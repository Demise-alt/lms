"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface GlassCardProps {
  title?: string
  description?: string
  children: React.ReactNode
  className?: string
  hoverable?: boolean
}

export function GlassCard({ title, description, children, className, hoverable = false }: GlassCardProps) {
  return (
    <Card className={cn(
      "glass-card transition-all duration-300",
      hoverable && "hover:shadow-glass-xl hover:-translate-y-1",
      className
    )}>
      {(title || description) && (
        <CardHeader>
          {title && <CardTitle className="text-lg font-semibold">{title}</CardTitle>}
          {description && <CardDescription>{description}</CardDescription>}
        </CardHeader>
      )}
      <CardContent className="pt-0">
        {children}
      </CardContent>
    </Card>
  )
}
