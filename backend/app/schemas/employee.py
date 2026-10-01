"""
Employee-related Pydantic schemas.
"""

from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List
from datetime import datetime
from .common import BaseSchema


class DepartmentBase(BaseSchema):
    """Base department schema."""
    name: str = Field(..., min_length=1, max_length=100)
    description: Optional[str] = None
    code: Optional[str] = Field(None, max_length=20)


class DepartmentCreate(DepartmentBase):
    """Schema for creating department."""
    pass


class DepartmentUpdate(DepartmentBase):
    """Schema for updating department."""
    name: Optional[str] = Field(None, min_length=1, max_length=100)
    description: Optional[str] = None
    code: Optional[str] = Field(None, max_length=20)
    is_active: Optional[bool] = None


class DepartmentResponse(DepartmentBase):
    """Schema for department response."""
    id: str
    is_active: bool
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class EmployeeBase(BaseSchema):
    """Base employee schema."""
    employee_id: str = Field(..., min_length=1, max_length=20)
    first_name: str = Field(..., min_length=1, max_length=50)
    last_name: str = Field(..., min_length=1, max_length=50)
    email: EmailStr
    department_id: Optional[str] = None
    manager_id: Optional[str] = None
    designation: Optional[str] = Field(None, max_length=100)
    hire_date: Optional[datetime] = None


class EmployeeCreate(EmployeeBase):
    """Schema for creating employee."""
    pass


class EmployeeUpdate(BaseSchema):
    """Schema for updating employee."""
    first_name: Optional[str] = Field(None, min_length=1, max_length=50)
    last_name: Optional[str] = Field(None, min_length=1, max_length=50)
    email: Optional[EmailStr] = None
    department_id: Optional[str] = None
    manager_id: Optional[str] = None
    designation: Optional[str] = Field(None, max_length=100)
    hire_date: Optional[datetime] = None
    is_active: Optional[bool] = None


class EmployeeResponse(EmployeeBase):
    """Schema for employee response."""
    id: str
    is_active: bool
    created_at: datetime
    updated_at: datetime
    department: Optional[DepartmentResponse] = None
    manager: Optional[EmployeeBase] = None
    full_name: str

    class Config:
        from_attributes = True


class EmployeeListResponse(BaseSchema):
    """Schema for employee list response."""
    employees: List[EmployeeResponse]
    total: int
    page: int
    size: int