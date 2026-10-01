"""
Session and Attendance related Pydantic schemas.
"""

from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime
from .common import BaseSchema


class TrainingSessionBase(BaseSchema):
    """Base training session schema."""
    title: str = Field(..., min_length=1, max_length=200)
    training_program_id: str
    module_id: Optional[str] = None
    trainer_id: Optional[str] = None
    start_time: datetime
    end_time: datetime
    location: Optional[str] = Field(None, max_length=255)
    meeting_url: Optional[str] = Field(None, max_length=500)
    capacity: Optional[int] = None


class TrainingSessionCreate(TrainingSessionBase):
    """Schema for creating training session."""
    pass


class TrainingSessionUpdate(BaseSchema):
    """Schema for updating training session."""
    title: Optional[str] = Field(None, min_length=1, max_length=200)
    module_id: Optional[str] = None
    trainer_id: Optional[str] = None
    start_time: Optional[datetime] = None
    end_time: Optional[datetime] = None
    location: Optional[str] = Field(None, max_length=255)
    meeting_url: Optional[str] = Field(None, max_length=500)
    capacity: Optional[int] = None
    status: Optional[str] = Field(None, max_length=20)


class TrainingSessionResponse(TrainingSessionBase):
    """Schema for training session response."""
    id: str
    status: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class AttendanceBase(BaseSchema):
    """Base attendance schema."""
    session_id: str
    employee_id: str
    status: str = Field(..., max_length=20)
    check_in_time: Optional[datetime] = None
    check_out_time: Optional[datetime] = None
    notes: Optional[str] = Field(None, max_length=500)


class AttendanceCreate(AttendanceBase):
    """Schema for creating attendance record."""
    pass


class AttendanceUpdate(BaseSchema):
    """Schema for updating attendance record."""
    status: Optional[str] = Field(None, max_length=20)
    check_in_time: Optional[datetime] = None
    check_out_time: Optional[datetime] = None
    notes: Optional[str] = Field(None, max_length=500)


class AttendanceResponse(BaseSchema):
    """Schema for attendance response."""
    id: str
    session_id: str
    employee_id: str
    status: str
    check_in_time: Optional[datetime] = None
    check_out_time: Optional[datetime] = None
    notes: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class BulkAttendanceCreate(BaseSchema):
    """Schema for bulk attendance marking."""
    session_id: str
    records: List[AttendanceCreate]


class SessionCalendarResponse(BaseSchema):
    """Schema for calendar view."""
    sessions: List[TrainingSessionResponse]
    month: int
    year: int