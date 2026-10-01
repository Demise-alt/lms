# Enterprise Learning & Training Management System (ELTMS)
## Premium Glassmorphism Frontend

A production-quality enterprise SaaS frontend built with React, TypeScript, and premium glassmorphism design.

### 🚀 Features

#### Premium Design System
- **Glassmorphism UI**: Strategic glass effects for premium enterprise look
- **Dark/Light Mode**: Seamless theme switching with system preference detection
- **Responsive Design**: Optimized for desktop, tablet, and mobile
- **Micro-interactions**: Smooth animations and hover effects
- **Professional Charts**: Recharts-powered analytics with glass styling

#### Core Modules
1. **Authentication**: Premium login with role-based access
2. **Dashboard**: Executive insights with KPI cards
3. **Employee Management**: Full CRUD with glass tables
4. **Training Programs**: Course and module management
5. **Sessions & Calendar**: Training scheduling
6. **Attendance Tracking**: Real-time monitoring
7. **Assessments**: Test creation and grading
8. **Analytics**: Comprehensive reporting
9. **Certificates**: Digital certificate management
10. **Notifications**: Real-time updates

#### Role-Based Access
- **SUPER_ADMIN**: Full system access
- **HR_ADMIN**: Employee and training management
- **TRAINER**: Course delivery and assessment
- **MANAGER**: Team oversight
- **EMPLOYEE**: Personal learning dashboard

### 🛠 Tech Stack

- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS + Custom Glassmorphism
- **UI Components**: shadcn/ui
- **State Management**: Zustand + TanStack Query
- **Forms**: React Hook Form + Zod
- **Charts**: Recharts
- **Icons**: Lucide React
- **Routing**: React Router v6
- **Backend**: Python FastAPI + PostgreSQL

### 📁 Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── ui/           # Reusable UI components
│   │   ├── layout/       # App shell components
│   │   ├── charts/       # Premium chart components
│   │   └── ...
│   ├── pages/            # Route pages
│   │   ├── auth/
│   │   ├── dashboard/
│   │   ├── employees/
│   │   └── ...
│   ├── hooks/            # Custom hooks
│   ├── services/         # API clients
│   ├── types/            # TypeScript definitions
│   └── styles/           # Global styles
```

### 🎨 Design Philosophy

The ELTMS frontend follows premium enterprise SaaS design principles:

1. **Glassmorphism**: Strategic use of translucent surfaces with backdrop blur
2. **Visual Hierarchy**: Clear information architecture
3. **Professional**: Enterprise-grade aesthetics, no playful elements
4. **Accessible**: WCAG 2.1 AA compliant
5. **Performant**: Lazy loading, code splitting, optimized rendering

### 🚀 Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

### 🌐 Environment Variables

```env
VITE_API_BASE_URL=http://localhost:8000/api/v1
```

### 📖 API Integration

The frontend integrates with Python FastAPI backend at `/api/v1`:

- `/auth` - Authentication
- `/users` - User management
- `/employees` - Employee data
- `/trainings` - Training programs
- `/courses` - Courses
- `/sessions` - Training sessions
- `/attendance` - Attendance tracking
- `/assessments` - Tests and quizzes
- `/analytics` - Reports and metrics
- `/certificates` - Certificate management

### 🎯 Key Pages

| Route | Description |
|-------|-------------|
| `/login` | Premium authentication |
| `/dashboard` | Executive dashboard |
| `/employees` | Employee management |
| `/trainings` | Training programs |
| `/courses` | Course catalog |
| `/sessions` | Session scheduling |
| `/attendance` | Attendance tracking |
| `/assessments` | Test management |
| `/analytics` | Advanced analytics |
| `/certificates` | Certification management |

### 🔐 Security

- JWT authentication with refresh tokens
- Role-based access control (RBAC)
- Protected routes
- CSRF protection
- Secure API communication

### 📱 Responsive Breakpoints

- Desktop: 1920px+
- Large Desktop: 1440px
- Tablet: 768px - 1024px
- Mobile: < 768px

### 🎨 Color Palette

- **Primary**: Indigo/Purple gradient
- **Success**: Emerald
- **Warning**: Amber
- **Danger**: Red
- **Info**: Blue

### 🤝 Backend Integration

The frontend is designed to work seamlessly with the Python FastAPI backend:

```python
# Backend example
from fastapi import FastAPI
app = FastAPI()

@app.post("/api/v1/auth/login")
async def login(credentials: LoginRequest):
    # Auth logic
    return {"access_token": token}
```

### 📝 License

Enterprise proprietary software

---

Built with ❤️ for enterprise learning excellence
