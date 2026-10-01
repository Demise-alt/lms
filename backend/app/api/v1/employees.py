"""
Employee API endpoints.
"""

from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from uuid import UUID

from ...core.database import get_db
from ...models.employee import Employee, Department
from ...schemas.employee import (
    EmployeeCreate,
    EmployeeUpdate,
    EmployeeResponse,
    EmployeeListResponse
)
from ..deps import get_current_user

router = APIRouter()


@router.get("", response_model=EmployeeListResponse)
async def list_employees(
    page: int = Query(1, ge=1),
    size: int = Query(20, ge=1, le=100),
    department_id: Optional[str] = None,
    search: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """
    List employees with optional filtering, searching, and pagination.
    """
    query = db.query(Employee).filter(Employee.is_deleted == False)

    # Filter by department
    if department_id:
        query = query.filter(Employee.department_id == department_id)

    # Search by name, email, or employee_id
    if search:
        search_filter = (
            Employee.first_name.ilike(f"%{search}%") |
            Employee.last_name.ilike(f"%{search}%") |
            Employee.email.ilike(f"%{search}%") |
            Employee.employee_id.ilike(f"%{search}%")
        )
        query = query.filter(search_filter)

    # Count total
    total = query.count()

    # Pagination
    offset = (page - 1) * size
    employees = query.offset(offset).limit(size).all()

    # Build response
    employee_responses = []
    for emp in employees:
        employee_responses.append(
            EmployeeResponse(
                id=emp.id,
                employee_id=emp.employee_id,
                first_name=emp.first_name,
                last_name=emp.last_name,
                full_name=f"{emp.first_name} {emp.last_name}",
                email=emp.email,
                designation=emp.designation,
                department_id=emp.department_id,
                manager_id=emp.manager_id,
                is_active=emp.is_active,
                hire_date=emp.hire_date,
                created_at=emp.created_at,
                updated_at=emp.updated_at
            )
        )

    return EmployeeListResponse(
        employees=employee_responses,
        total=total,
        page=page,
        size=size
    )


@router.get("/{employee_id}", response_model=EmployeeResponse)
async def get_employee(
    employee_id: str,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """
    Get a specific employee by ID.
    """
    emp = db.query(Employee).filter(
        Employee.id == employee_id,
        Employee.is_deleted == False
    ).first()

    if not emp:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Employee not found"
        )

    return EmployeeResponse(
        id=emp.id,
        employee_id=emp.employee_id,
        first_name=emp.first_name,
        last_name=emp.last_name,
        full_name=f"{emp.first_name} {emp.last_name}",
        email=emp.email,
        designation=emp.designation,
        department_id=emp.department_id,
        manager_id=emp.manager_id,
        is_active=emp.is_active,
        hire_date=emp.hire_date,
        created_at=emp.created_at,
        updated_at=emp.updated_at
    )


@router.post("", response_model=EmployeeResponse, status_code=status.HTTP_201_CREATED)
async def create_employee(
    employee_data: EmployeeCreate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """
    Create a new employee.
    """
    # Check if employee_id already exists
    existing = db.query(Employee).filter(
        Employee.employee_id == employee_data.employee_id
    ).first()

    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Employee ID already exists"
        )

    # Check if email already exists
    existing_email = db.query(Employee).filter(
        Employee.email == employee_data.email
    ).first()

    if existing_email:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )

    emp = Employee(
        employee_id=employee_data.employee_id,
        first_name=employee_data.first_name,
        last_name=employee_data.last_name,
        email=employee_data.email,
        department_id=employee_data.department_id,
        manager_id=employee_data.manager_id,
        designation=employee_data.designation,
        hire_date=employee_data.hire_date,
        is_active=True
    )

    db.add(emp)
    db.commit()
    db.refresh(emp)

    return EmployeeResponse(
        id=emp.id,
        employee_id=emp.employee_id,
        first_name=emp.first_name,
        last_name=emp.last_name,
        full_name=f"{emp.first_name} {emp.last_name}",
        email=emp.email,
        designation=emp.designation,
        department_id=emp.department_id,
        manager_id=emp.manager_id,
        is_active=emp.is_active,
        hire_date=emp.hire_date,
        created_at=emp.created_at,
        updated_at=emp.updated_at
    )


@router.put("/{employee_id}", response_model=EmployeeResponse)
async def update_employee(
    employee_id: str,
    employee_data: EmployeeUpdate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """
    Update an existing employee.
    """
    emp = db.query(Employee).filter(
        Employee.id == employee_id,
        Employee.is_deleted == False
    ).first()

    if not emp:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Employee not found"
        )

    # Update fields if provided
    if employee_data.first_name:
        emp.first_name = employee_data.first_name
    if employee_data.last_name:
        emp.last_name = employee_data.last_name
    if employee_data.email:
        emp.email = employee_data.email
    if employee_data.department_id is not None:
        emp.department_id = employee_data.department_id
    if employee_data.manager_id is not None:
        emp.manager_id = employee_data.manager_id
    if employee_data.designation:
        emp.designation = employee_data.designation
    if employee_data.hire_date is not None:
        emp.hire_date = employee_data.hire_date
    if employee_data.is_active is not None:
        emp.is_active = employee_data.is_active

    db.commit()
    db.refresh(emp)

    return EmployeeResponse(
        id=emp.id,
        employee_id=emp.employee_id,
        first_name=emp.first_name,
        last_name=emp.last_name,
        full_name=f"{emp.first_name} {emp.last_name}",
        email=emp.email,
        designation=emp.designation,
        department_id=emp.department_id,
        manager_id=emp.manager_id,
        is_active=emp.is_active,
        hire_date=emp.hire_date,
        created_at=emp.created_at,
        updated_at=emp.updated_at
    )


@router.delete("/{employee_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_employee(
    employee_id: str,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """
    Soft-delete an employee.
    """
    emp = db.query(Employee).filter(
        Employee.id == employee_id,
        Employee.is_deleted == False
    ).first()

    if not emp:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Employee not found"
        )

    emp.soft_delete()
    db.commit()

    return None