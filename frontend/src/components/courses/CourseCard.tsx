"use client"

import { GlassCard } from "@/components/ui/GlassCard"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Clock, BookOpen, Users, Award } from "lucide-react"

interface CourseCardProps {
  title: string
  description: string
  instructor: string
  duration: string
  modules: number
  progress?: number
  enrolled: number
  category: string
  level: "Beginner" | "Intermediate" | "Advanced"
}

export function CourseCard({
  title,
  description,
  instructor,
  duration,
  modules,
  progress = 0,
  enrolled,
  category,
  level
}: CourseCardProps) {
  return (
    <GlassCard className="group hover:shadow-glass-xl transition-all duration-300" hoverable>
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="outline" className="text-xs">{category}</Badge>
              <Badge variant="secondary" className="text-xs">{level}</Badge>
            </div>
            <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">
              {title}
            </h3>
            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{description}</p>
          </div>
        </div>

        {progress > 0 && (
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-muted-foreground">Progress</span>
              <span className="font-medium">{progress}%</span>
            </div>
            <Progress value={progress} className="h-1.5" />
          </div>
        )}

        <div className="grid grid-cols-2 gap-3 pt-2 border-t border-white/10">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Clock className="h-3 w-3" />
            {duration}
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <BookOpen className="h-3 w-3" />
            {modules} modules
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Users className="h-3 w-3" />
            {enrolled} enrolled
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Award className="h-3 w-3" />
            Certificate
          </div>
        </div>

        <div className="pt-2">
          <p className="text-xs text-muted-foreground">Instructor</p>
          <p className="text-sm font-medium">{instructor}</p>
        </div>
      </div>
    </GlassCard>
  )
}
