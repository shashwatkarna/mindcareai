"use client"

import { useEffect, useState } from "react"
import { Moon, Sun, Bell, User, LogOut, Settings, Flame, Sparkles, BarChart, HelpCircle, Keyboard, Zap, ChevronDown, ArrowRight } from "lucide-react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"


import { StreakDisplay } from "@/components/dashboard/streak-display"
import { NotificationCenter } from "@/components/dashboard/notification-center"
import { NotificationData } from "@/actions/notifications"
import { FileText } from "lucide-react"

interface HeaderProps {
  userProfile?: {
    full_name?: string
    email?: string
    avatar_url?: string
    is_premium?: boolean
  }
  streakData?: {
    streak: number
    history: string[]
  }
  notificationData?: NotificationData
}

export function Header({ userProfile, streakData = { streak: 0, history: [] }, notificationData = { hasLoggedMood: false, hasJournaled: false, streak: 0 } }: HeaderProps) {
  const [isDark, setIsDark] = useState(false)
  const pathname = usePathname()

  // Generate breadcrumbs from pathname
  const pathSegments = pathname.split("/").filter((segment) => segment)
  const breadcrumbs = pathSegments.map((segment, index) => {
    const href = "/" + pathSegments.slice(0, index + 1).join("/")
    return {
      label: segment.charAt(0).toUpperCase() + segment.slice(1),
      href,
      isLast: index === pathSegments.length - 1,
    }
  })

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains("dark"))
  }, [])

  const toggleTheme = () => {
    const html = document.documentElement
    html.classList.toggle("dark")
    setIsDark(!isDark)
    localStorage.setItem("theme", isDark ? "light" : "dark")
  }

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    window.location.href = "/auth/login"
  }

  return (
    <header className="bg-background/80 backdrop-blur-md border-b border-border px-6 py-3 sticky top-0 z-10 transition-colors duration-300">
      <div className="flex items-center justify-between gap-4">
        {/* Left: Breadcrumbs */}
        <div className="flex flex-col gap-1 min-w-0">
          <Breadcrumb className="hidden md:flex">
            <BreadcrumbList>
              {breadcrumbs.map((crumb, index) => (
                <div key={crumb.href} className="flex items-center">
                  <BreadcrumbItem>
                    {crumb.isLast ? (
                      <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
                    ) : (
                      <BreadcrumbLink href={crumb.href}>{crumb.label}</BreadcrumbLink>
                    )}
                  </BreadcrumbItem>
                  {!crumb.isLast && <BreadcrumbSeparator />}
                </div>
              ))}
            </BreadcrumbList>
          </Breadcrumb>
          <div className="md:hidden font-semibold text-lg">
            {breadcrumbs[breadcrumbs.length - 1]?.label || "Dashboard"}
          </div>
        </div>

        {/* Right: Actions & Profile */}
        <div className="flex items-center gap-2 sm:gap-4 ml-auto">



          {/* Streak Indicator */}
          {/* Streak Indicator */}
          <StreakDisplay streak={streakData.streak} history={streakData.history} />

          {/* Notifications */}
          {/* Notifications */}
          <NotificationCenter data={notificationData} />

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-muted transition-colors duration-200 text-muted-foreground hover:text-foreground hidden sm:block"
            aria-label="Toggle theme"
          >
            {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>

          {/* Profile Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-10 w-auto rounded-full pl-0 pr-2 gap-2 hover:bg-muted/50 transition-all group">
                <div className="relative">
                  <Avatar className={`h-9 w-9 border-2 transition-all ${userProfile?.is_premium ? "border-yellow-500 shadow-[0_0_10px_rgba(234,179,8,0.3)]" : "border-primary/20 group-hover:border-primary"}`}>
                    <AvatarImage src={userProfile?.avatar_url} alt={userProfile?.full_name || "User"} />
                    <AvatarFallback className="bg-primary/5 text-primary font-bold">{userProfile?.full_name?.[0] || "U"}</AvatarFallback>
                  </Avatar>
                  <span className="absolute bottom-0 right-0 h-2.5 w-2.5 bg-green-500 rounded-full border-2 border-background z-10"></span>
                  {userProfile?.is_premium && (
                    <span className="absolute -top-1 -right-1 flex h-3 w-3 z-20">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-yellow-500"></span>
                    </span>
                  )}
                </div>

                <div className="flex flex-col items-start text-left hidden sm:flex">
                  <span className="text-sm font-semibold leading-none flex items-center gap-1">
                    {userProfile?.full_name?.split(' ')[0] || "User"}
                    <ChevronDown className="w-3 h-3 text-muted-foreground opacity-50 group-hover:opacity-100 transition-opacity" />
                  </span>
                  <span className="text-[10px] text-muted-foreground font-medium">
                    {userProfile?.is_premium ? 'Premium' : 'Free Plan'}
                  </span>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64 p-2" sideOffset={8}>
              <div className="flex items-center gap-3 p-2 mb-1 bg-muted/30 rounded-lg">
                <Avatar className="h-10 w-10 border border-border">
                  <AvatarImage src={userProfile?.avatar_url} />
                  <AvatarFallback>{userProfile?.full_name?.[0] || "U"}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col space-y-0.5 overflow-hidden">
                  <p className="text-sm font-bold truncate flex items-center gap-1.5">
                    {userProfile?.full_name || "User"}
                    {userProfile?.is_premium && <Sparkles className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />}
                  </p>
                </div>
              </div>

              <DropdownMenuSeparator />

              <div className="grid gap-1 px-1 py-1">
                <DropdownMenuItem asChild className="cursor-pointer">
                  <Link href="/dashboard/profile">
                    <User className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span>Profile</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="cursor-pointer">
                  <Link href="/dashboard/settings">
                    <Settings className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span>Settings</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="cursor-pointer">
                  <Link href="/dashboard/mood/report">
                    <BarChart className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span>Mood Report</span>
                  </Link>
                </DropdownMenuItem>
              </div>

              <DropdownMenuSeparator />

              <div className="grid gap-1 px-1 py-1">
                <DropdownMenuItem className="cursor-pointer">
                  <Keyboard className="mr-2 h-4 w-4 text-muted-foreground" />
                  <span>Keyboard Shortcuts</span>
                  <span className="ml-auto text-xs text-muted-foreground tracking-widest border border-border px-1.5 rounded bg-muted/50">⌘K</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer">
                  <HelpCircle className="mr-2 h-4 w-4 text-muted-foreground" />
                  <span>Help & Support</span>
                </DropdownMenuItem>
              </div>

              <DropdownMenuSeparator />

              {!userProfile?.is_premium && (
                <div className="p-1 mb-1">
                  <div className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 rounded-md p-2 flex items-center justify-between group cursor-pointer hover:bg-gradient-to-r hover:from-indigo-500/20 hover:to-purple-500/20 transition-all">
                    <div className="flex items-center gap-2">
                      <div className="p-1 bg-indigo-500/20 rounded-md">
                        <Zap className="w-3.5 h-3.5 text-indigo-500 fill-indigo-500" />
                      </div>
                      <span className="text-xs font-semibold text-indigo-700 dark:text-indigo-400">Upgrade to Pro</span>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity transform group-hover:translate-x-0.5" />
                  </div>
                </div>
              )}

              <DropdownMenuItem onClick={handleSignOut} className="text-red-600 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-950/20 cursor-pointer mt-1">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
