"use client"

import { GlassCard } from "@/components/ui/GlassCard"
import { StatCard } from "@/components/ui/StatCard"
import { Progress } from "@/components/ui/progress"
import {
  BookOpen,
  Calendar,
  Award,
  TrendingUp,
  Clock,
  PlayCircle
} from "lucide-react"

export function EmployeeDashboard() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">My Learning</h1>
          <p className="text-muted-foreground">Continue your learning journey</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard
          title="Active Training"
          value="3"
          icon={<BookOpen className="h-6 w-6 text-white" />}
          color="bg-gradient-to-br from-blue-500 to-indigo-600"
        />
        <StatCard
          title="Progress"
          value="68%"
          icon={<TrendingUp className="h-6 w-6 text-white" />}
          color="bg-gradient-to-br from-emerald-500 to-teal-600"
        />
        <StatCard
          title="Upcoming"
          value="2"
          icon={<Calendar className="h-6 w-6 text-white" />}
          color="bg-gradient-to-br from-purple-500 to-pink-600"
        />
        <StatCard
          title="Certificates"
          value="5"
          icon={<Award className="h-6 w-6 text-white" />}
          color="bg-gradient-to-br from-amber-500 to-orange-600"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <GlassCard title="Continue Learning" className="lg:col-span-2">
          <div className="space-y-4">
            {[
              { title: "Salesforce Advanced", progress: 65, modules: "12/18", next: "Module 13: Lightning Experience" },
              { title: "Data Analytics", progress: 40, modules: "6/15", next: "Module 7: Python for Data" },
              { title: "Leadership Skills", progress: 85, modules: "17/20", next: "Final Assessment" },
            ].map((course, i) => (
              <div key={i} className="p-4 rounded-2xl bg-white/5 hover:bg-white/10 transition-colors">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="font-semibold">{course.title}</h4>
                    <p className="text-sm text-muted-foreground">{course.modules} completed</p>
                  </div>
                  <PlayCircle className="h-5 w-5 text-primary" />
                </div>
                <Progress value={course.progress} className="h-2 mb-2" />
                <p className="text-xs text-muted-foreground">Next: {course.next}</p>
              </div>
            ))}
          </div>
        </GlassCard>

        <GlassCard title="Upcoming Sessions">
          <div className="space-y-3">
            {[
              { title: "Data Analytics", time: "Tomorrow 10:00 AM", trainer: "Jane Smith" },
              { title: "Salesforce Q&A", time: "Friday 2:00 PM", trainer: "John Doe" },
            ].map((session, i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-white/5">
                <Clock className="h-4 w-4 text-primary flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm">{session.title}</div>
                  <div className="text-xs text-muted-foreground">{session.time}</div>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>
    </div>
  )
}
