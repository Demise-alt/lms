"use client"

import { GlassCard } from "@/components/ui/GlassCard"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import {
  Settings,
  User,
  Shield,
  Bell,
  Moon,
  Sun,
  Globe,
  Trash2,
  CheckCircle2
} from "lucide-react"
import { useTheme } from "next-themes"
import { useState } from "react"

export function SettingsPage() {
  const { theme, setTheme } = useTheme()
  const [notificationsEnabled, setNotificationsEnabled] = useState(true)
  const [emailUpdates, setEmailUpdates] = useState(true)
  const [securityNotifications, setSecurityNotifications] = useState(true)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-muted-foreground">Manage your account preferences</p>
        </div>
        <Button variant="outline" size="sm">
          <Globe className="h-4 w-4 mr-2" />
          Language
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <GlassCard title="Account">
          <div className="space-y-4">
            <div className="flex items-start justify-between p-3 rounded-xl bg-white/5">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <User className="h-4 w-4" />
                </div>
                <div>
                  <div className="font-medium">John Doe</div>
                  <div className="text-sm text-muted-foreground">john.doe@company.com</div>
                </div>
              </div>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Settings className="h-4 w-4" />
              </Button>
            </div>

            <div className="space-y-3">
              <div className="flex items-start justify-between p-3 rounded-xl bg-white/5">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-blue-500/20">
                    <Shield className="h-4 w-4 text-blue-500" />
                  </div>
                  <div>
                    <div className="font-medium">Password</div>
                    <div className="text-sm text-muted-foreground">Update your password</div>
                  </div>
                </div>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <CheckCircle2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </GlassCard>

        <GlassCard title="Preferences">
          <div className="space-y-4">
            <div className="flex items-start justify-between p-3 rounded-xl bg-white/5">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Moon className={theme === "dark" ? "h-4 w-4" : "h-4 w-4 opacity-50"} />
                  <Sun className={theme === "light" ? "h-4 w-4" : "h-4 w-4 opacity-50"} />
                </div>
                <div>
                  <div className="font-medium">Appearance</div>
                  <div className="text-sm text-muted-foreground">Theme settings</div>
                </div>
              </div>
              <Switch
                checked={theme === "dark"}
                onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
                className="ml-4"
              />
            </div>

            <div className="flex items-start justify-between p-3 rounded-xl bg-white/5">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-yellow-500/20">
                  <Bell className="h-4 w-4 text-yellow-500" />
                </div>
                <div>
                  <div className="font-medium">Language & Region</div>
                  <div className="text-sm text-muted-foreground">English (United States)</div>
                </div>
              </div>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Globe className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </GlassCard>
      </div>

      <GlassCard title="Notifications">
        <div className="space-y-4">
          <div className="flex items-start justify-between p-3 rounded-xl bg-white/5">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-purple-500/20">
                <Bell className="h-4 w-4 text-purple-500" />
              </div>
              <div>
                <div className="font-medium">Email Notifications</div>
                <div className="text-sm text-muted-foreground">Receive updates via email</div>
              </div>
            </div>
            <Switch checked={emailUpdates} onCheckedChange={setEmailUpdates} className="ml-4" />
          </div>

          <div className="flex items-start justify-between p-3 rounded-xl bg-white/5">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-purple-500/20">
                <Bell className="h-4 w-4 text-purple-500" />
              </div>
              <div>
                <div className="font-medium">In-App Notifications</div>
                <div className="text-sm text-muted-foreground">Get notified within the app</div>
              </div>
            </div>
            <Switch checked={notificationsEnabled} onCheckedChange={setNotificationsEnabled} className="ml-4" />
          </div>

          <div className="flex items-start justify-between p-3 rounded-xl bg-white/5">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-purple-500/20">
                <Shield className="h-4 w-4 text-purple-500" />
              </div>
              <div>
                <div className="font-medium">Security Alerts</div>
                <div className="text-sm text-muted-foreground">Security-related notifications</div>
              </div>
            </div>
            <Switch checked={securityNotifications} onCheckedChange={setSecurityNotifications} className="ml-4" />
          </div>
        </div>
      </GlassCard>

      <GlassCard title="Danger Zone">
        <div className="space-y-4">
          <div className="flex items-start justify-between p-3 rounded-xl bg-white/5">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-red-500/20">
                <Trash2 className="h-4 w-4 text-red-500" />
              </div>
              <div>
                <div className="font-medium">Delete Account</div>
                <div className="text-sm text-muted-foreground">This action cannot be undone</div>
              </div>
            </div>
            <Button variant="destructive" size="sm">
              Delete Account
            </Button>
          </div>
        </div>
      </GlassCard>
    </div>
  )
}