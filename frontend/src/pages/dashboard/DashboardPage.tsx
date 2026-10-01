"use client"

import { PageContainer } from "@/components/layout/PageContainer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useAuthStore } from "@/hooks/use-auth-store"
import {
  Users,
  BookOpen,
  Calendar,
  ClipboardCheck,
  Award,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface StatCardProps {
  title: string
  value: string | number
  change?: string
  changeType?: "up" | "down"
  icon: React.ReactNode
  color: string
}

function StatCard({ title, value, change, changeType, icon, color }: StatCardProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-3xl font-bold text-foreground mt-1">{value}</p>
            {change && (
              <p className={cn(
                "text-sm mt-1 flex items-center gap-1",
                changeType === "up" ? "text-green-600" : "text-red-600"
              )}>
                {changeType === "up" ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
                <span>{change}</span>
              </p>
            )}
          </div>
          <div className={cn("p-3 rounded-xl", color)}>
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export function DashboardPage() {
  const { user } = useAuthStore()
  const userRole = user?.roles[0] || "employee"

  // Role-specific stats
  const adminStats = [
    { title: "Total Employees", value: "15", change: "+12%", changeType: "up" as const, icon: <Users className="h-6 w-6 text-white" />, color: "bg-blue-500" },
    { title: "Active Trainings", value: "3", change: "+1", changeType: "up" as const, icon: <BookOpen className="h-6 w-6 text-white" />, color: "bg-green-500" },
    { title: "Upcoming Sessions", value: "11", change: "+5", changeType: "up" as const, icon: <Calendar className="h-6 w-6 text-white" />, color: "bg-purple-500" },
    { title: "Completion Rate", value: "87%", change: "+3%", changeType: "up" as const, icon: <TrendingUp className="h-6 w-6 text-white" />, color: "bg-orange-500" },
  ]

  const trainerStats = [
    { title: "My Courses", value: "3", change: "+1", changeType: "up" as const, icon: <BookOpen className="h-6 w-6 text-white" />, color: "bg-blue-500" },
    { title: "Today's Sessions", value: "2", change: "0", changeType: "up" as const, icon: <Calendar className="h-6 w-6 text-white" />, color: "bg-green-500" },
    { title: "Pending Attendance", value: "1", change: "-2", changeType: "down" as const, icon: <ClipboardCheck className="h-6 w-6 text-white" />, color: "bg-yellow-500" },
    { title: "Assessments to Grade", value: "3", change: "+3", changeType: "up" as const, icon: <ClipboardCheck className="h-6 w-6 text-white" />, color: "bg-purple-500" },
  ]

  const managerStats = [
    { title: "Team Size", value: "5", change: "+1", changeType: "up" as const, icon: <Users className="h-6 w-6 text-white" />, color: "bg-blue-500" },
    { title: "Team Completion", value: "80%", change: "+5%", changeType: "up" as const, icon: <TrendingUp className="h-6 w-6 text-white" />, color: "bg-green-500" },
    { title: "Avg Attendance", value: "92%", change: "+2%", changeType: "up" as const, icon: <Calendar className="h-6 w-6 text-white" />, color: "bg-purple-500" },
    { title: "Needs Support", value: "2", change: "-1", changeType: "down" as const, icon: <ClipboardCheck className="h-6 w-6 text-white" />, color: "bg-red-500" },
  ]

  const employeeStats = [
    { title: "My Training", value: "1", change: "0", changeType: "up" as const, icon: <BookOpen className="h-6 w-6 text-white" />, color: "bg-blue-500" },
    { title: "Progress", value: "25%", change: "+15%", changeType: "up" as const, icon: <TrendingUp className="h-6 w-6 text-white" />, color: "bg-green-500" },
    { title: "Upcoming Session", value: "2 days", change: "Soon", changeType: "up" as const, icon: <Calendar className="h-6 w-6 text-white" />, color: "bg-purple-500" },
    { title: "Certificates", value: "0", change: "0", changeType: "up" as const, icon: <Award className="h-6 w-6 text-white" />, color: "bg-yellow-500" },
  ]

  const getStats = () => {
    switch (userRole) {
      case "super_admin":
      case "hr_admin":
        return adminStats
      case "trainer":
        return trainerStats
      case "manager":
        return managerStats
      default:
        return employeeStats
    }
  }

  const stats = getStats()

  return (
    <PageContainer
      title="Dashboard"
      description={`Welcome back, ${user?.full_name?.split(" ")[0]}! Here's an overview of your training activities.`}
    >
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <span className="text-blue-600 font-medium">SJ</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">Sarah Johnson</p>
                  <p className="text-xs text-muted-foreground">Completed Salesforce Introduction module</p>
                </div>
                <Badge variant="success">Completed</Badge>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                  <span className="text-green-600 font-medium">MC</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">Michael Chen</p>
                  <p className="text-xs text-muted-foreground">Started Python for Data Analysis training</p>
                </div>
                <Badge variant="info">In Progress</Badge>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                <div className="h-10 w-10 rounded-full bg-yellow-100 flex items-center justify-center">
                  <span className="text-yellow-600 font-medium">ED</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">Emily Davis</p>
                  <p className="text-xs text-muted-foreground">Scored 85% on Pre-training Assessment</p>
                </div>
                <Badge variant="warning">Assessment</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 sm:grid-cols-2">
              <button className="p-4 rounded-lg border hover:bg-accent transition-colors text-left group">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors flex items-center justify-center">
                    <span className="text-primary">+</span>
                  </div>
                  <div>
                    <p className="font-medium">Create Training</p>
                    <p className="text-sm text-muted-foreground">Add new training program</p>
                  </div>
                </div>
              </button>
              <button className="p-4 rounded-lg border hover:bg-accent transition-colors text-left group">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-green/10 group-hover:bg-green/20 transition-colors flex items-center justify-center">
                    <span className="text-green">👥</span>
                  </div>
                  <div>
                    <p className="font-medium">Enroll Employees</p>
                    <p className="text-sm text-muted-foreground">Assign training to team</p>
                  </div>
                </div>
              </button>
              <button className="p-4 rounded-lg border hover:bg-accent transition-colors text-left group">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-purple/10 group-hover:bg-purple/20 transition-colors flex items-center justify-center">
                    <span className="text-purple">📅</span>
                  </div>
                  <div>
                    <p className="font-medium">Schedule Session</p>
                    <p className="text-sm text-muted-foreground">Plan training session</p>
                  </div>
                </div>
              </button>
              <button className="p-4 rounded-lg border hover:bg-accent transition-colors text-left group">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-orange/10 group-hover:bg-orange/20 transition-colors flex items-center justify-center">
                    <span className="text-orange">📊</span>
                  </div>
                  <div>
                    <p className="font-medium">View Reports</p>
                    <p className="text-sm text-muted-foreground">Generate analytics report</p>
                  </div>
                </div>
              </button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Upcoming Sessions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                    <span className="font-medium">1</span>
                  </div>
                  <div>
                    <p className="font-medium">Session 1: Salesforce Overview</p>
                    <p className="text-sm text-muted-foreground">Oct 3 • 9:00 AM - 11:00 AM</p>
                  </div>
                </div>
                <Badge variant="info">Scheduled</Badge>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                    <span className="font-medium">2</span>
                  </div>
                  <div>
                    <p className="font-medium">Session 2: Navigation Deep Dive</p>
                    <p className="text-sm text-muted-foreground">Oct 5 • 9:00 AM - 11:00 AM</p>
                  </div>
                </div>
                <Badge variant="info">Scheduled</Badge>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                    <span className="font-medium">3</span>
                  </div>
                  <div>
                    <p className="font-medium">Session 3: User Management</p>
                    <p className="text-sm text-muted-foreground">Oct 7 • 9:00 AM - 11:00 AM</p>
                  </div>
                </div>
                <Badge variant="info">Scheduled</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  )
}