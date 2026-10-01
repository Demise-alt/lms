"use client"

import { Link, useLocation, NavLink } from "react-router-dom"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  Users,
  BookOpen,
  Calendar,
  ClipboardCheck,
  BarChart3,
  Award,
  Settings,
  GraduationCap,
  X,
  ChevronRight,
} from "lucide-react"
import { useAuthStore } from "@/hooks/use-auth-store"
import { Button } from "@/components/ui/button"
import { useState } from "react"

const navigation = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
    roles: ["super_admin", "hr_admin", "trainer", "manager", "employee"],
  },
  {
    name: "People",
    href: "#",
    icon: Users,
    roles: ["super_admin", "hr_admin", "manager"],
    children: [
      { name: "Employees", href: "/employees", roles: ["super_admin", "hr_admin", "manager"] },
      { name: "Departments", href: "/departments", roles: ["super_admin", "hr_admin"] },
      { name: "Teams", href: "/teams", roles: ["super_admin", "hr_admin"] },
    ],
  },
  {
    name: "Learning",
    href: "#",
    icon: BookOpen,
    roles: ["super_admin", "hr_admin", "trainer", "employee"],
    children: [
      { name: "Training Programs", href: "/trainings", roles: ["super_admin", "hr_admin", "trainer", "employee"] },
      { name: "Courses", href: "/courses", roles: ["super_admin", "hr_admin", "trainer"] },
      { name: "Learning Paths", href: "/learning-paths", roles: ["super_admin", "hr_admin"] },
      { name: "Materials", href: "/materials", roles: ["super_admin", "hr_admin", "trainer", "employee"] },
    ],
  },
  {
    name: "Training Operations",
    href: "#",
    icon: Calendar,
    roles: ["super_admin", "hr_admin", "trainer", "manager"],
    children: [
      { name: "Sessions", href: "/sessions", roles: ["super_admin", "hr_admin", "trainer", "manager"] },
      { name: "Calendar", href: "/calendar", roles: ["super_admin", "hr_admin", "trainer", "manager", "employee"] },
      { name: "Attendance", href: "/attendance", roles: ["super_admin", "hr_admin", "trainer"] },
    ],
  },
  {
    name: "Assessment",
    href: "#",
    icon: ClipboardCheck,
    roles: ["super_admin", "hr_admin", "trainer", "employee"],
    children: [
      { name: "Assessments", href: "/assessments", roles: ["super_admin", "hr_admin", "trainer", "employee"] },
      { name: "Assignments", href: "/assignments", roles: ["super_admin", "hr_admin", "trainer", "employee"] },
      { name: "Results", href: "/results", roles: ["super_admin", "hr_admin", "trainer", "manager", "employee"] },
    ],
  },
  {
    name: "Analytics",
    href: "#",
    icon: BarChart3,
    roles: ["super_admin", "hr_admin", "manager"],
    children: [
      { name: "Overview", href: "/analytics", roles: ["super_admin", "hr_admin", "manager"] },
      { name: "Employee Progress", href: "/analytics/employees", roles: ["super_admin", "hr_admin", "manager"] },
      { name: "Skill Gaps", href: "/analytics/skill-gaps", roles: ["super_admin", "hr_admin"] },
      { name: "Effectiveness", href: "/analytics/effectiveness", roles: ["super_admin", "hr_admin", "manager"] },
      { name: "Reports", href: "/reports", roles: ["super_admin", "hr_admin", "manager"] },
    ],
  },
  {
    name: "Certification",
    href: "#",
    icon: Award,
    roles: ["super_admin", "hr_admin", "employee"],
    children: [
      { name: "Certificates", href: "/certificates", roles: ["super_admin", "hr_admin", "employee"] },
      { name: "Expiring", href: "/certificates/expiring", roles: ["super_admin", "hr_admin"] },
    ],
  },
  {
    name: "Administration",
    href: "#",
    icon: Settings,
    roles: ["super_admin"],
    children: [
      { name: "Users", href: "/admin/users", roles: ["super_admin"] },
      { name: "Roles", href: "/admin/roles", roles: ["super_admin"] },
      { name: "Settings", href: "/admin/settings", roles: ["super_admin"] },
      { name: "Audit Logs", href: "/admin/audit-logs", roles: ["super_admin"] },
    ],
  },
]

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const { user } = useAuthStore()
  const location = useLocation()
  const [expandedItems, setExpandedItems] = useState<string[]>([])

  const userRole = user?.roles[0] || "employee"

  const filteredNavigation = navigation.filter((item) =>
    item.roles.includes(userRole)
  ).map((item) => ({
    ...item,
    children: item.children?.filter((child) => child.roles.includes(userRole)),
  }))

  const toggleExpand = (href: string) => {
    setExpandedItems((prev) =>
      prev.includes(href) ? prev.filter((h) => h !== href) : [...prev, href]
    )
  }

  const isExpanded = (href: string) => expandedItems.includes(href)

  return (
    <>
      <Button
        className="lg:hidden fixed top-4 left-4 z-50"
        onClick={onClose}
        variant="ghost"
        size="icon"
        aria-label="Close sidebar"
      >
        <X className="h-5 w-5" />
      </Button>

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-64 bg-background border-r transition-transform duration-200 ease-in-out lg:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
        aria-label="Main navigation"
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex h-16 items-center justify-between px-6 border-b">
            <Link to="/dashboard" className="flex items-center space-x-2" onClick={onClose}>
              <GraduationCap className="h-8 w-8 text-primary" />
              <span className="text-xl font-bold text-foreground">ELTMS</span>
            </Link>
            <Button
              className="lg:hidden"
              onClick={onClose}
              variant="ghost"
              size="icon"
              aria-label="Close sidebar"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-4 space-y-1" aria-label="Main navigation">
            {filteredNavigation.map((item) => {
              const isActive = location.pathname === item.href ||
                (item.children && item.children.some(child => location.pathname.startsWith(child.href)))
              const hasChildren = item.children && item.children.length > 0

              return (
                <div key={item.name} className="group">
                  {hasChildren ? (
                    <>
                      <Button
                        variant={isActive ? "default" : "ghost"}
                        className={cn(
                          "w-full justify-between text-left",
                          isActive ? "bg-primary/10 text-primary" : "hover:bg-accent hover:text-accent-foreground"
                        )}
                        onClick={() => toggleExpand(item.name)}
                      >
                        <div className="flex items-center space-x-3">
                          <item.icon className="h-5 w-5 flex-shrink-0" />
                          <span className="font-medium truncate">{item.name}</span>
                        </div>
                        <ChevronRight
                          className={cn(
                            "h-4 w-4 text-muted-foreground transition-transform",
                            isExpanded(item.name) && "rotate-90"
                          )}
                        />
                      </Button>
                      <div
                        className={cn(
                          "overflow-hidden transition-all duration-200",
                          isExpanded(item.name) ? "max-h-96 opacity-100 mt-1" : "max-h-0 opacity-0"
                        )}
                      >
                        <div className="ml-10 space-y-1">
                          {item.children?.map((child) => {
                            const isChildActive = location.pathname === child.href
                            return (
                              <NavLink
                                key={child.name}
                                to={child.href}
                                onClick={onClose}
                                className={cn(
                                  "flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                                  isChildActive
                                    ? "bg-primary/10 text-primary"
                                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                                )}
                              >
                                <span>{child.name}</span>
                              </NavLink>
                            )
                          })}
                        </div>
                      </div>
                    </>
                  ) : (
                    <NavLink
                      to={item.href}
                      onClick={onClose}
                      className={cn(
                        "flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                        isActive
                          ? "bg-primary/10 text-primary"
                          : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                      )}
                    >
                      <item.icon className="h-5 w-5 flex-shrink-0" />
                      <span>{item.name}</span>
                    </NavLink>
                  )}
                </div>
              )
            })}
          </nav>

          {/* User Info */}
          <div className="p-4 border-t">
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-primary font-medium">
                  {user?.full_name?.charAt(0) || "U"}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{user?.full_name}</p>
                <p className="text-xs text-muted-foreground capitalize">{userRole.replace("_", " ")}</p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}
    </>
  )
}