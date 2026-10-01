"use client"

import { StatCard } from "@/components/ui/StatCard"
import { TrendingUp } from "lucide-react"

export function EffectivenessPage() {
  const metrics = [
    { label: "Pre-Test Average", value: "40%", improvement: "+42%" },
    { label: "Post-Test Average", value: "82%", improvement: "+22%" },
    { label: "Completion Rate", value: "87%", improvement: "+5%" },
    { label: "Satisfaction Score", value: "4.7/5", improvement: "+0.3" },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Training Effectiveness</h1>
        <p className="text-muted-foreground">Measure learning outcomes and ROI</p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        {metrics.map((metric, i) => (
          <StatCard
            key={i}
            title={metric.label}
            value={metric.value}
            change={metric.improvement}
            changeType="up"
            icon={<TrendingUp className="h-6 w-6 text-white" />}
            color="bg-gradient-to-br from-emerald-500 to-teal-600"
          />
        ))}
      </div>
    </div>
  )
}
