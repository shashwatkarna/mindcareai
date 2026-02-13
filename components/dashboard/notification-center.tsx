"use client"

import { useState } from "react"
import { Bell, Calendar, BookOpen, ClipboardList, Check, X, ArrowRight } from "lucide-react"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { NotificationData } from "@/actions/notifications"

interface NotificationCenterProps {
    data: NotificationData
}

export function NotificationCenter({ data }: NotificationCenterProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [dismissedIds, setDismissedIds] = useState<string[]>([])

    // Generate notifications based on data
    const notifications = []

    if (data.upcomingAppointment) {
        notifications.push({
            id: "appt",
            type: "appointment",
            title: "Upcoming Appointment",
            message: `You have a session with ${data.upcomingAppointment.doctorName} in ${data.upcomingAppointment.daysUntil} day${data.upcomingAppointment.daysUntil === 1 ? '' : 's'}.`,
            icon: Calendar,
            color: "text-blue-500",
            bgColor: "bg-blue-500/10",
            actionLabel: "View Details",
            actionLink: "/dashboard/appointments"
        })
    }

    if (!data.hasLoggedMood) {
        notifications.push({
            id: "mood",
            type: "action",
            title: "Daily Mood Check",
            message: "How are you feeling right now? Take a moment to check in.",
            icon: BookOpen,
            color: "text-pink-500",
            bgColor: "bg-pink-500/10",
            actionLabel: "Log Mood",
            actionLink: "/dashboard/mood"
        })
    }

    if (!data.hasJournaled) {
        notifications.push({
            id: "journal",
            type: "action",
            title: "Journal Prompt",
            message: "How did your day go? Reflecting can help clear your mind.",
            icon: BookOpen,
            color: "text-amber-500",
            bgColor: "bg-amber-500/10",
            actionLabel: "Write Journal",
            actionLink: "/dashboard/journal"
        })
    }

    const lastAssessmentTime = data.lastAssessmentDate ? new Date(data.lastAssessmentDate).getTime() : 0
    const sevenDaysAgo = Date.now() - (7 * 24 * 60 * 60 * 1000)

    if (!data.lastAssessmentDate || lastAssessmentTime < sevenDaysAgo) {
        notifications.push({
            id: "assessment",
            type: "suggestion",
            title: "Mental Health Check",
            message: "It's been a while since your last assessment. Want to see how you're doing?",
            icon: ClipboardList,
            color: "text-purple-500",
            bgColor: "bg-purple-500/10",
            actionLabel: "Take Assessment",
            actionLink: "/dashboard/assessments"
        })
    }

    // Filter out dismissed
    const activeNotifications = notifications.filter(n => !dismissedIds.includes(n.id))
    const hasUnread = activeNotifications.length > 0

    const dismiss = (id: string, e: React.MouseEvent) => {
        e.stopPropagation()
        e.preventDefault()
        setDismissedIds(prev => [...prev, id])
    }

    return (
        <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full relative">
                    <Bell className="h-5 w-5 text-muted-foreground" />
                    {hasUnread && (
                        <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-background animate-pulse"></span>
                    )}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-0 shadow-lg border-border bg-background/95 backdrop-blur-sm" align="end">
                <div className="flex items-center justify-between p-4 border-b">
                    <h3 className="font-semibold text-sm">Notifications</h3>
                    <span className="text-xs text-muted-foreground">{activeNotifications.length} New</span>
                </div>

                <ScrollArea className="h-[300px]">
                    {activeNotifications.length === 0 ? (
                        <div className="flex flex-col items-center justify-center p-8 text-center h-full">
                            <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mb-3 mx-auto">
                                <Check className="w-6 h-6 text-muted-foreground" />
                            </div>
                            <p className="text-sm font-medium">All caught up!</p>
                            <p className="text-xs text-muted-foreground mt-1">No new tasks or reminders for now.</p>
                        </div>
                    ) : (
                        <div className="divide-y relative">
                            {activeNotifications.map((notification) => {
                                const Icon = notification.icon
                                return (
                                    <div key={notification.id} className="p-4 hover:bg-muted/50 transition-colors relative group">
                                        <button
                                            onClick={(e) => dismiss(notification.id, e)}
                                            className="absolute top-2 right-2 p-1 rounded-full opacity-0 group-hover:opacity-100 text-muted-foreground hover:bg-muted hover:text-foreground transition-all"
                                            title="Dismiss"
                                        >
                                            <X className="w-3.5 h-3.5" />
                                        </button>
                                        <div className="flex gap-3">
                                            <div className={cn("w-9 h-9 rounded-full flex items-center justify-center shrink-0", notification.bgColor, notification.color)}>
                                                <Icon className="w-4.5 h-4.5" />
                                            </div>
                                            <div className="flex-1 space-y-1 pr-4">
                                                <p className="text-sm font-medium leading-none">{notification.title}</p>
                                                <p className="text-xs text-muted-foreground leading-snug">{notification.message}</p>

                                                {notification.actionLink && (
                                                    <Link
                                                        href={notification.actionLink}
                                                        onClick={() => setIsOpen(false)}
                                                        className={cn("inline-flex items-center gap-1 text-xs font-medium mt-1.5 hover:underline", notification.color)}
                                                    >
                                                        {notification.actionLabel}
                                                        <ArrowRight className="w-3 h-3" />
                                                    </Link>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    )}
                </ScrollArea>
                {activeNotifications.length > 0 && (
                    <div className="p-2 border-t bg-muted/20">
                        <Button
                            variant="ghost"
                            size="sm"
                            className="w-full text-xs h-8"
                            onClick={() => setDismissedIds(prev => [...prev, ...activeNotifications.map(n => n.id)])}
                        >
                            Mark all as read
                        </Button>
                    </div>
                )}
            </PopoverContent>
        </Popover>
    )
}
