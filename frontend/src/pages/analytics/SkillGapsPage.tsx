"use client"

import { GlassCard } from "@/components/ui/GlassCard"
import { TrendingDown } from "lucide-react"

const skillGaps = [
  { skill: "Advanced Salesforce", current: 45, target: 80, gap: 35, priority: "High" },
  { skill: "Data Analytics", current: 52, target: 85, gap: 33, priority: "High" },
  { skill: "Leadership", current: 60, target: 75, gap: 15, priority: "Medium" },
  { skill: "Project Management", current: 55, target: 70, gap: 15, priority: "Medium" },
]

export function SkillGapsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Skill Gap Analysis</h1>
          <p className="text-muted-foreground">Identify and address learning gaps</p>
        </div>
      </div>

      <div className="grid gap-4">
        {skillGaps.map((item, i) => (
          <GlassCard key={i} hoverable>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-2xl bg-gradient-to-br from-red-500 to-orange-500">
                  <TrendingDown className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold">{item.skill}</h3>
                  <div className="flex items-center gap-4 mt-1">
                    <span className="text-sm text-muted-foreground">Current: {item.current}%</span>
                    <span className="text-sm text-muted-foreground">Target: {item.target}%</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-red-500">{item.gap}%</div>
                <div className="text-sm text-muted-foreground">Gap</div>
              </div>
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  )
}
