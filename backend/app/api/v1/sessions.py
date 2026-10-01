"""
Training Session API endpoints.
"""

from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime, date

from ...core.database import get_db
from ...models.session import TrainingSession
from ...models.training import TrainingProgram, Module
from ...models.user import User
from ...schemas.session import (
    TrainingSessionCreate,
    TrainingSessionUpdate,
    TrainingSessionResponse,
    SessionCalendarResponse
)
from ..deps import get_current_user

router = APIRouter()


@router.get("", response_model=List[TrainingSessionResponse])
async def list_sessions(
    training_program_id: Optional[str] = None,
    trainer_id: Optional[str] = None,
    status: Optional[str] = None,
    start_date: Optional[date] = None,
    end_date: Optional[date] = None,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """
    List all training sessions with optional filtering.
    """
    query = db.query(TrainingSession).filter(TrainingSession.is_deleted == False)

    if training_program_id:
        query = query.filter(TrainingSession.training_program_id == training_program_id)

    if trainer_id:
        query = query.filter(TrainingSession.trainer_id == trainer_id)

    if status:
        query = query.filter(TrainingSession.status == status)

    if start_date:
        query = query.filter(TrainingSession.start_time >= start_date)

    if end_date:
        query = query.filter(TrainingSession.start_time <= end_date)

    sessions = query.order_by(TrainingSession.start_time).all()

    return [
        TrainingSessionResponse(
            id=s.id,
            title=s.title,
            training_program_id=s.training_program_id,
            module_id=s.module_id,
            trainer_id=s.trainer_id,
            start_time=s.start_time,
            end_time=s.end_time,
            location=s.location,
            meeting_url=s.meeting_url,
            capacity=s.capacity,
            status=s.status,
            created_at=s.created_at,
            updated_at=s.updated_at
        )
        for s in sessions
    ]


@router.get("/calendar", response_model=SessionCalendarResponse)
async def get_calendar(
    month: int = Query(..., ge=1, le=12),
    year: int = Query(..., ge=2020, le=2030),
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """
    Get sessions for a specific month (calendar view).
    """
    start_date = datetime(year, month, 1)
    if month == 12:
        end_date = datetime(year + 1, 1, 1)
    else:
        end_date = datetime(year, month + 1, 1)

    sessions = db.query(TrainingSession).filter(
        TrainingSession.is_deleted == False,
        TrainingSession.start_time >= start_date,
        TrainingSession.start_time < end_date
    ).order_by(TrainingSession.start_time).all()

    return SessionCalendarResponse(
        sessions=[
            TrainingSessionResponse(
                id=s.id,
                title=s.title,
                training_program_id=s.training_program_id,
                module_id=s.module_id,
                trainer_id=s.trainer_id,
                start_time=s.start_time,
                end_time=s.end_time,
                location=s.location,
                meeting_url=s.meeting_url,
                capacity=s.capacity,
                status=s.status,
                created_at=s.created_at,
                updated_at=s.updated_at
            )
            for s in sessions
        ],
        month=month,
        year=year
    )


@router.get("/{session_id}", response_model=TrainingSessionResponse)
async def get_session(
    session_id: str,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """
    Get a specific session by ID.
    """
    session = db.query(TrainingSession).filter(
        TrainingSession.id == session_id,
        TrainingSession.is_deleted == False
    ).first()

    if not session:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Training session not found"
        )

    return TrainingSessionResponse(
        id=session.id,
        title=session.title,
        training_program_id=session.training_program_id,
        module_id=session.module_id,
        trainer_id=session.trainer_id,
        start_time=session.start_time,
        end_time=session.end_time,
        location=session.location,
        meeting_url=session.meeting_url,
        capacity=session.capacity,
        status=session.status,
        created_at=session.created_at,
        updated_at=session.updated_at
    )


@router.post("", response_model=TrainingSessionResponse, status_code=status.HTTP_201_CREATED)
async def create_session(
    session_data: TrainingSessionCreate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """
    Create a new training session.
    """
    # Verify training program exists
    program = db.query(TrainingProgram).filter(
        TrainingProgram.id == session_data.training_program_id,
        TrainingProgram.is_deleted == False
    ).first()

    if not program:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Training program not found"
        )

    # Verify module exists if provided
    if session_data.module_id:
        module = db.query(Module).filter(
            Module.id == session_data.module_id,
            Module.is_deleted == False
        ).first()

        if not module:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Module not found"
            )

    # Verify trainer exists if provided
    if session_data.trainer_id:
        trainer = db.query(User).filter(
            User.id == session_data.trainer_id,
            User.is_deleted == False
        ).first()

        if not trainer:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Trainer not found"
            )

    session = TrainingSession(
        title=session_data.title,
        training_program_id=session_data.training_program_id,
        module_id=session_data.module_id,
        trainer_id=session_data.trainer_id,
        start_time=session_data.start_time,
        end_time=session_data.end_time,
        location=session_data.location,
        meeting_url=session_data.meeting_url,
        capacity=session_data.capacity,
        status="Scheduled"
    )

    db.add(session)
    db.commit()
    db.refresh(session)

    return TrainingSessionResponse(
        id=session.id,
        title=session.title,
        training_program_id=session.training_program_id,
        module_id=session.module_id,
        trainer_id=session.trainer_id,
        start_time=session.start_time,
        end_time=session.end_time,
        location=session.location,
        meeting_url=session.meeting_url,
        capacity=session.capacity,
        status=session.status,
        created_at=session.created_at,
        updated_at=session.updated_at
    )


@router.put("/{session_id}", response_model=TrainingSessionResponse)
async def update_session(
    session_id: str,
    session_data: TrainingSessionUpdate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """
    Update an existing training session.
    """
    session = db.query(TrainingSession).filter(
        TrainingSession.id == session_id,
        TrainingSession.is_deleted == False
    ).first()

    if not session:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Training session not found"
        )

    update_data = session_data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(session, field, value)

    db.commit()
    db.refresh(session)

    return TrainingSessionResponse(
        id=session.id,
        title=session.title,
        training_program_id=session.training_program_id,
        module_id=session.module_id,
        trainer_id=session.trainer_id,
        start_time=session.start_time,
        end_time=session.end_time,
        location=session.location,
        meeting_url=session.meeting_url,
        capacity=session.capacity,
        status=session.status,
        created_at=session.created_at,
        updated_at=session.updated_at
    )


@router.delete("/{session_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_session(
    session_id: str,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """
    Soft-delete a training session.
    """
    session = db.query(TrainingSession).filter(
        TrainingSession.id == session_id,
        TrainingSession.is_deleted == False
    ).first()

    if not session:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Training session not found"
        )

    session.soft_delete()
    db.commit()

    return None