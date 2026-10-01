"use client"

import { GlassCard } from "@/components/ui/GlassCard"
import { StatCard } from "@/components/ui/StatCard"
import { ProgressRing } from "@/components/progress/ProgressRing"
import { Badge } from "@/components/ui/badge"
import {
  BookOpen,
  Calendar,
  Target,
  Award,
  TrendingUp,
  CheckCircle2
} from "lucide-react"

export function ProgressPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">My Progress</h1>
          <p className="text-muted-foreground">Track your learning journey</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard
          title="Overall Completion"
          value="68%"
          change="+15%"
          changeType="up"
          icon={<TrendingUp className="h-6 w-6 text-white" />}
          color="bg-gradient-to-br from-blue-500 to-indigo-600"
        />
        <StatCard
          title="Modules Completed"
          value="23/34"
          change="+5"
          changeType="up"
          icon={<BookOpen className="h-6 w-6 text-white" />}
          color="bg-gradient-to-br from-green-500 to-teal-600"
        />
        <StatCard
          title="Assessments Avg"
          value="82%"
          change="+8%"
          changeType="up"
          icon={<Target className="h-6 w-6 text-white" />}
          color="bg-gradient-to-br from-purple-500 to-pink-600"
        />
        <StatCard
          title="Attendance Rate"
          value="91%"
          change="+3%"
          changeType="up"
          icon={<Calendar className="h-6 w-6 text-white" />}
          color="bg-gradient-to-br from-orange-500 to-red-600"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <GlassCard title="Learning Streak">
          <div className="flex items-center space-x-4">
            <ProgressRing value={12} size={80} label="12" sublabel="days" />
            <div className="flex-1">
              <p className="text-sm font-medium">Current Streak</p>
              <p className="text-xs text-muted-foreground">Keep learning daily</p>
            </div>
          </div>
        </GlassCard>

        <GlassCard title="Skill Development">
          <div className="space-y-4">
            {[
              { skill: "Salesforce", level: "Intermediate", progress: 65 },
              { skill: "Data Analysis", level: "Beginner", progress: 42 },
              { skill: "Leadership", level: "Intermediate", progress: 78 },
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-white/5">
                <div className="flex-1">
                  <div className="font-medium">{item.skill}</div>
                  <div className="text-xs text-muted-foreground">{item.level}</div>
                </div>
                <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full"
                    style={{ width: `${item.progress}%` }}
                  />
                </div>
                <span className="text-xs text-muted-foreground">{item.progress}%</span>
              </div>
            ))}
          </div>
        </GlassCard>

        <GlassCard title="Recent Achievements">
          <div className="space-y-3">
            {[
              { title: "Completed Salesforce Basics", date: "Sep 20", icon: <Award className="h-4 w-4 text-emerald-500" /> },
              { title: "Scored 90% on Quiz", date: "Sep 18", icon: <CheckCircle2 className="h-4 w-4 text-blue-500" /> },
              { title: "Perfect Attendance Week", date: "Sep 15", icon: <Calendar className="h-4 w-4 text-green-500" /> },
            ].map((achievement, i) => (
              <div key={i} className="p-3 rounded-xl bg-white/5">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    {achievement.icon}
                  </div>
                  <div className="flex-1">
                    <div className="font-medium">{achievement.title}</div>
                    <div className="text-xs text-muted-foreground mt-1">{achievement.date}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>

      <GlassCard title="Learning Path Progress">
        <div className="space-y-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-medium">Salesforce Administrator Path</h3>
            <Badge variant="outline">65% Complete</Badge>
          </div>
          <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-primary rounded-full"
              style={{ width: "65%" }}
            />
          </div>
          <div className="mt-3 space-y-2">
            {[
              { title: "Salesforce Essentials", status: "completed" },
              { title: "Data Management", status: "completed" },
              { title: "Security & Access", status: "in_progress" },
              { title: "Automation Basics", status: "not_started" },
              { title: "Reports & Dashboards", status: "not_started" },
            ].map((module, i) => (
              <div key={i} className="flex items-start gap-2">
                <div className={`w-3 h-3 rounded-full ${module.status === "completed" ? "bg-green-500" : module.status === "in_progress" ? "bg-yellow-500" : "bg-gray-300"}`} />
                <span className="text-sm">{module.title}</span>
              </div>
            ))}
          </div>
        </div>
      </GlassCard>
    </div>
  )
}