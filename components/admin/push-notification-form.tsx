"use client"

import { useState } from "react"
import { Loader2 } from "lucide-react"
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
    <div className="bg-white p-8 shadow-sm">
      <h2 className="text-2xl font-bold mb-1">Broadcast Notification</h2>
      <p className="text-black/60 text-sm mb-8">Send a push notification to all users.</p>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-semibold mb-2">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border border-black/20 p-2 focus:outline-none focus:border-[#1d2a5a] transition-colors bg-transparent"
          />
        </div>
        
        <div>
          <label className="block text-sm font-semibold mb-2">Message</label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full border border-black/20 p-2 min-h-[100px] focus:outline-none focus:border-[#1d2a5a] transition-colors bg-transparent resize-y"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2">Destination URL</label>
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="w-full border border-black/20 p-2 focus:outline-none focus:border-[#1d2a5a] transition-colors bg-transparent"
          />
        </div>

        <div className="pt-4 border-t border-black/10">
          <button 
            type="submit" 
            className="bg-[#1d2a5a] hover:bg-[#152044] text-white px-6 py-2 transition-colors flex items-center justify-center font-medium w-full sm:w-auto"
            disabled={isLoading}
          >
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Send Broadcast
          </button>
        </div>
      </form>
    </div>
  )
}
