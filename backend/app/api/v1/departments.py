"""
Department API endpoints.
"""

from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from uuid import UUID

from ...core.database import get_db
from ...models.employee import Department
from ...schemas.employee import (
    DepartmentCreate,
    DepartmentUpdate,
    DepartmentResponse
)
from ..deps import get_current_user

router = APIRouter()


@router.get("", response_model=List[DepartmentResponse])
async def list_departments(
    is_active: Optional[bool] = None,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """
    List all departments.
    """
    query = db.query(Department).filter(Department.is_deleted == False)

    if is_active is not None:
        query = query.filter(Department.is_active == is_active)

    departments = query.all()

    return [
        DepartmentResponse(
            id=d.id,
            name=d.name,
            description=d.description,
            code=d.code,
            is_active=d.is_active,
            created_at=d.created_at,
            updated_at=d.updated_at
        )
        for d in departments
    ]


@router.get("/{dept_id}", response_model=DepartmentResponse)
async def get_department(
    dept_id: str,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """
    Get a specific department by ID.
    """
    dept = db.query(Department).filter(
        Department.id == dept_id,
        Department.is_deleted == False
    ).first()

    if not dept:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Department not found"
        )

    return DepartmentResponse(
        id=dept.id,
        name=dept.name,
        description=dept.description,
        code=dept.code,
        is_active=dept.is_active,
        created_at=dept.created_at,
        updated_at=dept.updated_at
    )


@router.post("", response_model=DepartmentResponse, status_code=status.HTTP_201_CREATED)
async def create_department(
    dept_data: DepartmentCreate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """
    Create a new department.
    """
    # Check if name already exists
    existing = db.query(Department).filter(
        Department.name == dept_data.name
    ).first()

    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Department name already exists"
        )

    dept = Department(
        name=dept_data.name,
        description=dept_data.description,
        code=dept_data.code,
        is_active=True
    )

    db.add(dept)
    db.commit()
    db.refresh(dept)

    return DepartmentResponse(
        id=dept.id,
        name=dept.name,
        description=dept.description,
        code=dept.code,
        is_active=dept.is_active,
        created_at=dept.created_at,
        updated_at=dept.updated_at
    )


@router.put("/{dept_id}", response_model=DepartmentResponse)
async def update_department(
    dept_id: str,
    dept_data: DepartmentUpdate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """
    Update an existing department.
    """
    dept = db.query(Department).filter(
        Department.id == dept_id,
        Department.is_deleted == False
    ).first()

    if not dept:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Department not found"
        )

    # Update fields if provided
    if dept_data.name is not None:
        dept.name = dept_data.name
    if dept_data.description is not None:
        dept.description = dept_data.description
    if dept_data.code is not None:
        dept.code = dept_data.code
    if dept_data.is_active is not None:
        dept.is_active = dept_data.is_active

    db.commit()
    db.refresh(dept)

    return DepartmentResponse(
        id=dept.id,
        name=dept.name,
        description=dept.description,
        code=dept.code,
        is_active=dept.is_active,
        created_at=dept.created_at,
        updated_at=dept.updated_at
    )


@router.delete("/{dept_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_department(
    dept_id: str,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """
    Soft-delete a department.
    """
    dept = db.query(Department).filter(
        Department.id == dept_id,
        Department.is_deleted == False
    ).first()

    if not dept:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Department not found"
        )

    dept.soft_delete()
    db.commit()

    return None