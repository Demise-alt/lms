"use client"

import { Link, useLocation } from "react-router-dom"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  BookOpen,
  Calendar,
  ClipboardCheck,
  BarChart3,
  Award,
  Settings,
  ChevronRight,
  X
} from "lucide-react"
import { useAuthStore } from "@/hooks/use-auth-store"
import { Button } from "@/components/ui/button"
import { useState } from "react"

const navigation = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
    badge: null,
  },
  {
    name: "People",
    icon: Users,
    children: [
      { name: "Employees", href: "/employees", badge: "1.2k" },
      { name: "Departments", href: "/departments" },
      { name: "Teams", href: "/teams" },
    ]
  },
  {
    name: "Learning",
    icon: BookOpen,
    children: [
      { name: "Training Programs", href: "/trainings", badge: "47" },
      { name: "Courses", href: "/courses" },
      { name: "Materials", href: "/materials" },
    ]
  },
  {
    name: "Operations",
    icon: Calendar,
    children: [
      { name: "Sessions", href: "/sessions" },
      { name: "Calendar", href: "/calendar" },
      { name: "Attendance", href: "/attendance" },
    ]
  },
  {
    name: "Assessment",
    icon: ClipboardCheck,
    children: [
      { name: "Assessments", href: "/assessments" },
      { name: "Assignments", href: "/assignments" },
      { name: "Results", href: "/results" },
    ]
  },
  {
    name: "Analytics",
    icon: BarChart3,
    children: [
      { name: "Overview", href: "/analytics" },
      { name: "Progress", href: "/analytics/employees" },
      { name: "Skill Gaps", href: "/analytics/skill-gaps" },
      { name: "Reports", href: "/reports" },
    ]
  },
  {
    name: "Certification",
    icon: Award,
    children: [
      { name: "Certificates", href: "/certificates" },
      { name: "Expiring", href: "/certificates/expiring" },
    ]
  },
  {
    name: "Admin",
    icon: Settings,
    children: [
      { name: "Users", href: "/admin/users" },
      { name: "Roles", href: "/admin/roles" },
      { name: "Audit Logs", href: "/admin/audit-logs" },
    ]
  },
]

interface PremiumSidebarProps {
  isOpen: boolean
  onClose: () => void
}

export function PremiumSidebar({ isOpen, onClose }: PremiumSidebarProps) {
  const { user } = useAuthStore()
  const location = useLocation()
  const [expandedItems, setExpandedItems] = useState<string[]>(["People", "Learning"])

  const toggleExpand = (name: string) => {
    setExpandedItems(prev =>
      prev.includes(name) ? prev.filter(n => n !== name) : [...prev, name]
    )
  }

  return (
    <>
      <Button
        className="lg:hidden fixed top-4 left-4 z-50 glass"
        onClick={onClose}
        variant="ghost"
        size="icon"
      >
        <X className="h-5 w-5" />
      </Button>

      <aside className={cn(
        "fixed inset-y-0 left-0 z-40 w-72 transition-all duration-300 ease-in-out lg:translate-x-0",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="h-full glass-panel flex flex-col">
          {/* Logo */}
          <div className="flex h-20 items-center gap-3 px-8 border-b border-white/10">
            <div className="p-3 bg-gradient-to-br from-primary to-primary/70 rounded-2xl shadow-lg">
              <GraduationCap className="h-6 w-6 text-white" />
            </div>
            <div>
              <span className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                ELTMS
              </span>
              <p className="text-xs text-muted-foreground -mt-1">Enterprise Learning</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-4 space-y-1">
            {navigation.map((item) => {
              const hasChildren = item.children && item.children.length > 0
              const isExpanded = expandedItems.includes(item.name)
              const isActive = location.pathname === item.href

              return (
                <div key={item.name} className="space-y-1">
                  {hasChildren ? (
                    <>
                      <button
                        onClick={() => toggleExpand(item.name)}
                        className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition-colors group"
                      >
                        <div className="flex items-center gap-3">
                          <item.icon className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                          <span className="font-medium">{item.name}</span>
                        </div>
                        <ChevronRight className={cn(
                          "h-4 w-4 text-muted-foreground transition-transform",
                          isExpanded && "rotate-90"
                        )} />
                      </button>

                      {isExpanded && (
                        <div className="ml-8 space-y-1 pb-2">
                          {item.children!.map((child) => {
                            const isChildActive = location.pathname === child.href
                            return (
                              <Link
                                key={child.name}
                                to={child.href}
                                onClick={onClose}
                                className={cn(
                                  "flex items-center justify-between p-2.5 rounded-lg text-sm transition-all group",
                                  isChildActive
                                    ? "bg-primary/10 text-primary font-medium"
                                    : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
                                )}
                              >
                                <span>{child.name}</span>
                                {child.badge && (
                                  <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full">
                                    {child.badge}
                                  </span>
                                )}
                              </Link>
                            )
                          })}
                        </div>
                      )}
                    </>
                  ) : (
                    <Link
                      to={item.href || "#"}
                      onClick={onClose}
                      className={cn(
                        "flex items-center gap-3 p-3 rounded-xl transition-all",
                        isActive
                          ? "bg-primary/10 text-primary font-medium"
                          : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
                      )}
                    >
                      <item.icon className="h-5 w-5" />
                      <span>{item.name}</span>
                    </Link>
                  )}
                </div>
              )
            })}
          </nav>

          {/* User Info */}
          <div className="p-4 border-t border-white/10">
            <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/5 backdrop-blur">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center text-white font-semibold">
                {user?.full_name?.charAt(0) || "U"}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{user?.full_name || "User"}</p>
                <p className="text-xs text-muted-foreground capitalize">
                  {user?.roles?.[0]?.replace("_", " ") || "Employee"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}
    </>
  )
}
