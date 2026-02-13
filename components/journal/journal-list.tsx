"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Search, Filter, Calendar as CalendarIcon, List as ListIcon, Trash2, Edit2, BookOpen, Briefcase, Home, Moon, Heart, Users, Book, Dumbbell, Sun } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { Badge } from "@/components/ui/badge"

interface JournalEntry {
  id: string
  title: string
  content: string
  mood: string | null
  mood_score: number | null
  created_at: string
  tags: string[] | null
}

const ACTIVITY_ICONS: Record<string, any> = {
  work: Briefcase,
  family: Home,
  sleep: Moon,
  health: Heart,
  social: Users,
  learning: Book,
  exercise: Dumbbell,
  hobby: Sun
}

export function JournalList({ entries }: { entries: JournalEntry[] }) {
  const [searchQuery, setSearchQuery] = useState("")
  const [moodFilter, setMoodFilter] = useState<string>("all")
  const [viewMode, setViewMode] = useState<"list" | "calendar">("list")
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [date, setDate] = useState<Date | undefined>(new Date())

  // --- Filtering Logic ---
  const filteredEntries = useMemo(() => {
    return entries.filter((entry) => {
      const matchesSearch =
        entry.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        entry.content.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesMood = moodFilter === "all" || entry.mood === moodFilter

      if (viewMode === 'calendar' && date) {
        const entryDate = new Date(entry.created_at).toDateString()
        const selectedDate = date.toDateString()
        return matchesSearch && matchesMood && entryDate === selectedDate
      }

      return matchesSearch && matchesMood
    })
  }, [entries, searchQuery, moodFilter, viewMode, date])

  const handleDelete = async (entryId: string) => {
    if (!confirm("Are you sure you want to delete this entry?")) return

    setDeletingId(entryId)
    try {
      const supabase = createClient()
      await supabase.from("journal_entries").delete().eq("id", entryId)
      window.location.reload()
    } catch (error) {
      console.error("Error deleting entry:", error)
      alert("Failed to delete entry")
    } finally {
      setDeletingId(null)
    }
  }

  const getMoodEmoji = (mood: string | null) => {
    const moodMap: { [key: string]: string } = {
      happy: "😊", sad: "😢", anxious: "😰", calm: "😌",
      stressed: "😤", hopeful: "🙂", confused: "🤔", grateful: "🙏",
    }
    return moodMap[mood || ""] || "📝"
  }

  const getIntensityLabel = (score: number | null) => {
    if (!score) return null
    if (score <= 3) return "Mild"
    if (score <= 6) return "Moderate"
    return "Intense"
  }

  const getIntensityColor = (score: number | null) => {
    if (!score) return "secondary"
    if (score <= 3) return "outline" // Mild
    if (score <= 6) return "secondary" // Moderate
    return "destructive" // Intense (using destructive for high intensity visual pop, or default)
  }

  // Helper to highlight days with entries in calendar
  const modifiers = {
    hasEntry: (date: Date) => entries.some(e => new Date(e.created_at).toDateString() === date.toDateString())
  }
  const modifiersStyles = {
    hasEntry: { fontWeight: 'bold', textDecoration: 'underline', color: 'hsl(var(--primary))' }
  }

  if (entries.length === 0) {
    return (
      <Card className="p-12 border-dashed border-2 text-center bg-muted/20 shadow-none">
        <BookOpen className="w-12 h-12 mx-auto text-muted-foreground mb-4 opacity-50" />
        <h3 className="text-lg font-medium text-foreground">Your journal is empty</h3>
        <p className="text-muted-foreground mt-2 mb-6">Start writing to begin your reflective journey.</p>
        <Link href="/dashboard/journal/new">
          <Button>Write First Entry</Button>
        </Link>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Controls Header */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-card p-4 rounded-lg border shadow-sm">
        <div className="flex w-full md:w-auto gap-2 flex-1">
          <div className="relative flex-1 md:max-w-xs">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search entries..."
              className="pl-9 bg-background"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Select value={moodFilter} onValueChange={setMoodFilter}>
            <SelectTrigger className="w-[140px] bg-background">
              <Filter className="w-4 h-4 mr-2 text-muted-foreground" />
              <SelectValue placeholder="Filter Mood" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Moods</SelectItem>
              <SelectItem value="happy">Happy 😊</SelectItem>
              <SelectItem value="sad">Sad 😢</SelectItem>
              <SelectItem value="anxious">Anxious 😰</SelectItem>
              <SelectItem value="calm">Calm 😌</SelectItem>
              <SelectItem value="stressed">Stressed 😤</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2 border rounded-md p-1 bg-background">
          <Button
            variant={viewMode === 'list' ? 'secondary' : 'ghost'}
            size="sm"
            onClick={() => setViewMode('list')}
            className="h-8 px-2"
          >
            <ListIcon className="w-4 h-4 mr-2" /> List
          </Button>
          <Button
            variant={viewMode === 'calendar' ? 'secondary' : 'ghost'}
            size="sm"
            onClick={() => setViewMode('calendar')}
            className="h-8 px-2"
          >
            <CalendarIcon className="w-4 h-4 mr-2" /> Calendar
          </Button>
        </div>
      </div>

      {/* Content Area */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">

        {/* Calendar Sidebar */}
        {viewMode === 'calendar' && (
          <div className="md:col-span-1">
            <Card className="border-border shadow-sm sticky top-4">
              <CardContent className="p-0">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  className="rounded-md border-0 w-full"
                  modifiers={modifiers}
                  modifiersStyles={modifiersStyles}
                />
              </CardContent>
            </Card>
          </div>
        )}

        {/* Entries List */}
        <div className={viewMode === 'calendar' ? "md:col-span-3" : "md:col-span-4"}>
          <AnimatePresence mode="popLayout">
            {filteredEntries.length > 0 ? (
              <div className={viewMode === 'list' ? "grid gap-4 sm:grid-cols-2 lg:grid-cols-3" : "space-y-4"}>
                {filteredEntries.map((entry) => (
                  <motion.div
                    key={entry.id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Link href={`/dashboard/journal/${entry.id}`}>
                      <Card className="h-full hover:shadow-md transition-shadow cursor-pointer border-l-4 border-l-primary/50 overflow-hidden group">
                        <CardContent className="p-5 flex flex-col h-full gap-3">
                          <div className="flex justify-between items-start">
                            <div className="flex items-center gap-2">
                              <span className="text-2xl group-hover:scale-110 transition-transform">{getMoodEmoji(entry.mood)}</span>
                              <div>
                                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
                                  {new Date(entry.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                </p>
                                <h3 className="font-semibold text-foreground line-clamp-1">{entry.title}</h3>
                              </div>
                            </div>
                          </div>

                          <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed flex-1">
                            {entry.content}
                          </p>

                          {/* Activities / Tags */}
                          {entry.tags && entry.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-2">
                              {entry.tags.map(tag => {
                                const Icon = ACTIVITY_ICONS[tag] || BookOpen
                                return (
                                  <span key={tag} className="text-[10px] bg-secondary px-2 py-0.5 rounded-full text-secondary-foreground flex items-center gap-1">
                                    <Icon className="w-3 h-3" />
                                    {tag.charAt(0).toUpperCase() + tag.slice(1)}
                                  </span>
                                )
                              })}
                            </div>
                          )}

                          <div className="flex items-center justify-between pt-2 mt-2 border-t border-border/50">
                            <Badge variant={getIntensityColor(entry.mood_score) as any} className="text-xs font-normal">
                              {getIntensityLabel(entry.mood_score) || 'No Score'}
                            </Badge>

                            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <Button variant="ghost" size="icon" className="h-7 w-7" asChild onClick={(e) => e.stopPropagation()}>
                                <Link href={`/dashboard/journal/${entry.id}/edit`}>
                                  <Edit2 className="w-3.5 h-3.5 text-muted-foreground hover:text-primary" />
                                </Link>
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7"
                                onClick={(e) => {
                                  e.preventDefault()
                                  e.stopPropagation()
                                  handleDelete(entry.id)
                                }}
                                disabled={deletingId === entry.id}
                              >
                                <Trash2 className="w-3.5 h-3.5 text-muted-foreground hover:text-destructive" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  </motion.div>
                ))}
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12"
              >
                <p className="text-muted-foreground">No entries found matching your criteria.</p>
                {viewMode === 'calendar' && <p className="text-xs text-muted-foreground mt-2">Try selecting a different date.</p>}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
