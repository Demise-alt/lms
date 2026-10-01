"""
Attendance API endpoints.
"""

from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime

from ...core.database import get_db
from ...models.session import Attendance, TrainingSession
from ...models.employee import Employee
from ...schemas.session import (
    AttendanceCreate,
    AttendanceUpdate,
    AttendanceResponse,
    BulkAttendanceCreate
)
from ..deps import get_current_user

router = APIRouter()


@router.get("/session/{session_id}", response_model=List[AttendanceResponse])
async def get_session_attendance(
    session_id: str,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """
    Get all attendance records for a specific session.
    """
    # Verify session exists
    session = db.query(TrainingSession).filter(
        TrainingSession.id == session_id,
        TrainingSession.is_deleted == False
    ).first()

    if not session:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Training session not found"
        )

    records = db.query(Attendance).filter(
        Attendance.session_id == session_id,
        Attendance.is_deleted == False
    ).all()

    return [
        AttendanceResponse(
            id=r.id,
            session_id=r.session_id,
            employee_id=r.employee_id,
            status=r.status,
            check_in_time=r.check_in_time,
            check_out_time=r.check_out_time,
            notes=r.notes,
            created_at=r.created_at,
            updated_at=r.updated_at
        )
        for r in records
    ]


@router.get("/employee/{employee_id}", response_model=List[AttendanceResponse])
async def get_employee_attendance(
    employee_id: str,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """
    Get all attendance records for a specific employee.
    """
    # Verify employee exists
    emp = db.query(Employee).filter(
        Employee.id == employee_id,
        Employee.is_deleted == False
    ).first()

    if not emp:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Employee not found"
        )

    records = db.query(Attendance).filter(
        Attendance.employee_id == employee_id,
        Attendance.is_deleted == False
    ).all()

    return [
        AttendanceResponse(
            id=r.id,
            session_id=r.session_id,
            employee_id=r.employee_id,
            status=r.status,
            check_in_time=r.check_in_time,
            check_out_time=r.check_out_time,
            notes=r.notes,
            created_at=r.created_at,
            updated_at=r.updated_at
        )
        for r in records
    ]


@router.post("", response_model=AttendanceResponse, status_code=status.HTTP_201_CREATED)
async def mark_attendance(
    attendance_data: AttendanceCreate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """
    Mark attendance for an employee in a session.
    """
    # Verify session exists
    session = db.query(TrainingSession).filter(
        TrainingSession.id == attendance_data.session_id,
        TrainingSession.is_deleted == False
    ).first()

    if not session:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Training session not found"
        )

    # Verify employee exists
    employee = db.query(Employee).filter(
        Employee.id == attendance_data.employee_id,
        Employee.is_deleted == False
    ).first()

    if not employee:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Employee not found"
        )

    # Check if attendance already exists
    existing = db.query(Attendance).filter(
        Attendance.session_id == attendance_data.session_id,
        Attendance.employee_id == attendance_data.employee_id,
        Attendance.is_deleted == False
    ).first()

    if existing:
        # Update existing record
        existing.status = attendance_data.status
        existing.check_in_time = attendance_data.check_in_time
        existing.check_out_time = attendance_data.check_out_time
        existing.notes = attendance_data.notes
        db.commit()
        db.refresh(existing)
        return AttendanceResponse(
            id=existing.id,
            session_id=existing.session_id,
            employee_id=existing.employee_id,
            status=existing.status,
            check_in_time=existing.check_in_time,
            check_out_time=existing.check_out_time,
            notes=existing.notes,
            created_at=existing.created_at,
            updated_at=existing.updated_at
        )

    record = Attendance(
        session_id=attendance_data.session_id,
        employee_id=attendance_data.employee_id,
        status=attendance_data.status,
        check_in_time=attendance_data.check_in_time,
        check_out_time=attendance_data.check_out_time,
        notes=attendance_data.notes
    )

    db.add(record)
    db.commit()
    db.refresh(record)

    return AttendanceResponse(
        id=record.id,
        session_id=record.session_id,
        employee_id=record.employee_id,
        status=record.status,
        check_in_time=record.check_in_time,
        check_out_time=record.check_out_time,
        notes=record.notes,
        created_at=record.created_at,
        updated_at=record.updated_at
    )


@router.post("/bulk", response_model=List[AttendanceResponse], status_code=status.HTTP_201_CREATED)
async def bulk_mark_attendance(
    bulk_data: BulkAttendanceCreate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """
    Bulk mark attendance for multiple employees in a session.
    """
    # Verify session exists
    session = db.query(TrainingSession).filter(
        TrainingSession.id == bulk_data.session_id,
        TrainingSession.is_deleted == False
    ).first()

    if not session:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Training session not found"
        )

    responses = []

    for item in bulk_data.records:
        # Check if already exists
        existing = db.query(Attendance).filter(
            Attendance.session_id == bulk_data.session_id,
            Attendance.employee_id == item.employee_id,
            Attendance.is_deleted == False
        ).first()

        if existing:
            existing.status = item.status
            existing.check_in_time = item.check_in_time
            existing.check_out_time = item.check_out_time
            existing.notes = item.notes
            responses.append(existing)
        else:
            record = Attendance(
                session_id=bulk_data.session_id,
                employee_id=item.employee_id,
                status=item.status,
                check_in_time=item.check_in_time,
                check_out_time=item.check_out_time,
                notes=item.notes
            )
            db.add(record)
            responses.append(record)

    db.commit()

    for r in responses:
        db.refresh(r)

    return [
        AttendanceResponse(
            id=r.id,
            session_id=r.session_id,
            employee_id=r.employee_id,
            status=r.status,
            check_in_time=r.check_in_time,
            check_out_time=r.check_out_time,
            notes=r.notes,
            created_at=r.created_at,
            updated_at=r.updated_at
        )
        for r in responses
    ]


@router.get("/employee/{employee_id}/rate")
async def get_attendance_rate(
    employee_id: str,
    training_program_id: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """
    Calculate attendance rate for an employee.
    """
    query = db.query(Attendance).join(TrainingSession).filter(
        Attendance.employee_id == employee_id,
        Attendance.is_deleted == False
    )

    if training_program_id:
        query = query.filter(TrainingSession.training_program_id == training_program_id)

    records = query.all()
    total_sessions = len(records)

    if total_sessions == 0:
        return {
            "employee_id": employee_id,
            "total_sessions": 0,
            "attended_sessions": 0,
            "attendance_rate": 0.0
        }

    attended_sessions = sum(1 for r in records if r.status in ["Present", "Late"])
    attendance_rate = (attended_sessions / total_sessions) * 100

    return {
        "employee_id": employee_id,
        "total_sessions": total_sessions,
        "attended_sessions": attended_sessions,
        "attendance_rate": round(attendance_rate, 2)
    }