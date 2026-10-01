"""
Assessment API endpoints.
"""

from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime

from ...core.database import get_db
from ...models.assessment import Assessment, Question, AssessmentAttempt, Answer
from ...models.employee import Employee
from ...schemas.assessment import (
    AssessmentCreate,
    AssessmentUpdate,
    AssessmentResponse,
    AssessmentSubmitRequest,
    AssessmentAttemptResponse,
    QuestionCreate,
    QuestionResponse
)
from ..deps import get_current_user

router = APIRouter()


@router.get("", response_model=List[AssessmentResponse])
async def list_assessments(
    training_program_id: Optional[str] = None,
    module_id: Optional[str] = None,
    assessment_type: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """
    List assessments with optional filtering.
    """
    query = db.query(Assessment).filter(Assessment.is_deleted == False)

    if training_program_id:
        query = query.filter(Assessment.training_program_id == training_program_id)

    if module_id:
        query = query.filter(Assessment.module_id == module_id)

    if assessment_type:
        query = query.filter(Assessment.assessment_type == assessment_type)

    assessments = query.all()
    return assessments


@router.get("/{assessment_id}", response_model=AssessmentResponse)
async def get_assessment(
    assessment_id: str,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """
    Get a specific assessment by ID with questions.
    """
    assessment = db.query(Assessment).filter(
        Assessment.id == assessment_id,
        Assessment.is_deleted == False
    ).first()

    if not assessment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Assessment not found"
        )

    return assessment


@router.post("", response_model=AssessmentResponse, status_code=status.HTTP_201_CREATED)
async def create_assessment(
    assessment_data: AssessmentCreate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """
    Create a new assessment with questions.
    """
    questions_data = assessment_data.questions or []

    assessment = Assessment(
        title=assessment_data.title,
        description=assessment_data.description,
        assessment_type=assessment_data.assessment_type,
        training_program_id=assessment_data.training_program_id,
        module_id=assessment_data.module_id,
        duration_minutes=assessment_data.duration_minutes,
        passing_score=assessment_data.passing_score,
        attempt_limit=assessment_data.attempt_limit,
        start_date=assessment_data.start_date,
        end_date=assessment_data.end_date,
        is_active=True
    )

    db.add(assessment)
    db.flush()  # Get assessment ID

    for q_data in questions_data:
        question = Question(
            assessment_id=assessment.id,
            question_text=q_data.question_text,
            question_type=q_data.question_type,
            options=q_data.options,
            correct_answer=q_data.correct_answer,
            explanation=q_data.explanation,
            points=q_data.points,
            order_index=q_data.order_index
        )
        db.add(question)

    db.commit()
    db.refresh(assessment)

    return assessment


@router.post("/{assessment_id}/start", response_model=AssessmentAttemptResponse)
async def start_assessment(
    assessment_id: str,
    employee_id: str = Query(...),
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """
    Start a new attempt at an assessment for an employee.
    """
    assessment = db.query(Assessment).filter(
        Assessment.id == assessment_id,
        Assessment.is_deleted == False
    ).first()

    if not assessment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Assessment not found"
        )

    employee = db.query(Employee).filter(
        Employee.id == employee_id,
        Employee.is_deleted == False
    ).first()

    if not employee:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Employee not found"
        )

    # Check attempt limit
    existing_attempts = db.query(AssessmentAttempt).filter(
        AssessmentAttempt.assessment_id == assessment_id,
        AssessmentAttempt.employee_id == employee_id,
        AssessmentAttempt.is_deleted == False
    ).count()

    if existing_attempts >= assessment.attempt_limit:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Attempt limit reached ({assessment.attempt_limit})"
        )

    attempt = AssessmentAttempt(
        assessment_id=assessment_id,
        employee_id=employee_id,
        attempt_number=existing_attempts + 1,
        status="In Progress",
        start_time=datetime.utcnow()
    )

    db.add(attempt)
    db.commit()
    db.refresh(attempt)

    return attempt


@router.post("/attempts/{attempt_id}/submit", response_model=AssessmentAttemptResponse)
async def submit_assessment(
    attempt_id: str,
    submit_data: AssessmentSubmitRequest,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """
    Submit answers for an assessment attempt and calculate score.
    """
    attempt = db.query(AssessmentAttempt).filter(
        AssessmentAttempt.id == attempt_id,
        AssessmentAttempt.is_deleted == False
    ).first()

    if not attempt:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Attempt not found"
        )

    if attempt.status == "Submitted" or attempt.status == "Graded":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Attempt already submitted"
        )

    assessment = db.query(Assessment).filter(Assessment.id == attempt.assessment_id).first()
    questions = {q.id: q for q in assessment.questions}

    total_score = 0.0
    max_score = sum(q.points for q in questions.values())

    for ans_data in submit_data.answers:
        question = questions.get(ans_data.question_id)
        if not question:
            continue

        is_correct = (ans_data.selected_answer.strip().lower() == question.correct_answer.strip().lower())
        points_awarded = question.points if is_correct else 0.0
        total_score += points_awarded

        answer = Answer(
            attempt_id=attempt.id,
            question_id=question.id,
            selected_answer=ans_data.selected_answer,
            is_correct=is_correct,
            points_awarded=points_awarded
        )
        db.add(answer)

    percentage = (total_score / max_score * 100.0) if max_score > 0 else 0.0
    passed = percentage >= assessment.passing_score

    attempt.score = total_score
    attempt.max_score = max_score
    attempt.percentage = round(percentage, 2)
    attempt.passed = passed
    attempt.status = "Submitted"
    attempt.submit_time = datetime.utcnow()

    db.commit()
    db.refresh(attempt)

    return attempt