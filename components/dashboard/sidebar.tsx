"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { AnimatedLogo } from "@/components/ui/animated-logo"
import {
  ChevronLeft,
  ChevronRight,
  LogOut
} from "lucide-react"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

// Using Emojis as requested, with the new color system
const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: "📊", color: "text-blue-500", bgColor: "bg-blue-500/10", hoverBg: "hover:bg-blue-500/20", activeBg: "bg-blue-500", shadow: "shadow-blue-500/20" },
  { label: "Assessments", href: "/dashboard/assessments", icon: "📋", color: "text-violet-500", bgColor: "bg-violet-500/10", hoverBg: "hover:bg-violet-500/20", activeBg: "bg-violet-500", shadow: "shadow-violet-500/20" },
  { label: "Journal", href: "/dashboard/journal", icon: "📝", color: "text-amber-500", bgColor: "bg-amber-500/10", hoverBg: "hover:bg-amber-500/20", activeBg: "bg-amber-500", shadow: "shadow-amber-500/20" },
  { label: "Mood Tracker", href: "/dashboard/mood", icon: "😊", color: "text-yellow-500", bgColor: "bg-yellow-500/10", hoverBg: "hover:bg-yellow-500/20", activeBg: "bg-yellow-500", shadow: "shadow-yellow-500/20" },
  { label: "Exercises", href: "/dashboard/exercises", icon: "🧘", color: "text-emerald-500", bgColor: "bg-emerald-500/10", hoverBg: "hover:bg-emerald-500/20", activeBg: "bg-emerald-500", shadow: "shadow-emerald-500/20" },
  { label: "Appointments", href: "/dashboard/appointments", icon: "📅", color: "text-pink-500", bgColor: "bg-pink-500/10", hoverBg: "hover:bg-pink-500/20", activeBg: "bg-pink-500", shadow: "shadow-pink-500/20" },
  { label: "MindCare AI", href: "/dashboard/chatbot", icon: "🧠", color: "text-cyan-500", bgColor: "bg-cyan-500/10", hoverBg: "hover:bg-cyan-500/20", activeBg: "bg-cyan-500", shadow: "shadow-cyan-500/20" },
  { label: "Resources", href: "/dashboard/resources", icon: "📚", color: "text-indigo-500", bgColor: "bg-indigo-500/10", hoverBg: "hover:bg-indigo-500/20", activeBg: "bg-indigo-500", shadow: "shadow-indigo-500/20" },
  { label: "Profile", href: "/dashboard/profile", icon: "⚙️", color: "text-slate-500", bgColor: "bg-slate-500/10", hoverBg: "hover:bg-slate-500/20", activeBg: "bg-slate-500", shadow: "shadow-slate-500/20" },
]

export function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [isCollapsed, setIsCollapsed] = useState(false)

  const handleLogout = async () => {
    setIsLoading(true)
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/")
  }

  return (
    <div
      className={`${isCollapsed ? "w-20" : "w-72"} bg-card/95 backdrop-blur-xl border-r border-border flex flex-col shadow-2xl transition-all duration-300 ease-in-out relative z-50 h-full`}
    >
      {/* Collapse Toggle Button */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-10 bg-primary text-primary-foreground border-2 border-background rounded-full p-1.5 shadow-lg hover:scale-110 transition-all z-50"
      >
        {isCollapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronLeft className="w-3 h-3" />}
      </button>

      <div className={`p-6 border-b border-border/50 flex items-center ${isCollapsed ? "justify-center px-2" : ""}`}>
        {isCollapsed ? (
          <div className="relative shrink-0 group">
            <div className="absolute inset-0 bg-primary/30 blur-xl rounded-full animate-pulse group-hover:bg-primary/50 transition-colors" />
            <img src="/logo.png" alt="MindCare AI" className="w-12 h-12 object-contain drop-shadow-xl relative z-10" />
          </div>
        ) : (
          <AnimatedLogo size="lg" showSubtitle={true} />
        )}
      </div>

      <TooltipProvider delayDuration={0}>
        <nav className="flex-1 overflow-y-auto p-4 space-y-2 no-scrollbar">
          {navItems.map((item) => {
            const isActive = pathname === item.href

            const LinkContent = (
              <div
                className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-300 group relative overflow-hidden ${isActive
                  ? `bg-background shadow-sm border border-border/50`
                  : "hover:bg-muted/50"
                  } ${isCollapsed ? "justify-center px-0" : ""}`}
              >

                {/* Icon Container with dynamic color */}
                <div className={`relative z-10 flex items-center justify-center w-8 h-8 rounded-lg transition-all duration-300 ${isActive ? `${item.activeBg} text-white shadow-md scale-110` : `${item.bgColor} group-hover:scale-110`}`}>
                  <span className={`text-lg leading-none filter drop-shadow-sm ${isActive ? "brightness-125" : ""}`}>
                    {item.icon}
                  </span>
                </div>

                {!isCollapsed && (
                  <span className={`relative z-10 text-sm font-medium whitespace-nowrap overflow-hidden transition-all ${isActive ? "text-foreground font-semibold" : "text-muted-foreground group-hover:text-foreground"}`}>
                    {item.label}
                  </span>
                )}

                {/* Active Indicator Line */}
                {isActive && !isCollapsed && (
                  <div className={`ml-auto w-1.5 h-1.5 rounded-full ${item.activeBg} ${item.shadow} animate-pulse relative z-10`} />
                )}
              </div>
            )

            return (
              <Link key={item.href} href={item.href}>
                {isCollapsed ? (
                  <Tooltip delayDuration={0}>
                    <TooltipTrigger asChild>
                      {LinkContent}
                    </TooltipTrigger>
                    <TooltipContent side="right" className={`font-medium ${item.activeBg} text-white border-none ml-2`}>
                      {item.label}
                    </TooltipContent>
                  </Tooltip>
                ) : (
                  LinkContent
                )}
              </Link>
            )
          })}
        </nav>
      </TooltipProvider>

      <div className="p-4 border-t border-border/50 bg-muted/5">
        <TooltipProvider>
          {isCollapsed ? (
            <Tooltip delayDuration={0}>
              <TooltipTrigger asChild>
                <Button
                  onClick={handleLogout}
                  disabled={isLoading}
                  variant="ghost"
                  size="icon"
                  className="w-full h-10 hover:bg-destructive/10 hover:text-destructive transition-colors rounded-xl"
                >
                  {isLoading ? <span className="animate-spin text-xs">⌛</span> : <LogOut className="w-5 h-5" />}
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right" className="bg-destructive text-destructive-foreground font-medium ml-2">Sign Out</TooltipContent>
            </Tooltip>
          ) : (
            <Button
              onClick={handleLogout}
              disabled={isLoading}
              variant="outline"
              className="w-full justify-start gap-3 border-border/50 hover:bg-destructive/10 hover:text-destructive hover:border-destructive/50 transition-all rounded-xl h-11"
            >
              <div className="w-8 h-8 rounded-lg bg-destructive/10 flex items-center justify-center text-destructive">
                <LogOut className="w-4 h-4" />
              </div>
              {isLoading ? "Signing out..." : "Sign Out"}
            </Button>
          )}
        </TooltipProvider>
      </div>
    </div>
  )
}
