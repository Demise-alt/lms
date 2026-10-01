"""
Enrollment API endpoints.
"""

from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional

from ...core.database import get_db
from ...models.enrollment import Enrollment
from ...models.employee import Employee
from ...models.training import TrainingProgram
from ...schemas.enrollment import (
    EnrollmentCreate,
    BulkEnrollmentCreate,
    EnrollmentUpdate,
    EnrollmentResponse
)
from ..deps import get_current_user

router = APIRouter()


@router.get("", response_model=List[EnrollmentResponse])
async def list_enrollments(
    employee_id: Optional[str] = None,
    training_program_id: Optional[str] = None,
    status: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """
    List enrollments with optional filtering.
    """
    query = db.query(Enrollment).filter(Enrollment.is_deleted == False)

    if employee_id:
        query = query.filter(Enrollment.employee_id == employee_id)

    if training_program_id:
        query = query.filter(Enrollment.training_program_id == training_program_id)

    if status:
        query = query.filter(Enrollment.status == status)

    enrollments = query.all()

    return [
        EnrollmentResponse(
            id=e.id,
            employee_id=e.employee_id,
            training_program_id=e.training_program_id,
            course_id=e.course_id,
            module_id=e.module_id,
            enrollment_date=e.enrollment_date,
            status=e.status,
            progress_percentage=e.progress_percentage,
            completion_date=e.completion_date,
            certificate_id=e.certificate_id,
            created_at=e.created_at,
            updated_at=e.updated_at
        )
        for e in enrollments
    ]


@router.get("/{enrollment_id}", response_model=EnrollmentResponse)
async def get_enrollment(
    enrollment_id: str,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """
    Get a specific enrollment by ID.
    """
    enrollment = db.query(Enrollment).filter(
        Enrollment.id == enrollment_id,
        Enrollment.is_deleted == False
    ).first()

    if not enrollment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Enrollment not found"
        )

    return EnrollmentResponse(
        id=enrollment.id,
        employee_id=enrollment.employee_id,
        training_program_id=enrollment.training_program_id,
        course_id=enrollment.course_id,
        module_id=enrollment.module_id,
        enrollment_date=enrollment.enrollment_date,
        status=enrollment.status,
        progress_percentage=enrollment.progress_percentage,
        completion_date=enrollment.completion_date,
        certificate_id=enrollment.certificate_id,
        created_at=enrollment.created_at,
        updated_at=enrollment.updated_at
    )


@router.post("", response_model=EnrollmentResponse, status_code=status.HTTP_201_CREATED)
async def create_enrollment(
    enrollment_data: EnrollmentCreate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """
    Create a new enrollment.
    """
    # Verify employee exists
    employee = db.query(Employee).filter(
        Employee.id == enrollment_data.employee_id,
        Employee.is_deleted == False
    ).first()

    if not employee:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Employee not found"
        )

    # Verify training program exists
    program = db.query(TrainingProgram).filter(
        TrainingProgram.id == enrollment_data.training_program_id,
        TrainingProgram.is_deleted == False
    ).first()

    if not program:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Training program not found"
        )

    # Check if already enrolled
    existing = db.query(Enrollment).filter(
        Enrollment.employee_id == enrollment_data.employee_id,
        Enrollment.training_program_id == enrollment_data.training_program_id,
        Enrollment.is_deleted == False
    ).first()

    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Employee already enrolled in this training program"
        )

    enrollment = Enrollment(
        employee_id=enrollment_data.employee_id,
        training_program_id=enrollment_data.training_program_id,
        course_id=enrollment_data.course_id,
        module_id=enrollment_data.module_id,
        status="Enrolled",
        progress_percentage=0.0
    )

    db.add(enrollment)
    db.commit()
    db.refresh(enrollment)

    return EnrollmentResponse(
        id=enrollment.id,
        employee_id=enrollment.employee_id,
        training_program_id=enrollment.training_program_id,
        course_id=enrollment.course_id,
        module_id=enrollment.module_id,
        enrollment_date=enrollment.enrollment_date,
        status=enrollment.status,
        progress_percentage=enrollment.progress_percentage,
        completion_date=enrollment.completion_date,
        certificate_id=enrollment.certificate_id,
        created_at=enrollment.created_at,
        updated_at=enrollment.updated_at
    )


