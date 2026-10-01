"""
Assignment API endpoints.
"""

from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime

from ...core.database import get_db
from ...models.assignment import Assignment, AssignmentSubmission
from ...models.employee import Employee
from ...models.training import TrainingProgram
from ...models.course import Course
from ...schemas.assignment import (
    AssignmentCreate,
    AssignmentUpdate,
    AssignmentResponse,
    AssignmentSubmissionCreate,
    AssignmentSubmissionUpdate,
    AssignmentSubmissionResponse
)
from ..deps import get_current_user

router = APIRouter()


@router.get("", response_model=List[AssignmentResponse])
async def list_assignments(
    training_program_id: Optional[str] = Query(None),
    course_id: Optional[str] = Query(None),
    status: Optional[str] = Query(None),
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """
    List assignments with optional filtering.
    """
    query = db.query(Assignment)

    if training_program_id:
        query = query.filter(Assignment.training_program_id == training_program_id)

    if course_id:
        query = query.filter(Assignment.course_id == course_id)

    # Note: Assignment model doesn't have a status field, but we can filter by related submissions if needed
    # For now, we'll just return all assignments

    assignments = query.order_by(Assignment.created_at.desc()).all()

    return [
        AssignmentResponse(
            id=a.id,
            title=a.title,
            description=a.description,
            training_program_id=a.training_program_id,
            course_id=a.course_id,
            due_date=a.due_date,
            max_score=a.max_score,
            created_at=a.created_at,
            updated_at=a.updated_at
        )
        for a in assignments
    ]


@router.get("/{assignment_id}", response_model=AssignmentResponse)
async def get_assignment(
    assignment_id: str,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """
    Get a specific assignment by ID.
    """
    assignment = db.query(Assignment).filter(Assignment.id == assignment_id).first()

    if not assignment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Assignment not found"
        )

    return AssignmentResponse(
        id=assignment.id,
        title=assignment.title,
        description=assignment.description,
        training_program_id=assignment.training_program_id,
        course_id=assignment.course_id,
        due_date=assignment.due_date,
        max_score=assignment.max_score,
        created_at=assignment.created_at,
        updated_at=assignment.updated_at
    )


@router.post("", response_model=AssignmentResponse, status_code=status.HTTP_201_CREATED)
async def create_assignment(
    assignment_data: AssignmentCreate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """
    Create a new assignment.
    """
    # Verify training program exists
    program = db.query(TrainingProgram).filter(
        TrainingProgram.id == assignment_data.training_program_id,
        TrainingProgram.is_deleted == False
    ).first()

    if not program:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Training program not found"
        )

    # Verify course exists if provided
    if assignment_data.course_id:
        course = db.query(Course).filter(
            Course.id == assignment_data.course_id,
            Course.is_deleted == False
        ).first()

        if not course:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Course not found"
            )

    assignment = Assignment(
        title=assignment_data.title,
        description=assignment_data.description,
        training_program_id=assignment_data.training_program_id,
        course_id=assignment_data.course_id,
        due_date=assignment_data.due_date,
        max_score=assignment_data.max_score
    )

    db.add(assignment)
    db.commit()
    db.refresh(assignment)

    return AssignmentResponse(
        id=assignment.id,
        title=assignment.title,
        description=assignment.description,
        training_program_id=assignment.training_program_id,
        course_id=assignment.course_id,
        due_date=assignment.due_date,
        max_score=assignment.max_score,
        created_at=assignment.created_at,
        updated_at=assignment.updated_at
    )


@router.put("/{assignment_id}", response_model=AssignmentResponse)
async def update_assignment(
    assignment_id: str,
    assignment_data: AssignmentUpdate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """
    Update an existing assignment.
    """
    assignment = db.query(Assignment).filter(Assignment.id == assignment_id).first()

    if not assignment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Assignment not found"
        )

    update_data = assignment_data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(assignment, field, value)

    db.commit()
    db.refresh(assignment)

    return AssignmentResponse(
        id=assignment.id,
        title=assignment.title,
        description=assignment.description,
        training_program_id=assignment.training_program_id,
        course_id=assignment.course_id,
        due_date=assignment.due_date,
        max_score=assignment.max_score,
        created_at=assignment.created_at,
        updated_at=assignment.updated_at
    )


@router.delete("/{assignment_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_assignment(
    assignment_id: str,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """
    Delete an assignment.
    """
    assignment = db.query(Assignment).filter(Assignment.id == assignment_id).first()

    if not assignment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Assignment not found"
        )

    db.delete(assignment)
    db.commit()

    return None


