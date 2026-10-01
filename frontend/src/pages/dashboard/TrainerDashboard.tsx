"use client"

import { GlassCard } from "@/components/ui/GlassCard"
import { StatCard } from "@/components/ui/StatCard"
import {
  BookOpen,
  Calendar,
  CheckCircle2,
  Award
} from "lucide-react"

export function TrainerDashboard() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Trainer Dashboard</h1>
          <p className="text-muted-foreground">Manage your training programs</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard
          title="Active Courses"
          value="12"
          change="+2"
          changeType="up"
          icon={<BookOpen className="h-6 w-6 text-white" />}
          color="bg-gradient-to-br from-blue-500 to-indigo-600"
        />
        <StatCard
          title="Today's Sessions"
          value="3"
          change="+1"
          changeType="up"
          icon={<Calendar className="h-6 w-6 text-white" />}
          color="bg-gradient-to-br from-green-500 to-teal-600"
        />
        <StatCard
          title="Pending Assessments"
          value="8"
          change="+3"
          changeType="up"
          icon={<CheckCircle2 className="h-6 w-6 text-white" />}
          color="bg-gradient-to-br from-yellow-500 to-amber-600"
        />
        <StatCard
          title="Avg Rating"
          value="4.8/5"
          change="+0.2"
          changeType="up"
          icon={<Award className="h-6 w-6 text-white" />}
          color="bg-gradient-to-br from-purple-500 to-pink-600"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <GlassCard title="My Training Programs">
          <div className="space-y-4">
            {[
              { name: "Salesforce Advanced", progress: 65, students: 28 },
              { name: "Data Science Fundamentals", progress: 42, students: 35 },
              { name: "Leadership Essentials", progress: 78, students: 22 },
            ].map((program, i) => (
              <div key={i} className="p-4 rounded-2xl bg-white/5 hover:bg-white/10 transition-colors">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-medium">{program.name}</h4>
                  <span className="text-xs text-muted-foreground">{program.students} students</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full"
                    style={{ width: `${program.progress}%` }}
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-1">{program.progress}% complete</p>
              </div>
            ))}
          </div>
        </GlassCard>

        <GlassCard title="Today's Schedule">
          <div className="space-y-3">
            {[
              { time: "9:00 AM", title: "Session 1: Introduction", duration: "2h" },
              { time: "2:00 PM", title: "Session 2: Hands-on Lab", duration: "3h" },
              { time: "4:00 PM", title: "Q&A Session", duration: "1h" },
            ].map((session, i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-white/5">
                <div className="text-xs text-muted-foreground">{session.time}</div>
                <div className="flex-1">
                  <div className="font-medium">{session.title}</div>
                  <div className="text-xs text-muted-foreground">{session.duration}</div>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>

        <GlassCard title="Recent Feedback">
          <div className="space-y-3">
            {[
              { student: "Alex Rivera", rating: 5, comment: "Excellent session!" },
              { student: "Jordan Kim", rating: 4, comment: "Very informative" },
              { student: "Taylor Smith", rating: 5, comment: "Best training ever" },
            ].map((feedback, i) => (
              <div key={i} className="p-3 rounded-xl bg-white/5">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="font-medium">{feedback.student}</div>
                    <div className="text-xs text-muted-foreground">{feedback.comment}</div>
                  </div>
                  <div className="text-right">
                    {[1,2,3,4,5].map((star) => (
                      <span key={star} className={star <= feedback.rating ? "text-yellow-400" : "text-gray-300"}>
                        ⭐
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>
    </div>
  )
}