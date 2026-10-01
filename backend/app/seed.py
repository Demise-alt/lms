"""
Seed script for development data.
Creates initial roles, permissions, users, departments, and demo data.
"""

from sqlalchemy.orm import Session
from passlib.context import CryptContext
from datetime import datetime, timedelta
import uuid
import sys
import os

# Add parent directory to path for imports
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.core.database import get_engine, SessionLocal, Base
from app.models.user import User, Role, Permission, role_permission, user_role
from app.models.employee import Employee, Department
from app.models.training import TrainingProgram, Course, Module
from app.models.enrollment import Enrollment
from app.models.session import TrainingSession, Attendance
from app.models.assessment import Assessment, Question, AssessmentAttempt, Answer
from app.models.assignment import Assignment, AssignmentSubmission, Feedback, TrainerEvaluation, Certificate, Notification, AuditLog

pwd_context = CryptContext(
    schemes=["argon2"],
    default="argon2",
    deprecated="auto",
)


def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)


def seed_database():
    db = SessionLocal()

    try:
        # Check if already seeded
        existing_user = db.query(User).filter(User.email == "admin@eltms.com").first()
        if existing_user:
            print("Database already seeded!")
            return

        # Create permissions
        permissions = [
            # User permissions
            Permission(name="users.create", resource="users", action="create", description="Create users"),
            Permission(name="users.read", resource="users", action="read", description="Read users"),
            Permission(name="users.update", resource="users", action="update", description="Update users"),
            Permission(name="users.delete", resource="users", action="delete", description="Delete users"),

            # Employee permissions
            Permission(name="employees.create", resource="employees", action="create", description="Create employees"),
            Permission(name="employees.read", resource="employees", action="read", description="Read employees"),
            Permission(name="employees.update", resource="employees", action="update", description="Update employees"),
            Permission(name="employees.delete", resource="employees", action="delete", description="Delete employees"),

            # Department permissions
            Permission(name="departments.create", resource="departments", action="create", description="Create departments"),
            Permission(name="departments.read", resource="departments", action="read", description="Read departments"),
            Permission(name="departments.update", resource="departments", action="update", description="Update departments"),
            Permission(name="departments.delete", resource="departments", action="delete", description="Delete departments"),

            # Training permissions
            Permission(name="trainings.create", resource="trainings", action="create", description="Create training programs"),
            Permission(name="trainings.read", resource="trainings", action="read", description="Read training programs"),
            Permission(name="trainings.update", resource="trainings", action="update", description="Update training programs"),
            Permission(name="trainings.delete", resource="trainings", action="delete", description="Delete training programs"),
            Permission(name="trainings.assign", resource="trainings", action="assign", description="Assign employees to training"),

            # Session permissions
            Permission(name="sessions.create", resource="sessions", action="create", description="Create training sessions"),
            Permission(name="sessions.read", resource="sessions", action="read", description="Read training sessions"),
            Permission(name="sessions.update", resource="sessions", action="update", description="Update training sessions"),
            Permission(name="sessions.attendance", resource="sessions", action="attendance", description="Mark attendance"),

            # Assessment permissions
            Permission(name="assessments.create", resource="assessments", action="create", description="Create assessments"),
            Permission(name="assessments.read", resource="assessments", action="read", description="Read assessments"),
            Permission(name="assessments.take", resource="assessments", action="take", description="Take assessments"),
            Permission(name="assessments.grade", resource="assessments", action="grade", description="Grade assessments"),

            # Certificate permissions
            Permission(name="certificates.read", resource="certificates", action="read", description="View certificates"),
            Permission(name="certificates.generate", resource="certificates", action="generate", description="Generate certificates"),

            # Analytics permissions
            Permission(name="analytics.read", resource="analytics", action="read", description="View analytics"),
            Permission(name="reports.read", resource="reports", action="read", description="View reports"),

            # Admin permissions
            Permission(name="admin.settings", resource="admin", action="settings", description="Manage system settings"),
            Permission(name="admin.audit_logs", resource="admin", action="audit_logs", description="View audit logs"),
        ]

        for perm in permissions:
            db.add(perm)
        db.commit()
        print(f"Created {len(permissions)} permissions")

        # Create roles
        super_admin_role = Role(name="super_admin", description="Super Administrator - full system access", is_active=True)
        hr_admin_role = Role(name="hr_admin", description="HR/L&D Administrator - manages training programs", is_active=True)
        trainer_role = Role(name="trainer", description="Trainer - conducts training sessions", is_active=True)
        manager_role = Role(name="manager", description="Manager - manages team training", is_active=True)
        employee_role = Role(name="employee", description="Employee - participates in training", is_active=True)

        db.add_all([super_admin_role, hr_admin_role, trainer_role, manager_role, employee_role])
        db.commit()
        print("Created 5 roles")

        # Assign all permissions to super_admin
        all_perms = db.query(Permission).all()
        super_admin_role.permissions = all_perms

        # Assign permissions to hr_admin
        hr_perms = [p for p in all_perms if p.resource in ["trainings", "employees", "departments", "sessions", "assessments", "certificates", "analytics", "reports"] and p.action in ["create", "read", "update", "assign", "attendance", "grade", "generate"]]
        hr_admin_role.permissions = hr_perms

        # Assign permissions to trainer
        trainer_perms = [p for p in all_perms if p.resource in ["sessions", "assessments", "trainings"] and p.action in ["read", "attendance", "grade", "create", "update"]]
        trainer_role.permissions = trainer_perms

        # Assign permissions to manager
        manager_perms = [p for p in all_perms if p.resource in ["employees", "trainings", "sessions", "analytics", "reports"] and p.action in ["read"]]
        manager_role.permissions = manager_perms

        # Assign permissions to employee
        employee_perms = [p for p in all_perms if p.resource in ["trainings", "sessions", "assessments", "certificates"] and p.action in ["read", "take"]]
        employee_role.permissions = employee_perms

        db.commit()
        print("Assigned permissions to roles")

        # Create users
        admin_user = User(
            email="admin@eltms.com",
            full_name="System Administrator",
            hashed_password=get_password_hash("Admin123!"),
            is_active=True,
            is_superuser=True,
            roles=[super_admin_role]
        )

        hr_user = User(
            email="hr@eltms.com",
            full_name="HR Administrator",
            hashed_password=get_password_hash("Hr123!"),
            is_active=True,
            is_superuser=False,
            roles=[hr_admin_role]
        )

        trainer_user = User(
            email="trainer@eltms.com",
            full_name="John Trainer",
            hashed_password=get_password_hash("Trainer123!"),
            is_active=True,
            is_superuser=False,
            roles=[trainer_role]
        )

        manager_user = User(
            email="manager@eltms.com",
            full_name="Jane Manager",
            hashed_password=get_password_hash("Manager123!"),
            is_active=True,
            is_superuser=False,
            roles=[manager_role]
        )

        employee_user = User(
            email="employee@eltms.com",
            full_name="Alex Employee",
            hashed_password=get_password_hash("Employee123!"),
            is_active=True,
            is_superuser=False,
            roles=[employee_role]
        )

        db.add_all([admin_user, hr_user, trainer_user, manager_user, employee_user])
        db.commit()
        print("Created 5 users")

        # Create departments
        departments = [
            Department(name="Sales", code="SALES", description="Sales Department"),
            Department(name="Information Technology", code="IT", description="IT Department"),
            Department(name="Human Resources", code="HR", description="HR Department"),
            Department(name="Finance", code="FINANCE", description="Finance Department"),
            Department(name="Operations", code="OPS", description="Operations Department"),
        ]

        for dept in departments:
            db.add(dept)
        db.commit()
        print("Created 5 departments")

        # Create employees
        employees = []
        dept_sales = db.query(Department).filter(Department.code == "SALES").first()
        dept_it = db.query(Department).filter(Department.code == "IT").first()
        dept_hr = db.query(Department).filter(Department.code == "HR").first()
        dept_finance = db.query(Department).filter(Department.code == "FINANCE").first()
        dept_ops = db.query(Department).filter(Department.code == "OPS").first()

        emp_data = [
            ("EMP-001", "Sarah", "Johnson", "sarah.j@company.com", dept_sales.id, "Sales Representative", datetime(2022, 1, 15)),
            ("EMP-002", "Michael", "Chen", "michael.c@company.com", dept_it.id, "Software Engineer", datetime(2021, 6, 10)),
            ("EMP-003", "Emily", "Davis", "emily.d@company.com", dept_hr.id, "HR Specialist", datetime(2023, 3, 20)),
            ("EMP-004", "James", "Wilson", "james.w@company.com", dept_finance.id, "Financial Analyst", datetime(2022, 9, 5)),
            ("EMP-005", "Lisa", "Anderson", "lisa.a@company.com", dept_ops.id, "Operations Coordinator", datetime(2021, 11, 12)),
            ("EMP-006", "David", "Brown", "david.b@company.com", dept_sales.id, "Senior Sales Rep", datetime(2020, 4, 18)),
            ("EMP-007", "Jennifer", "Taylor", "jennifer.t@company.com", dept_it.id, "DevOps Engineer", datetime(2022, 2, 28)),
            ("EMP-008", "Robert", "Martinez", "robert.m@company.com", dept_hr.id, "HR Manager", datetime(2019, 8, 3)),
            ("EMP-009", "Amanda", "Garcia", "amanda.g@company.com", dept_finance.id, "Accountant", datetime(2023, 1, 30)),
            ("EMP-010", "Christopher", "Rodriguez", "chris.r@company.com", dept_ops.id, "Operations Analyst", datetime(2022, 7, 14)),
            ("EMP-011", "Michelle", "Lee", "michelle.l@company.com", dept_sales.id, "Sales Manager", datetime(2018, 12, 1)),
            ("EMP-012", "Daniel", "Walker", "daniel.w@company.com", dept_it.id, "Senior Developer", datetime(2020, 5, 22)),
            ("EMP-013", "Ashley", "Hall", "ashley.h@company.com", dept_hr.id, "Recruiter", datetime(2023, 4, 10)),
            ("EMP-014", "Matthew", "Allen", "matthew.a@company.com", dept_finance.id, "Finance Manager", datetime(2017, 9, 15)),
            ("EMP-015", "Stephanie", "Young", "stephanie.y@company.com", dept_ops.id, "Project Coordinator", datetime(2021, 10, 8)),
        ]

        for emp_id, first, last, email, dept_id, designation, hire_date in emp_data:
            emp = Employee(
                employee_id=emp_id,
                first_name=first,
                last_name=last,
                email=email,
                department_id=dept_id,
                designation=designation,
                hire_date=hire_date,
                is_active=True
            )
            db.add(emp)
            employees.append(emp)

        db.commit()
        print(f"Created {len(employees)} employees")

        # Create training programs
        salesforce_training = TrainingProgram(
            title="Salesforce Beginner Training",
            description="Comprehensive introduction to Salesforce CRM for sales team members",
            category="Technical",
            department_id=dept_sales.id,
            trainer_id=trainer_user.id,
            start_date=datetime.now() + timedelta(days=7),
            end_date=datetime.now() + timedelta(days=35),
            duration_weeks=4,
            mode="hybrid",
            location="Training Room A / Zoom",
            max_participants=20,
            prerequisites="Basic computer literacy",
            learning_objectives="Understand Salesforce basics, navigate the interface, manage leads and opportunities, create reports",
            status="Published",
            is_required=True
        )

        python_training = TrainingProgram(
            title="Python for Data Analysis",
            description="Learn Python programming for data analysis and visualization",
            category="Technical",
            department_id=dept_it.id,
            trainer_id=trainer_user.id,
            start_date=datetime.now() + timedelta(days=14),
            end_date=datetime.now() + timedelta(days=56),
            duration_weeks=6,
            mode="online",
            location="Virtual (Zoom)",
            max_participants=15,
            prerequisites="Basic programming concepts",
            learning_objectives="Python fundamentals, pandas, numpy, matplotlib, data cleaning, visualization",
            status="Upcoming",
            is_required=False
        )

        leadership_training = TrainingProgram(
            title="Leadership Essentials",
            description="Core leadership skills for new and aspiring managers",
            category="Leadership",
            department_id=None,
            trainer_id=trainer_user.id,
            start_date=datetime.now() + timedelta(days=30),
            end_date=datetime.now() + timedelta(days=58),
            duration_weeks=4,
            mode="offline",
            location="Conference Room B",
            max_participants=12,
            prerequisites="At least 1 year of work experience",
            learning_objectives="Communication, delegation, coaching, conflict resolution, team building",
            status="Draft",
            is_required=False
        )

        db.add_all([salesforce_training, python_training, leadership_training])
        db.commit()
        print("Created 3 training programs")

        # Create courses for Salesforce training
        sf_courses = [
            Course(title="Salesforce Introduction", description="Overview of Salesforce platform", order_index=1, estimated_hours=4, is_mandatory=True, training_program_id=salesforce_training.id, status="Published"),
            Course(title="Objects & Fields", description="Understanding standard and custom objects", order_index=2, estimated_hours=6, is_mandatory=True, training_program_id=salesforce_training.id, status="Published"),
            Course(title="Data Management", description="Import, export, and data quality", order_index=3, estimated_hours=4, is_mandatory=True, training_program_id=salesforce_training.id, status="Published"),
            Course(title="Reports & Dashboards", description="Creating and customizing reports", order_index=4, estimated_hours=5, is_mandatory=True, training_program_id=salesforce_training.id, status="Published"),
            Course(title="Automation", description="Workflow rules, process builder, flow", order_index=5, estimated_hours=6, is_mandatory=True, training_program_id=salesforce_training.id, status="Published"),
            Course(title="Practical Project", description="End-to-end Salesforce implementation", order_index=6, estimated_hours=8, is_mandatory=True, training_program_id=salesforce_training.id, status="Published"),
        ]

        for course in sf_courses:
            db.add(course)
        db.commit()
        print("Created 6 courses for Salesforce training")

        # Create modules for first course
        sf_course_1 = db.query(Course).filter(Course.title == "Salesforce Introduction", Course.training_program_id == salesforce_training.id).first()

        sf_modules = [
            Module(title="What is Salesforce?", description="Introduction to CRM and Salesforce", order_index=1, estimated_hours=1, course_id=sf_course_1.id, status="Not Started"),
            Module(title="Navigating the Interface", description="Lightning experience navigation", order_index=2, estimated_hours=1.5, course_id=sf_course_1.id, status="Not Started"),
            Module(title="User Setup", description="Creating users, profiles, and permissions", order_index=3, estimated_hours=1.5, course_id=sf_course_1.id, status="Not Started"),
        ]

        for module in sf_modules:
            db.add(module)
        db.commit()
        print("Created 3 modules for Salesforce Introduction course")

        # Enroll employees in Salesforce training
        sales_employees = db.query(Employee).filter(Employee.department_id == dept_sales.id).all()
        for emp in sales_employees:
            enrollment = Enrollment(
                employee_id=emp.id,
                training_program_id=salesforce_training.id,
                status="Enrolled",
                progress_percentage=0.0
            )
            db.add(enrollment)
        db.commit()
        print(f"Enrolled {len(sales_employees)} sales employees in Salesforce training")

        # Create sessions for Salesforce training
        start_date = salesforce_training.start_date
        sessions_data = [
            ("Session 1: Salesforce Overview", 0, 2),
            ("Session 2: Navigation Deep Dive", 2, 2),
            ("Session 3: User Management", 4, 2),
            ("Session 4: Objects & Fields Part 1", 7, 3),
            ("Session 5: Objects & Fields Part 2", 9, 3),
            ("Session 6: Data Management", 14, 3),
            ("Session 6: Reports & Dashboards", 18, 3),
            ("Session 7: Automation Basics", 21, 3),
            ("Session 8: Advanced Automation", 23, 3),
            ("Session 9: Project Kickoff", 28, 2),
            ("Session 10: Project Review", 35, 2),
        ]

        module1 = db.query(Module).filter(Module.title == "What is Salesforce?").first()
        module2 = db.query(Module).filter(Module.title == "Navigating the Interface").first()
        module3 = db.query(Module).filter(Module.title == "User Setup").first()

        for i, (title, day_offset, duration) in enumerate(sessions_data):
            session_start = start_date + timedelta(days=day_offset, hours=9)
            session_end = session_start + timedelta(hours=duration)

            module_id = None
            if i < 3:
                module_id = module1.id if i == 0 else (module2.id if i == 1 else module3.id)

            session = TrainingSession(
                title=title,
                training_program_id=salesforce_training.id,
                module_id=module_id,
                trainer_id=trainer_user.id,
                start_time=session_start,
                end_time=session_end,
                location="Training Room A" if i % 2 == 0 else "Zoom",
                meeting_url="https://zoom.us/j/123456789" if i % 2 == 1 else None,
                capacity=20,
                status="Scheduled" if session_start > datetime.now() else "Completed"
            )
            db.add(session)

        db.commit()
        print(f"Created {len(sessions_data)} sessions for Salesforce training")

        # Create pre-test assessment for Salesforce training
        pre_test = Assessment(
            title="Salesforce Pre-Training Assessment",
            description="Assess baseline Salesforce knowledge before training",
            assessment_type="Pre-test",
            training_program_id=salesforce_training.id,
            duration_minutes=30,
            passing_score=50.0,
            attempt_limit=1,
            start_date=datetime.now(),
            end_date=salesforce_training.start_date,
            is_active=True
        )
        db.add(pre_test)
        db.commit()

        pre_test_questions = [
            Question(assessment_id=pre_test.id, question_text="What is CRM?", question_type="Multiple Choice", options=["Customer Relationship Management", "Company Resource Management", "Contact Record Manager", "Customer Retention Model"], correct_answer="Customer Relationship Management", points=1, order_index=1),
            Question(assessment_id=pre_test.id, question_text="Salesforce is a cloud-based platform.", question_type="True/False", correct_answer="True", points=1, order_index=2),
            Question(assessment_id=pre_test.id, question_text="Which of the following are standard Salesforce objects?", question_type="Multiple Answer", options=["Account", "Contact", "Lead", "Project", "Opportunity"], correct_answer="Account, Contact, Lead, Opportunity", points=2, order_index=3),
            Question(assessment_id=pre_test.id, question_text="What is the primary purpose of a Salesforce Report?", question_type="Short Answer", correct_answer="To analyze and display data from Salesforce objects", points=2, order_index=4),
        ]
        for q in pre_test_questions:
            db.add(q)
        db.commit()
        print("Created pre-test assessment with 4 questions")

        # Create post-test assessment
        post_test = Assessment(
            title="Salesforce Post-Training Assessment",
            description="Assess Salesforce knowledge after completing training",
            assessment_type="Post-test",
            training_program_id=salesforce_training.id,
            duration_minutes=45,
            passing_score=70.0,
            attempt_limit=3,
            start_date=salesforce_training.end_date,
            end_date=salesforce_training.end_date + timedelta(days=14),
            is_active=True
        )
        db.add(post_test)
        db.commit()

        post_test_questions = [
            Question(assessment_id=post_test.id, question_text="Which feature allows you to automate business processes without code?", question_type="Multiple Choice", options=["Apex Triggers", "Process Builder", "Visualforce Pages", "SOQL Queries"], correct_answer="Process Builder", points=1, order_index=1),
            Question(assessment_id=post_test.id, question_text="A Dashboard can display multiple Report components.", question_type="True/False", correct_answer="True", points=1, order_index=2),
            Question(assessment_id=post_test.id, question_text="What is the difference between a Role and a Profile in Salesforce?", question_type="Short Answer", correct_answer="Profile controls what users can do (permissions), Role controls what data users can see (record-level access)", points=3, order_index=3),
            Question(assessment_id=post_test.id, question_text="Which automation tools can send email alerts?", question_type="Multiple Answer", options=["Workflow Rules", "Process Builder", "Flow", "Approval Processes", "Validation Rules"], correct_answer="Workflow Rules, Process Builder, Flow, Approval Processes", points=2, order_index=4),
        ]
        for q in post_test_questions:
            db.add(q)
        db.commit()
        print("Created post-test assessment with 4 questions")

        # Create assignment for Salesforce training
        sf_assignment = Assignment(
            title="Salesforce Implementation Project",
            description="Design and implement a Salesforce solution for a fictional company including custom objects, fields, automation, and reports",
            training_program_id=salesforce_training.id,
            due_date=salesforce_training.end_date + timedelta(days=7),
            max_score=100.0
        )
        db.add(sf_assignment)
        db.commit()
        print("Created practical assignment for Salesforce training")

        print("\n=== SEED DATA SUMMARY ===")
        print("Users:")
        print("  admin@eltms.com / Admin123! (Super Admin)")
        print("  hr@eltms.com / Hr123! (HR Admin)")
        print("  trainer@eltms.com / Trainer123! (Trainer)")
        print("  manager@eltms.com / Manager123! (Manager)")
        print("  employee@eltms.com / Employee123! (Employee)")
        print("\nDatabase seeded successfully!")

    except Exception as e:
        db.rollback()
        print(f"Error seeding database: {e}")
        raise
    finally:
        db.close()


if __name__ == "__main__":
    seed_database()