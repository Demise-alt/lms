"""
Training Program, Course, and Module models.
"""

from sqlalchemy import Column, String, Boolean, DateTime, Text, Integer, ForeignKey, UniqueConstraint, Index
from sqlalchemy.orm import relationship
from datetime import datetime
import uuid

from .base import BaseModel


class TrainingProgram(BaseModel):
    """Model representing a training program."""
    __tablename__ = "training_programs"

    title = Column(
        String(200),
        nullable=False,
        comment="Training program title"
    )
    description = Column(
        Text,
        nullable=True,
        comment="Training program description"
    )
    category = Column(
        String(100),
        nullable=True,
        comment="Training category (e.g., 'Technical', 'Leadership', 'Compliance')"
    )
    department_id = Column(
        String(36),
        ForeignKey("departments.id"),
        nullable=True,
        comment="Optional department association"
    )
    trainer_id = Column(
        String(36),
        ForeignKey("users.id"),
        nullable=True,
        comment="Assigned trainer (user ID)"
    )
    start_date = Column(
        DateTime(timezone=True),
        nullable=True,
        comment="Training program start date"
    )
    end_date = Column(
        DateTime(timezone=True),
        nullable=True,
        comment="Training program end date"
    )
    duration_weeks = Column(
        Integer,
        nullable=True,
        comment="Duration in weeks"
    )
    mode = Column(
        String(50),
        nullable=True,
        comment="Training mode (e.g., 'online', 'offline', 'hybrid')"
    )
    location = Column(
        String(255),
        nullable=True,
        comment="Training location"
    )
    max_participants = Column(
        Integer,
        nullable=True,
        comment="Maximum number of participants"
    )
    prerequisites = Column(
        Text,
        nullable=True,
        comment="Prerequisites for the training"
    )
    learning_objectives = Column(
        Text,
        nullable=True,
        comment="Learning objectives"
    )
    status = Column(
        String(20),
        nullable=False,
        default="Draft",
        comment="Program status: Draft, Published, Upcoming, In Progress, Completed, Archived"
    )
    is_required = Column(
        Boolean,
        default=False,
        nullable=False,
        comment="Whether this training is mandatory"
    )

    # Relationships
    courses = relationship(
        "Course",
        back_populates="training_program",
        cascade="all, delete-orphan",
        lazy="select",
    )
    enrollments = relationship(
        "Enrollment",
        back_populates="training_program",
        cascade="all, delete-orphan",
        lazy="select",
    )

    __table_args__ = (
        Index("ix_training_programs_status", "status"),
        Index("ix_training_programs_department_id", "department_id"),
    )

    STATUS_CHOICES = ["Draft", "Published", "Upcoming", "In Progress", "Completed", "Archived"]

    def __repr__(self):
        return f"<TrainingProgram {self.title}>"


class Course(BaseModel):
    """Model representing a course within a training program."""
    __tablename__ = "courses"

    title = Column(
        String(200),
        nullable=False,
        comment="Course title"
    )
    description = Column(
        Text,
        nullable=True,
        comment="Course description"
    )
    order_index = Column(
        Integer,
        nullable=False,
        default=0,
        comment="Course order within the training program"
    )
    estimated_hours = Column(
        Integer,
        nullable=True,
        comment="Estimated completion hours"
    )
    status = Column(
        String(20),
        nullable=False,
        default="Draft",
        comment="Course status: Draft, Published"
    )
    is_mandatory = Column(
        Boolean,
        default=False,
        nullable=False,
        comment="Whether this course is mandatory"
    )
    training_program_id = Column(
        String(36),
        ForeignKey("training_programs.id"),
        nullable=False,
        comment="Foreign key to training program"
    )

    # Relationships
    training_program = relationship(
        "TrainingProgram",
        back_populates="courses",
        lazy="select",
    )
    modules = relationship(
        "Module",
        back_populates="course",
        cascade="all, delete-orphan",
        lazy="select",
    )

    __table_args__ = (
        UniqueConstraint("title", "training_program_id", name="uq_course_title_program"),
        Index("ix_courses_training_program_id", "training_program_id"),
    )

    def __repr__(self):
        return f"<Course {self.title}>"


class Module(BaseModel):
    """Model representing a module within a course."""
    __tablename__ = "modules"

    title = Column(
        String(200),
        nullable=False,
        comment="Module title"
    )
    description = Column(
        Text,
        nullable=True,
        comment="Module description"
    )
    order_index = Column(
        Integer,
        nullable=False,
        default=0,
        comment="Module order within the course"
    )
    estimated_hours = Column(
        Integer,
        nullable=True,
        comment="Estimated completion hours"
    )
    status = Column(
        String(20),
        nullable=False,
        default="Not Started",
        comment="Module status: Not Started, In Progress, Completed"
    )
    course_id = Column(
        String(36),
        ForeignKey("courses.id"),
        nullable=False,
        comment="Foreign key to course"
    )

    # Relationships
    course = relationship(
        "Course",
        back_populates="modules",
        lazy="select",
    )
    enrollments = relationship(
        "Enrollment",
        back_populates="module",
        cascade="all, delete-orphan",
        lazy="select",
    )
    learning_materials = relationship(
        "app.models.material.LearningMaterial",
        back_populates="module",
        cascade="all, delete-orphan",
        lazy="select",
    )
    assessment = relationship(
        "app.models.assessment.Assessment",
        back_populates="module",
        cascade="all, delete-orphan",
        lazy="select",
        uselist=False,
    )

    __table_args__ = (
        Index("ix_modules_course_id", "course_id"),
        Index("ix_modules_order_index", "order_index"),
    )

    STATUS_CHOICES = ["Not Started", "In Progress", "Completed"]

    def __repr__(self):
        return f"<Module {self.title}>"