"use client"

import { useEffect, useState } from "react"
import { Moon, Sun, Bell, User, LogOut, Settings, Flame, Sparkles } from "lucide-react"
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
              <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                <Avatar className={`h-9 w-9 border ${userProfile?.is_premium ? "border-yellow-500 border-2" : "border-border"}`}>
                  <AvatarImage src={userProfile?.avatar_url} alt={userProfile?.full_name || "User"} />
                  <AvatarFallback>{userProfile?.full_name?.[0] || "U"}</AvatarFallback>
                </Avatar>
                {userProfile?.is_premium && (
                  <span className="absolute -top-1 -right-1 flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-yellow-500"></span>
                  </span>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-bold leading-none flex items-center gap-2">
                    {userProfile?.full_name || "User"}
                    {userProfile?.is_premium && <Sparkles className="w-3 h-3 text-yellow-500 fill-yellow-500" />}
                  </p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {userProfile?.email || "user@example.com"}
                  </p>
                  {userProfile?.is_premium && (
                    <span className="text-[10px] font-medium text-yellow-600 dark:text-yellow-400 bg-yellow-500/10 px-1 py-0.5 rounded w-fit">
                      Premium Member
                    </span>
                  )}
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/dashboard/profile" className="cursor-pointer w-full flex items-center">
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/dashboard/settings" className="cursor-pointer w-full flex items-center">
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/dashboard/mood/report" className="cursor-pointer w-full flex items-center">
                  <FileText className="mr-2 h-4 w-4" />
                  <span>Mood Report</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleSignOut} className="text-red-600 focus:text-red-600 cursor-pointer">
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
