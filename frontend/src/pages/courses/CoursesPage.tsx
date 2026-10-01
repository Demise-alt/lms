"use client"

import * as React from "react"
import { PageContainer } from "@/components/layout/PageContainer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { BookOpen, Plus, Search, Edit, Trash2, Play, Clock, Users, Menu } from "lucide-react"
import { useTrainings } from "@/hooks/useTrainings"
import { useCourses } from "@/hooks/useTrainings"
import { useToast } from "@/hooks/use-toast"

interface Course {
  id: string
  title: string
  description: string | null
  order_index: number
  estimated_hours: number | null
  status: string
  is_mandatory: boolean
  training_program_id: string
  created_at: string
  updated_at: string
}

export function CoursesPage() {
  const [searchTerm, setSearchTerm] = React.useState("")
  const [selectedProgramId, setSelectedProgramId] = React.useState<string | null>(null)
  const { data: programs, isLoading: programsLoading, isError: programsError } = useTrainings()
  const { data: courses, isLoading: coursesLoading, isError: coursesError } = useCourses(selectedProgramId ?? "")
  const { toast } = useToast()

  if (programsLoading || coursesLoading) {
    return (
      <PageContainer title="Courses" description="Manage course content and modules">
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      </PageContainer>
    )
  }

  if (programsError || coursesError) {
    return (
      <PageContainer title="Courses" description="Manage course content and modules">
        <div className="text-center py-12">
          <p className="text-destructive">Failed to load courses. Please try again later.</p>
        </div>
      </PageContainer>
    )
  }

  const filteredCourses = courses?.filter(
    (course) =>
      course.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (course.description ?? "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.status?.toLowerCase().includes(searchTerm.toLowerCase())
  ) ?? []

  return (
    <PageContainer title="Courses" description="Manage course content and modules">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div className="relative max-w-sm flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search courses..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={!selectedProgramId}
            onClick={() => setSelectedProgramId(null)}
          >
            <Menu className="h-4 w-4 mr-2" />
            All Programs
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              // Create course logic would go here
              toast({
                title: "Create Course",
                description: "Course creation feature coming soon.",
                variant: "default",
              })
            }}
          >
            <Plus className="mr-2 h-4 w-4" />
            Create Course
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Course Catalog</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Course</TableHead>
                  <TableHead>Modules</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Instructor</TableHead>
                  <TableHead>Enrolled</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCourses.map((course) => (
                  <TableRow key={course.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                          <BookOpen className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">{course.title}</p>
                          <p className="text-sm text-muted-foreground truncate max-w-xs">{course.description ?? "No description"}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <BookOpen className="h-4 w-4 text-muted-foreground" />
                        <span>{course.order_index}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span>{course.estimated_hours ? `${course.estimated_hours} hours` : "Not specified"}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {/* Instructor info would need to be fetched from training program */}
                      <span>Instructor info</span>
                    </TableCell>
                    <TableCell>
                      {/* Enrolled count would need to be calculated from enrollments */}
                      <span>-</span>
                    </TableCell>
                    <TableCell>
                      <Badge variant={
                        course.status === "Published" ? "success" :
                        course.status === "Draft" ? "secondary" :
                        course.status === "Archived" ? "outline" : "secondary"
                      }>
                        {course.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Play className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredCourses.length === 0 && (
                  <TableRow>
                    <TableCell colSpan="7" className="text-center py-4">
                      No courses found
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