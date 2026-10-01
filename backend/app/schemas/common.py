"""
Common Pydantic schemas used across the application.
"""

from typing import Optional, Generic, TypeVar, List
from pydantic import BaseModel
from datetime import datetime
from uuid import UUID

T = TypeVar('T')


class BaseSchema(BaseModel):
    """Base schema with common fields."""

    class Config:
        from_attributes = True  # Allow ORM mode


class APIResponse(BaseModel):
    """Standard API response wrapper."""
    success: bool
    data: Optional[dict] = None
    message: Optional[str] = None


class APIErrorResponse(BaseModel):
    """Standard API error response."""
    success: bool = False
    error: dict


class PaginatedResponse(BaseModel, Generic[T]):
    """Standard paginated response."""
    items: List[T]
    total: int
    page: int
    size: int
    pages: int


class TimestampSchema(BaseSchema):
    """Schema with timestamps."""
    created_at: datetime
    updated_at: datetime