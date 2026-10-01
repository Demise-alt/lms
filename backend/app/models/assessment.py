"""
Assessment, Question, AssessmentAttempt, and Answer models.
"""

from sqlalchemy import Column, String, Boolean, DateTime, Integer, Float, Text, ForeignKey, Index, JSON, UniqueConstraint
from sqlalchemy.orm import relationship
from datetime import datetime
import uuid

from .base import BaseModel


class Assessment(BaseModel):
    """Model representing an assessment (quiz, test, pre-test, post-test)."""
    __tablename__ = "assessments"

    title = Column(
        String(200),
        nullable=False,
        comment="Assessment title"
    )
    description = Column(
        Text,
        nullable=True,
        comment="Assessment description"
    )
    assessment_type = Column(
        String(50),
        nullable=False,
        default="Quiz",
        comment="Type: Pre-test, Post-test, Quiz, Final Exam"
    )
    training_program_id = Column(
        String(36),
        ForeignKey("training_programs.id"),
        nullable=True,
        comment="Optional training program ID"
    )
    module_id = Column(
        String(36),
        ForeignKey("modules.id"),
        nullable=True,
        comment="Optional module ID"
    )
    duration_minutes = Column(
        Integer,
        nullable=True,
        comment="Duration in minutes (null for untimed)"
    )
    passing_score = Column(
        Float,
        default=60.0,
        nullable=False,
        comment="Passing percentage score (0-100)"
    )
    attempt_limit = Column(
        Integer,
        default=3,
        nullable=False,
        comment="Maximum allowed attempts"
    )
    start_date = Column(
        DateTime(timezone=True),
        nullable=True,
        comment="Assessment available from"
    )
    end_date = Column(
        DateTime(timezone=True),
        nullable=True,
        comment="Assessment available until"
    )
    is_active = Column(
        Boolean,
        default=True,
        nullable=False,
        comment="Whether the assessment is active"
    )

    # Relationships
    training_program = relationship(
        "TrainingProgram",
        backref="assessments",
        lazy="select",
    )
    module = relationship(
        "app.models.training.Module",
        back_populates="assessment",
        lazy="select",
    )
    questions = relationship(
        "Question",
        back_populates="assessment",
        cascade="all, delete-orphan",
        lazy="select",
    )
    attempts = relationship(
        "AssessmentAttempt",
        back_populates="assessment",
        cascade="all, delete-orphan",
        lazy="select",
    )

    __table_args__ = (
        Index("ix_assessments_module_id", "module_id"),
        Index("ix_assessments_training_program_id", "training_program_id"),
        Index("ix_assessments_type", "assessment_type"),
    )

    TYPE_CHOICES = ["Pre-test", "Post-test", "Quiz", "Final Exam"]

    def __repr__(self):
        return f"<Assessment {self.title} ({self.assessment_type})>"


class Question(BaseModel):
    """Model representing an assessment question."""
    __tablename__ = "questions"

    assessment_id = Column(
        String(36),
        ForeignKey("assessments.id"),
        nullable=False,
        comment="Foreign key to assessment"
    )
    question_text = Column(
        Text,
        nullable=False,
        comment="The question text"
    )
    question_type = Column(
        String(50),
        nullable=False,
        default="Multiple Choice",
        comment="Type: Multiple Choice, True/False, Multiple Answer, Short Answer"
    )
    options = Column(
        JSON,
        nullable=True,
        comment="JSON list of options for multiple choice questions"
    )
    correct_answer = Column(
        Text,
        nullable=False,
        comment="Correct answer(s)"
    )
    explanation = Column(
        Text,
        nullable=True,
        comment="Explanation for the correct answer"
    )
    points = Column(
        Float,
        default=1.0,
        nullable=False,
        comment="Points awarded for correct answer"
    )
    order_index = Column(
        Integer,
        default=0,
        nullable=False,
        comment="Order within assessment"
    )

    # Relationships
    assessment = relationship(
        "Assessment",
        back_populates="questions",
        lazy="select",
    )

    __table_args__ = (
        Index("ix_questions_assessment_id", "assessment_id"),
    )

    TYPE_CHOICES = ["Multiple Choice", "True/False", "Multiple Answer", "Short Answer"]

    def __repr__(self):
        return f"<Question {self.id} ({self.question_type})>"


