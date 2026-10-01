"use client"

import { Bell, Search, Moon, Sun, HelpCircle, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useAuthStore } from "@/hooks/use-auth-store"
import { useTheme } from "next-themes"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"

interface HeaderProps {
  onMenuClick: () => void
}

export function Header({ onMenuClick }: HeaderProps) {
  const { user, logout } = useAuthStore()
  const { theme, setTheme } = useTheme()

  return (
    <header className="sticky top-0 z-30 glass-panel border-b border-white/10">
      <div className="flex items-center justify-between h-16 px-6">
        {/* Left side - Search */}
        <div className="flex items-center gap-4 flex-1 max-w-md">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={onMenuClick}
          >
            <div className="w-5 h-5" />
          </Button>
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Global search..."
              className="pl-10 bg-background/50 border-white/20 backdrop-blur-sm h-10"
            />
          </div>
        </div>

        {/* Right side - Actions */}
        <div className="flex items-center gap-2">
          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="h-9 w-9 hover:bg-white/10"
          >
            {theme === "dark" ? (
              <Sun className="h-4 w-4" />
            ) : (
              <Moon className="h-4 w-4" />
            )}
          </Button>

          {/* Help */}
          <Button variant="ghost" size="icon" className="h-9 w-9 hover:bg-white/10">
            <HelpCircle className="h-4 w-4" />
          </Button>

          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-9 w-9 hover:bg-white/10 relative">
                <Bell className="h-4 w-4" />
                <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center bg-red-500 text-white text-xs">
                  3
                </Badge>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="glass w-80">
              <div className="p-4 border-b border-white/10">
                <h4 className="font-semibold">Notifications</h4>
              </div>
              <div className="p-2 space-y-2 max-h-96 overflow-y-auto">
                {[
                  { title: "Training Assigned", desc: "Salesforce Advanced training assigned", time: "2m ago", unread: true },
                  { title: "Session Reminder", desc: "Session starts in 30 minutes", time: "15m ago", unread: true },
                  { title: "Certificate Issued", desc: "Your certificate is ready", time: "1h ago", unread: false },
                ].map((notif, i) => (
                  <div key={i} className={`p-3 rounded-xl ${notif.unread ? "bg-primary/10" : "bg-muted/30"} hover:bg-muted/50 transition-colors`}>
                    <div className="font-medium text-sm">{notif.title}</div>
                    <div className="text-xs text-muted-foreground">{notif.desc}</div>
                    <div className="text-xs text-muted-foreground mt-1">{notif.time}</div>
                  </div>
                ))}
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-10 gap-3 hover:bg-white/10 px-3">
                <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center text-white font-semibold text-sm">
                  {user?.full_name?.charAt(0) || "U"}
                </div>
                <div className="hidden sm:block text-left">
                  <div className="text-sm font-medium leading-tight">{user?.full_name || "User"}</div>
                  <div className="text-xs text-muted-foreground leading-tight capitalize">
                    {user?.roles?.[0]?.replace("_", " ") || "Employee"}
                  </div>
                </div>
                <ChevronDown className="h-4 w-4 text-muted-foreground hidden sm:block" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="glass w-56">
              <DropdownMenuItem>My Profile</DropdownMenuItem>
              <DropdownMenuItem>Preferences</DropdownMenuItem>
              <DropdownMenuItem>Change Password</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => logout()} className="text-destructive">
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}