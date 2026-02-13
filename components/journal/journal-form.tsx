"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Save, Loader2, Sparkles, Briefcase, Home, Moon, Heart, Users, Book, Dumbbell, Sun } from "lucide-react"

interface JournalFormProps {
  userId: string
}

const MOODS = [
  { value: "happy", label: "Happy", emoji: "😊" },
  { value: "calm", label: "Calm", emoji: "😌" },
  { value: "hopeful", label: "Hopeful", emoji: "🙂" },
  { value: "grateful", label: "Grateful", emoji: "🙏" },
  { value: "sad", label: "Sad", emoji: "😢" },
  { value: "anxious", label: "Anxious", emoji: "😰" },
  { value: "stressed", label: "Stressed", emoji: "😤" },
  { value: "confused", label: "Confused", emoji: "🤔" },
]

const ACTIVITIES = [
  { id: "work", label: "Work", icon: Briefcase },
  { id: "family", label: "Family", icon: Home },
  { id: "sleep", label: "Sleep", icon: Moon },
  { id: "health", label: "Health", icon: Heart },
  { id: "social", label: "Social", icon: Users },
  { id: "learning", label: "Learning", icon: Book },
  { id: "exercise", label: "Fitness", icon: Dumbbell },
  { id: "hobby", label: "Hobby", icon: Sun },
]

const PROMPTS = [
  "What made you smile today?",
  "What is one thing you learned about yourself recently?",
  "Describe a challenge you overcame today.",
  "What are three things you are grateful for right now?",
  "How did you take care of yourself today?",
  "What is something you are looking forward to?",
  "Who is someone you appreciate, and why?",
  "What is a fear you would like to conquer?",
  "Describe your ideal day.",
  "What is a habit you want to build?",
  "Reflect on a recent mistake. What did it teach you?",
  "What is a memory that brings you joy?",
  "How are you feeling right now, in one word?",
  "What is a small act of kindness you witnessed or performed?",
  "What is something you are proud of accomplishing?",
  "If you could talk to your younger self, what would you say?",
  "What is a stressful situation you handled well recently?",
  "What does 'success' mean to you today?",
  "List five things that make you happy.",
  "What is a book, movie, or song that impacted you recently?",
  "How do you recharge when you are tired?",
  "What is a goal you are working towards?",
  "Write about a place where you feel safe.",
  "Who has supported you lately?",
  "What is a boundary you need to set?",
  "What is something new you want to try?",
  "How does your body feel right now?",
  "What is a worry you can let go of today?",
  "Describe a moment of peace you experienced.",
  "What is something you take for granted?",
  "If you had a free hour today, how would you spend it?",
  "What is a quality you admire in others?",
  "How have you grown in the last year?",
  "What is a question you have been asking yourself?",
  "Write a letter to your future self.",
]

