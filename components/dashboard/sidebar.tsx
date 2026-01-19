"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"

const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: "📊" },
  { label: "Assessments", href: "/dashboard/assessments", icon: "📋" },
  { label: "Journal", href: "/dashboard/journal", icon: "📝" },
  { label: "Mood Tracker", href: "/dashboard/mood", icon: "😊" },
  { label: "Exercises (Premium)", href: "/dashboard/exercises", icon: "🧘" },
  { label: "Appointments", href: "/dashboard/appointments", icon: "📅" },
  { label: "Resources", href: "/dashboard/resources", icon: "📚" },
  { label: "Profile", href: "/dashboard/profile", icon: "⚙️" },
]

export function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const handleLogout = async () => {
    setIsLoading(true)
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/")
  }

  return (
    <div className="w-64 bg-background border-r border-border flex flex-col shadow-sm transition-colors duration-300">
      <div className="p-6 border-b border-border">
        <div className="flex items-center gap-2 mb-1">
          <img src="/logo.png" alt="MindCare AI" className="w-10 h-10 object-contain" />
          <h1 className="text-2xl font-bold text-foreground tracking-tight">MindCare AI</h1>
        </div>
        <p className="text-xs text-muted-foreground">Your wellness companion</p>
      </div>

      <nav className="flex-1 overflow-y-auto p-4 space-y-2 no-scrollbar">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link key={item.href} href={item.href}>
              <div
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group ${isActive
                  ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
              >
                <span className={`text-xl transition-transform group-hover:scale-110 ${isActive ? "" : "opacity-80"}`}>{item.icon}</span>
                <span className="text-sm font-medium">{item.label}</span>
              </div>
            </Link>
          )
        })}
      </nav>

      <div className="p-4 border-t border-border">
        <Button
          onClick={handleLogout}
          disabled={isLoading}
          variant="outline"
          className="w-full border-border text-foreground hover:bg-destructive/10 hover:text-destructive hover:border-destructive/50 transition-all"
        >
          {isLoading ? "Signing out..." : "Sign Out"}
        </Button>
      </div>
    </div>
  )
}
