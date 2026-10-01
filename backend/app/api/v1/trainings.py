"""
Training Program API endpoints.
"""

from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime

from ...core.database import get_db
from ...models.training import TrainingProgram, Course, Module
from ...models.employee import Department
from ...models.user import User
from ...schemas.training import (
    TrainingProgramCreate,
    TrainingProgramUpdate,
    TrainingProgramResponse,
    CourseCreate,
    CourseUpdate,
    CourseResponse,
    ModuleCreate,
    ModuleUpdate,
    ModuleResponse
)
from ..deps import get_current_user

router = APIRouter()


# ===================== Training Program Endpoints =====================

@router.get("", response_model=List[TrainingProgramResponse])
async def list_training_programs(
    status: Optional[str] = None,
    department_id: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """
    List all training programs with optional filtering.
    """
    query = db.query(TrainingProgram).filter(TrainingProgram.is_deleted == False)

    if status:
        query = query.filter(TrainingProgram.status == status)

    if department_id:
        query = query.filter(TrainingProgram.department_id == department_id)

    programs = query.all()

    return [
        TrainingProgramResponse(
            id=p.id,
            title=p.title,
            description=p.description,
            category=p.category,
            department_id=p.department_id,
            trainer_id=p.trainer_id,
            start_date=p.start_date,
            end_date=p.end_date,
            duration_weeks=p.duration_weeks,
            mode=p.mode,
            location=p.location,
            max_participants=p.max_participants,
            prerequisites=p.prerequisites,
            learning_objectives=p.learning_objectives,
            status=p.status,
            is_required=p.is_required,
            created_at=p.created_at,
            updated_at=p.updated_at
        )
        for p in programs
    ]


@router.get("/{program_id}", response_model=TrainingProgramResponse)
async def get_training_program(
    program_id: str,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """
    Get a specific training program by ID.
    """
    program = db.query(TrainingProgram).filter(
        TrainingProgram.id == program_id,
        TrainingProgram.is_deleted == False
    ).first()

    if not program:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Training program not found"
        )

    return TrainingProgramResponse(
        id=program.id,
        title=program.title,
        description=program.description,
        category=program.category,
        department_id=program.department_id,
        trainer_id=program.trainer_id,
        start_date=program.start_date,
        end_date=program.end_date,
        duration_weeks=program.duration_weeks,
        mode=program.mode,
        location=program.location,
        max_participants=program.max_participants,
        prerequisites=program.prerequisites,
        learning_objectives=program.learning_objectives,
        status=program.status,
        is_required=program.is_required,
        created_at=program.created_at,
        updated_at=program.updated_at
    )


@router.post("", response_model=TrainingProgramResponse, status_code=status.HTTP_201_CREATED)
async def create_training_program(
    program_data: TrainingProgramCreate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """
    Create a new training program.
    """
    program = TrainingProgram(
        title=program_data.title,
        description=program_data.description,
        category=program_data.category,
        department_id=program_data.department_id,
        trainer_id=program_data.trainer_id,
        start_date=program_data.start_date,
        end_date=program_data.end_date,
        duration_weeks=program_data.duration_weeks,
        mode=program_data.mode,
        location=program_data.location,
        max_participants=program_data.max_participants,
        prerequisites=program_data.prerequisites,
        learning_objectives=program_data.learning_objectives,
        is_required=program_data.is_required,
        status="Draft"
    )

    db.add(program)
    db.commit()
    db.refresh(program)

    return TrainingProgramResponse(
        id=program.id,
        title=program.title,
        description=program.description,
        category=program.category,
        department_id=program.department_id,
        trainer_id=program.trainer_id,
        start_date=program.start_date,
        end_date=program.end_date,
        duration_weeks=program.duration_weeks,
        mode=program.mode,
        location=program.location,
        max_participants=program.max_participants,
        prerequisites=program.prerequisites,
        learning_objectives=program.learning_objectives,
        status=program.status,
        is_required=program.is_required,
        created_at=program.created_at,
        updated_at=program.updated_at
    )


@router.put("/{program_id}", response_model=TrainingProgramResponse)
async def update_training_program(
    program_id: str,
    program_data: TrainingProgramUpdate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """
    Update an existing training program.
    """
    program = db.query(TrainingProgram).filter(
        TrainingProgram.id == program_id,
        TrainingProgram.is_deleted == False
    ).first()

    if not program:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Training program not found"
        )

    # Update fields if provided
    update_data = program_data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(program, field, value)

    db.commit()
    db.refresh(program)

    return TrainingProgramResponse(
        id=program.id,
        title=program.title,
        description=program.description,
        category=program.category,
        department_id=program.department_id,
        trainer_id=program.trainer_id,
        start_date=program.start_date,
        end_date=program.end_date,
        duration_weeks=program.duration_weeks,
        mode=program.mode,
        location=program.location,
        max_participants=program.max_participants,
        prerequisites=program.prerequisites,
        learning_objectives=program.learning_objectives,
        status=program.status,
        is_required=program.is_required,
        created_at=program.created_at,
        updated_at=program.updated_at
    )


@router.delete("/{program_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_training_program(
    program_id: str,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """
    Soft-delete a training program.
    """
    program = db.query(TrainingProgram).filter(
        TrainingProgram.id == program_id,
        TrainingProgram.is_deleted == False
    ).first()

    if not program:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Training program not found"
        )

    program.soft_delete()
    db.commit()

    return None


# ===================== Course Endpoints =====================

@router.get("/{program_id}/courses", response_model=List[CourseResponse])
async def list_courses(
    program_id: str,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """
    List all courses for a training program.
    """
    # Verify program exists
    program = db.query(TrainingProgram).filter(
        TrainingProgram.id == program_id,
        TrainingProgram.is_deleted == False
    ).first()

    if not program:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Training program not found"
        )

    courses = db.query(Course).filter(
        Course.training_program_id == program_id,
        Course.is_deleted == False
    ).order_by(Course.order_index).all()

    return [
        CourseResponse(
            id=c.id,
            title=c.title,
            description=c.description,
            order_index=c.order_index,
            estimated_hours=c.estimated_hours,
            status=c.status,
            is_mandatory=c.is_mandatory,
            training_program_id=c.training_program_id,
            created_at=c.created_at,
            updated_at=c.updated_at
        )
        for c in courses
    ]


@router.post("/{program_id}/courses", response_model=CourseResponse, status_code=status.HTTP_201_CREATED)
async def create_course(
    program_id: str,
    course_data: CourseCreate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """
    Create a new course in a training program.
    """
    # Verify program exists
    program = db.query(TrainingProgram).filter(
        TrainingProgram.id == program_id,
        TrainingProgram.is_deleted == False
    ).first()

    if not program:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Training program not found"
        )

    course = Course(
        title=course_data.title,
        description=course_data.description,
        order_index=course_data.order_index,
        estimated_hours=course_data.estimated_hours,
        is_mandatory=course_data.is_mandatory,
        training_program_id=program_id,
        status="Draft"
    )

    db.add(course)
    db.commit()
    db.refresh(course)

    return CourseResponse(
        id=course.id,
        title=course.title,
        description=course.description,
        order_index=course.order_index,
        estimated_hours=course.estimated_hours,
        status=course.status,
        is_mandatory=course.is_mandatory,
        training_program_id=course.training_program_id,
        created_at=course.created_at,
        updated_at=course.updated_at
    )


@router.put("/courses/{course_id}", response_model=CourseResponse)
async def update_course(
    course_id: str,
    course_data: CourseUpdate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """
    Update an existing course.
    """
    course = db.query(Course).filter(
        Course.id == course_id,
        Course.is_deleted == False
    ).first()

    if not course:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Course not found"
        )

    update_data = course_data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(course, field, value)

    db.commit()
    db.refresh(course)

    return CourseResponse(
        id=course.id,
        title=course.title,
        description=course.description,
        order_index=course.order_index,
        estimated_hours=course.estimated_hours,
        status=course.status,
        is_mandatory=course.is_mandatory,
        training_program_id=course.training_program_id,
        created_at=course.created_at,
        updated_at=course.updated_at
    )


# ===================== Module Endpoints =====================

@router.get("/courses/{course_id}/modules", response_model=List[ModuleResponse])
async def list_modules(
    course_id: str,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """
    List all modules for a course.
    """
    # Verify course exists
    course = db.query(Course).filter(
        Course.id == course_id,
        Course.is_deleted == False
    ).first()

    if not course:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Course not found"
        )

    modules = db.query(Module).filter(
        Module.course_id == course_id,
        Module.is_deleted == False
    ).order_by(Module.order_index).all()

    return [
        ModuleResponse(
            id=m.id,
            title=m.title,
            description=m.description,
            order_index=m.order_index,
            estimated_hours=m.estimated_hours,
            status=m.status,
            course_id=m.course_id,
            created_at=m.created_at,
            updated_at=m.updated_at
        )
        for m in modules
    ]


@router.post("/courses/{course_id}/modules", response_model=ModuleResponse, status_code=status.HTTP_201_CREATED)
async def create_module(
    course_id: str,
    module_data: ModuleCreate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """
    Create a new module in a course.
    """
    # Verify course exists
    course = db.query(Course).filter(
        Course.id == course_id,
        Course.is_deleted == False
    ).first()

    if not course:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Course not found"
        )

    module = Module(
        title=module_data.title,
        description=module_data.description,
        order_index=module_data.order_index,
        estimated_hours=module_data.estimated_hours,
        course_id=course_id,
        status="Not Started"
    )

    db.add(module)
    db.commit()
    db.refresh(module)

    return ModuleResponse(
        id=module.id,
        title=module.title,
        description=module.description,
        order_index=module.order_index,
        estimated_hours=module.estimated_hours,
        status=module.status,
        course_id=module.course_id,
        created_at=module.created_at,
        updated_at=module.updated_at
    )


@router.put("/modules/{module_id}", response_model=ModuleResponse)
async def update_module(
    module_id: str,
    module_data: ModuleUpdate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """
    Update an existing module.
    """
    module = db.query(Module).filter(
        Module.id == module_id,
        Module.is_deleted == False
    ).first()

    if not module:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Module not found"
        )

    update_data = module_data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(module, field, value)

    db.commit()
    db.refresh(module)

    return ModuleResponse(
        id=module.id,
        title=module.title,
        description=module.description,
        order_index=module.order_index,
        estimated_hours=module.estimated_hours,
        status=module.status,
        course_id=module.course_id,
        created_at=module.created_at,
        updated_at=module.updated_at
    )