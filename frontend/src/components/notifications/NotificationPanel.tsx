"use client"

import { GlassCard } from "@/components/ui/GlassCard"
import { Badge } from "@/components/ui/badge"
import { Bell, Calendar, Award, FileText, CheckCircle2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface Notification {
  id: string
  title: string
  message: string
  time: string
  type: "training" | "session" | "assessment" | "certificate"
  read: boolean
}

const notifications: Notification[] = [
  {
    id: "1",
    title: "Training Assigned",
    message: "Salesforce Advanced training has been assigned to you",
    time: "2 hours ago",
    type: "training",
    read: false
  },
  {
    id: "2",
    title: "Session Reminder",
    message: "Data Analytics session starts in 30 minutes",
    time: "15 minutes ago",
    type: "session",
    read: false
  },
  {
    id: "3",
    title: "Certificate Issued",
    message: "Your Python for Data Analysis certificate is ready",
    time: "1 hour ago",
    type: "certificate",
    read: true
  }
]

const getIcon = (type: string) => {
  switch (type) {
    case "training":
      return <FileText className="h-4 w-4" />
    case "session":
      return <Calendar className="h-4 w-4" />
    case "assessment":
      return <CheckCircle2 className="h-4 w-4" />
    case "certificate":
      return <Award className="h-4 w-4" />
    default:
      return <Bell className="h-4 w-4" />
  }
}

export function NotificationPanel() {
  return (
    <GlassCard className="w-96">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold">Notifications</h3>
        <Badge variant="secondary">3 new</Badge>
      </div>

      <div className="space-y-2 max-h-96 overflow-y-auto">
        {notifications.map((notif) => (
          <div
            key={notif.id}
            className={cn(
              "p-3 rounded-xl transition-colors cursor-pointer",
              notif.read ? "bg-white/5" : "bg-primary/10 border border-primary/20"
            )}
          >
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-white/10">
                {getIcon(notif.type)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-medium text-sm">{notif.title}</div>
                <div className="text-xs text-muted-foreground mt-1">{notif.message}</div>
                <div className="text-xs text-muted-foreground mt-1">{notif.time}</div>
              </div>
              {!notif.read && <div className="w-2 h-2 rounded-full bg-primary mt-2" />}
            </div>
          </div>
        ))}
      </div>
    </GlassCard>
  )
}
