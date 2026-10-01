"use client"

import { Button } from "@/components/ui/button"
import { Bell, Calendar, Award, FileText, CheckCircle2, Users } from "lucide-react"

interface Notification {
  id: string
  title: string
  message: string
  time: string
  type: "training" | "session" | "assignment" | "assessment" | "certificate" | "system"
  read: boolean
  priority?: "low" | "medium" | "high"
}

const notifications: Notification[] = [
  { id: "1", title: "New Training Assigned", message: "Salesforce Advanced Training has been assigned to your team", time: "2 minutes ago", type: "training", read: false, priority: "high" },
  { id: "2", title: "Session Starting Soon", message: "Data Analytics Fundamentals session starts in 15 minutes", time: "5 minutes ago", type: "session", read: false, priority: "medium" },
  { id: "3", title: "Assignment Submitted", message: "Jordan Kim submitted the Salesforce Lightning Project", time: "1 hour ago", type: "assignment", read: true, priority: "low" },
  { id: "4", title: "Assessment Graded", message: "Your Data Analytics quiz has been graded: 85%", time: "2 hours ago", type: "assessment", read: true, priority: "medium" },
  { id: "5", title: "Certificate Earned", message: "Congratulations! You've earned the Salesforce Administrator certificate", time: "4 hours ago", type: "certificate", read: false, priority: "high" },
  { id: "6", title: "System Maintenance", message: "Scheduled maintenance tonight from 2-4 AM EST", time: "Yesterday", type: "system", read: true, priority: "low" }
]

const getIcon = (type: string) => {
  switch (type) {
    case "training": return <FileText className="h-4 w-4" />
    case "session": return <Calendar className="h-4 w-4" />
    case "assignment": return <FileText className="h-4 w-4" />
    case "assessment": return <CheckCircle2 className="h-4 w-4" />
    case "certificate": return <Award className="h-4 w-4" />
    case "system": return <Users className="h-4 w-4" />
    default: return <Bell className="h-4 w-4" />
  }
}

const getPriorityColor = (priority: string | undefined) => {
  switch (priority) {
    case "high": return "bg-red-500/20 text-red-600 border border-red-500/30"
    case "medium": return "bg-amber-500/20 text-amber-600 border border-amber-500/30"
    case "low": return "bg-blue-500/20 text-blue-600 border border-blue-500/30"
    default: return "bg-gray-500/20 text-gray-600 border border-gray-500/30"
  }
}

export function NotificationsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Bell className="h-6 w-6" />
          <div>
            <h1 className="text-3xl font-bold">Notifications</h1>
            <p className="text-muted-foreground">Stay updated on important events</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">Mark all as read</Button>
          <Button variant="ghost" size="icon"><Bell className="h-4 w-4" /></Button>
        </div>
      </div>

      <div className="space-y-3">
        {notifications.map((notif) => (
          <div
            key={notif.id}
            className={"p-4 rounded-2xl transition-colors cursor-pointer hover:bg-white/5 " +
              (notif.read ? "bg-white/5" : "bg-primary/10") +
              " " + getPriorityColor(notif.priority)}
          >
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-2xl flex items-center justify-center">
                {getIcon(notif.type)}
              </div>
              <div className="flex-1 space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium">{notif.title}</h3>
                  <span className="text-xs text-muted-foreground">{notif.time}</span>
                </div>
                <p className="text-sm">{notif.message}</p>
                {notif.priority && (
                  <div className="mt-1">
                    <span className="text-xs font-medium">
                      {notif.priority?.toUpperCase()} PRIORITY
                    </span>
                  </div>
                )}
              </div>
              {!notif.read && <div className="w-2 h-2 rounded-full bg-primary mt-2 self-start" />}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}