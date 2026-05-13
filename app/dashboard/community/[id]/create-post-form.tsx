"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Send } from "lucide-react"
import { createCirclePost } from "@/actions/community"
import { toast } from "sonner"

export function CreatePostForm({ circleId }: { circleId: string }) {
  const [content, setContent] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!content.trim()) return

    setIsLoading(true)
    const res = await createCirclePost(circleId, content)
    if (res.success) {
      setContent("")
      toast.success("Post published anonymously!")
    } else {
      toast.error(res.error || "Failed to post")
    }
    setIsLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="flex items-end gap-2">
      <div className="relative flex-1">
        <Textarea
          placeholder="Type a message anonymously..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="min-h-[44px] h-[44px] max-h-[120px] resize-none bg-background/80 border-border/50 focus:border-primary/50 text-sm py-3 px-4 rounded-2xl pr-12"
          maxLength={500}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSubmit(e);
            }
          }}
        />
        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-muted-foreground pointer-events-none opacity-50 hidden sm:block">
          Press Enter to send
        </div>
      </div>
      <Button 
        type="submit" 
        size="icon"
        disabled={isLoading || !content.trim()}
        className="h-[44px] w-[44px] rounded-full bg-primary hover:bg-primary/90 text-primary-foreground flex-shrink-0"
      >
        {isLoading ? <span className="animate-pulse text-xs">...</span> : <Send className="w-4 h-4 ml-0.5" />}
      </Button>
    </form>
  )
}
