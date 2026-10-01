"use client"

import { GlassCard } from "@/components/ui/GlassCard"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Calendar, FileText, Upload } from "lucide-react"
import { cn } from "@/lib/utils"

interface AssignmentCardProps {
  title: string
  description: string
  dueDate: string
  status: "pending" | "submitted" | "graded" | "overdue"
  progress?: number
  points?: number
  course: string
}

export function AssignmentCard({
  title,
  description,
  dueDate,
  status,
  progress = 0,
  points,
  course
}: AssignmentCardProps) {
  const statusConfig = {
    pending: { color: "bg-amber-500", label: "Pending" },
    submitted: { color: "bg-blue-500", label: "Submitted" },
    graded: { color: "bg-emerald-500", label: "Graded" },
    overdue: { color: "bg-red-500", label: "Overdue" }
  }

  const config = statusConfig[status]

  return (
    <GlassCard className="group">
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="outline">{course}</Badge>
              <div className={cn("w-2 h-2 rounded-full", config.color)} />
              <span className="text-xs text-muted-foreground">{config.label}</span>
            </div>
            <h3 className="font-semibold text-lg">{title}</h3>
            <p className="text-sm text-muted-foreground mt-1">{description}</p>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            Due {dueDate}
          </div>
          {points && (
            <div className="flex items-center gap-1">
              <FileText className="h-3 w-3" />
              {points} points
            </div>
          )}
        </div>

        {status === "pending" && progress > 0 && (
          <div>
            <Progress value={progress} className="h-1.5" />
          </div>
        )}

        <div className="flex items-center gap-2 pt-2">
          {status === "pending" && (
            <>
              <Button size="sm" className="flex-1">
                <Upload className="h-4 w-4 mr-2" />
                Submit
              </Button>
              <Button variant="outline" size="sm">
                Save Draft
              </Button>
            </>
          )}
          {status === "submitted" && (
            <Button variant="outline" size="sm" className="w-full">
              View Submission
            </Button>
          )}
          {status === "graded" && (
            <Button variant="outline" size="sm" className="w-full">
              View Feedback
            </Button>
          )}
          {status === "overdue" && (
            <Button variant="destructive" size="sm" className="w-full">
              Submit Late
            </Button>
          )}
        </div>
      </div>
    </GlassCard>
  )
}
