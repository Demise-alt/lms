"use client"

import { GlassCard } from "@/components/ui/GlassCard"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, Calendar, User } from "lucide-react"

const expiring = [
  { employee: "Sarah Johnson", cert: "Salesforce Admin", expires: "2024-10-15", days: 15 },
  { employee: "Michael Chen", cert: "Python for Data", expires: "2024-10-22", days: 22 },
  { employee: "Emily Davis", cert: "Leadership", expires: "2024-11-01", days: 32 },
]

export function ExpiringCertificatesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <AlertTriangle className="h-8 w-8 text-amber-500" />
        <div>
          <h1 className="text-3xl font-bold">Expiring Certificates</h1>
          <p className="text-muted-foreground">Certificates requiring renewal</p>
        </div>
      </div>

      <div className="grid gap-4">
        {expiring.map((item, i) => (
          <GlassCard key={i} hoverable>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-2xl bg-amber-500/20">
                  <Calendar className="h-6 w-6 text-amber-500" />
                </div>
                <div>
                  <div className="font-semibold">{item.cert}</div>
                  <div className="text-sm text-muted-foreground flex items-center gap-2">
                    <User className="h-3 w-3" />
                    {item.employee}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <Badge className="bg-amber-500/20 text-amber-600 border-0">
                  {item.days} days
                </Badge>
                <div className="text-xs text-muted-foreground mt-1">Expires {item.expires}</div>
              </div>
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  )
}