class AssessmentAttempt(BaseModel):
    """Model representing an employee's attempt at an assessment."""
    __tablename__ = "assessment_attempts"

    assessment_id = Column(
        String(36),
        ForeignKey("assessments.id"),
        nullable=False,
        comment="Foreign key to assessment"
    )
    employee_id = Column(
        String(36),
        ForeignKey("employees.id"),
        nullable=False,
        comment="Foreign key to employee"
    )
    attempt_number = Column(
        Integer,
        default=1,
        nullable=False,
        comment="Attempt sequence number"
    )
    score = Column(
        Float,
        default=0.0,
        nullable=False,
        comment="Achieved score"
    )
    max_score = Column(
        Float,
        default=0.0,
        nullable=False,
        comment="Maximum possible score"
    )
    percentage = Column(
        Float,
        default=0.0,
        nullable=False,
        comment="Percentage score (0-100)"
    )
    passed = Column(
        Boolean,
        default=False,
        nullable=False,
        comment="Whether the attempt passed"
    )
    start_time = Column(
        DateTime(timezone=True),
        default=datetime.utcnow,
        nullable=False,
        comment="Attempt start time"
    )
    submit_time = Column(
        DateTime(timezone=True),
        nullable=True,
        comment="Attempt submission time"
    )
    status = Column(
        String(20),
        nullable=False,
        default="In Progress",
        comment="Status: In Progress, Submitted, Graded"
    )

    # Relationships
    assessment = relationship(
        "Assessment",
        back_populates="attempts",
        lazy="select",
    )
    employee = relationship(
        "Employee",
        backref="assessment_attempts",
        lazy="select",
    )
    answers = relationship(
        "Answer",
        back_populates="attempt",
        cascade="all, delete-orphan",
        lazy="select",
    )

    __table_args__ = (
        Index("ix_assessment_attempts_assessment_id", "assessment_id"),
        Index("ix_assessment_attempts_employee_id", "employee_id"),
        Index("ix_assessment_attempts_passed", "passed"),
    )

    def __repr__(self):
        return f"<AssessmentAttempt emp={self.employee_id} assess={self.assessment_id} score={self.percentage}%>"


class Answer(BaseModel):
    """Model representing an employee's answer to a specific question in an attempt."""
    __tablename__ = "answers"

    attempt_id = Column(
        String(36),
        ForeignKey("assessment_attempts.id"),
        nullable=False,
        comment="Foreign key to assessment attempt"
    )
    question_id = Column(
        String(36),
        ForeignKey("questions.id"),
        nullable=False,
        comment="Foreign key to question"
    )
    selected_answer = Column(
        Text,
        nullable=True,
        comment="Employee's selected/provided answer"
    )
    is_correct = Column(
        Boolean,
        default=False,
        nullable=False,
        comment="Whether the answer is correct"
    )
    points_awarded = Column(
        Float,
        default=0.0,
        nullable=False,
        comment="Points awarded for this answer"
    )

    # Relationships
    attempt = relationship(
        "AssessmentAttempt",
        back_populates="answers",
        lazy="select",
    )
    question = relationship(
        "Question",
        lazy="select",
    )

    __table_args__ = (
        UniqueConstraint("attempt_id", "question_id", name="uq_answer_attempt_question"),
        Index("ix_answers_attempt_id", "attempt_id"),
    )

    def __repr__(self):
        return f"<Answer attempt={self.attempt_id} q={self.question_id} correct={self.is_correct}>"