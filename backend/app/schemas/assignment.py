"""
Assignment, feedback, certificate related Pydantic schemas.
"""

from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime
from .common import BaseSchema


# ===================== Assignment Schemas =====================

class AssignmentBase(BaseSchema):
    """Base assignment schema."""
    title: str = Field(..., min_length=1, max_length=200)
    description: Optional[str] = None
    training_program_id: str
    due_date: Optional[datetime] = None
    max_score: float = 100.0


class AssignmentCreate(AssignmentBase):
    """Schema for creating assignment."""
    pass


class AssignmentUpdate(BaseSchema):
    """Schema for updating assignment."""
    title: Optional[str] = Field(None, min_length=1, max_length=200)
    description: Optional[str] = None
    due_date: Optional[datetime] = None
    max_score: Optional[float] = None


class AssignmentResponse(AssignmentBase):
    """Schema for assignment response."""
    id: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class AssignmentSubmissionBase(BaseSchema):
    """Base assignment submission schema."""
    assignment_id: str
    employee_id: str
    file_path: Optional[str] = None
    comments: Optional[str] = None


class AssignmentSubmissionCreate(AssignmentSubmissionBase):
    """Schema for creating assignment submission."""
    pass


class AssignmentSubmissionUpdate(BaseSchema):
    """Schema for updating assignment submission (grading)."""
    status: Optional[str] = Field(None, max_length=30)
    score: Optional[float] = None
    trainer_feedback: Optional[str] = None


class AssignmentSubmissionResponse(AssignmentSubmissionBase):
    """Schema for assignment submission response."""
    id: str
    status: str
    score: Optional[float] = None
    trainer_feedback: Optional[str] = None
    graded_by_id: Optional[str] = None
    graded_at: Optional[datetime] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


# ===================== Feedback Schemas =====================

class FeedbackCreate(BaseSchema):
    """Schema for creating feedback."""
    training_program_id: str
    employee_id: str
    training_rating: int = Field(..., ge=1, le=5)
    trainer_rating: int = Field(..., ge=1, le=5)
    material_usefulness: int = Field(..., ge=1, le=5)
    difficulty_level: Optional[str] = None
    confidence_gain: Optional[int] = Field(None, ge=1, le=5)
    suggestions: Optional[str] = None


class FeedbackResponse(FeedbackCreate):
    """Schema for feedback response."""
    id: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


# ===================== Trainer Evaluation Schemas =====================

class TrainerEvaluationCreate(BaseSchema):
    """Schema for creating trainer evaluation."""
    training_program_id: str
    employee_id: str
    trainer_id: str
    understanding_level: Optional[str] = None
    participation_level: Optional[str] = None
    practical_performance: Optional[str] = None
    strengths: Optional[str] = None
    areas_for_improvement: Optional[str] = None
    comments: Optional[str] = None


class TrainerEvaluationResponse(TrainerEvaluationCreate):
    """Schema for trainer evaluation response."""
    id: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


# ===================== Certificate Schemas =====================

class CertificateResponse(BaseSchema):
    """Schema for certificate response."""
    id: str
    certificate_number: str
    employee_id: str
    training_program_id: str
    issue_date: datetime
    expiry_date: Optional[datetime] = None
    issuer_name: str
    file_path: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


# ===================== Notification Schemas =====================

class NotificationResponse(BaseSchema):
    """Schema for notification response."""
    id: str
    user_id: str
    title: str
    message: str
    notification_type: str
    is_read: bool
    link: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


# ===================== Audit Log Schemas =====================

class AuditLogResponse(BaseSchema):
    """Schema for audit log response."""
    id: str
    user_id: Optional[str] = None
    action: str
    resource_type: str
    resource_id: Optional[str] = None
    details: Optional[dict] = None
    ip_address: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True