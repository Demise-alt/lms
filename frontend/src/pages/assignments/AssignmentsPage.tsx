"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Plus, Calendar, Users, FileText, CheckCircle2, Award } from "lucide-react"
import { PremiumDataTable } from "@/components/tables/PremiumDataTable"
import { useAssignments } from "@/hooks/useAssignments"
import { useEmployees } from "@/hooks/useEmployees"
import { useTrainings } from "@/hooks/useTrainings"
import { useToast } from "@/hooks/use-toast"

interface Assignment {
  id: string
  title: string
  description: string | null
  training_program_id: string
  course_id: string | null
  due_date: string | null
  max_score: number
  created_at: string
  updated_at: string
}

interface AssignmentSubmission {
  id: string
  assignment_id: string
  employee_id: string
  file_path: string | null
  comments: string | null
  status: string
  score: number | null
  trainer_feedback: string | null
  graded_by_id: string | null
  graded_at: string | null
  created_at: string
  updated_at: string
}

export function AssignmentsPage() {
  const [searchTerm, setSearchTerm] = React.useState("")
  const [selectedProgramId, setSelectedProgramId] = React.useState<string | null>(null)
  const [selectedCourseId, setSelectedCourseId] = React.useState<string | null>(null)
  const { data: assignments, isLoading, isError } = useAssignments({
    training_program_id: selectedProgramId,
    course_id: selectedCourseId
  })
  const { data: employees } = useEmployees({ page: 1, size: 1000 })
  const { data: programs } = useTrainings()
  const { toast } = useToast()

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    )
  }

  if (isError) {
    return (
      <div className="text-center py-12">
        <p className="text-destructive">Failed to load assignments. Please try again later.</p>
      </div>
    )
  }

  const columns = [
    {
      accessorKey: "title",
      header: "Assignment",
      cell: (row: Assignment) => (
        <div>
          <div className="font-medium">{row.title}</div>
          <div className="text-xs text-muted-foreground">{row.description || "No description"}</div>
        </div>
      ),
    },
    {
      header: "Assigned",
      cell: (row: Assignment) => (
        <div className="flex items-center gap-1">
          <Calendar className="h-3 w-3 text-muted-foreground" />
          <span>{row.created_at ? new Date(row.created_at).toLocaleDateString() : "N/A"}</span>
        </div>
      )
    },
    {
      header: "Due Date",
      cell: (row: Assignment) => (
        <Badge
          variant={row.due_date && new Date(row.due_date) < new Date() ? "destructive" : "secondary"}
        >
          {row.due_date ? new Date(row.due_date).toLocaleDateString() : "Not set"}
        </Badge>
      ),
    },
    {
      header: "Training Program",
      cell: (row: Assignment) => {
        const program = programs?.find(p => p.id === row.training_program_id)
        return <span>{program ? program.title : `Program ${row.training_program_id?.substring(0, 8)}...`}</span>
      }
    },
    {
      header: "Course",
      cell: (row: Assignment) => {
        // We don't have direct course info in assignment, would need to fetch
        // For now, show course_id or "Not assigned"
        return <span>{row.course_id || "Not assigned"}</span>
      }
    },
    {
      header: "Max Points",
      cell: (row: Assignment) => (
        <span>{row.max_score}</span>
      )
    },
    {
      id: "actions",
      header: "Actions",
      cell: (row: Assignment) => (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              toast({
                title: "Submit Assignment",
                description: "Assignment submission feature coming soon",
                variant: "default"
              })
            }}
          >
            <FileText className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              toast({
                title: "Grade Assignment",
                description: "Assignment grading feature coming soon",
                variant: "default"
              })
            }}
          >
            <Award className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              toast({
                title: "View Submissions",
                description: "View submissions feature coming soon",
                variant: "default"
              })
            }}
          >
            <CheckCircle2 className="h-4 w-4" />
          </Button>
        </div>
      )
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Assignments</h1>
          <p className="text-muted-foreground">Manage and submit assignments</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSelectedProgramId(null)}
          >
            <Filter className="h-4 w-4 mr-2" />
            All Programs
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSelectedCourseId(null)}
          >
            <Menu className="h-4 w-4 mr-2" />
            All Courses
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              toast({
                title: "New Assignment",
                description: "Assignment creation feature coming soon",
                variant: "default"
              })
            }}
          >
            <Plus className="mr-2 h-4 w-4" />
            New Assignment
          </Button>
        </div>
      </div>

      <div className="flex items-center justify-between mb-4">
        <div className="flex-1">
          <Input
            placeholder="Search assignments..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full max-w-sm pl-10"
          />
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Calendar className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Button variant="outline" size="sm">
            <Users className="h-4 w-4 mr-2" />
            Bulk Actions
          </Button>
        </div>
      </div>

      {assignments.length > 0 ? (
        <PremiumDataTable
          columns={columns}
          data={assignments}
          searchPlaceholder="Search assignments..."
        />
      ) : (
        <div className="text-center py-8">
          <p className="text-muted-foreground">No assignments found</p>
        </div>
      )}
    </div>
  )
}