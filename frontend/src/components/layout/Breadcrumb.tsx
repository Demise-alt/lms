"use client"

import { Link, useLocation } from "react-router-dom"
import { cn } from "@/lib/utils"
import { ChevronRight } from "lucide-react"

const routeLabels: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/employees": "Employees",
  "/employees/new": "New Employee",
  "/departments": "Departments",
  "/departments/new": "New Department",
  "/trainings": "Training Programs",
  "/trainings/new": "New Training Program",
  "/courses": "Courses",
  "/courses/new": "New Course",
  "/sessions": "Sessions",
  "/sessions/new": "New Session",
  "/calendar": "Calendar",
  "/attendance": "Attendance",
  "/assessments": "Assessments",
  "/assessments/new": "New Assessment",
  "/assignments": "Assignments",
  "/results": "Results",
  "/analytics": "Analytics",
  "/analytics/employee-progress": "Employee Progress",
  "/analytics/skill-gaps": "Skill Gaps",
  "/reports": "Reports",
  "/certificates": "Certificates",
  "/certificates/expiring": "Expiring Certificates",
  "/materials": "Materials",
  "/learning-paths": "Learning Paths",
  "/admin/users": "Users",
  "/admin/roles": "Roles",
  "/admin/settings": "Settings",
  "/admin/audit-logs": "Audit Logs",
}

export function Breadcrumb() {
  const location = useLocation()
  const pathnames = location.pathname.split("/").filter(Boolean)

  if (pathnames.length === 0) return null

  return (
    <nav className="flex items-center gap-1.5 text-sm" aria-label="Breadcrumb">
      <Link
        to="/dashboard"
        className={cn(
          "text-muted-foreground hover:text-foreground transition-colors",
          pathnames.length === 0 && "text-foreground"
        )}
      >
        Dashboard
      </Link>

      {pathnames.map((segment, index) => {
        const href = "/" + pathnames.slice(0, index + 1).join("/")
        const isLast = index === pathnames.length - 1
        const label = routeLabels[href] || segment.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())

        return (
          <span key={href} className="flex items-center gap-1.5">
            <ChevronRight className="h-3 w-3 text-muted-foreground" />
            {isLast ? (
              <span className="text-foreground font-medium">{label}</span>
            ) : (
              <Link
                to={href}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                {label}
              </Link>
            )}
          </span>
        )
      })}
    </nav>
  )
}