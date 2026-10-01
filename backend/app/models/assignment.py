"""
Assignment, Feedback, Certificate, Notification, and AuditLog models.
"""

from sqlalchemy import Column, String, Boolean, DateTime, Integer, Float, Text, ForeignKey, Index, JSON, UniqueConstraint, JSON
from sqlalchemy.orm import relationship
from datetime import datetime
import uuid

from .base import BaseModel


class Assignment(BaseModel):
    """Model representing a practical assignment."""
    __tablename__ = "assignments"

    title = Column(
        String(200),
        nullable=False,
        comment="Assignment title"
    )
    description = Column(
        Text,
        nullable=True,
        comment="Assignment description and instructions"
    )
    training_program_id = Column(
        String(36),
        ForeignKey("training_programs.id"),
        nullable=False,
        comment="Foreign key to training program"
    )
    due_date = Column(
        DateTime(timezone=True),
        nullable=True,
        comment="Submission due date"
    )
    max_score = Column(
        Float,
        default=100.0,
        nullable=False,
        comment="Maximum possible score"
    )

    # Relationships
    training_program = relationship(
        "TrainingProgram",
        backref="assignments",
        lazy="select",
    )
    submissions = relationship(
        "AssignmentSubmission",
        back_populates="assignment",
        cascade="all, delete-orphan",
        lazy="select",
    )

    __table_args__ = (
        Index("ix_assignments_training_program_id", "training_program_id"),
    )

    def __repr__(self):
        return f"<Assignment {self.title}>"


class AssignmentSubmission(BaseModel):
    """Model representing an employee's submission for an assignment."""
    __tablename__ = "assignment_submissions"

    assignment_id = Column(
        String(36),
        ForeignKey("assignments.id"),
        nullable=False,
        comment="Foreign key to assignment"
    )
    employee_id = Column(
        String(36),
        ForeignKey("employees.id"),
        nullable=False,
        comment="Foreign key to employee"
    )
    file_path = Column(
        String(500),
        nullable=True,
        comment="Path to submitted file or document"
    )
    comments = Column(
        Text,
        nullable=True,
        comment="Employee comments on submission"
    )
    status = Column(
        String(30),
        nullable=False,
        default="Submitted",
        comment="Status: Pending, Submitted, Under Review, Passed, Needs Improvement"
    )
    score = Column(
        Float,
        nullable=True,
        comment="Score awarded by trainer"
    )
    trainer_feedback = Column(
        Text,
        nullable=True,
        comment="Feedback from trainer"
    )
    graded_by_id = Column(
        String(36),
        ForeignKey("users.id"),
        nullable=True,
        comment="Trainer user ID who graded"
    )
    graded_at = Column(
        DateTime(timezone=True),
        nullable=True,
        comment="Timestamp when graded"
    )

    # Relationships
    assignment = relationship(
        "Assignment",
        back_populates="submissions",
        lazy="select",
    )
    employee = relationship(
        "Employee",
        backref="assignment_submissions",
        lazy="select",
    )
    graded_by = relationship(
        "User",
        backref="assignments_graded",
        lazy="select",
    )

    __table_args__ = (
        UniqueConstraint("assignment_id", "employee_id", name="uq_submission_assign_emp"),
        Index("ix_assignment_submissions_assignment_id", "assignment_id"),
        Index("ix_assignment_submissions_employee_id", "employee_id"),
        Index("ix_assignment_submissions_status", "status"),
    )

    STATUS_CHOICES = ["Pending", "Submitted", "Under Review", "Passed", "Needs Improvement"]

    def __repr__(self):
        return f"<AssignmentSubmission assign={self.assignment_id} emp={self.employee_id}>"


class Feedback(BaseModel):
    """Model representing employee feedback on training and trainer."""
    __tablename__ = "feedbacks"

    training_program_id = Column(
        String(36),
        ForeignKey("training_programs.id"),
        nullable=False,
        comment="Foreign key to training program"
    )
    employee_id = Column(
        String(36),
        ForeignKey("employees.id"),
        nullable=False,
        comment="Foreign key to employee"
    )
    training_rating = Column(
        Integer,
        nullable=False,
        comment="Rating 1-5 for training program"
    )
    trainer_rating = Column(
        Integer,
        nullable=False,
        comment="Rating 1-5 for trainer"
    )
    material_usefulness = Column(
        Integer,
        nullable=False,
        comment="Rating 1-5 for materials"
    )
    difficulty_level = Column(
        String(30),
        nullable=True,
        comment="Too Easy, Just Right, Too Hard"
    )
    confidence_gain = Column(
        Integer,
        nullable=True,
        comment="Rating 1-5 on confidence improvement"
    )
    suggestions = Column(
        Text,
        nullable=True,
        comment="Suggestions for improvement"
    )

    # Relationships
    training_program = relationship(
        "TrainingProgram",
        backref="feedbacks",
        lazy="select",
    )
    employee = relationship(
        "Employee",
        backref="feedbacks",
        lazy="select",
    )

    __table_args__ = (
        UniqueConstraint("training_program_id", "employee_id", name="uq_feedback_program_emp"),
        Index("ix_feedbacks_training_program_id", "training_program_id"),
    )

    def __repr__(self):
        return f"<Feedback program={self.training_program_id} emp={self.employee_id}>"


