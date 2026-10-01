"use client"

import { Card, CardContent } from "@/components/ui/card"
import { ArrowUpRight, ArrowDownRight } from "lucide-react"
import { cn } from "@/lib/utils"

interface StatCardProps {
  title: string
  value: string | number
  change?: string
  changeType?: "up" | "down"
  icon: React.ReactNode
  color?: string
  description?: string
}

export function StatCard({ title, value, change, changeType, icon, color = "bg-primary", description }: StatCardProps) {
  return (
    <Card className="glass-card hover-lift group relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <CardContent className="p-6 relative">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-muted-foreground truncate">{title}</p>
            <p className="text-3xl font-bold text-foreground mt-2 tracking-tight">{value}</p>
            {change && (
              <div className={cn(
                "flex items-center gap-1.5 mt-2 text-sm font-medium",
                changeType === "up" ? "text-emerald-600" : "text-red-600"
              )}>
                {changeType === "up" ? (
                  <ArrowUpRight className="h-4 w-4" />
                ) : (
                  <ArrowDownRight className="h-4 w-4" />
                )}
                <span>{change}</span>
              </div>
            )}
            {description && (
              <p className="text-xs text-muted-foreground mt-2 line-clamp-2">{description}</p>
            )}
          </div>
          <div className={cn("p-3 rounded-2xl bg-gradient-to-br shadow-lg", color)}>
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
