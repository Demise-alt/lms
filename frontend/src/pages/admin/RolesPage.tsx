"use client"

import { GlassCard } from "@/components/ui/GlassCard"
import { Badge } from "@/components/ui/badge"
import { Shield, Users, Settings, BarChart3 } from "lucide-react"

const roles = [
  {
    name: "Super Admin",
    description: "Full system access and control",
    permissions: ["All modules", "User management", "System settings"],
    users: 2,
    icon: Shield,
    color: "from-red-500 to-pink-500"
  },
  {
    name: "HR Admin",
    description: "Manage employees and training programs",
    permissions: ["Employees", "Trainings", "Reports"],
    users: 12,
    icon: Users,
    color: "from-blue-500 to-indigo-500"
  },
  {
    name: "Trainer",
    description: "Deliver training and assess employees",
    permissions: ["Courses", "Sessions", "Assessments"],
    users: 45,
    icon: Settings,
    color: "from-emerald-500 to-teal-500"
  },
  {
    name: "Manager",
    description: "Oversee team training progress",
    permissions: ["Team view", "Reports", "Analytics"],
    users: 89,
    icon: BarChart3,
    color: "from-purple-500 to-pink-500"
  }
]

export function RolesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Roles & Permissions</h1>
        <p className="text-muted-foreground">Manage user roles and access control</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {roles.map((role, i) => (
          <GlassCard key={i} hoverable className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className={`p-3 rounded-2xl bg-gradient-to-br ${role.color}`}>
                <role.icon className="h-6 w-6 text-white" />
              </div>
              <Badge variant="outline">{role.users} users</Badge>
            </div>

            <h3 className="text-xl font-semibold mb-2">{role.name}</h3>
            <p className="text-sm text-muted-foreground mb-4">{role.description}</p>

            <div>
              <h4 className="text-sm font-medium mb-2">Permissions</h4>
              <div className="flex flex-wrap gap-2">
                {role.permissions.map((perm, idx) => (
                  <Badge key={idx} variant="secondary" className="text-xs">
                    {perm}
                  </Badge>
                ))}
              </div>
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  )
}
