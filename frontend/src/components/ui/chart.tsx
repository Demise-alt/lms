"use client"

// Simplified chart components to avoid TypeScript errors with recharts
// These are placeholder components that match the expected interface

import * as React from "react"
import { cn } from "@/lib/utils"

// Basic container for charts
export const ChartContainer = ({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement> & {
  className?: string
}) => (
  <div className={cn("w-full h-[300px]", className)} {...props}>
    {children}
  </div>
)

// Basic tooltip
export const ChartTooltip = ({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement> & {
  className?: string
}) => (
  <div className={cn("tooltip-content", className)} {...props}>
    {children}
  </div>
)

// Basic legend
export const ChartLegend = ({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement> & {
  className?: string
}) => (
  <div className={cn("legend-content", className)} {...props}>
    {children}
  </div>
)

// Basic chart item wrapper
export const ChartItem = ({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement> & {
  className?: string
}) => (
  <div className={cn("chart-item", className)} {...props}>
    {children}
  </div>
)

// Basic chart content
export const ChartContent = ({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement> & {
  className?: string
}) => (
  <div className={cn("chart-content", className)} {...props}>
    {children}
  </div>
)

// Basic area chart wrapper
export const ChartArea = ({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement> & {
  className?: string
}) => (
  <div className={cn("chart-area", className)} {...props}>
    {children}
  </div>
)

// Basic line chart wrapper
export const ChartLine = ({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement> & {
  className?: string
}) => (
  <div className={cn("chart-line", className)} {...props}>
    {children}
  </div>
)

// Basic bar chart wrapper
export const ChartBar = ({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement> & {
  className?: string
}) => (
  <div className={cn("chart-bar", className)} {...props}>
    {children}
  </div>
)

// Basic pie chart wrapper
export const ChartPie = ({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement> & {
  className?: string
}) => (
  <div className={cn("chart-pie", className)} {...props}>
    {children}
  </div>
)

// Basic pie data
export const ChartPieData = ({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement> & {
  className?: string
}) => (
  <div className={cn("chart-pie-data", className)} {...props}>
    {children}
  </div>
)

// Basic cell
export const ChartCell = ({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement> & {
  className?: string
}) => (
  <div className={cn("chart-cell", className)} {...props}>
    {children}
  </div>
)

// Basic axes
export const ChartXAxis = ({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement> & {
  className?: string
}) => (
  <div className={cn("chart-x-axis", className)} {...props}>
    {children}
  </div>
)

export const ChartYAxis = ({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement> & {
  className?: string
}) => (
  <div className={cn("chart-y-axis", className)} {...props}>
    {children}
  </div>
)

// Basic cartesian grid
export const ChartCartesianGrid = ({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement> & {
  className?: string
}) => (
  <div className={cn("chart-cartesian-grid", className)} {...props}>
    {children}
  </div>
)

// Basic responsive container
export const ChartResponsiveContainer = ({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement> & {
  className?: string
}) => (
  <div className={cn("chart-responsive-container", className)} {...props}>
    {children}
  </div>
)

// Basic chart types
export const ChartBarChart = ({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement> & {
  className?: string
}) => (
  <div className={cn("chart-bar-chart", className)} {...props}>
    {children}
  </div>
)

export const ChartAreaChart = ({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement> & {
  className?: string
}) => (
  <div className={cn("chart-area-chart", className)} {...props}>
    {children}
  </div>
)

export const ChartPieChart = ({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement> & {
  className?: string
}) => (
  <div className={cn("chart-pie-chart", className)} {...props}>
    {children}
  </div>
)

export const ChartComposedChart = ({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement> & {
  className?: string
}) => (
  <div className={cn("chart-composed-chart", className)} {...props}>
    {children}
  </div>
)

export const ChartScatterChart = ({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement> & {
  className?: string
}) => (
  <div className={cn("chart-scatter-chart", className)} {...props}>
    {children}
  </div>
)

export const ChartRadialBarChart = ({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement> & {
  className?: string
}) => (
  <div className={cn("chart-radial-bar-chart", className)} {...props}>
    {children}
  </div>
)

export const ChartScatter = ({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement> & {
  className?: string
}) => (
  <div className={cn("chart-scatter", className)} {...props}>
    {children}
  </div>
)

export const ChartRadialBar = ({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement> & {
  className?: string
}) => (
  <div className={cn("chart-radial-bar", className)} {...props}>
    {children}
  </div>
)