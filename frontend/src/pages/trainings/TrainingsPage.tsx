"use client"

import * as React from "react"
import { PageContainer } from "@/components/layout/PageContainer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { BookOpen, Plus, Search, Users, Clock, Edit, Trash2, Calendar } from "lucide-react"
import { useTrainings } from "@/hooks/useTrainings"
import { useDepartments } from "@/hooks/useEmployees"
import { useToast } from "@/hooks/use-toast"

interface Training {
  id: string
  title: string
  description: string | null
  category: string | null
  duration_weeks: number | null
  trainer_id: string | null
  enrolledCount: number
  status: string
  start_date: string | null
  mode: string | null
  location: string | null
}

export function TrainingsPage() {
  const [searchTerm, setSearchTerm] = React.useState("")
  const { data: trainings, isLoading, isError } = useTrainings({
    status: undefined,
    department_id: undefined,
  })
  const { data: departments } = useDepartments()
  const { toast } = useToast()

  if (isLoading) {
    return (
      <PageContainer title="Trainings" description="Manage training programs and courses">
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      </PageContainer>
    )
  }

  if (isError) {
    return (
      <PageContainer title="Trainings" description="Manage training programs and courses">
        <div className="text-center py-12">
          <p className="text-destructive">Failed to load trainings. Please try again later.</p>
        </div>
      </PageContainer>
    )
  }

  const filteredTrainings = trainings?.filter(
    (training) =>
      training.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      training.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (training.trainer_id && departments?.find(d => d.id === training.trainer_id)?.first_name?.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (training.trainer_id && departments?.find(d => d.id === training.trainer_id)?.last_name?.toLowerCase().includes(searchTerm.toLowerCase()))
  ) ?? []

  return (
    <PageContainer title="Trainings" description="Manage training programs and courses">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div className="relative max-w-sm flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search trainings..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Create Training
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Training Programs</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Training</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Instructor</TableHead>
                  <TableHead>Enrolled</TableHead>
                  <TableHead>Start Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTrainings.map((training) => (
                  <TableRow key={training.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                          <BookOpen className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">{training.title}</p>
                          <p className="text-sm text-muted-foreground truncate max-w-xs">{training.description ?? "No description"}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{training.category ?? "Not specified"}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span>{training.duration_weeks ? `${training.duration_weeks} weeks` : "Not specified"}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {training.trainer_id ? (
                        <>
                          {departments?.find(d => d.id === training.trainer_id)?.first_name ?? ""}
                          {" "}
                          {departments?.find(d => d.id === training.trainer_id)?.last_name ?? ""}
                        </>
                      ) : (
                        "Not assigned"
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span>{training.enrolledCount}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span>{training.start_date ? new Date(training.start_date).toLocaleDateString() : "Not set"}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={
                        training.status === "Published" ? "success" :
                        training.status === "Draft" ? "secondary" :
                        training.status === "Upcoming" ? "info" :
                        training.status === "In Progress" ? "warning" :
                        training.status === "Completed" ? "default" :
                        training.status === "Archived" ? "outline" : "secondary"
                      }>
                        {training.status}
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
                {filteredTrainings.length === 0 && (
                  <TableRow>
                    <TableCell colSpan="8" className="text-center py-4">
                      No trainings found
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