"""
Assessment related Pydantic schemas.
"""

from pydantic import BaseModel, Field
from typing import Optional, List, Any
from datetime import datetime
from .common import BaseSchema


class QuestionBase(BaseSchema):
    """Base question schema."""
    question_text: str = Field(..., min_length=1)
    question_type: str = Field(..., max_length=50)
    options: Optional[List[Any]] = None
    correct_answer: str
    explanation: Optional[str] = None
    points: float = 1.0
    order_index: int = 0


class QuestionCreate(QuestionBase):
    """Schema for creating question."""
    pass


class QuestionResponse(QuestionBase):
    """Schema for question response."""
    id: str
    assessment_id: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class AssessmentBase(BaseSchema):
    """Base assessment schema."""
    title: str = Field(..., min_length=1, max_length=200)
    description: Optional[str] = None
    assessment_type: str = Field(..., max_length=50)
    training_program_id: Optional[str] = None
    module_id: Optional[str] = None
    duration_minutes: Optional[int] = None
    passing_score: float = 60.0
    attempt_limit: int = 3
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None


class AssessmentCreate(AssessmentBase):
    """Schema for creating assessment."""
    questions: Optional[List[QuestionCreate]] = None


class AssessmentUpdate(BaseSchema):
    """Schema for updating assessment."""
    title: Optional[str] = Field(None, min_length=1, max_length=200)
    description: Optional[str] = None
    assessment_type: Optional[str] = Field(None, max_length=50)
    duration_minutes: Optional[int] = None
    passing_score: Optional[float] = None
    attempt_limit: Optional[int] = None
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None
    is_active: Optional[bool] = None


class AssessmentResponse(AssessmentBase):
    """Schema for assessment response."""
    id: str
    is_active: bool
    created_at: datetime
    updated_at: datetime
    questions: List[QuestionResponse] = []

    class Config:
        from_attributes = True


class AnswerSubmit(BaseSchema):
    """Schema for submitting an answer."""
    question_id: str
    selected_answer: str


class AssessmentSubmitRequest(BaseSchema):
    """Schema for submitting assessment attempt."""
    answers: List[AnswerSubmit]


class AnswerResponse(BaseSchema):
    """Schema for answer response."""
    id: str
    question_id: str
    selected_answer: Optional[str] = None
    is_correct: bool
    points_awarded: float

    class Config:
        from_attributes = True


class AssessmentAttemptResponse(BaseSchema):
    """Schema for assessment attempt response."""
    id: str
    assessment_id: str
    employee_id: str
    attempt_number: int
    score: float
    max_score: float
    percentage: float
    passed: bool
    start_time: datetime
    submit_time: Optional[datetime] = None
    status: str
    answers: List[AnswerResponse] = []

    class Config:
        from_attributes = True