export function JournalForm({ userId }: JournalFormProps) {
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [selectedMood, setSelectedMood] = useState<string | null>(null)
  const [moodIntensity, setMoodIntensity] = useState<number>(5) // 3=Mild, 6=Mod, 9=Intense
  const [selectedActivities, setSelectedActivities] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const toggleActivity = (activityId: string) => {
    setSelectedActivities(prev =>
      prev.includes(activityId)
        ? prev.filter(id => id !== activityId)
        : [...prev, activityId]
    )
  }

  const insertPrompt = () => {
    const randomPrompt = PROMPTS[Math.floor(Math.random() * PROMPTS.length)]
    const newContent = content ? `${content}\n\n${randomPrompt}\n` : `${randomPrompt}\n`
    setContent(newContent)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!content.trim()) {
      alert("Please write something in your journal entry")
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch("/api/journal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title || `Journal Entry - ${new Date().toLocaleDateString()}`,
          content,
          mood: selectedMood,
          mood_score: moodIntensity,
          is_private: true,
          tags: selectedActivities, // Save activities as tags
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || "Failed to save journal entry")
      }

      router.push("/dashboard/journal")
    } catch (error) {
      console.error("Error saving entry:", error)
      alert("Failed to save journal entry")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-6">

      {/* Top Bar: Activities & Intensity */}
      <div className="grid md:grid-cols-2 gap-4">
        <Card className="border-border shadow-sm p-4 flex flex-col justify-center gap-3">
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">What impacted your day?</span>
          <div className="flex flex-wrap gap-2">
            {ACTIVITIES.map((act) => {
              const Icon = act.icon
              const isSelected = selectedActivities.includes(act.id)
              return (
                <button
                  key={act.id}
                  type="button"
                  onClick={() => toggleActivity(act.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${isSelected
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                    }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {act.label}
                </button>
              )
            })}
          </div>
        </Card>

        <Card className="border-border shadow-sm p-4 flex flex-col justify-center gap-3">
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Intensity</span>
          <div className="grid grid-cols-3 gap-2">
            {[
              { label: "Mild", value: 3 },
              { label: "Moderate", value: 6 },
              { label: "Intense", value: 9 },
            ].map((level) => (
              <button
                key={level.label}
                type="button"
                onClick={() => setMoodIntensity(level.value)}
                className={`py-2 px-4 rounded-md text-sm font-medium transition-all ${moodIntensity === level.value
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                  }`}
              >
                {level.label}
              </button>
            ))}
          </div>
        </Card>
      </div>


      {/* Main "Notebook" Area */}
      <Card className="border-border shadow-md overflow-hidden bg-[#faf9f6] dark:bg-card relative min-h-[500px] flex flex-col">
        {/* Notebook Binding Visual */}
        <div className="absolute left-0 top-0 bottom-0 w-12 border-r border-border/50 bg-repeat-y bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMiIgaGVpZ2h0PSIzMiI+CiAgPGNpcmNsZSBjeD0iNiIgY3k9IjE2IiByPSI0IiBmaWxsPSIjZTRlNGU0IiAvPgo8L3N2Zz4=')] bg-[length:100%_32px] opacity-20 dark:opacity-5 pointer-events-none z-10 hidden md:block"></div>

        <CardContent className="p-0 md:pl-16 flex-1 flex flex-col">
          <div className="p-8 space-y-6 flex-1 flex flex-col">
            <div className="flex justify-between items-center gap-4">
              <Input
                type="text"
                placeholder="Title (Optional)"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="text-2xl font-bold border-none shadow-none px-0 focus-visible:ring-0 bg-transparent placeholder:text-muted-foreground/50 flex-1"
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={insertPrompt}
                className="text-muted-foreground hover:text-primary gap-2"
              >
                <Sparkles className="w-4 h-4" />
                Spark
              </Button>
            </div>

            <div className="relative flex-1">
              <Textarea
                placeholder="Start writing..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="h-full min-h-[400px] resize-none border-none shadow-none px-0 focus-visible:ring-0 bg-transparent text-lg leading-loose placeholder:text-muted-foreground/40
                        bg-[linear-gradient(transparent_1.9rem,#e5e7eb_2rem)] bg-[length:100%_2rem] dark:bg-[linear-gradient(transparent_1.9rem,#333_2rem)] font-serif"
              />
            </div>
          </div>
        </CardContent>

        {/* Mood Selector Footer */}
        <div className="bg-card/50 backdrop-blur-sm border-t p-4 flex flex-col sm:flex-row items-center justify-between gap-4 md:pl-16 sticky bottom-0">
          <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0 w-full sm:w-auto hide-scrollbar">
            {MOODS.map((m) => (
              <button
                key={m.value}
                type="button"
                onClick={() => setSelectedMood(m.value)}
                className={`flex flex-col items-center justify-center p-2 rounded-lg transition-all min-w-[60px] ${selectedMood === m.value
                  ? "bg-primary/10 text-primary scale-110"
                  : "hover:bg-muted text-muted-foreground hover:text-foreground"
                  }`}
              >
                <span className="text-2xl mb-1">{m.emoji}</span>
                <span className="text-[10px] font-medium uppercase tracking-wide">{m.label}</span>
              </button>
            ))}
          </div>

          <Button size="lg" disabled={isLoading} className="w-full sm:w-auto min-w-[140px]">
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
            Save Entry
          </Button>
        </div>
      </Card>
    </form>
  )
}
