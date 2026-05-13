"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Send, Users, Circle as CircleIcon, ArrowLeft } from "lucide-react"
import { createCirclePost } from "@/actions/community"
import { toast } from "sonner"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"

interface ChatRoomProps {
  circle: any
  initialPosts: any[]
  currentUserId: string
  currentUserPseudonym: string
}

export function ChatRoom({ circle, initialPosts, currentUserId, currentUserPseudonym }: ChatRoomProps) {
  const router = useRouter()
  const [posts, setPosts] = useState(initialPosts)
  const [content, setContent] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [onlineCount, setOnlineCount] = useState(1)
  const [typingUsers, setTypingUsers] = useState<Set<string>>(new Set())
  const scrollRef = useRef<HTMLDivElement>(null)
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const channelRef = useRef<any>(null)

  useEffect(() => {
    // Auto-scroll to bottom on mount and new posts
    if (scrollRef.current) {
      const scrollContainer = scrollRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, [posts])

  useEffect(() => {
    const supabase = createClient()
    const channel = supabase.channel(`circle:${circle.id}`, {
      config: {
        presence: { key: currentUserId },
        broadcast: { self: false }
      }
    })
    channelRef.current = channel

    channel
      .on('presence', { event: 'sync' }, () => {
        const state = channel.presenceState()
        setOnlineCount(Object.keys(state).length)
      })
      .on('broadcast', { event: 'typing' }, ({ payload }) => {
        setTypingUsers(prev => {
          const newSet = new Set(prev)
          if (payload.isTyping) {
            newSet.add(payload.pseudonym)
          } else {
            newSet.delete(payload.pseudonym)
          }
          return newSet
        })
      })
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'circle_posts', filter: `circle_id=eq.${circle.id}` }, (payload) => {
        router.refresh() // The parent server component will re-fetch and pass new initialPosts
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          await channel.track({ online_at: new Date().toISOString() })
        }
      })

    return () => {
      supabase.removeChannel(channel)
    }
  }, [circle.id, currentUserId, router])

  // Update local state when parent re-fetches
  useEffect(() => {
    setPosts(initialPosts)
  }, [initialPosts])

  const handleTyping = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value)

    if (channelRef.current) {
      channelRef.current.send({
        type: 'broadcast',
        event: 'typing',
        payload: { pseudonym: currentUserPseudonym, isTyping: true }
      })

      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current)
      
      typingTimeoutRef.current = setTimeout(() => {
        channelRef.current?.send({
          type: 'broadcast',
          event: 'typing',
          payload: { pseudonym: currentUserPseudonym, isTyping: false }
        })
      }, 2000)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!content.trim()) return

    setIsLoading(true)
    const res = await createCirclePost(circle.id, content)
    if (res.success) {
      setContent("")
      // Clear typing indicator immediately
      if (channelRef.current) {
        channelRef.current.send({
          type: 'broadcast',
          event: 'typing',
          payload: { pseudonym: currentUserPseudonym, isTyping: false }
        })
      }
    } else {
      toast.error(res.error || "Failed to send message")
    }
    setIsLoading(false)
  }

  const typingArray = Array.from(typingUsers)
  let typingText = ""
  if (typingArray.length === 1) typingText = `${typingArray[0]} is typing...`
  else if (typingArray.length > 1) typingText = "Multiple people are typing..."

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] bg-background">
      {/* Header - Sleek WhatsApp/Telegram Style */}
      <div className="flex-none bg-card border-b border-border/50 px-4 py-3 flex items-center justify-between z-10 shadow-sm">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/community" className="text-muted-foreground hover:text-primary transition-colors p-2 -ml-2 rounded-full hover:bg-muted/50">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center text-xl shadow-sm border border-border/50">
            {circle.icon || '👥'}
          </div>
          <div className="flex flex-col">
            <h1 className="text-base font-semibold text-foreground flex items-center gap-2 leading-tight">
              {circle.name}
              {circle.is_official && (
                <span className="text-[9px] bg-primary/20 text-primary px-1.5 py-0.5 rounded-full font-medium uppercase tracking-wider">
                  Official
                </span>
              )}
            </h1>
            <div className="flex items-center text-xs text-muted-foreground mt-0.5">
              <span className="flex items-center gap-1 text-emerald-500 font-medium">
                <CircleIcon className="w-2 h-2 fill-current" /> {onlineCount} online
              </span>
              <span className="mx-1.5">•</span>
              <span className="line-clamp-1 max-w-[200px] sm:max-w-xs">{circle.description}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <ScrollArea className="flex-1 bg-muted/20 relative" ref={scrollRef}>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03] pointer-events-none mix-blend-overlay" />
        
        <div className="space-y-6 p-4 sm:p-6 pb-4 max-w-4xl mx-auto w-full">
          {posts.length === 0 ? (
            <div className="flex items-center justify-center h-full min-h-[200px]">
              <div className="text-center bg-card/60 backdrop-blur-sm px-6 py-4 rounded-2xl border border-border/30 shadow-sm">
                <p className="text-muted-foreground text-sm">It's quiet here. Be the first to say hello!</p>
              </div>
            </div>
          ) : (
            posts.map((post: any, i: number) => {
              const isMe = post.user_id === currentUserId
              const showHeader = i === 0 || posts[i - 1].user_id !== post.user_id || 
                (new Date(post.created_at).getTime() - new Date(posts[i - 1].created_at).getTime() > 5 * 60000)

              return (
                <div key={post.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} w-full animate-fade-in-up`}>
                  {showHeader && !isMe && (
                    <span className="text-xs font-semibold text-muted-foreground mb-1 ml-1">{post.pseudonym}</span>
                  )}
                  {showHeader && isMe && (
                    <span className="text-xs font-medium text-muted-foreground/70 mb-1 mr-1">You</span>
                  )}
                  
                  <div 
                    className={`
                      relative max-w-[85%] sm:max-w-[70%] px-4 py-2 text-[15px] shadow-sm leading-relaxed
                      ${isMe 
                        ? 'bg-primary text-primary-foreground rounded-2xl rounded-tr-sm' 
                        : 'bg-card text-foreground border border-border/50 rounded-2xl rounded-tl-sm'
                      }
                    `}
                  >
                    <p className="whitespace-pre-wrap break-words">{post.content}</p>
                    <div className={`text-[10px] text-right mt-1 opacity-70 ${isMe ? 'text-primary-foreground' : 'text-muted-foreground'}`}>
                      {new Date(post.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>
              )
            })
          )}
        </div>
      </ScrollArea>

      {/* Typing Indicator */}
      <div className="px-4 h-6 bg-muted/20 flex items-center max-w-4xl mx-auto w-full">
        <AnimatePresence>
          {typingText && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="text-xs text-muted-foreground flex items-center gap-1.5 italic"
            >
              <div className="flex gap-0.5">
                <span className="w-1 h-1 bg-muted-foreground/60 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-1 h-1 bg-muted-foreground/60 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-1 h-1 bg-muted-foreground/60 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
              {typingText}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Input Area */}
      <div className="flex-none bg-card border-t border-border/50 p-3 sm:p-4 z-10 w-full">
        <div className="max-w-4xl mx-auto w-full">
          <form onSubmit={handleSubmit} className="flex items-end gap-2">
            <div className="relative flex-1 bg-muted/30 rounded-2xl border border-border/50 focus-within:border-primary/50 focus-within:bg-background transition-colors">
              <Textarea
                placeholder="Type a message..."
                value={content}
                onChange={handleTyping}
                className="min-h-[44px] h-[44px] max-h-[120px] resize-none bg-transparent border-0 focus-visible:ring-0 text-sm py-3 px-4 w-full pr-12 scrollbar-none"
                maxLength={500}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit(e);
                  }
                }}
              />
            </div>
            <Button 
              type="submit" 
              size="icon"
              disabled={isLoading || !content.trim()}
              className="h-[44px] w-[44px] rounded-full bg-primary hover:bg-primary/90 text-primary-foreground flex-shrink-0 shadow-sm"
            >
              {isLoading ? <span className="animate-pulse">...</span> : <Send className="w-4 h-4 ml-0.5" />}
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}
