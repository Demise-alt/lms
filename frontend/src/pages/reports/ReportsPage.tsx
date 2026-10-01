"use client"

import { GlassCard } from "@/components/ui/GlassCard"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Download, FileText, Calendar, Users, TrendingUp } from "lucide-react"

const reports = [
  {
    id: "1",
    name: "Employee Training Report",
    description: "Comprehensive employee training participation",
    lastGenerated: "2024-09-28",
    frequency: "Monthly",
    icon: Users
  },
  {
    id: "2",
    name: "Attendance Report",
    description: "Session attendance and participation metrics",
    lastGenerated: "2024-09-29",
    frequency: "Weekly",
    icon: Calendar
  },
  {
    id: "3",
    name: "Training Effectiveness",
    description: "Pre/post test improvement analysis",
    lastGenerated: "2024-09-25",
    frequency: "Quarterly",
    icon: TrendingUp
  },
  {
    id: "4",
    name: "Certificate Expiry",
    description: "Certificates expiring in next 90 days",
    lastGenerated: "2024-09-30",
    frequency: "Daily",
    icon: FileText
  }
]

export function ReportsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Reports</h1>
        <p className="text-muted-foreground">Generate and download comprehensive reports</p>
      </div>

      <div className="grid gap-4">
        {reports.map((report) => (
          <GlassCard key={report.id} hoverable className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4 flex-1">
                <div className="p-3 rounded-2xl bg-primary/10">
                  <report.icon className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{report.name}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{report.description}</p>
                  <div className="flex items-center gap-4 mt-2">
                    <span className="text-xs text-muted-foreground">
                      Last generated: {report.lastGenerated}
                    </span>
                    <Badge variant="outline" className="text-xs">
                      {report.frequency}
                    </Badge>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">
                  Preview
                </Button>
                <Button size="sm" className="gap-2">
                  <Download className="h-4 w-4" />
                  Generate
                </Button>
              </div>
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  )
}