class TrainerEvaluation(BaseModel):
    """Model representing trainer's evaluation of an employee."""
    __tablename__ = "trainer_evaluations"

    training_program_id = Column(
        String(36),
        ForeignKey("training_programs.id"),
        nullable=False,
        comment="Training program ID"
    )
    employee_id = Column(
        String(36),
        ForeignKey("employees.id"),
        nullable=False,
        comment="Employee ID"
    )
    trainer_id = Column(
        String(36),
        ForeignKey("users.id"),
        nullable=False,
        comment="Trainer user ID"
    )
    understanding_level = Column(
        String(30),
        nullable=True,
        comment="Poor, Average, Good, Excellent"
    )
    participation_level = Column(
        String(30),
        nullable=True,
        comment="Low, Moderate, High"
    )
    practical_performance = Column(
        String(30),
        nullable=True,
        comment="Needs Improvement, Satisfactory, Outstanding"
    )
    strengths = Column(
        Text,
        nullable=True,
        comment="Employee strengths"
    )
    areas_for_improvement = Column(
        Text,
        nullable=True,
        comment="Areas for improvement"
    )
    comments = Column(
        Text,
        nullable=True,
        comment="Additional trainer comments"
    )

    # Relationships
    training_program = relationship(
        "TrainingProgram",
        backref="evaluations",
        lazy="select",
    )
    employee = relationship(
        "Employee",
        backref="trainer_evaluations",
        lazy="select",
    )
    trainer = relationship(
        "User",
        backref="evaluations_given",
        lazy="select",
    )

    __table_args__ = (
        UniqueConstraint("training_program_id", "employee_id", name="uq_eval_program_emp"),
        Index("ix_trainer_evaluations_employee_id", "employee_id"),
    )

    def __repr__(self):
        return f"<TrainerEvaluation program={self.training_program_id} emp={self.employee_id}>"


class Certificate(BaseModel):
    """Model representing a generated training completion certificate."""
    __tablename__ = "certificates"

    certificate_number = Column(
        String(100),
        nullable=False,
        unique=True,
        index=True,
        comment="Unique certificate verification number"
    )
    employee_id = Column(
        String(36),
        ForeignKey("employees.id"),
        nullable=False,
        comment="Foreign key to employee"
    )
    training_program_id = Column(
        String(36),
        ForeignKey("training_programs.id"),
        nullable=False,
        comment="Foreign key to training program"
    )
    issue_date = Column(
        DateTime(timezone=True),
        default=datetime.utcnow,
        nullable=False,
        comment="Date certificate was issued"
    )
    expiry_date = Column(
        DateTime(timezone=True),
        nullable=True,
        comment="Optional expiry date for renewal"
    )
    issuer_name = Column(
        String(100),
        default="Enterprise L&D Department",
        nullable=False,
        comment="Name of issuer"
    )
    file_path = Column(
        String(500),
        nullable=True,
        comment="Path to generated PDF certificate"
    )

    # Relationships
    employee = relationship(
        "Employee",
        backref="certificates",
        lazy="select",
    )
    training_program = relationship(
        "TrainingProgram",
        backref="certificates",
        lazy="select",
    )
    enrollment = relationship(
        "Enrollment",
        back_populates="certificate",
        lazy="select",
        uselist=False,
    )

    __table_args__ = (
        Index("ix_certificates_employee_id", "employee_id"),
        Index("ix_certificates_training_program_id", "training_program_id"),
    )

    def __repr__(self):
        return f"<Certificate {self.certificate_number}>"


class Notification(BaseModel):
    """Model representing an in-app notification for a user/employee."""
    __tablename__ = "notifications"

    user_id = Column(
        String(36),
        ForeignKey("users.id"),
        nullable=False,
        comment="Foreign key to user"
    )
    title = Column(
        String(200),
        nullable=False,
        comment="Notification title"
    )
    message = Column(
        Text,
        nullable=False,
        comment="Notification message"
    )
    notification_type = Column(
        String(50),
        nullable=False,
        default="Info",
        comment="Type: Info, Warning, Assignment, Session, Certificate, Completion"
    )
    is_read = Column(
        Boolean,
        default=False,
        nullable=False,
        comment="Whether notification has been read"
    )
    link = Column(
        String(500),
        nullable=True,
        comment="Optional UI link for action"
    )

    # Relationships
    user = relationship(
        "User",
        backref="notifications",
        lazy="select",
    )

    __table_args__ = (
        Index("ix_notifications_user_id", "user_id"),
        Index("ix_notifications_is_read", "is_read"),
    )

    def __repr__(self):
        return f"<Notification user={self.user_id}: {self.title}>"


class AuditLog(BaseModel):
    """Model representing a system audit log for compliance and tracking."""
    __tablename__ = "audit_logs"

    user_id = Column(
        String(36),
        ForeignKey("users.id"),
        nullable=True,
        comment="User ID who performed the action"
    )
    action = Column(
        String(100),
        nullable=False,
        comment="Action performed (e.g., 'CREATE_TRAINING', 'UPDATE_EMPLOYEE')"
    )
    resource_type = Column(
        String(50),
        nullable=False,
        comment="Entity type affected (e.g., 'TrainingProgram', 'Employee')"
    )
    resource_id = Column(
        String(36),
        nullable=True,
        comment="ID of affected entity"
    )
    details = Column(
        JSON,
        nullable=True,
        comment="JSON details of changes or action"
    )
    ip_address = Column(
        String(50),
        nullable=True,
        comment="Client IP address"
    )

    # Relationships
    user = relationship(
        "User",
        backref="audit_logs",
        lazy="select",
    )

    __table_args__ = (
        Index("ix_audit_logs_user_id", "user_id"),
        Index("ix_audit_logs_action", "action"),
        Index("ix_audit_logs_resource_type", "resource_type"),
    )

    def __repr__(self):
        return f"<AuditLog {self.action} on {self.resource_type}>"