"use client"

import { GlassCard } from "@/components/ui/GlassCard"
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area
} from "recharts"
import { TrendingUp } from "lucide-react"

const colors = {
  primary: "#6366f1",
  success: "#10b981",
  warning: "#f59e0b",
  danger: "#ef4444",
  info: "#3b82f6"
}

export function TrainingCompletionTrend() {
  const data = [
    { month: "Jan", completion: 65, attendance: 72 },
    { month: "Feb", completion: 68, attendance: 75 },
    { month: "Mar", completion: 72, attendance: 78 },
    { month: "Apr", completion: 75, attendance: 80 },
    { month: "May", completion: 78, attendance: 82 },
    { month: "Jun", completion: 82, attendance: 85 },
  ]

  return (
    <GlassCard title="Training Completion Trend" description="6-month completion rates">
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="completionGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={colors.primary} stopOpacity={0.3}/>
                <stop offset="95%" stopColor={colors.primary} stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis dataKey="month" stroke="rgba(255,255,255,0.5)" />
            <YAxis stroke="rgba(255,255,255,0.5)" />
            <Tooltip
              contentStyle={{
                backgroundColor: "rgba(255,255,255,0.9)",
                border: "1px solid rgba(255,255,255,0.2)",
                borderRadius: "12px",
                backdropFilter: "blur(10px)"
              }}
            />
            <Area
              type="monotone"
              dataKey="completion"
              stroke={colors.primary}
              strokeWidth={3}
              fill="url(#completionGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </GlassCard>
  )
}

export function DepartmentCompletion() {
  const data = [
    { name: "Engineering", value: 92, color: colors.primary },
    { name: "Sales", value: 85, color: colors.success },
    { name: "Marketing", value: 78, color: colors.info },
    { name: "HR", value: 95, color: colors.warning },
    { name: "Operations", value: 88, color: colors.danger },
  ]

  return (
    <GlassCard title="Department Completion" description="Completion by department">
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis type="number" stroke="rgba(255,255,255,0.5)" />
            <YAxis dataKey="name" type="category" stroke="rgba(255,255,255,0.5)" width={100} />
            <Tooltip
              contentStyle={{
                backgroundColor: "rgba(255,255,255,0.9)",
                border: "1px solid rgba(255,255,255,0.2)",
                borderRadius: "12px",
                backdropFilter: "blur(10px)"
              }}
            />
            <Bar dataKey="value" radius={[0, 12, 12, 0]}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </GlassCard>
  )
}

export function AssessmentPerformance() {
  const data = [
    { name: "Pre-Test", avg: 62, max: 85, min: 35 },
    { name: "Post-Test", avg: 84, max: 98, min: 55 },
  ]

  return (
    <GlassCard title="Pre vs Post Test" description="Learning improvement metrics">
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-6">
          {data.map((item, i) => (
            <div key={i} className="text-center">
              <div className="text-4xl font-bold text-foreground mb-2">{item.avg}%</div>
              <div className="text-sm text-muted-foreground">{item.name}</div>
              <div className="flex items-center justify-center gap-4 mt-2 text-xs text-muted-foreground">
                <span>Max: {item.max}%</span>
                <span>Min: {item.min}%</span>
              </div>
            </div>
          ))}
        </div>
        <div className="relative h-2 bg-muted rounded-full overflow-hidden">
          <div className="absolute inset-0 flex items-center">
            <TrendingUp className="h-4 w-4 text-emerald-500 ml-2" />
          </div>
          <div className="absolute left-[62%] right-0 top-0 bottom-0 bg-gradient-to-r from-emerald-500 to-emerald-600 opacity-50" />
        </div>
        <p className="text-center text-sm text-muted-foreground">
          Average improvement: <span className="font-semibold text-emerald-600">+22%</span>
        </p>
      </div>
    </GlassCard>
  )
}

export function CertificationStatus() {
  const data = [
    { name: "Active", value: 1247, color: colors.success },
    { name: "Expiring", value: 89, color: colors.warning },
    { name: "Expired", value: 34, color: colors.danger },
  ]

  return (
    <GlassCard title="Certificate Status" description="Current certification metrics">
      <div className="grid grid-cols-2 gap-6 items-center">
        <div className="h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(255,255,255,0.9)",
                  border: "1px solid rgba(255,255,255,0.2)",
                  borderRadius: "12px",
                  backdropFilter: "blur(10px)"
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="space-y-3">
          {data.map((item, i) => (
            <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-white/5">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-sm font-medium">{item.name}</span>
              </div>
              <span className="text-lg font-bold">{item.value}</span>
            </div>
          ))}
        </div>
      </div>
    </GlassCard>
  )
}
