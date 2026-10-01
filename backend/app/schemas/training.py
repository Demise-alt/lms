"""
Training program related Pydantic schemas.
"""

from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime
from .common import BaseSchema


class TrainingProgramBase(BaseSchema):
    """Base training program schema."""
    title: str = Field(..., min_length=1, max_length=200)
    description: Optional[str] = None
    category: Optional[str] = Field(None, max_length=100)
    department_id: Optional[str] = None
    trainer_id: Optional[str] = None
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None
    duration_weeks: Optional[int] = None
    mode: Optional[str] = Field(None, max_length=50)
    location: Optional[str] = Field(None, max_length=255)
    max_participants: Optional[int] = None
    prerequisites: Optional[str] = None
    learning_objectives: Optional[str] = None
    is_required: bool = False


class TrainingProgramCreate(TrainingProgramBase):
    """Schema for creating training program."""
    pass


class TrainingProgramUpdate(BaseSchema):
    """Schema for updating training program."""
    title: Optional[str] = Field(None, min_length=1, max_length=200)
    description: Optional[str] = None
    category: Optional[str] = Field(None, max_length=100)
    department_id: Optional[str] = None
    trainer_id: Optional[str] = None
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None
    duration_weeks: Optional[int] = None
    mode: Optional[str] = Field(None, max_length=50)
    location: Optional[str] = Field(None, max_length=255)
    max_participants: Optional[int] = None
    prerequisites: Optional[str] = None
    learning_objectives: Optional[str] = None
    status: Optional[str] = Field(None, max_length=20)
    is_required: Optional[bool] = None


class TrainingProgramResponse(TrainingProgramBase):
    """Schema for training program response."""
    id: str
    status: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class CourseBase(BaseSchema):
    """Base course schema."""
    title: str = Field(..., min_length=1, max_length=200)
    description: Optional[str] = None
    order_index: int = 0
    estimated_hours: Optional[int] = None
    is_mandatory: bool = False


class CourseCreate(CourseBase):
    """Schema for creating course."""
    training_program_id: str


class CourseUpdate(BaseSchema):
    """Schema for updating course."""
    title: Optional[str] = Field(None, min_length=1, max_length=200)
    description: Optional[str] = None
    order_index: Optional[int] = None
    estimated_hours: Optional[int] = None
    status: Optional[str] = Field(None, max_length=20)
    is_mandatory: Optional[bool] = None


class CourseResponse(CourseBase):
    """Schema for course response."""
    id: str
    training_program_id: str
    status: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class ModuleBase(BaseSchema):
    """Base module schema."""
    title: str = Field(..., min_length=1, max_length=200)
    description: Optional[str] = None
    order_index: int = 0
    estimated_hours: Optional[int] = None


class ModuleCreate(ModuleBase):
    """Schema for creating module."""
    course_id: str


class ModuleUpdate(BaseSchema):
    """Schema for updating module."""
    title: Optional[str] = Field(None, min_length=1, max_length=200)
    description: Optional[str] = None
    order_index: Optional[int] = None
    estimated_hours: Optional[int] = None
    status: Optional[str] = Field(None, max_length=20)


class ModuleResponse(ModuleBase):
    """Schema for module response."""
    id: str
    course_id: str
    status: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True