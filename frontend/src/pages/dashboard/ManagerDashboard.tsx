"use client"

import { GlassCard } from "@/components/ui/GlassCard"
import { StatCard } from "@/components/ui/StatCard"
import { Badge } from "@/components/ui/badge"
import {
  Users,
  Calendar,
  TrendingUp,
  Target
} from "lucide-react"

export function ManagerDashboard() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Manager Dashboard</h1>
          <p className="text-muted-foreground">Team performance and oversight</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard
          title="Team Size"
          value="12"
          change="+1"
          changeType="up"
          icon={<Users className="h-6 w-6 text-white" />}
          color="bg-gradient-to-br from-blue-500 to-indigo-600"
        />
        <StatCard
          title="Team Completion"
          value="84%"
          change="+5%"
          changeType="up"
          icon={<TrendingUp className="h-6 w-6 text-white" />}
          color="bg-gradient-to-br from-green-500 to-teal-600"
        />
        <StatCard
          title="Avg Attendance"
          value="91%"
          change="+3%"
          changeType="up"
          icon={<Calendar className="h-6 w-6 text-white" />}
          color="bg-gradient-to-br from-purple-500 to-pink-600"
        />
        <StatCard
          title="Needs Support"
          value="3"
          change="-1"
          changeType="down"
          icon={<Target className="h-6 w-6 text-white" />}
          color="bg-gradient-to-br from-red-500 to-orange-600"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <GlassCard title="Team Overview">
          <div className="space-y-4">
            <div className="flex items-start justify-between mb-3">
              <h3 className="font-medium">Team Members</h3>
              <Badge variant="outline">12</Badge>
            </div>
            <div className="flex items-start justify-between mb-3">
              <h3 className="font-medium">Active Trainings</h3>
              <Badge variant="outline">8</Badge>
            </div>
            <div className="flex items-start justify-between mb-3">
              <h3 className="font-medium">Pending Reviews</h3>
              <Badge variant="outline">5</Badge>
            </div>
          </div>
        </GlassCard>

        <GlassCard title="Team Progress">
          <div className="space-y-4">
            {[
              { name: "Alex Rivera", progress: 92, status: "Excellent" },
              { name: "Jordan Kim", progress: 78, status: "Good" },
              { name: "Taylor Smith", progress: 65, status: "Needs Attention" },
              { name: "Casey Brown", progress: 88, status: "Very Good" },
            ].map((member, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-white/5">
                <div className="flex-1">
                  <div className="font-medium">{member.name}</div>
                  <div className="text-sm text-muted-foreground">{member.status}</div>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full"
                    style={{ width: `${member.progress}%` }}
                  />
                </div>
                <span className="text-xs text-muted-foreground">{member.progress}%</span>
              </div>
            ))}
          </div>
        </GlassCard>

        <GlassCard title="Upcoming Team Activities">
          <div className="space-y-3">
            {[
              { date: "Today 2:00 PM", title: "Salesforce Training", members: 8 },
              { date: "Tomorrow 10:00 AM", title: "Data Workshop", members: 6 },
              { date: "Friday 9:00 AM", title: "Team Meeting", members: 12 },
            ].map((activity, i) => (
              <div key={i} className="flex items-start justify-between p-3 rounded-xl bg-white/5">
                <div className="flex-1">
                  <div className="font-medium">{activity.title}</div>
                  <div className="text-xs text-muted-foreground">{activity.date}</div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-muted-foreground">{activity.members} members</div>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>
    </div>
  )
}