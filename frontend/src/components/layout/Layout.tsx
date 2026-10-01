"use client"

import { cn } from "@/lib/utils"

interface LayoutProps {
  children: React.ReactNode
  sidebarOpen: boolean
}

export function Layout({ children, sidebarOpen }: LayoutProps) {
  return (
    <div className={cn("min-h-screen bg-background", sidebarOpen && "overflow-hidden")}>
      {children}
    </div>
  )
}