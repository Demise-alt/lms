"""
Main API router for version 1.
"""

from fastapi import APIRouter
from . import (
    auth,
    employees,
    departments,
    trainings,
    sessions,
    attendance,
    assessments,
    enrollments,
    certificates,
    analytics,
    assignments
)

api_router = APIRouter()

# Authentication
api_router.include_router(
    auth.router,
    prefix="/auth",
    tags=["Authentication"]
)

# Employee Management
api_router.include_router(
    employees.router,
    prefix="/employees",
    tags=["Employees"]
)

# Department Management
api_router.include_router(
    departments.router,
    prefix="/departments",
    tags=["Departments"]
)

# Training Programs
api_router.include_router(
    trainings.router,
    prefix="/trainings",
    tags=["Training Programs"]
)

# Training Sessions
api_router.include_router(
    sessions.router,
    prefix="/sessions",
    tags=["Training Sessions"]
)

# Attendance
api_router.include_router(
    attendance.router,
    prefix="/attendance",
    tags=["Attendance"]
)

# Assessments
api_router.include_router(
    assessments.router,
    prefix="/assessments",
    tags=["Assessments"]
)

# Enrollments
api_router.include_router(
    enrollments.router,
    prefix="/enrollments",
    tags=["Enrollments"]
)

# Certificates
api_router.include_router(
    certificates.router,
    prefix="/certificates",
    tags=["Certificates"]
)

# Analytics
api_router.include_router(
    analytics.router,
    prefix="/analytics",
    tags=["Analytics"]
)

# Assignments
api_router.include_router(
    assignments.router,
    prefix="/assignments",
    tags=["Assignments"]
)