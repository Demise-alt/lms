"use client"

import { GlassCard } from "@/components/ui/GlassCard"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, MapPin, Users } from "lucide-react"
import { format } from "date-fns"

interface Session {
  id: string
  title: string
  date: Date
  time: string
  location: string
  trainer: string
  participants: number
  type: "classroom" | "virtual" | "hybrid"
}

const sessions: Session[] = [
  {
    id: "1",
    title: "Salesforce Lightning Basics",
    date: new Date(),
    time: "09:00 - 11:00",
    location: "Room 101",
    trainer: "John Doe",
    participants: 25,
    type: "classroom"
  },
  {
    id: "2",
    title: "Data Analytics Workshop",
    date: new Date(Date.now() + 86400000),
    time: "14:00 - 16:00",
    location: "Virtual",
    trainer: "Jane Smith",
    participants: 18,
    type: "virtual"
  }
]

export function TrainingCalendar() {
  return (
    <GlassCard>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold">Training Calendar</h3>
        <Badge variant="outline" className="gap-2">
          <Calendar className="h-3 w-3" />
          {format(new Date(), "MMMM yyyy")}
        </Badge>
      </div>

      <div className="space-y-3">
        {sessions.map((session) => (
          <div
            key={session.id}
            className="p-4 rounded-2xl bg-white/5 hover:bg-white/10 transition-colors border border-white/10"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h4 className="font-semibold">{session.title}</h4>
                <div className="mt-2 space-y-1 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Clock className="h-3 w-3" />
                    {session.time} • {format(session.date, "EEEE, MMM d")}
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-3 w-3" />
                    {session.location}
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-3 w-3" />
                    {session.participants} participants • {session.trainer}
                  </div>
                </div>
              </div>
              <Badge variant={
                session.type === "classroom" ? "default" :
                session.type === "virtual" ? "secondary" : "outline"
              }>
                {session.type}
              </Badge>
            </div>
          </div>
        ))}
      </div>
    </GlassCard>
  )
}
