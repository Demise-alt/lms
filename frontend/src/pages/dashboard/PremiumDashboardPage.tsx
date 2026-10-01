"use client"

import { PageContainer } from "@/components/layout/PageContainer"
import { GlassCard } from "@/components/ui/GlassCard"
import { StatCard } from "@/components/ui/StatCard"
import {
  Users,
  BookOpen,
  Calendar,
  TrendingUp,
  Award,
  Clock,
  Target,
  Activity,
  ChevronRight
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

export function PremiumDashboardPage() {
  // const { user } = useAuthStore()

  const stats = [
    {
      title: "Total Employees",
      value: "1,247",
      change: "+12%",
      changeType: "up" as const,
      icon: <Users className="h-6 w-6 text-white" />,
      color: "bg-gradient-to-br from-blue-500 to-indigo-600",
      description: "Across all departments"
    },
    {
      title: "Active Trainings",
      value: "23",
      change: "+3",
      changeType: "up" as const,
      icon: <BookOpen className="h-6 w-6 text-white" />,
      color: "bg-gradient-to-br from-emerald-500 to-teal-600",
      description: "Currently running programs"
    },
    {
      title: "Upcoming Sessions",
      value: "47",
      change: "+8",
      changeType: "up" as const,
      icon: <Calendar className="h-6 w-6 text-white" />,
      color: "bg-gradient-to-br from-purple-500 to-pink-600",
      description: "Next 7 days"
    },
    {
      title: "Completion Rate",
      value: "87.5%",
      change: "+3.2%",
      changeType: "up" as const,
      icon: <TrendingUp className="h-6 w-6 text-white" />,
      color: "bg-gradient-to-br from-orange-500 to-red-600",
      description: "Average completion rate"
    }
  ]

  return (
    <PageContainer
      title="Executive Dashboard"
      description="Enterprise learning insights and performance metrics"
    >
      {/* Hero Stats */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent Activity */}
        <GlassCard title="Recent Learning Activity" className="lg:col-span-2">
          <div className="space-y-4">
            {[
              { name: "Sarah Johnson", action: "Completed Salesforce Advanced", time: "2 hours ago", icon: Award, color: "text-emerald-600" },
              { name: "Michael Chen", action: "Started Data Analytics Program", time: "4 hours ago", icon: BookOpen, color: "text-blue-600" },
              { name: "Emily Davis", action: "Scored 95% on Assessment", time: "6 hours ago", icon: Target, color: "text-purple-600" },
              { name: "Robert Wilson", action: "Issued Certificate - Python", time: "1 day ago", icon: Award, color: "text-orange-600" },
            ].map((activity, i) => (
              <div key={i} className="flex items-center gap-4 p-4 rounded-2xl bg-muted/30 hover:bg-muted/50 transition-colors group">
                <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <activity.icon className={`h-6 w-6 ${activity.color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{activity.name}</p>
                  <p className="text-sm text-muted-foreground">{activity.action}</p>
                </div>
                <span className="text-xs text-muted-foreground">{activity.time}</span>
              </div>
            ))}
          </div>
        </GlassCard>

        {/* Quick Actions */}
        <GlassCard title="Quick Actions" hoverable>
          <div className="space-y-3">
            {[
              { label: "Create Training", desc: "New program", icon: BookOpen },
              { label: "Enroll Team", desc: "Assign employees", icon: Users },
              { label: "Schedule Session", desc: "Plan training", icon: Calendar },
              { label: "View Reports", desc: "Analytics", icon: TrendingUp },
            ].map((action, i) => (
              <Button key={i} variant="ghost" className="w-full justify-between h-auto p-4 hover:bg-muted/50 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <action.icon className="h-4 w-4 text-primary" />
                  </div>
                  <div className="text-left">
                    <div className="font-medium text-sm">{action.label}</div>
                    <div className="text-xs text-muted-foreground">{action.desc}</div>
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </Button>
            ))}
          </div>
        </GlassCard>

        {/* Upcoming Sessions */}
        <GlassCard title="Upcoming Sessions" className="lg:col-span-2">
          <div className="space-y-3">
            {[
              { title: "Salesforce Lightning", trainer: "John Doe", time: "Today 9:00 AM", participants: 24 },
              { title: "Data Analytics Fundamentals", trainer: "Jane Smith", time: "Tomorrow 2:00 PM", participants: 18 },
              { title: "Leadership Development", trainer: "Mike Johnson", time: "Friday 10:00 AM", participants: 32 },
            ].map((session, i) => (
              <div key={i} className="p-4 rounded-2xl bg-gradient-to-r from-primary/5 to-transparent border border-primary/10 hover:border-primary/20 transition-all group cursor-pointer">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-semibold">{session.title}</h4>
                    <p className="text-sm text-muted-foreground mt-1">Trainer: {session.trainer}</p>
                  </div>
                  <Badge variant="outline" className="bg-background/50">
                    {session.participants} participants
                  </Badge>
                </div>
                <div className="flex items-center gap-2 mt-3 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  {session.time}
                </div>
              </div>
            ))}
          </div>
        </GlassCard>

        {/* System Health */}
        <GlassCard title="System Health" hoverable>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">API Status</span>
                <Badge className="bg-emerald-500/20 text-emerald-700 dark:text-emerald-400">Online</Badge>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div className="h-full w-[98%] bg-emerald-500 rounded-full" />
              </div>
            </div>
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Database</span>
                <Badge className="bg-emerald-500/20 text-emerald-700 dark:text-emerald-400">Healthy</Badge>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div className="h-full w-[99%] bg-emerald-500 rounded-full" />
              </div>
            </div>
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Active Users</span>
                <span className="text-sm font-medium">1,247</span>
              </div>
              <div className="flex items-center gap-2">
                <Activity className="h-4 w-4 text-emerald-600" />
                <span className="text-xs text-muted-foreground">Real-time monitoring active</span>
              </div>
            </div>
          </div>
        </GlassCard>
      </div>
    </PageContainer>
  )
}
