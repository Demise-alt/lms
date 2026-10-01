"use client"

import { GlassCard } from "@/components/ui/GlassCard"
import { StatCard } from "@/components/ui/StatCard"
import { Badge } from "@/components/ui/badge"
import {
  Users,
  BookOpen,
  TrendingUp
} from "lucide-react"

export function HRAdminDashboard() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">HR Admin Dashboard</h1>
          <p className="text-muted-foreground">Employee and training oversight</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard
          title="Total Employees"
          value="12,450"
          change="+12%"
          changeType="up"
          icon={<Users className="h-6 w-6 text-white" />}
          color="bg-gradient-to-br from-blue-500 to-indigo-600"
        />
        <StatCard
          title="New Hires"
          value="89"
          change="+15"
          changeType="up"
          icon={<Users className="h-6 w-6 text-white rotate-90" />}
          color="bg-gradient-to-br from-green-500 to-teal-600"
        />
        <StatCard
          title="Active Trainings"
          value="189"
          change="+23"
          changeType="up"
          icon={<BookOpen className="h-6 w-6 text-white" />}
          color="bg-gradient-to-br from-emerald-500 to-teal-600"
        />
        <StatCard
          title="Completion Rate"
          value="87.5%"
          change="+3.2%"
          changeType="up"
          icon={<TrendingUp className="h-6 w-6 text-white" />}
          color="bg-gradient-to-br from-orange-500 to-red-600"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <GlassCard title="Workforce Overview">
          <div className="space-y-4">
            <div className="flex items-start justify-between mb-3">
              <h3 className="font-medium">Departments</h3>
              <Badge variant="outline">24</Badge>
            </div>
            <div className="flex items-start justify-between mb-3">
              <h3 className="font-medium">Locations</h3>
              <Badge variant="outline">12</Badge>
            </div>
            <div className="flex items-start justify-between mb-3">
              <h3 className="font-medium">Job Levels</h3>
              <Badge variant="outline">8</Badge>
            </div>
            <div className="flex items-start justify-between mb-3">
              <h3 className="font-medium">Avg Tenure</h3>
              <span className="font-medium text-blue-600">3.2 years</span>
            </div>
          </div>
        </GlassCard>

        <GlassCard title="Training Pipeline">
          <div className="space-y-4">
            <div className="flex items-start justify-between mb-3">
              <h3 className="font-medium">Pending Approvals</h3>
              <Badge variant="outline" className="bg-amber-500/20 text-amber-600">
                12
              </Badge>
            </div>
            <div className="flex items-start justify-between mb-3">
              <h3 className="font-medium">Upcoming Sessions</h3>
              <Badge variant="outline" className="bg-blue-500/20 text-blue-600">
                45
              </Badge>
            </div>
            <div className="flex items-start justify-between mb-3">
              <h3 className="font-medium">Certifications Issued</h3>
              <Badge variant="outline" className="bg-green-500/20 text-green-600">
                1,203
              </Badge>
            </div>
          </div>
        </GlassCard>

        <GlassCard title="Compliance & Reporting">
          <div className="space-y-4">
            <div className="flex items-start justify-between mb-3">
              <h3 className="font-medium">Required Trainings</h3>
              <Badge variant="outline">87%</Badge>
            </div>
            <div className="flex items-start justify-between mb-3">
              <h3 className="font-medium">Skill Assessments</h3>
              <Badge variant="outline">92%</Badge>
            </div>
            <div className="flex items-start justify-between mb-3">
              <h3 className="font-medium">Audit Ready</h3>
              <span className="font-medium text-green-600">Yes</span>
            </div>
          </div>
        </GlassCard>
      </div>
    </div>
  )
}