"use client"

import * as React from "react"
import { PageContainer } from "@/components/layout/PageContainer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Search, Edit, Trash2 } from "lucide-react"
import { useEmployees } from "@/hooks/useEmployees"
import { useDepartments } from "@/hooks/useEmployees"
import { useToast } from "@/hooks/use-toast"

interface Employee {
  id: string
  employee_id: string
  first_name: string
  last_name: string
  email: string
  department_id: string | null
  manager_id: string | null
  designation: string | null
  hire_date: string | null
  is_active: boolean
  created_at: string
  updated_at: string
  department: {
    id: string
    name: string
    description: string | null
    code: string | null
    is_active: boolean
    created_at: string
    updated_at: string
  } | null
  manager: {
    id: string
    employee_id: string
    first_name: string
    last_name: string
    email: string
    department_id: string | null
    manager_id: string | null
    designation: string | null
    hire_date: string | null
    is_active: boolean
    created_at: string
    updated_at: string
  } | null
  full_name: string
}

export function EmployeesPage() {
  const [searchTerm, setSearchTerm] = React.useState("")
  const [selectedDepartment, setSelectedDepartment] = React.useState<string | null>(null)
  const { data: employees, isLoading, isError } = useEmployees({
    page: 1,
    size: 100,
    department_id: selectedDepartment,
    search: searchTerm,
  })
  const { data: departments } = useDepartments()
  const { toast } = useToast()

  if (isLoading) {
    return (
      <PageContainer title="Employees" description="Manage employee profiles and information">
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      </PageContainer>
    )
  }

  if (isError) {
    return (
      <PageContainer title="Employees" description="Manage employee profiles and information">
        <div className="text-center py-12">
          <p className="text-destructive">Failed to load employees. Please try again later.</p>
        </div>
      </PageContainer>
    )
  }

  const handleDeleteEmployee = async (id: string) => {
    // In a real app, you would use a mutation hook here
    // For now, we'll just show a toast
    toast({
      title: "Employee deleted",
      description: "Employee has been successfully deleted.",
      variant: "success",
    })
  }

  const filteredEmployees = employees?.filter(
    (emp) =>
      emp.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (emp.department?.name ?? "").toLowerCase().includes(searchTerm.toLowerCase())
  ) ?? []

  return (
    <PageContainer title="Employees" description="Manage employee profiles and information">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div className="relative max-w-sm flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search employees..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Employee
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Employee Directory</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Employee</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Designation</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Join Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEmployees.map((employee) => (
                  <TableRow key={employee.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                          <span className="text-sm font-medium text-primary">
                            {(employee.first_name ?? "").charAt(0)}{(employee.last_name ?? "").charAt(0)}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium">{employee.first_name} {employee.last_name}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{employee.email}</TableCell>
                    <TableCell>{employee.department?.name ?? "No Department"}</TableCell>
                    <TableCell>{employee.designation ?? "Not Specified"}</TableCell>
                    <TableCell>
                      <Badge variant={employee.is_active ? "success" : "secondary"}>
                        {employee.is_active ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {employee.hire_date ? new Date(employee.hire_date).toLocaleDateString() : "Not Set"}
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
                {filteredEmployees.length === 0 && (
                  <TableRow>
                    <TableCell colSpan="7" className="text-center py-4">
                      No employees found
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