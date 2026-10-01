"use client"

import { GlassCard } from "@/components/ui/GlassCard"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Award, Download, Eye, Calendar, CheckCircle2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface CertificateCardProps {
  id: string
  employeeName: string
  courseName: string
  issueDate: string
  expiryDate?: string
  status: "active" | "expiring" | "expired"
  grade: string
}

export function CertificateCard({
  id,
  employeeName,
  courseName,
  issueDate,
  expiryDate,
  status,
  grade
}: CertificateCardProps) {
  const statusConfig = {
    active: { color: "text-emerald-600", bg: "bg-emerald-500/20", label: "Active" },
    expiring: { color: "text-amber-600", bg: "bg-amber-500/20", label: "Expiring Soon" },
    expired: { color: "text-red-600", bg: "bg-red-500/20", label: "Expired" }
  }

  const config = statusConfig[status]

  return (
    <GlassCard className="relative overflow-hidden group">
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/20 to-transparent rounded-bl-full pointer-events-none" />

      <div className="relative">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-gradient-to-br from-primary to-primary/70">
              <Award className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="font-semibold">Certificate #{id}</h3>
              <p className="text-sm text-muted-foreground">{courseName}</p>
            </div>
          </div>
          <Badge className={cn(config.bg, config.color, "border-0")}>
            {config.label}
          </Badge>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between py-2 border-b border-white/10">
            <span className="text-sm text-muted-foreground">Employee</span>
            <span className="text-sm font-medium">{employeeName}</span>
          </div>
          <div className="flex items-center justify-between py-2 border-b border-white/10">
            <span className="text-sm text-muted-foreground">Grade</span>
            <span className="text-sm font-medium">{grade}</span>
          </div>
          <div className="flex items-center justify-between py-2 border-b border-white/10">
            <span className="text-sm text-muted-foreground flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              Issued
            </span>
            <span className="text-sm font-medium">{issueDate}</span>
          </div>
          {expiryDate && (
            <div className="flex items-center justify-between py-2">
              <span className="text-sm text-muted-foreground flex items-center gap-1">
                <CheckCircle2 className="h-3 w-3" />
                Expires
              </span>
              <span className="text-sm font-medium">{expiryDate}</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 mt-4">
          <Button variant="outline" size="sm" className="flex-1">
            <Eye className="h-4 w-4 mr-2" />
            View
          </Button>
          <Button size="sm" className="flex-1">
            <Download className="h-4 w-4 mr-2" />
            Download
          </Button>
        </div>
      </div>
    </GlassCard>
  )
}
