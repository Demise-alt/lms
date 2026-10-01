"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { GlassCard } from "@/components/ui/GlassCard"

interface ColumnDef<TData> {
  accessorKey?: string
  header: string
  cell?: (row: TData) => React.ReactNode
}

interface PremiumDataTableProps<TData> {
  columns: ColumnDef<TData>[]
  data: TData[]
  searchPlaceholder?: string
}

export function PremiumDataTable<TData>({
  columns,
  data,
  searchPlaceholder = "Search...",
}: PremiumDataTableProps<TData>) {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredData = data.filter((row) => {
    const searchString = JSON.stringify(row).toLowerCase()
    return searchString.includes(searchTerm.toLowerCase())
  })

  return (
    <GlassCard className="overflow-hidden">
      <div className="p-6 pb-4">
        <div className="flex items-center justify-between">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={searchPlaceholder}
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              className="pl-9 bg-background/50 border-white/20"
            />
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/10">
              {columns.map((column) => (
                <th key={column.header} className="text-left p-4 font-semibold text-sm">
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredData.length > 0 ? (
              filteredData.map((row, rowIndex) => (
                <tr key={rowIndex} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  {columns.map((column, colIndex) => (
                    <td key={colIndex} className="p-4">
                      {column.cell ? column.cell(row) : String(row[column.accessorKey as keyof TData] ?? "")}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="h-24 text-center">
                  No results found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </GlassCard>
  )
}