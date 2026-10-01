"use client"

import * as React from "react"
import { PageContainer } from "@/components/layout/PageContainer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Users, BookOpen, Award, TrendingUp, ArrowUpRight, ArrowDownRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { useDashboardAnalytics, useEnrollmentTrends, useCompletionRates, useDepartmentAnalytics } from "@/hooks/useAnalytics"

interface StatCardProps {
  title: string
  value: string | number
  change?: string
  changeType?: "up" | "down"
  icon: React.ReactNode
  color: string
}

function StatCard({ title, value, change, changeType, icon, color }: StatCardProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-3xl font-bold text-foreground mt-1">{value}</p>
            {change && (
              <p className={cn(
                "text-sm mt-1 flex items-center gap-1",
                changeType === "up" ? "text-green-600" : "text-red-600"
              )}>
                {changeType === "up" ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
                <span>{change}</span>
              </p>
            )}
          </div>
          <div className={cn("p-3 rounded-xl", color)}>
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export function AnalyticsPage() {
  const [activeTab, setActiveTab] = React.useState("overview")

  const { data: dashboard, isLoading: dashboardLoading } = useDashboardAnalytics()
  const { data: enrollmentTrends, isLoading: trendsLoading } = useEnrollmentTrends(6)
  const { data: completionRates, isLoading: ratesLoading } = useCompletionRates()
  const { data: departmentData, isLoading: deptLoading } = useDepartmentAnalytics()

  const isLoading = dashboardLoading || trendsLoading || ratesLoading || deptLoading

  if (isLoading) {
    return (
      <PageContainer title="Analytics" description="Training analytics and insights">
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      </PageContainer>
    )
  }

  return (
    <PageContainer title="Analytics" description="Training analytics and insights">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
        <StatCard
          title="Total Enrollments"
          value={dashboard?.total_enrollments ?? 0}
          change="+12%"
          changeType="up"
          icon={<Users className="h-6 w-6 text-white" />}
          color="bg-blue-500"
        />
        <StatCard
          title="Active Trainings"
          value={dashboard?.active_trainings ?? 0}
          change="+3"
          changeType="up"
          icon={<BookOpen className="h-6 w-6 text-white" />}
          color="bg-green-500"
        />
        <StatCard
          title="Avg Completion Rate"
          value={`${dashboard?.avg_completion_rate ?? 0}%`}
          change="+5%"
          changeType="up"
          icon={<TrendingUp className="h-6 w-6 text-white" />}
          color="bg-purple-500"
        />
        <StatCard
          title="Certificates Issued"
          value={dashboard?.certificates_issued ?? 0}
          change="+23"
          changeType="up"
          icon={<Award className="h-6 w-6 text-white" />}
          color="bg-yellow-500"
        />
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="enrollments">Enrollments</TabsTrigger>
          <TabsTrigger value="departments">By Department</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Enrollment & Completion Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="bg-white rounded-lg shadow p-6">
                    <h3 className="font-semibold mb-4">Enrollment Trends</h3>
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Month</TableHead>
                            <TableHead>Enrollments</TableHead>
                            <TableHead>Completions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {enrollmentTrends?.map((data, index) => (
                            <TableRow key={index} className="hover:bg-gray-50">
                              <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{data.month}</TableCell>
                              <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{data.enrollments}</TableCell>
                              <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{data.completions}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg shadow p-6">
                    <h3 className="font-semibold mb-4">Completion Rate</h3>
                    <div className="space-y-3">
                      {completionRates?.map((item, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-700">{item.name}</span>
                          <div className="flex-1 bg-gray-200 rounded-full h-2.5">
                            <div className={cn(
                              "h-2.5 rounded-full bg-primary",
                              { width: `${(item.value / 100) * 100}%` }
                            )} />
                          </div>
                          <span className="text-sm font-medium text-gray-900">{item.value}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="enrollments">
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Monthly Enrollment Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="font-semibold mb-4">Enrollment Data</h3>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Month</TableHead>
                          <TableHead>Enrollments</TableHead>
                          <TableHead>Completions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {enrollmentTrends?.map((data, index) => (
                          <TableRow key={index} className="hover:bg-gray-50">
                            <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{data.month}</TableCell>
                            <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{data.enrollments}</TableCell>
                            <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{data.completions}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="departments">
          <Card>
            <CardHeader>
              <CardTitle>Completion Rate by Department</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Department</TableHead>
                      <TableHead>Employees</TableHead>
                      <TableHead>Avg Completion</TableHead>
                      <TableHead>Trend</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {departmentData?.map((dept, index) => (
                      <TableRow key={index} className="hover:bg-gray-50">
                        <TableCell className="px-6 py-4 whitespace-nowrap text-sm font-medium">{dept.department}</TableCell>
                        <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{dept.employees}</TableCell>
                        <TableCell className="px-6 py-4 whitespace-nowrap text-sm">
                          <div className="flex items-center">
                            <div className="w-20 bg-gray-200 rounded-full h-2.5">
                              <div className={cn(
                                "h-2.5 rounded-full bg-primary",
                                { width: `${(dept.avg_completion / 100) * 100}%` }
                              )} />
                            </div>
                            <span className="ml-2 text-sm font-medium">{dept.avg_completion}%</span>
                          </div>
                        </TableCell>
                        <TableCell className="px-6 py-4 whitespace-nowrap text-sm">
                          <span className={cn(
                            "px-2 inline-flex text-xs leading-5 font-semibold rounded-full",
                            dept.avg_completion >= 80 ? "bg-green-100 text-green-800" :
                            dept.avg_completion >= 70 ? "bg-yellow-100 text-yellow-800" : "bg-red-100 text-red-800"
                          )}>
                            {dept.avg_completion >= 80 ? "Excellent" : dept.avg_completion >= 70 ? "Good" : "Needs Improvement"}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </PageContainer>
  )
}