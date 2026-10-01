"""
Certificate API endpoints.
"""

from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime

from ...core.database import get_db
from ...models.assignment import Certificate, Employee, TrainingProgram, Enrollment
from ...schemas.assignment import CertificateResponse
from ..deps import get_current_user

router = APIRouter()


@router.get("", response_model=List[CertificateResponse])
async def list_certificates(
    employee_id: Optional[str] = None,
    training_program_id: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """
    List certificates with optional filtering.
    """
    query = db.query(Certificate)

    if employee_id:
        query = query.filter(Certificate.employee_id == employee_id)

    if training_program_id:
        query = query.filter(Certificate.training_program_id == training_program_id)

    certificates = query.order_by(Certificate.issue_date.desc()).all()

    return [
        CertificateResponse(
            id=c.id,
            certificate_number=c.certificate_number,
            employee_id=c.employee_id,
            training_program_id=c.training_program_id,
            issue_date=c.issue_date,
            expiry_date=c.expiry_date,
            issuer_name=c.issuer_name,
            file_path=c.file_path,
            created_at=c.created_at,
            updated_at=c.updated_at
        )
        for c in certificates
    ]


@router.get("/{certificate_id}", response_model=CertificateResponse)
async def get_certificate(
    certificate_id: str,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """
    Get a specific certificate by ID.
    """
    certificate = db.query(Certificate).filter(
        Certificate.id == certificate_id
    ).first()

    if not certificate:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Certificate not found"
        )

    return CertificateResponse(
        id=certificate.id,
        certificate_number=certificate.certificate_number,
        employee_id=certificate.employee_id,
        training_program_id=certificate.training_program_id,
        issue_date=certificate.issue_date,
        expiry_date=certificate.expiry_date,
        issuer_name=certificate.issuer_name,
        file_path=certificate.file_path,
        created_at=certificate.created_at,
        updated_at=certificate.updated_at
    )


@router.post("", response_model=CertificateResponse, status_code=status.HTTP_201_CREATED)
async def issue_certificate(
    employee_id: str = Query(...),
    training_program_id: str = Query(...),
    expiry_date: Optional[datetime] = Query(None),
    issuer_name: str = Query("Enterprise L&D Department"),
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """
    Issue a new certificate for an employee completing a training program.
    """
    # Verify employee exists
    employee = db.query(Employee).filter(
        Employee.id == employee_id,
        Employee.is_deleted == False
    ).first()

    if not employee:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Employee not found"
        )

    # Verify training program exists
    program = db.query(TrainingProgram).filter(
        TrainingProgram.id == training_program_id,
        TrainingProgram.is_deleted == False
    ).first()

    if not program:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Training program not found"
        )

    # Check if employee has completed enrollment
    enrollment = db.query(Enrollment).filter(
        Enrollment.employee_id == employee_id,
        Enrollment.training_program_id == training_program_id,
        Enrollment.is_deleted == False
    ).first()

    if not enrollment:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Employee not enrolled in this training program"
        )

    if enrollment.status != "Completed":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Employee must complete the training program first"
        )

    # Check if certificate already exists
    existing = db.query(Certificate).filter(
        Certificate.employee_id == employee_id,
        Certificate.training_program_id == training_program_id
    ).first()

    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Certificate already issued for this employee and program"
        )

    # Generate certificate number
    import uuid
    certificate_number = f"CERT-{datetime.utcnow().strftime('%Y%m%d')}-{str(uuid.uuid4())[:8].upper()}"

    certificate = Certificate(
        certificate_number=certificate_number,
        employee_id=employee_id,
        training_program_id=training_program_id,
        issue_date=datetime.utcnow(),
        expiry_date=expiry_date,
        issuer_name=issuer_name
    )

    db.add(certificate)
    db.commit()
    db.refresh(certificate)

    return CertificateResponse(
        id=certificate.id,
        certificate_number=certificate.certificate_number,
        employee_id=certificate.employee_id,
        training_program_id=certificate.training_program_id,
        issue_date=certificate.issue_date,
        expiry_date=certificate.expiry_date,
        issuer_name=certificate.issuer_name,
        file_path=certificate.file_path,
        created_at=certificate.created_at,
        updated_at=certificate.updated_at
    )


@router.delete("/{certificate_id}", status_code=status.HTTP_204_NO_CONTENT)
async def revoke_certificate(
    certificate_id: str,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """
    Revoke (soft-delete) a certificate.
    """
    certificate = db.query(Certificate).filter(
        Certificate.id == certificate_id
    ).first()

    if not certificate:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Certificate not found"
        )

    # Soft delete
    certificate.is_deleted = True
    db.commit()

    return None


@router.get("/verify/{certificate_number}")
async def verify_certificate(
    certificate_number: str,
    db: Session = Depends(get_db)
):
    """
    Public endpoint to verify a certificate by its number.
    """
    certificate = db.query(Certificate).filter(
        Certificate.certificate_number == certificate_number
    ).first()

    if not certificate:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Certificate not found"
        )

    # Check if revoked
    if certificate.is_deleted:
        return {
            "valid": False,
            "reason": "Certificate has been revoked",
            "certificate_number": certificate.certificate_number
        }

    # Check if expired
    if certificate.expiry_date and certificate.expiry_date < datetime.utcnow():
        return {
            "valid": False,
            "reason": "Certificate has expired",
            "certificate_number": certificate.certificate_number,
            "expiry_date": certificate.expiry_date
        }

    # Get employee and program details for verification
    employee = db.query(Employee).filter(Employee.id == certificate.employee_id).first()
    program = db.query(TrainingProgram).filter(TrainingProgram.id == certificate.training_program_id).first()

    return {
        "valid": True,
        "certificate_number": certificate.certificate_number,
        "employee_name": f"{employee.first_name} {employee.last_name}" if employee else "Unknown",
        "training_program": program.title if program else "Unknown",
        "issue_date": certificate.issue_date,
        "expiry_date": certificate.expiry_date,
        "issuer_name": certificate.issuer_name
    }