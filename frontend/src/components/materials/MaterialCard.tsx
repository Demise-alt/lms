"use client"

import { GlassCard } from "@/components/ui/GlassCard"
import { Button } from "@/components/ui/button"
import { Download, Eye, FileText, FileImage, FileVideo } from "lucide-react"
import { cn } from "@/lib/utils"

interface MaterialCardProps {
  title: string
  description: string
  type: "pdf" | "video" | "document" | "image"
  size: string
  uploadedBy: string
  uploadedAt: string
  url: string
}

const getIcon = (type: string) => {
  switch (type) {
    case "pdf":
    case "document":
      return <FileText className="h-8 w-8" />
    case "video":
      return <FileVideo className="h-8 w-8" />
    case "image":
      return <FileImage className="h-8 w-8" />
    default:
      return <FileText className="h-8 w-8" />
  }
}

const getColor = (type: string) => {
  switch (type) {
    case "pdf":
    case "document":
      return "from-red-500 to-orange-500"
    case "video":
      return "from-purple-500 to-pink-500"
    case "image":
      return "from-blue-500 to-cyan-500"
    default:
      return "from-gray-500 to-gray-600"
  }
}

export function MaterialCard({
  title,
  description,
  type,
  size,
  uploadedBy
}: MaterialCardProps) {
  return (
    <GlassCard className="group">
      <div className="flex items-start gap-4">
        <div className={cn(
          "p-4 rounded-2xl bg-gradient-to-br text-white flex items-center justify-center",
          getColor(type)
        )}>
          {getIcon(type)}
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="font-semibold truncate">{title}</h3>
          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{description}</p>
          <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
            <span>{size}</span>
            <span>•</span>
            <span>By {uploadedBy}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 mt-4 pt-4 border-t border-white/10">
        <Button variant="ghost" size="sm" className="flex-1">
          <Eye className="h-4 w-4 mr-2" />
          Preview
        </Button>
        <Button variant="ghost" size="sm" className="flex-1">
          <Download className="h-4 w-4 mr-2" />
          Download
        </Button>
      </div>
    </GlassCard>
  )
}
