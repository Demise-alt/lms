"use client"

import * as React from "react"
import { PageContainer } from "@/components/layout/PageContainer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Search, Edit, Calendar, Filter } from "lucide-react"
import { useSessionAttendance } from "@/hooks/useAttendance"
import { useSessions } from "@/hooks/useSessions"
import { useToast } from "@/hooks/use-toast"

interface AttendanceRecord {
  id: string
  session_id: string
  employee_id: string
  status: string
  check_in_time: string | null
  check_out_time: string | null
  notes: string | null
  created_at: string
  updated_at: string
}

export function AttendancePage() {
  const [searchTerm, setSearchTerm] = React.useState("")
  const [statusFilter, setStatusFilter] = React.useState<string>("all")
  const [selectedSessionId, setSelectedSessionId] = React.useState<string | null>(null)

  const { data: sessions, isLoading: sessionsLoading } = useSessions()
  const { data: attendance, isLoading: attendanceLoading, isError } = useSessionAttendance(selectedSessionId ?? "")
  const { toast } = useToast()

  if (sessionsLoading || attendanceLoading) {
    return (
      <PageContainer title="Attendance" description="Track and manage session attendance">
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      </PageContainer>
    )
  }

  if (isError) {
    return (
      <PageContainer title="Attendance" description="Track and manage session attendance">
        <div className="text-center py-12">
          <p className="text-destructive">Failed to load attendance data. Please try again later.</p>
        </div>
      </PageContainer>
    )
  }

  const filteredAttendance = attendance?.filter((record) => {
    const matchesSearch =
      record.employee_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.session_id.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || record.status === statusFilter
    return matchesSearch && matchesStatus
  }) ?? []

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "present": return <Badge variant="success">Present</Badge>
      case "absent": return <Badge variant="destructive">Absent</Badge>
      case "late": return <Badge variant="warning">Late</Badge>
      case "excused": return <Badge variant="secondary">Excused</Badge>
      default: return <Badge variant="outline">{status}</Badge>
    }
  }

  return (
    <PageContainer title="Attendance" description="Track and manage session attendance">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-4 flex-1">
          <div className="relative max-w-sm flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search attendance..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="pl-10 pr-8 py-2 border border-input bg-background rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="all">All Status</option>
              <option value="present">Present</option>
              <option value="absent">Absent</option>
              <option value="late">Late</option>
              <option value="excused">Excused</option>
            </select>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSelectedSessionId(null)}
          >
            <Filter className="h-4 w-4 mr-2" />
            All Sessions
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              // Mark attendance logic would go here
              toast({
                title: "Mark Attendance",
                description: "Attendance marking feature coming soon",
                variant: "default"
              })
            }}
          >
            <Plus className="mr-2 h-4 w-4" />
            Mark Attendance
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Attendance Records</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Employee</TableHead>
                  <TableHead>Session</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Check-in</TableHead>
                  <TableHead>Check-out</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAttendance.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell>
                      {/* We don't have employee name directly, would need to fetch from employee service */}
                      <span>Employee ID: {record.employee_id.substring(0, 8)}...</span>
                    </TableCell>
                    <TableCell>
                      {/* We don't have session title directly, would need to fetch from session service */}
                      <span>Session ID: {record.session_id.substring(0, 8)}...</span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span>
                          {record.check_in_time ? new Date(record.check_in_time).toLocaleDateString() : "Not set"}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(record.status)}</TableCell>
                    <TableCell>
                      {record.check_in_time ? new Date(record.check_in_time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : "-"}
                    </TableCell>
                    <TableCell>
                      {record.check_out_time ? new Date(record.check_out_time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : "-"}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredAttendance.length === 0 && (
                  <TableRow>
                    <TableCell colSpan="6" className="text-center py-4">
                      No attendance records found
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