@router.get("/{assignment_id}/submissions", response_model=List[AssignmentSubmissionResponse])
async def list_assignment_submissions(
    assignment_id: str,
    employee_id: Optional[str] = Query(None),
    status: Optional[str] = Query(None),
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """
    List submissions for a specific assignment.
    """
    # Verify assignment exists
    assignment = db.query(Assignment).filter(Assignment.id == assignment_id).first()

    if not assignment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Assignment not found"
        )

    query = db.query(AssignmentSubmission).filter(AssignmentSubmission.assignment_id == assignment_id)

    if employee_id:
        query = query.filter(AssignmentSubmission.employee_id == employee_id)

    if status:
        query = query.filter(AssignmentSubmission.status == status)

    submissions = query.order_by(AssignmentSubmission.graded_at.desc().nullsfirst()).all()

    return [
        AssignmentSubmissionResponse(
            id=s.id,
            assignment_id=s.assignment_id,
            employee_id=s.employee_id,
            file_path=s.file_path,
            comments=s.comments,
            status=s.status,
            score=s.score,
            trainer_feedback=s.trainer_feedback,
            graded_by_id=s.graded_by_id,
            graded_at=s.graded_at,
            created_at=s.created_at,
            updated_at=s.updated_at
        )
        for s in submissions
    ]


@router.post("/submissions", response_model=AssignmentSubmissionResponse, status_code=status.HTTP_201_CREATED)
async def create_submission(
    submission_data: AssignmentSubmissionCreate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """
    Create a new assignment submission.
    """
    # Verify assignment exists
    assignment = db.query(Assignment).filter(
        Assignment.id == submission_data.assignment_id
    ).first()

    if not assignment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Assignment not found"
        )

    # Verify employee exists
    employee = db.query(Employee).filter(
        Employee.id == submission_data.employee_id,
        Employee.is_deleted == False
    ).first()

    if not employee:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Employee not found"
        )

    submission = AssignmentSubmission(
        assignment_id=submission_data.assignment_id,
        employee_id=submission_data.employee_id,
        file_path=submission_data.file_path,
        comments=submission_data.comments,
        status="Submitted"
    )

    db.add(submission)
    db.commit()
    db.refresh(submission)

    return AssignmentSubmissionResponse(
        id=submission.id,
        assignment_id=submission.assignment_id,
        employee_id=submission.employee_id,
        file_path=submission.file_path,
        comments=submission.comments,
        status=submission.status,
        score=submission.score,
        trainer_feedback=submission.trainer_feedback,
        graded_by_id=submission.graded_by_id,
        graded_at=submission.graded_at,
        created_at=submission.created_at,
        updated_at=submission.updated_at
    )


@router.put("/submissions/{submission_id}", response_model=AssignmentSubmissionResponse)
async def update_submission(
    submission_id: str,
    submission_data: AssignmentSubmissionUpdate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """
    Update an assignment submission (grading).
    """
    submission = db.query(AssignmentSubmission).filter(AssignmentSubmission.id == submission_id).first()

    if not submission:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Submission not found"
        )

    update_data = submission_data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(submission, field, value)

    db.commit()
    db.refresh(submission)

    return AssignmentSubmissionResponse(
        id=submission.id,
        assignment_id=submission.assignment_id,
        employee_id=submission.employee_id,
        file_path=submission.file_path,
        comments=submission.comments,
        status=submission.status,
        score=submission.score,
        trainer_feedback=submission.trainer_feedback,
        graded_by_id=submission.graded_by_id,
        graded_at=submission.graded_at,
        created_at=submission.created_at,
        updated_at=submission.updated_at
    )


@router.get("/employee/{employee_id}/assignments", response_model=List[AssignmentResponse])
async def get_employee_assignments(
    employee_id: str,
    status: Optional[str] = Query(None),
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """
    Get assignments for a specific employee.
    """
    # Verify employee exists
    employee = db.query(Employee).filter(
        Employee.id == employee_id,
        Employee.is_deleted == False
    ).first()

    if not employee:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Employee not found"
        )

    # Get enrollments for this employee to see what training programs they're enrolled in
    from ...models.enrollment import Enrollment
    enrollments = db.query(Enrollment).filter(
        Enrollment.employee_id == employee_id,
        Enrollment.is_deleted == False
    ).all()

    enrollment_program_ids = [e.training_program_id for e in enrollments if e.training_program_id]

    # Get assignments for those training programs
    query = db.query(Assignment).filter(
        Assignment.training_program_id.in_(enrollment_program_ids)
    )

    if status:
        # Note: Assignment model doesn't have status, but we could join with submissions
        # For simplicity, we'll just return all assignments for now
        pass

    assignments = query.order_by(Assignment.created_at.desc()).all()

    return [
        AssignmentResponse(
            id=a.id,
            title=a.title,
            description=a.description,
            training_program_id=a.training_program_id,
            course_id=a.course_id,
            due_date=a.due_date,
            max_score=a.max_score,
            created_at=a.created_at,
            updated_at=a.updated_at
        )
        for a in assignments
    ]