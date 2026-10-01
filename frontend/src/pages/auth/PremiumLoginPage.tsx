"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { toast } from "@/hooks/use-toast"
import { useAuthStore } from "@/hooks/use-auth-store"
import { GraduationCap, Eye, EyeOff, Loader2, Shield, Users, BarChart3 } from "lucide-react"

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  rememberMe: z.boolean().optional(),
})

type LoginFormData = z.infer<typeof loginSchema>

export function PremiumLoginPage() {
  const navigate = useNavigate()
  const { login, isLoading: authLoading } = useAuthStore()
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      rememberMe: false,
    },
  })

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true)
    try {
      await login(data.email, data.password)
      toast({
        title: "Welcome back!",
        description: "You have successfully logged in.",
      })
      navigate("/dashboard")
    } catch (error: unknown) {
      const axiosError = error as { response?: { data?: { error?: { message?: string } } } }
      toast({
        variant: "destructive",
        title: "Login failed",
        description: axiosError.response?.data?.error?.message || "Invalid email or password",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Left side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-700" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAwIiBoZWlnaHQ9IjYwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZmlsdGVyIGlkPSJhIj48ZmVUdXJidWxlbmNlIHR5cGU9ImZyYWN0YWxOb2lzZSIgYmFzZUZyZXF1ZW5jeT0iLjc1IiBzdGl0Y2hUaWxlcz0ic3RpdGNoIi8+PC9maWx0ZXI+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsdGVyPSJ1cmwoI2EpIiBvcGFjaXR5PSIuMDUiLz48L3N2Zz4=')] opacity-20" />
        <div className="relative z-10 flex flex-col justify-center items-center p-16 text-white">
          <div className="max-w-md">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-4 bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20">
                <GraduationCap className="h-10 w-10" />
              </div>
              <h1 className="text-4xl font-bold">ELTMS</h1>
            </div>

            <h2 className="text-5xl font-bold mb-6 leading-tight">
              Enterprise Learning & Training Management System
            </h2>

            <p className="text-xl text-white/80 mb-12 leading-relaxed">
              Empowering organizations with premium learning experiences, intelligent analytics, and seamless training operations at scale.
            </p>

            <div className="grid gap-4">
              {[
                { icon: Shield, title: "Enterprise Grade", desc: "SOC 2 compliant, secure, scalable" },
                { icon: Users, title: "10,000+ Employees", desc: "Trusted by Fortune 500 companies" },
                { icon: BarChart3, title: "Advanced Analytics", desc: "Data-driven learning insights" }
              ].map((feature, i) => (
                <div key={i} className="flex items-center gap-4 p-4 bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 hover:bg-white/20 transition-all">
                  <feature.icon className="h-6 w-6 flex-shrink-0" />
                  <div>
                    <div className="font-semibold">{feature.title}</div>
                    <div className="text-sm text-white/70">{feature.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Login Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <Card className="p-8 glass-panel shadow-xl border-white/30">
            <div className="text-center mb-8">
              <div className="inline-flex p-4 bg-primary/10 rounded-2xl mb-4">
                <GraduationCap className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-2xl font-bold">Welcome Back</h3>
              <p className="text-muted-foreground mt-2">Sign in to your enterprise account</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@enterprise.com"
                  {...register("email")}
                  disabled={isLoading || authLoading}
                  aria-invalid={!!errors.email}
                  className="h-12 bg-background/50 border-white/20 backdrop-blur-sm focus:border-primary"
                />
                {errors.email && (
                  <p className="text-sm text-destructive">{errors.email.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-sm font-medium">Password</Label>
                  <button type="button" className="text-sm text-primary hover:underline">
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    {...register("password")}
                    disabled={isLoading || authLoading}
                    aria-invalid={!!errors.password}
                    className="h-12 bg-background/50 border-white/20 backdrop-blur-sm focus:border-primary pr-12"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-2 hover:bg-muted rounded"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-sm text-destructive">{errors.password.message}</p>
                )}
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    id="rememberMe"
                    type="checkbox"
                    {...register("rememberMe")}
                    className="h-4 w-4 rounded border-white/20 bg-background/50"
                  />
                  <span className="text-sm">Remember me</span>
                </label>
              </div>

              <Button
                type="submit"
                className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-medium rounded-xl shadow-lg hover:shadow-xl transition-all"
                disabled={isLoading || authLoading}
              >
                {isLoading || authLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  "Sign In"
                )}
              </Button>
            </form>

            <div className="mt-8 pt-6 border-t border-white/20">
              <p className="text-xs text-muted-foreground text-center mb-4">Demo Credentials</p>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-3 bg-muted/50 rounded-lg">
                  <div className="font-medium">Admin</div>
                  <div className="text-muted-foreground">admin@eltms.com</div>
                </div>
                <div className="p-3 bg-muted/50 rounded-lg">
                  <div className="font-medium">HR</div>
                  <div className="text-muted-foreground">hr@eltms.com</div>
                </div>
                <div className="p-3 bg-muted/50 rounded-lg">
                  <div className="font-medium">Trainer</div>
                  <div className="text-muted-foreground">trainer@eltms.com</div>
                </div>
                <div className="p-3 bg-muted/50 rounded-lg">
                  <div className="font-medium">Employee</div>
                  <div className="text-muted-foreground">employee@eltms.com</div>
                </div>
              </div>
            </div>
          </Card>

          <p className="text-center text-xs text-muted-foreground mt-6">
            Enterprise Learning & Training Management System v1.0.0
          </p>
        </div>
      </div>
    </div>
  )
}