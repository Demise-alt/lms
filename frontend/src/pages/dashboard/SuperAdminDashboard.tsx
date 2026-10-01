"use client"

import { GlassCard } from "@/components/ui/GlassCard"
import { StatCard } from "@/components/ui/StatCard"
import { Badge } from "@/components/ui/badge"
import {
  Users,
  BookOpen,
  TrendingUp,
  Shield
} from "lucide-react"

export function SuperAdminDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Enterprise Dashboard</h1>
        <p className="text-muted-foreground">Complete organizational overview</p>
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
          title="Active Trainings"
          value="189"
          change="+15"
          changeType="up"
          icon={<BookOpen className="h-6 w-6 text-white" />}
          color="bg-gradient-to-br from-green-500 to-teal-600"
        />
        <StatCard
          title="Completion Rate"
          value="87.5%"
          change="+3.2%"
          changeType="up"
          icon={<TrendingUp className="h-6 w-6 text-white" />}
          color="bg-gradient-to-br from-orange-500 to-red-600"
        />
        <StatCard
          title="System Health"
          value="99.8%"
          change="+0.2%"
          changeType="up"
          icon={<Shield className="h-6 w-6 text-white" />}
          color="bg-gradient-to-br from-purple-500 to-pink-600"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <GlassCard title="Organization Overview">
          <div className="space-y-4">
            <div className="flex items-start justify-between mb-3">
              <h3 className="font-medium">Departments</h3>
              <Badge variant="outline">24</Badge>
            </div>
            <div className="flex items-start justify-between mb-3">
              <h3 className="font-medium">Teams</h3>
              <Badge variant="outline">156</Badge>
            </div>
            <div className="flex items-start justify-between mb-3">
              <h3 className="font-medium">Locations</h3>
              <Badge variant="outline">12</Badge>
            </div>
            <div className="flex items-start justify-between mb-3">
              <h3 className="font-medium">Budget Utilization</h3>
              <span className="font-medium text-green-600">78%</span>
            </div>
          </div>
        </GlassCard>

        <GlassCard title="Learning Trends">
          <div className="h-[300px]">
            {/* Learning trends chart would go here */}
            <div className="flex items-center justify-center h-full text-muted-foreground">
              Learning Trends Chart
            </div>
          </div>
        </GlassCard>

        <GlassCard title="Recent Activities">
          <div className="space-y-3">
            {[
              { action: "Created new Salesforce training", by: "HR Team", time: "2h ago" },
              { action: "Issued 150 certificates", by: "System", time: "5h ago" },
              { action: "Updated security policies", by: "Admin", time: "1d ago" },
            ].map((activity, i) => (
              <div key={i} className="p-3 rounded-xl bg-white/5">
                <div className="flex items-start justify-between">
                  <div className="font-medium">{activity.action}</div>
                  <div className="text-xs text-muted-foreground">{activity.time}</div>
                </div>
                <div className="text-sm text-muted-foreground mt-1">by {activity.by}</div>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>
    </div>
  )
}