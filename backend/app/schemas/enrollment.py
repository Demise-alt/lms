"""
Enrollment related Pydantic schemas.
"""

from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime
from .common import BaseSchema


class EnrollmentBase(BaseSchema):
    """Base enrollment schema."""
    employee_id: str
    training_program_id: str
    course_id: Optional[str] = None
    module_id: Optional[str] = None


class EnrollmentCreate(EnrollmentBase):
    """Schema for creating enrollment."""
    pass


class BulkEnrollmentCreate(BaseSchema):
    """Schema for bulk enrollment."""
    employee_ids: List[str]
    training_program_id: str


class EnrollmentUpdate(BaseSchema):
    """Schema for updating enrollment."""
    status: Optional[str] = Field(None, max_length=20)
    progress_percentage: Optional[float] = Field(None, ge=0, le=100)


class EnrollmentResponse(BaseSchema):
    """Schema for enrollment response."""
    id: str
    employee_id: str
    training_program_id: str
    course_id: Optional[str] = None
    module_id: Optional[str] = None
    enrollment_date: datetime
    status: str
    progress_percentage: float
    completion_date: Optional[datetime] = None
    certificate_id: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True