@router.post("/bulk", response_model=List[EnrollmentResponse], status_code=status.HTTP_201_CREATED)
async def bulk_enroll(
    enrollment_data: BulkEnrollmentCreate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """
    Bulk enroll multiple employees in a training program.
    """
    # Verify training program exists
    program = db.query(TrainingProgram).filter(
        TrainingProgram.id == enrollment_data.training_program_id,
        TrainingProgram.is_deleted == False
    ).first()

    if not program:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Training program not found"
        )

    # Check max participants
    current_count = db.query(Enrollment).filter(
        Enrollment.training_program_id == enrollment_data.training_program_id,
        Enrollment.is_deleted == False
    ).count()

    if program.max_participants and current_count + len(enrollment_data.employee_ids) > program.max_participants:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Exceeds maximum participants ({program.max_participants})"
        )

    created_enrollments = []

    for emp_id in enrollment_data.employee_ids:
        # Verify employee exists
        employee = db.query(Employee).filter(
            Employee.id == emp_id,
            Employee.is_deleted == False
        ).first()

        if not employee:
            continue

        # Check if already enrolled
        existing = db.query(Enrollment).filter(
            Enrollment.employee_id == emp_id,
            Enrollment.training_program_id == enrollment_data.training_program_id,
            Enrollment.is_deleted == False
        ).first()

        if existing:
            continue

        enrollment = Enrollment(
            employee_id=emp_id,
            training_program_id=enrollment_data.training_program_id,
            status="Enrolled",
            progress_percentage=0.0
        )

        db.add(enrollment)
        created_enrollments.append(enrollment)

    db.commit()

    # Refresh all created enrollments
    for e in created_enrollments:
        db.refresh(e)

    return [
        EnrollmentResponse(
            id=e.id,
            employee_id=e.employee_id,
            training_program_id=e.training_program_id,
            course_id=e.course_id,
            module_id=e.module_id,
            enrollment_date=e.enrollment_date,
            status=e.status,
            progress_percentage=e.progress_percentage,
            completion_date=e.completion_date,
            certificate_id=e.certificate_id,
            created_at=e.created_at,
            updated_at=e.updated_at
        )
        for e in created_enrollments
    ]


@router.put("/{enrollment_id}", response_model=EnrollmentResponse)
async def update_enrollment(
    enrollment_id: str,
    enrollment_data: EnrollmentUpdate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """
    Update an enrollment.
    """
    enrollment = db.query(Enrollment).filter(
        Enrollment.id == enrollment_id,
        Enrollment.is_deleted == False
    ).first()

    if not enrollment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Enrollment not found"
        )

    update_data = enrollment_data.model_dump(exclude_unset=True)

    for field, value in update_data.items():
        setattr(enrollment, field, value)

    # Auto-set completion date if status is completed
    if enrollment.status == "Completed" and not enrollment.completion_date:
        enrollment.completion_date = datetime.utcnow()

    db.commit()
    db.refresh(enrollment)

    return EnrollmentResponse(
        id=enrollment.id,
        employee_id=enrollment.employee_id,
        training_program_id=enrollment.training_program_id,
        course_id=enrollment.course_id,
        module_id=enrollment.module_id,
        enrollment_date=enrollment.enrollment_date,
        status=enrollment.status,
        progress_percentage=enrollment.progress_percentage,
        completion_date=enrollment.completion_date,
        certificate_id=enrollment.certificate_id,
        created_at=enrollment.created_at,
        updated_at=enrollment.updated_at
    )