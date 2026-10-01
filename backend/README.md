# Enterprise Learning & Training Management System (ELTMS) - Backend

## Overview

The ELTMS Backend is a production-quality REST API built with **FastAPI** that manages the complete employee training lifecycle. It provides authentication, authorization (RBAC), training program management, course/modules, sessions, attendance, assessments, assignments, certifications, and analytics.

## Technology Stack

- **Python 3.12+**
- **FastAPI 0.109+** - Modern, fast web framework
- **SQLAlchemy 2.0+** - ORM for database operations
- **Alembic 1.13+** - Database migrations
- **PostgreSQL** (production) / **SQLite** (development)
- **Pydantic 2.5+** - Data validation and serialization
- **Passlib + Argon2** - Secure password hashing
- **PyJWT** - JWT token authentication
- **Uvicorn** - ASGI server

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        API Layer                            │
│  FastAPI Routes (/api/v1/*)                                 │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                      Service Layer                          │
│  Business Logic (services/)                                 │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    Repository Layer                         │
│  Data Access (repositories/)                                │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                     Database Layer                          │
│  SQLAlchemy ORM + PostgreSQL/SQLite                         │
└─────────────────────────────────────────────────────────────┘
```

## Project Structure

```
backend/
├── app/
│   ├── main.py                 # FastAPI application entry point
│   ├── core/
│   │   ├── config.py          # Settings and environment config
│   │   ├── database.py        # Database connection and session management
│   │   ├── security.py        # JWT, password hashing
│   │   └── logging.py         # Structured logging
│   ├── models/                # SQLAlchemy ORM models
│   │   ├── base.py            # Base model with common fields
│   │   ├── user.py            # User, Role, Permission
│   │   ├── employee.py        # Employee, Department
│   │   ├── training.py        # TrainingProgram, Course, Module
│   │   ├── enrollment.py      # Enrollment
│   │   ├── session.py         # TrainingSession, Attendance
│   │   ├── material.py        # LearningMaterial
│   │   ├── assessment.py      # Assessment, Question, Attempt, Answer
│   │   └── assignment.py      # Assignment, Feedback, Certificate, etc.
│   ├── schemas/               # Pydantic request/response schemas
│   ├── api/
│   │   ├── deps.py            # Dependencies (auth, DB, RBAC)
│   │   └── v1/                # API v1 routes
│   ├── services/              # Business logic
│   ├── repositories/          # Data access layer
│   └── utils/                 # Utility functions
├── alembic/                   # Database migrations
├── tests/                     # Test suite
├── requirements.txt           # Python dependencies
├── alembic.ini               # Alembic configuration
├── .env.example              # Environment variables template
└── README.md
```

## API Endpoints

### Authentication
- `POST /api/v1/auth/login` - User login
- `POST /api/v1/auth/register` - User registration
- `GET /api/v1/auth/me` - Get current user info
- `POST /api/v1/auth/change-password` - Change password

### Users & Employees
- `GET/POST /api/v1/employees` - List/Create employees
- `GET/PUT/DELETE /api/v1/employees/{id}` - Employee CRUD
- `GET/POST /api/v1/departments` - List/Create departments
- `GET/PUT/DELETE /api/v1/departments/{id}` - Department CRUD

### Training Programs
- `GET/POST /api/v1/trainings` - List/Create training programs
- `GET/PUT/DELETE /api/v1/trainings/{id}` - Training CRUD
- `GET/POST /api/v1/trainings/{id}/courses` - Courses for training
- `POST /api/v1/trainings/{id}/courses/{course_id}/modules` - Modules for course

### Enrollments
- `GET/POST /api/v1/enrollments` - List/Create enrollments
- `POST /api/v1/enrollments/bulk` - Bulk enroll employees
- `PUT /api/v1/enrollments/{id}` - Update enrollment

### Sessions & Attendance
- `GET/POST /api/v1/sessions` - List/Create sessions
- `GET /api/v1/sessions/calendar` - Calendar view
- `POST /api/v1/attendance` - Mark attendance
- `POST /api/v1/attendance/bulk` - Bulk attendance
- `GET /api/v1/attendance/employee/{id}/rate` - Attendance rate

### Assessments
- `GET/POST /api/v1/assessments` - List/Create assessments
- `POST /api/v1/assessments/{id}/start` - Start attempt
- `POST /api/v1/assessments/attempts/{id}/submit` - Submit answers

## Quick Start

### Prerequisites
- Python 3.12+
- PostgreSQL 15+ (for production)

### Installation

```bash
# Create virtual environment
python -m venv .venv

# Activate virtual environment
# Windows:
.venv\Scripts\activate
# Linux/Mac:
source .venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Copy environment file
cp .env.example .env

# Edit .env with your settings
# For development, SQLite is used by default

# Run database migrations
alembic upgrade head

# Seed development data
python app/seed.py

# Start development server
uvicorn app.main:app --reload
```

### Development Credentials

After running the seed script, the following users are available:

| Role | Email | Password |
|------|-------|----------|
| Super Admin | admin@eltms.com | Admin123! |
| HR Admin | hr@eltms.com | Hr123! |
| Trainer | trainer@eltms.com | Trainer123! |
| Manager | manager@eltms.com | Manager123! |
| Employee | employee@eltms.com | Employee123! |

### API Documentation

- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc
- **OpenAPI JSON**: http://localhost:8000/openapi.json

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `DATABASE_URL` | Database connection string | `sqlite:///./eltms.db` |
| `JWT_SECRET` | Secret key for JWT tokens | Required |
| `JWT_ALGORITHM` | JWT algorithm | `HS256` |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | Access token expiry | `15` |
| `REFRESH_TOKEN_EXPIRE_DAYS` | Refresh token expiry | `7` |
| `BCRYPT_ROUNDS` | Argon2 rounds | `12` |
| `CORS_ORIGINS` | Allowed CORS origins | `http://localhost:3000,http://localhost` |
| `ENVIRONMENT` | Environment (development/production/test) | `development` |

## Database Migrations

```bash
# Create a new migration
alembic revision --autogenerate -m "Description of changes"

# Apply migrations
alembic upgrade head

# Rollback one migration
alembic downgrade -1

# View migration history
alembic history
```

## Testing

```bash
# Run all tests
pytest

# Run with coverage
pytest --cov=app tests/

# Run specific test file
pytest tests/test_auth.py
```

## User Roles & Permissions

### Super Admin
- Full system access
- Manage organization, departments, users, roles
- View all training, analytics, audit logs

### HR / L&D Admin
- Create training programs, courses, modules
- Assign trainers and employees
- Schedule sessions, monitor attendance
- Manage assessments, generate reports

### Trainer
- View assigned courses
- Upload learning materials
- Create sessions, mark attendance
- Create assessments, evaluate assignments

### Manager
- View team members and their training
- View attendance, completion, assessment results
- Identify employees needing support

### Employee
- View assigned training
- Access learning materials
- Complete modules, take assessments
- Submit assignments, view certificates

## Seed Data

The seed script creates:
- 5 roles with permissions
- 5 users (one per role)
- 5 departments
- 15 employees across departments
- 3 training programs with courses/modules
- Sessions with schedules
- Pre-test and post-test assessments
- Practical assignments

## Security Features

- JWT-based authentication with short-lived access tokens
- Argon2 password hashing (industry standard)
- Role-Based Access Control (RBAC)
- Permission-based authorization
- Input validation with Pydantic
- SQL injection protection via ORM
- CORS configuration
- Audit logging for compliance

## Production Deployment

### Docker

```dockerfile
FROM python:3.12-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### Environment Variables for Production

```env
DATABASE_URL=postgresql://user:pass@host:5432/eltms
JWT_SECRET=your-strong-random-secret-key
ENVIRONMENT=production
DEBUG=False
CORS_ORIGINS=https://your-frontend-domain.com
```

## License

Enterprise Learning & Training Management System - Proprietary