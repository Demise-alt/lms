"use client"

import * as React from "react"
import { PageContainer } from "@/components/layout/PageContainer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Calendar, Plus, Search, Users, Clock, Edit, Trash2, Video, MapPin } from "lucide-react"
import { useSessions } from "@/hooks/useSessions"
import { useTrainings } from "@/hooks/useTrainings"
import { useDepartments } from "@/hooks/useEmployees"
import { useToast } from "@/hooks/use-toast"

interface Session {
  id: string
  title: string
  training_program_id: string | null
  module_id: string | null
  trainer_id: string | null
  start_time: string
  end_time: string
  location: string | null
  meeting_url: string | null
  capacity: number | null
  status: string
}

export function SessionsPage() {
  const [searchTerm, setSearchTerm] = React.useState("")
  const [selectedProgramId, setSelectedProgramId] = React.useState<string | null>(null)
  const [selectedTrainerId, setSelectedTrainerId] = React.useState<string | null>(null)
  const { data: sessions, isLoading: sessionsLoading, isError: sessionsError } = useSessions({
    training_program_id: selectedProgramId,
    trainer_id: selectedTrainerId,
    status: undefined,
    start_date: undefined,
    end_date: undefined,
  })
  const { data: programs } = useTrainings()
  const { data: trainers } = useDepartments() // Using departments as trainers for now
  const { toast } = useToast()

  if (sessionsLoading) {
    return (
      <PageContainer title="Sessions" description="Manage training sessions and schedules">
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      </PageContainer>
    )
  }

  if (sessionsError) {
    return (
      <PageContainer title="Sessions" description="Manage training sessions and schedules">
        <div className="text-center py-12">
          <p className="text-destructive">Failed to load sessions. Please try again later.</p>
        </div>
      </PageContainer>
    )
  }

  const filteredSessions = sessions?.filter(
    (session) =>
      session.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (session.training_program_id && programs?.find(p => p.id === session.training_program_id)?.title?.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (session.trainer_id && trainers?.find(t => t.id === session.trainer_id)?.first_name?.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (session.trainer_id && trainers?.find(t => t.id === session.trainer_id)?.last_name?.toLowerCase().includes(searchTerm.toLowerCase()))
  ) ?? []

  return (
    <PageContainer title="Sessions" description="Manage training sessions and schedules">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div className="relative max-w-sm flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search sessions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSelectedProgramId(null)}
          >
            <Menu className="h-4 w-4 mr-2" />
            All Programs
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSelectedTrainerId(null)}
          >
            <User className="h-4 w-4 mr-2" />
            All Trainers
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              // Schedule session logic would go here
              toast({
                title: "Schedule Session",
                description: "Session scheduling feature coming soon.",
                variant: "default",
              })
            }}
          >
            <Plus className="mr-2 h-4 w-4" />
            Schedule Session
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Training Sessions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Session</TableHead>
                  <TableHead>Training Program</TableHead>
                  <TableHead>Module</TableHead>
                  <TableHead>Trainer</TableHead>
                  <TableHead>Date & Time</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Capacity</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSessions.map((session) => (
                  <TableRow key={session.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{session.title}</p>
                        <p className="text-sm text-muted-foreground">
                          <Clock className="h-3 w-3 inline mr-1" />
                          {session.duration_weeks ? `${session.duration_weeks} weeks` : "Not specified"}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      {session.training_program_id ? (
                        programs?.find(p => p.id === session.training_program_id)?.title ?? "Unknown Program"
                      ) : (
                        "No Program"
                      )}
                    </TableCell>
                    <TableCell>
                      {session.module_id ? (
                        "Module ID: " + session.module_id
                      ) : (
                        "No Module"
                      )}
                    </TableCell>
                    <TableCell>
                      {session.trainer_id ? (
                        <>
                          {trainers?.find(t => t.id === session.trainer_id)?.first_name ?? ""}
                          {" "}
                          {trainers?.find(t => t.id === session.trainer_id)?.last_name ?? ""}
                        </>
                      ) : (
                        "Not assigned"
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span>
                          {session.start_time ? new Date(session.start_time).toLocaleDateString() : "Not set"}
                          {" • "}
                          {session.start_time ? new Date(session.start_time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : ""}
                          {" - "}
                          {session.end_time ? new Date(session.end_time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : ""}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {session.location ?? "Not specified"}
                    </TableCell>
                    <TableCell>
                      {session.capacity ? `${session.capacity}` : "Not specified"}
                    </TableCell>
                    <TableCell>
                      <Badge variant={
                        session.status === "Scheduled" ? "info" :
                        session.status === "In Progress" ? "success" :
                        session.status === "Completed" ? "default" :
                        session.status === "Cancelled" ? "destructive" : "secondary"
                      }>
                        {session.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredSessions.length === 0 && (
                  <TableRow>
                    <TableCell colSpan="8" className="text-center py-4">
                      No sessions found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </PageContainer>
  )
}