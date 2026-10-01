"""
Analytics API endpoints.
"""

from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from sqlalchemy import func, extract
from typing import List, Optional
from datetime import datetime, timedelta

from ...core.database import get_db
from ...models.employee import Employee, Department
from ...models.training import TrainingProgram, Course, Module
from ...models.session import TrainingSession
from ...models.enrollment import Enrollment
from ...models.assessment import Assessment, AssessmentAttempt
from ...models.assignment import Certificate
from ..deps import get_current_user

router = APIRouter()


@router.get("/dashboard")
async def get_dashboard_analytics(
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """
    Get dashboard analytics - overview statistics.
    """
    # Total enrollments
    total_enrollments = db.query(Enrollment).filter(Enrollment.is_deleted == False).count()

    # Active trainings (In Progress or Enrolled)
    active_trainings = db.query(Enrollment).filter(
        Enrollment.is_deleted == False,
        Enrollment.status.in_(["Enrolled", "In Progress"])
    ).count()

    # Average completion rate
    completed_enrollments = db.query(Enrollment).filter(
        Enrollment.is_deleted == False,
        Enrollment.status == "Completed"
    ).count()

    avg_completion_rate = round((completed_enrollments / total_enrollments * 100) if total_enrollments > 0 else 0, 1)

    # Certificates issued
    certificates_issued = db.query(Certificate).filter(Certificate.is_deleted == False).count()

    return {
        "total_enrollments": total_enrollments,
        "active_trainings": active_trainings,
        "avg_completion_rate": avg_completion_rate,
        "certificates_issued": certificates_issued
    }


@router.get("/enrollment-trends")
async def get_enrollment_trends(
    months: int = Query(6, ge=1, le=24),
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """
    Get enrollment and completion trends over the specified number of months.
    """
    end_date = datetime.utcnow()
    start_date = end_date - timedelta(days=months * 30)

    # Get enrollments grouped by month
    enrollments_query = db.query(
        extract('year', Enrollment.enrollment_date).label('year'),
        extract('month', Enrollment.enrollment_date).label('month'),
        func.count(Enrollment.id).label('count')
    ).filter(
        Enrollment.is_deleted == False,
        Enrollment.enrollment_date >= start_date,
        Enrollment.enrollment_date <= end_date
    ).group_by(
        extract('year', Enrollment.enrollment_date),
        extract('month', Enrollment.enrollment_date)
    ).order_by(
        extract('year', Enrollment.enrollment_date),
        extract('month', Enrollment.enrollment_date)
    ).all()

    # Get completions grouped by month
    completions_query = db.query(
        extract('year', Enrollment.completion_date).label('year'),
        extract('month', Enrollment.completion_date).label('month'),
        func.count(Enrollment.id).label('count')
    ).filter(
        Enrollment.is_deleted == False,
        Enrollment.status == "Completed",
        Enrollment.completion_date >= start_date,
        Enrollment.completion_date <= end_date
    ).group_by(
        extract('year', Enrollment.completion_date),
        extract('month', Enrollment.completion_date)
    ).order_by(
        extract('year', Enrollment.completion_date),
        extract('month', Enrollment.completion_date)
    ).all()

    # Build month labels
    months_data = []
    current = start_date
    while current <= end_date:
        month_key = f"{int(current.year)}-{int(current.month):02d}"
        months_data.append({
            "month": current.strftime("%b %Y"),
            "month_key": month_key,
            "enrollments": 0,
            "completions": 0
        })
        # Move to next month
        if current.month == 12:
            current = current.replace(year=current.year + 1, month=1)
        else:
            current = current.replace(month=current.month + 1)

    # Fill in enrollment data
    for row in enrollments_query:
        month_key = f"{int(row.year)}-{int(row.month):02d}"
        for item in months_data:
            if item["month_key"] == month_key:
                item["enrollments"] = row.count
                break

    # Fill in completion data
    for row in completions_query:
        month_key = f"{int(row.year)}-{int(row.month):02d}"
        for item in months_data:
            if item["month_key"] == month_key:
                item["completions"] = row.count
                break

    return months_data


@router.get("/completion-rates")
async def get_completion_rates(
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """
    Get completion rate distribution.
    """
    total = db.query(Enrollment).filter(Enrollment.is_deleted == False).count()

    if total == 0:
        return [
            {"name": "Completed", "value": 0},
            {"name": "In Progress", "value": 0},
            {"name": "Not Started", "value": 0}
        ]

    completed = db.query(Enrollment).filter(
        Enrollment.is_deleted == False,
        Enrollment.status == "Completed"
    ).count()

    in_progress = db.query(Enrollment).filter(
        Enrollment.is_deleted == False,
        Enrollment.status.in_(["Enrolled", "In Progress"])
    ).count()

    not_started = total - completed - in_progress

    return [
        {"name": "Completed", "value": round((completed / total) * 100)},
        {"name": "In Progress", "value": round((in_progress / total) * 100)},
        {"name": "Not Started", "value": round((not_started / total) * 100)}
    ]


@router.get("/department-analytics")
async def get_department_analytics(
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """
    Get completion rates by department.
    """
    departments = db.query(Department).filter(Department.is_deleted == False).all()

    result = []
    for dept in departments:
        # Get employees in this department
        employee_ids = [e.id for e in dept.employees]

        if not employee_ids:
            continue

        # Get enrollments for these employees
        enrollments = db.query(Enrollment).filter(
            Enrollment.is_deleted == False,
            Enrollment.employee_id.in_(employee_ids)
        ).all()

        if not enrollments:
            continue

        total = len(enrollments)
        completed = sum(1 for e in enrollments if e.status == "Completed")
        avg_completion = round((completed / total) * 100) if total > 0 else 0

        result.append({
            "department": dept.name,
            "employees": len(employee_ids),
            "avg_completion": avg_completion,
            "total_enrollments": total,
            "completed_enrollments": completed
        })

    return result


@router.get("/skill-gaps")
async def get_skill_gaps(
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """
    Get skill gaps analysis based on assessments.
    """
    # Get assessments with low passing rates
    attempts = db.query(AssessmentAttempt).filter(
        AssessmentAttempt.is_deleted == False,
        AssessmentAttempt.status.in_(["Submitted", "Graded"])
    ).all()

    # Group by assessment
    assessment_stats = {}
    for attempt in attempts:
        if attempt.assessment_id not in assessment_stats:
            assessment_stats[attempt.assessment_id] = {
                "total_attempts": 0,
                "passed_attempts": 0,
                "total_percentage": 0
            }
        assessment_stats[attempt.assessment_id]["total_attempts"] += 1
        assessment_stats[attempt.assessment_id]["total_percentage"] += attempt.percentage
        if attempt.passed:
            assessment_stats[attempt.assessment_id]["passed_attempts"] += 1

    # Calculate pass rates and find gaps
    skill_gaps = []
    for assessment_id, stats in assessment_stats.items():
        if stats["total_attempts"] < 3:
            continue  # Need minimum attempts for meaningful data

        pass_rate = (stats["passed_attempts"] / stats["total_attempts"]) * 100
        avg_score = stats["total_percentage"] / stats["total_attempts"]

        if pass_rate < 70:  # Threshold for skill gap
            assessment = db.query(Assessment).filter(Assessment.id == assessment_id).first()
            if assessment:
                skill_gaps.append({
                    "assessment_id": assessment_id,
                    "assessment_title": assessment.title,
                    "assessment_type": assessment.assessment_type,
                    "pass_rate": round(pass_rate, 1),
                    "avg_score": round(avg_score, 1),
                    "attempts": stats["total_attempts"],
                    "severity": "high" if pass_rate < 50 else "medium"
                })

    # Sort by pass rate (lowest first)
    skill_gaps.sort(key=lambda x: x["pass_rate"])

    return skill_gaps


@router.get("/effectiveness")
async def get_training_effectiveness(
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """
    Get training effectiveness metrics.
    """
    # Get training programs with enrollment and completion data
    programs = db.query(TrainingProgram).filter(TrainingProgram.is_deleted == False).all()

    result = []
    for program in programs:
        enrollments = db.query(Enrollment).filter(
            Enrollment.is_deleted == False,
            Enrollment.training_program_id == program.id
        ).all()

        if not enrollments:
            continue

        total = len(enrollments)
        completed = sum(1 for e in enrollments if e.status == "Completed")
        in_progress = sum(1 for e in enrollments if e.status in ["Enrolled", "In Progress"])
        completion_rate = round((completed / total) * 100) if total > 0 else 0

        # Get average assessment score for this program
        program_assessments = db.query(Assessment).filter(
            Assessment.is_deleted == False,
            Assessment.training_program_id == program.id
        ).all()

        assessment_ids = [a.id for a in program_assessments]
        avg_assessment_score = 0
        assessment_count = 0

        if assessment_ids:
            attempts = db.query(AssessmentAttempt).filter(
                AssessmentAttempt.is_deleted == False,
                AssessmentAttempt.assessment_id.in_(assessment_ids),
                AssessmentAttempt.status.in_(["Submitted", "Graded"])
            ).all()

            if attempts:
                avg_assessment_score = round(sum(a.percentage for a in attempts) / len(attempts), 1)
                assessment_count = len(attempts)

        result.append({
            "program_id": program.id,
            "program_title": program.title,
            "total_enrollments": total,
            "completed": completed,
            "in_progress": in_progress,
            "completion_rate": completion_rate,
            "avg_assessment_score": avg_assessment_score,
            "assessment_count": assessment_count
        })

    # Sort by completion rate (lowest first to highlight needs)
    result.sort(key=lambda x: x["completion_rate"])

    return result


@router.get("/employees")
async def get_employee_analytics(
    employee_id: Optional[str] = None,
    training_program_id: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """
    Get employee-level analytics.
    """
    query = db.query(Employee).filter(Employee.is_deleted == False)

    if employee_id:
        query = query.filter(Employee.id == employee_id)

    employees = query.all()

    result = []
    for emp in employees:
        enrollments = db.query(Enrollment).filter(
            Enrollment.is_deleted == False,
            Enrollment.employee_id == emp.id
        ).all()

        if training_program_id:
            enrollments = [e for e in enrollments if e.training_program_id == training_program_id]

        if not enrollments:
            continue

        total = len(enrollments)
        completed = sum(1 for e in enrollments if e.status == "Completed")
        in_progress = sum(1 for e in enrollments if e.status in ["Enrolled", "In Progress"])
        completion_rate = round((completed / total) * 100) if total > 0 else 0

        # Get certificates
        certificates = db.query(Certificate).filter(
            Certificate.is_deleted == False,
            Certificate.employee_id == emp.id
        ).count()

        result.append({
            "employee_id": emp.id,
            "employee_name": f"{emp.first_name} {emp.last_name}",
            "email": emp.email,
            "department": emp.department.name if emp.department else "N/A",
            "total_enrollments": total,
            "completed": completed,
            "in_progress": in_progress,
            "completion_rate": completion_rate,
            "certificates_earned": certificates
        })

    return result