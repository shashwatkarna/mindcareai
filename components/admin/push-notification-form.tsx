"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Send, Loader2, BellRing } from "lucide-react"
import { toast } from "sonner"

export function PushNotificationForm() {
  const [title, setTitle] = useState("MindCare Check-in")
  const [message, setMessage] = useState("Take a deep breath. How are you feeling today?")
  const [url, setUrl] = useState("/dashboard")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!title || !message) {
      toast.error("Title and message are required")
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch("/api/notifications/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, message, url }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to send push notification")
      }

      toast.success(`Sent notification to ${data.sentCount} active devices!`)
    } catch (error: any) {
      console.error("Error sending notification:", error)
      toast.error(error.message || "Failed to send push notification")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="max-w-2xl mx-auto shadow-md border-border/50">
      <CardHeader className="bg-muted/30 pb-6 border-b border-border/50">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 text-primary rounded-lg">
            <BellRing className="w-6 h-6" />
          </div>
          <div>
            <CardTitle className="text-2xl">Broadcast Notification</CardTitle>
            <CardDescription className="mt-1.5">
              Send a push notification to all users who have enabled them.
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6 pt-6">
          <div className="space-y-2.5">
            <label className="text-sm font-semibold text-foreground">Notification Title</label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. MindCare Update"
              className="bg-background shadow-sm"
            />
          </div>
          
          <div className="space-y-2.5">
            <label className="text-sm font-semibold text-foreground">Message Body</label>
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="e.g. We just added a new meditation exercise!"
              className="min-h-[120px] bg-background shadow-sm resize-y"
            />
          </div>

          <div className="space-y-2.5">
            <label className="text-sm font-semibold text-foreground">Click Destination URL</label>
            <Input
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="e.g. /dashboard/exercises"
              className="bg-background shadow-sm font-mono text-sm"
            />
            <p className="text-xs text-muted-foreground pl-1">Where the user is taken when they tap the notification.</p>
          </div>
        </CardContent>

        <CardFooter className="bg-muted/10 border-t border-border/50 pt-6">
          <Button 
            type="submit" 
            size="lg" 
            className="w-full sm:w-auto"
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            ) : (
              <Send className="mr-2 h-5 w-5" />
            )}
            Send Broadcast
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
