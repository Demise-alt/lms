"use client"

import { PremiumDataTable } from "@/components/tables/PremiumDataTable"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Plus, Eye, Edit, Users } from "lucide-react"

interface Training {
  id: string
  name: string
  category: string
  trainer: string
  participants: number
  progress: number
  status: string
  startDate: string
  endDate: string
}

const trainings: Training[] = [
  {
    id: "1",
    name: "Salesforce Lightning",
    category: "Technical",
    trainer: "John Doe",
    participants: 45,
    progress: 75,
    status: "In Progress",
    startDate: "2024-01-15",
    endDate: "2024-03-15"
  },
  {
    id: "2",
    name: "Leadership Development",
    category: "Soft Skills",
    trainer: "Jane Smith",
    participants: 32,
    progress: 90,
    status: "In Progress",
    startDate: "2024-01-20",
    endDate: "2024-04-20"
  },
  {
    id: "3",
    name: "Data Analytics",
    category: "Technical",
    trainer: "Mike Johnson",
    participants: 28,
    progress: 45,
    status: "Upcoming",
    startDate: "2024-02-01",
    endDate: "2024-05-01"
  }
]

const columns = [
  {
    accessorKey: "name",
    header: "Training Program",
    cell: (row: Training) => (
      <div>
        <div className="font-medium">{row.name}</div>
        <div className="text-xs text-muted-foreground">{row.category}</div>
      </div>
    ),
  },
  {
    accessorKey: "trainer",
    header: "Trainer",
  },
  {
    accessorKey: "participants",
    header: "Participants",
    cell: (row: Training) => (
      <div className="flex items-center gap-2">
        <Users className="h-4 w-4 text-muted-foreground" />
        {row.participants}
      </div>
    ),
  },
  {
    accessorKey: "progress",
    header: "Progress",
    cell: (row: Training) => {
      const progress = row.progress
      return (
        <div className="flex items-center gap-3">
          <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
            <div className="h-full bg-primary rounded-full" style={{ width: `${progress}%` }} />
          </div>
          <span className="text-sm font-medium">{progress}%</span>
        </div>
      )
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: (row: Training) => (
      <Badge variant={row.status === "In Progress" ? "default" : "secondary"}>
        {row.status}
      </Badge>
    ),
  },
  {
    id: "actions",
    header: "Actions",
    cell: () => (
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon">
          <Eye className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon">
          <Edit className="h-4 w-4" />
        </Button>
      </div>
    ),
  },
]

export function TrainingPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Training Programs</h1>
          <p className="text-muted-foreground">Manage all training initiatives</p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          New Training
        </Button>
      </div>

      <PremiumDataTable columns={columns} data={trainings} searchPlaceholder="Search trainings..." />
    </div>
  )
}