"use client"

import * as React from "react"
import { PageContainer } from "@/components/layout/PageContainer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ClipboardList, Plus, Search, Edit, Trash2, Eye, FileText, Award } from "lucide-react"
import { useAssessments } from "@/hooks/useAssessments"
import { useToast } from "@/hooks/use-toast"

interface Assessment {
  id: string
  title: string
  description: string | null
  assessment_type: string
  training_program_id: string | null
  module_id: string | null
  duration_minutes: number | null
  passing_score: number
  attempt_limit: number
  start_date: string | null
  end_date: string | null
  is_active: boolean
  created_at: string
  updated_at: string
  questions: any[] // We'll keep this simple for now
}

export function AssessmentsPage() {
  const [searchTerm, setSearchTerm] = React.useState("")
  const { data: assessments, isLoading, isError } = useAssessments()
  const { toast } = useToast()

  if (isLoading) {
    return (
      <PageContainer title="Assessments" description="Manage quizzes, exams, and assignments">
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      </PageContainer>
    )
  }

  if (isError) {
    return (
      <PageContainer title="Assessments" description="Manage quizzes, exams, and assignments">
        <div className="text-center py-12">
          <p className="text-destructive">Failed to load assessments. Please try again later.</p>
        </div>
      </PageContainer>
    )
  }

  const filteredAssessments = assessments?.filter(
    (assessment) =>
      assessment.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (assessment.description ?? "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      assessment.assessment_type?.toLowerCase().includes(searchTerm.toLowerCase())
  ) ?? []

  return (
    <PageContainer title="Assessments" description="Manage quizzes, exams, and assignments">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div className="relative max-w-sm flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search assessments..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Create Assessment
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Assessments</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Assessment</TableHead>
                  <TableHead>Training Program</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Questions</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Passing Score</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAssessments.map((assessment) => (
                  <TableRow key={assessment.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                          {assessment.assessment_type === "quiz" && <ClipboardList className="h-5 w-5 text-primary" />}
                          {assessment.assessment_type === "exam" && <FileText className="h-5 w-5 text-primary" />}
                          {assessment.assessment_type === "assignment" && <Award className="h-5 w-5 text-primary" />}
                          {assessment.assessment_type === "practical" && <Eye className="h-5 w-5 text-primary" />}
                        </div>
                        <div>
                          <p className="font-medium">{assessment.title}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {assessment.training_program_id ? (
                        "Training Program ID: " + assessment.training_program_id.substring(0, 8) + "..."
                      ) : (
                        "None"
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="capitalize">{assessment.assessment_type}</Badge>
                    </TableCell>
                    <TableCell>
                      {assessment.questions?.length ?? 0}
                    </TableCell>
                    <TableCell>
                      {assessment.duration_minutes ? `${assessment.duration_minutes} min` : "Not set"}
                    </TableCell>
                    <TableCell>
                      {assessment.passing_score}%
                    </TableCell>
                    <TableCell>
                      <Badge variant={
                        assessment.is_active ? "success" :
                        "secondary"
                      }>
                        {assessment.is_active ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Eye className="h-4 w-4" />
                        </Button>
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
                {filteredAssessments.length === 0 && (
                  <TableRow>
                    <TableCell colSpan="8" className="text-center py-4">
                      No assessments found
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