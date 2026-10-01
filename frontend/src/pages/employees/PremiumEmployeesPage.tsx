"use client"

import { useState } from "react"
import { PageContainer } from "@/components/layout/PageContainer"
import { GlassCard } from "@/components/ui/GlassCard"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Search,
  Plus,
  Filter,
  Download,
  MoreHorizontal,
  Mail,
  Phone,
  Building2,
  Calendar
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function PremiumEmployeesPage() {
  const [searchTerm, setSearchTerm] = useState("")

  const employees = [
    {
      id: "EMP001",
      name: "Sarah Johnson",
      email: "sarah.johnson@company.com",
      department: "Engineering",
      designation: "Senior Software Engineer",
      manager: "Michael Chen",
      trainingProgress: 85,
      status: "Active",
      joinedDate: "2023-01-15"
    },
    {
      id: "EMP002",
      name: "Michael Chen",
      email: "michael.chen@company.com",
      department: "Engineering",
      designation: "Engineering Manager",
      manager: "Lisa Anderson",
      trainingProgress: 92,
      status: "Active",
      joinedDate: "2022-06-20"
    },
    {
      id: "EMP003",
      name: "Emily Davis",
      email: "emily.davis@company.com",
      department: "Sales",
      designation: "Sales Representative",
      manager: "David Wilson",
      trainingProgress: 67,
      status: "Active",
      joinedDate: "2023-03-10"
    },
    {
      id: "EMP004",
      name: "Robert Wilson",
      email: "robert.wilson@company.com",
      department: "Marketing",
      designation: "Marketing Specialist",
      manager: "Jessica Brown",
      trainingProgress: 78,
      status: "Active",
      joinedDate: "2022-09-05"
    },
  ]

  return (
    <PageContainer
      title="Employee Management"
      description="Manage employee profiles, training progress, and organizational structure"
    >
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center mb-6">
        <div className="flex-1 flex gap-3 w-full sm:w-auto">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search employees..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-background/50 border-white/20 backdrop-blur-sm"
            />
          </div>
          <Button variant="outline" size="icon" className="glass">
            <Filter className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="glass">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button size="sm" className="bg-primary hover:bg-primary/90">
            <Plus className="h-4 w-4 mr-2" />
            Add Employee
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {[
          { label: "Total Employees", value: "1,247", change: "+12" },
          { label: "Active Training", value: "892", change: "+45" },
          { label: "Avg Completion", value: "87%", change: "+3%" },
          { label: "This Month", value: "34", change: "+8" },
        ].map((stat, i) => (
          <GlassCard key={i} className="p-4">
            <div className="text-2xl font-bold text-foreground">{stat.value}</div>
            <div className="text-xs text-muted-foreground mt-1">{stat.label}</div>
            <div className="text-xs text-emerald-600 mt-1">{stat.change} this month</div>
          </GlassCard>
        ))}
      </div>

      {/* Employee Grid */}
      <div className="grid gap-4">
        {employees.map((employee) => (
          <GlassCard key={employee.id} hoverable className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex gap-4 flex-1">
                <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center text-white text-xl font-bold shadow-lg">
                  {employee.name.split(" ").map(n => n[0]).join("")}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold">{employee.name}</h3>
                    <Badge variant={employee.status === "Active" ? "default" : "secondary"}>
                      {employee.status}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Mail className="h-3 w-3" />
                      {employee.email}
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Building2 className="h-3 w-3" />
                      {employee.department}
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Phone className="h-3 w-3" />
                      {employee.designation}
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      Joined {new Date(employee.joinedDate).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="mt-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Training Progress</span>
                      <span className="text-sm font-semibold text-primary">{employee.trainingProgress}%</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-primary to-primary/70 rounded-full transition-all"
                        style={{ width: `${employee.trainingProgress}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="hover:bg-white/10">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="glass" align="end">
                  <DropdownMenuItem>View Profile</DropdownMenuItem>
                  <DropdownMenuItem>Edit Employee</DropdownMenuItem>
                  <DropdownMenuItem>Training History</DropdownMenuItem>
                  <DropdownMenuItem className="text-destructive">Deactivate</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </GlassCard>
        ))}
      </div>
    </PageContainer>
  )
}
