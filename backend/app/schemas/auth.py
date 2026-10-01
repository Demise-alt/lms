"""
Authentication-related Pydantic schemas.
"""

from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from .common import BaseSchema


class LoginRequest(BaseSchema):
    """Schema for login request."""
    email: EmailStr
    password: str = Field(..., min_length=8, max_length=128)


class TokenResponse(BaseSchema):
    """Schema for JWT token response."""
    access_token: str
    refresh_token: Optional[str] = None
    token_type: str = "bearer"
    expires_in: int


class UserResponse(BaseSchema):
    """Schema for user response."""
    id: str
    email: str
    full_name: str
    is_active: bool
    roles: list[str] = []


class UserCreate(BaseSchema):
    """Schema for creating a user."""
    email: EmailStr
    full_name: str = Field(..., min_length=1, max_length=100)
    password: str = Field(..., min_length=8, max_length=128)
    roles: list[str] = []


class PasswordChange(BaseSchema):
    """Schema for changing password."""
    current_password: str
    new_password: str = Field(..., min_length=8, max_length=128)


class PasswordResetRequest(BaseSchema):
    """Schema for password reset request."""
    email: EmailStr


class PasswordResetConfirm(BaseSchema):
    """Schema for password reset confirmation."""
    token: str
    new_password: str = Field(..., min_length=8, max_length=128)