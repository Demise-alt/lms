"""
Enrollment model for tracking employee training participation.
"""

from sqlalchemy import Column, String, Boolean, DateTime, Integer, Float, ForeignKey, UniqueConstraint, Index
from sqlalchemy.orm import relationship
from datetime import datetime
import uuid

from .base import BaseModel


class Enrollment(BaseModel):
    """Model representing an employee's enrollment in a training program."""
    __tablename__ = "enrollments"

    employee_id = Column(
        String(36),
        ForeignKey("employees.id"),
        nullable=False,
        comment="Enrolled employee ID"
    )
    training_program_id = Column(
        String(36),
        ForeignKey("training_programs.id"),
        nullable=False,
        comment="Training program ID"
    )
    course_id = Column(
        String(36),
        ForeignKey("courses.id"),
        nullable=True,
        comment="Optional course ID"
    )
    module_id = Column(
        String(36),
        ForeignKey("modules.id"),
        nullable=True,
        comment="Optional module ID"
    )
    enrollment_date = Column(
        DateTime(timezone=True),
        default=datetime.utcnow,
        nullable=False,
        comment="Date of enrollment"
    )
    status = Column(
        String(20),
        nullable=False,
        default="Enrolled",
        comment="Enrollment status: Enrolled, In Progress, Completed, Dropped, Failed"
    )
    progress_percentage = Column(
        Float,
        default=0.0,
        nullable=False,
        comment="Progress percentage (0.0 to 100.0)"
    )
    completion_date = Column(
        DateTime(timezone=True),
        nullable=True,
        comment="Date when training was completed"
    )
    certificate_id = Column(
        String(36),
        ForeignKey("certificates.id"),
        nullable=True,
        comment="Issued certificate ID"
    )

    # Relationships
    employee = relationship(
        "Employee",
        backref="enrollments",
        lazy="select",
    )
    training_program = relationship(
        "TrainingProgram",
        back_populates="enrollments",
        lazy="select",
    )
    module = relationship(
        "app.models.training.Module",
        back_populates="enrollments",
        lazy="select",
    )
    certificate = relationship(
        "Certificate",
        back_populates="enrollment",
        lazy="select",
        uselist=False,
    )

    __table_args__ = (
        UniqueConstraint("employee_id", "training_program_id", name="uq_enrollment_emp_program"),
        Index("ix_enrollments_employee_id", "employee_id"),
        Index("ix_enrollments_training_program_id", "training_program_id"),
        Index("ix_enrollments_status", "status"),
    )

    STATUS_CHOICES = ["Enrolled", "In Progress", "Completed", "Dropped", "Failed"]

    def __repr__(self):
        return f"<Enrollment {self.employee_id} -> {self.training_program_id}>"