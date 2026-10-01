"use client"

import { GlassCard } from "@/components/ui/GlassCard"
import { StatCard } from "@/components/ui/StatCard"
import { TrainingCompletionTrend } from "@/components/charts/PremiumCharts"
import { DepartmentCompletion } from "@/components/charts/PremiumCharts"
import { AssessmentPerformance } from "@/components/charts/PremiumCharts"
import { CertificationStatus } from "@/components/charts/PremiumCharts"
import { Users, TrendingUp, Award, Target } from "lucide-react"

export function AnalyticsDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Analytics & Insights</h1>
        <p className="text-muted-foreground">Comprehensive learning analytics and insights</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard
          title="Total Employees"
          value="1,247"
          change="+12%"
          changeType="up"
          icon={<Users className="h-6 w-6 text-white" />}
          color="bg-gradient-to-br from-blue-500 to-indigo-600"
        />
        <StatCard
          title="Completion Rate"
          value="87.5%"
          change="+3.2%"
          changeType="up"
          icon={<TrendingUp className="h-6 w-6 text-white" />}
          color="bg-gradient-to-br from-emerald-500 to-teal-600"
        />
        <StatCard
          title="Certifications"
          value="1,203"
          change="+89"
          changeType="up"
          icon={<Award className="h-6 w-6 text-white" />}
          color="bg-gradient-to-br from-purple-500 to-pink-600"
        />
        <StatCard
          title="Avg Score"
          value="84%"
          change="+5%"
          changeType="up"
          icon={<Target className="h-6 w-6 text-white" />}
          color="bg-gradient-to-br from-orange-500 to-red-600"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TrainingCompletionTrend />
        <DepartmentCompletion />
        <AssessmentPerformance />
        <CertificationStatus />
      </div>

      <GlassCard title="Learning Gaps Analysis">
        <div className="space-y-4">
          {[
            { skill: "Advanced Salesforce", gap: 32, priority: "High" },
            { skill: "Data Analytics", gap: 28, priority: "High" },
            { skill: "Leadership", gap: 18, priority: "Medium" },
            { skill: "Project Management", gap: 15, priority: "Medium" },
          ].map((item, i) => (
            <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-white/5">
              <div className="flex-1">
                <div className="font-medium">{item.skill}</div>
                <div className="text-sm text-muted-foreground mt-1">
                  {item.gap}% of employees need training
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm text-muted-foreground">Priority</div>
                <div className={`text-sm font-medium ${item.priority === "High" ? "text-red-500" : "text-amber-500"}`}>
                  {item.priority}
                </div>
              </div>
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  )
}
