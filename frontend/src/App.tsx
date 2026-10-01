import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
import { Toaster } from "@/components/ui/toaster"
import { ThemeProvider } from "next-themes"
import { useAuthStore } from "@/hooks/use-auth-store"
import { Layout } from "@/components/layout/Layout"
import { Header } from "@/components/layout/Header"
import { Breadcrumb } from "@/components/layout/Breadcrumb"
import { PremiumLoginPage } from "@/pages/auth/PremiumLoginPage"
import { EmployeesPage } from "@/pages/employees/EmployeesPage"
import { DepartmentsPage } from "@/pages/departments/DepartmentsPage"
import { TrainingsPage } from "@/pages/trainings/TrainingsPage"
import { CoursesPage } from "@/pages/courses/CoursesPage"
import { SessionsPage } from "@/pages/sessions/SessionsPage"
import { AttendancePage } from "@/pages/attendance/AttendancePage"
import { AssessmentsPage } from "@/pages/assessments/AssessmentsPage"
import { AnalyticsPage } from "@/pages/analytics/AnalyticsPage"
import { CertificatesPage } from "@/pages/certificates/CertificatesPage"
import { SuperAdminDashboard } from "./pages/dashboard/SuperAdminDashboard"
import { HRAdminDashboard } from "./pages/dashboard/HRAdminDashboard"
import { TrainerDashboard } from "./pages/dashboard/TrainerDashboard"
import { ManagerDashboard } from "./pages/dashboard/ManagerDashboard"
import { EmployeeDashboard } from "./pages/dashboard/EmployeeDashboard"
import { SkillGapsPage } from "./pages/analytics/SkillGapsPage"
import { EffectivenessPage } from "./pages/analytics/EffectivenessPage"
import { ExpiringCertificatesPage } from "./pages/certificates/ExpiringPage"
import { PremiumSidebar } from "@/components/layout/PremiumSidebar"
import * as React from "react"

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
})

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading, checkAuth } = useAuthStore()

  React.useEffect(() => {
    checkAuth()
  }, [checkAuth])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return <>{children}</>
}

function RoleBasedDashboard() {
  const { user } = useAuthStore()
  const role = user?.roles[0] || "employee"

  switch (role) {
    case "super_admin":
      return <SuperAdminDashboard />
    case "hr_admin":
      return <HRAdminDashboard />
    case "trainer":
      return <TrainerDashboard />
    case "manager":
      return <ManagerDashboard />
    default:
      return <EmployeeDashboard />
  }
}

function AppRoutes() {
  const { isAuthenticated, isLoading } = useAuthStore()
  const [sidebarOpen, setSidebarOpen] = React.useState(false)

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    )
  }

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-background">
        {!isAuthenticated ? (
          <PremiumLoginPage />
        ) : (
          <Layout sidebarOpen={sidebarOpen}>
            <PremiumSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
            <div className="lg:pl-64 flex flex-col min-h-screen">
              <Header onMenuClick={() => setSidebarOpen(true)} />
              <main className="flex-1">
                <Breadcrumb />
                <Routes>
                  <Route path="/login" element={<PremiumLoginPage />} />
                  <Route path="/dashboard" element={
                    <PrivateRoute>
                      <RoleBasedDashboard />
                    </PrivateRoute>
                  } />
                  <Route path="/employees" element={
                    <PrivateRoute>
                      <EmployeesPage />
                    </PrivateRoute>
                  } />
                  <Route path="/employees/new" element={
                    <PrivateRoute>
                      {/* We'll create this later if needed */}
                      <Navigate to="/employees" replace />
                    </PrivateRoute>
                  } />
                  <Route path="/employees/:id" element={
                    <PrivateRoute>
                      {/* We'll create this later if needed */}
                      <Navigate to="/employees" replace />
                    </PrivateRoute>
                  } />
                  <Route path="/departments" element={
                    <PrivateRoute>
                      <DepartmentsPage />
                    </PrivateRoute>
                  } />
                  <Route path="/trainings" element={
                    <PrivateRoute>
                      <TrainingsPage />
                    </PrivateRoute>
                  } />
                  <Route path="/trainings/new" element={
                    <PrivateRoute>
                      {/* We'll create this later if needed */}
                      <Navigate to="/trainings" replace />
                    </PrivateRoute>
                  } />
                  <Route path="/trainings/:id" element={
                    <PrivateRoute>
                      {/* We'll create this later if needed */}
                      <Navigate to="/trainings" replace />
                    </PrivateRoute>
                  } />
                  <Route path="/courses" element={
                    <PrivateRoute>
                      <CoursesPage />
                    </PrivateRoute>
                  } />
                  <Route path="/sessions" element={
                    <PrivateRoute>
                      <SessionsPage />
                    </PrivateRoute>
                  } />
                  <Route path="/calendar" element={
                    <PrivateRoute>
                      <SessionsPage /> {/* Reusing sessions page for calendar view */}
                    </PrivateRoute>
                  } />
                  <Route path="/attendance" element={
                    <PrivateRoute>
                      <AttendancePage />
                    </PrivateRoute>
                  } />
                  <Route path="/assessments" element={
                    <PrivateRoute>
                      <AssessmentsPage />
                    </PrivateRoute>
                  } />
                  <Route path="/assessments/new" element={
                    <PrivateRoute>
                      {/* We'll create this later if needed */}
                      <Navigate to="/assessments" replace />
                    </PrivateRoute>
                  } />
                  <Route path="/assessments/:id" element={
                    <PrivateRoute>
                      {/* We'll create this later if needed */}
                      <Navigate to="/assessments" replace />
                    </PrivateRoute>
                  } />
                  <Route path="/assessments/:id/take" element={
                    <PrivateRoute>
                      {/* We'll create this later if needed */}
                      <Navigate to="/assessments" replace />
                    </PrivateRoute>
                  } />
                  <Route path="/assessments/:id/result" element={
                    <PrivateRoute>
                      {/* We'll create this later if needed */}
                      <Navigate to="/assessments" replace />
                    </PrivateRoute>
                  } />
                  <Route path="/analytics" element={
                    <PrivateRoute>
                      <AnalyticsPage />
                    </PrivateRoute>
                  } />
                  <Route path="/analytics/skill-gaps" element={
                    <PrivateRoute>
                      <SkillGapsPage />
                    </PrivateRoute>
                  } />
                  <Route path="/analytics/effectiveness" element={
                    <PrivateRoute>
                      <EffectivenessPage />
                    </PrivateRoute>
                  } />
                  <Route path="/certificates" element={
                    <PrivateRoute>
                      <CertificatesPage />
                    </PrivateRoute>
                  } />
                  <Route path="/certificates/expiring" element={
                    <PrivateRoute>
                      <ExpiringCertificatesPage />
                    </PrivateRoute>
                  } />
                  <Route path="*" element={<Navigate to="/dashboard" replace />} />
                </Routes>
              </main>
            </div>
          </Layout>
        )}
      </div>
      <Toaster />
    </BrowserRouter>
  )
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <AppRoutes />
      </ThemeProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}

export default App