"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface PageContainerProps {
  children: React.ReactNode
  className?: string
  title?: string
  description?: string
  action?: React.ReactNode
}

export function PageContainer({ children, className, title, description, action }: PageContainerProps) {
  return (
    <div className={cn("flex-1 overflow-auto bg-background", className)}>
      <div className="p-4 sm:p-6 lg:p-8">
        {(title || description || action) && (
          <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              {title && <h1 className="text-2xl font-bold tracking-tight text-foreground">{title}</h1>}
              {description && (
                <p className="mt-1 text-sm text-muted-foreground">{description}</p>
              )}
            </div>
            {action && <div className="mt-4 sm:mt-0">{action}</div>}
          </div>
        )}
        {children}
      </div>
    </div>
  )
}