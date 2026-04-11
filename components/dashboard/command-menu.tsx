"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { useTheme } from "next-themes"
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command"
import {
  Calendar,
  LayoutDashboard,
  Moon,
  Settings,
  Sun,
  PenLine,
  SmilePlus,
  BookOpen,
  BicepsFlexed,
  BrainCircuit,
  MessageSquare
} from "lucide-react"

export function CommandMenu() {
  const [open, setOpen] = React.useState(false)
  const [keySequence, setKeySequence] = React.useState<string>("")
  const router = useRouter()
  const { setTheme } = useTheme()

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      // 1. Check for Cmd+K or Ctrl+K to toggle dialog
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
        return
      }

      // Ignore sequences if clicking inside inputs
      const activeEl = document.activeElement
      if (
        activeEl?.tagName === "INPUT" ||
        activeEl?.tagName === "TEXTAREA" ||
        (activeEl as HTMLElement)?.isContentEditable
      ) {
        return
      }

      // 2. Navigation sequences (g then another key)
      if (e.key.toLowerCase() === "g") {
        setKeySequence("g")
        // Clear sequence after 1 second if second key not pressed
        setTimeout(() => setKeySequence(""), 1000)
        return
      }

      if (keySequence === "g") {
        const key = e.key.toLowerCase()
        let handled = true
        
        switch (key) {
          case "d":
            router.push("/dashboard")
            break
          case "j":
            router.push("/dashboard/journal")
            break
          case "m":
            router.push("/dashboard/mood")
            break
          case "a":
            router.push("/dashboard/assessments")
            break
          case "e":
            router.push("/dashboard/exercises")
            break
          case "c":
            router.push("/dashboard/chatbot")
            break
          case "p":
            router.push("/dashboard/profile")
            break
          default:
            handled = false
        }
        
        if (handled) {
          e.preventDefault()
        }
        setKeySequence("")
        return
      }
    }

    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [keySequence, router])

  const runCommand = React.useCallback((command: () => unknown) => {
    setOpen(false)
    command()
  }, [])

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Type a command or search..." />
      <CommandList className="scrollbar-thin scrollbar-thumb-primary/10">
        <CommandEmpty>No results found.</CommandEmpty>
        
        <CommandGroup heading="Navigation">
          <CommandItem onSelect={() => runCommand(() => router.push("/dashboard"))}>
            <LayoutDashboard className="mr-2 h-4 w-4 text-blue-500" />
            <span>Dashboard</span>
            <CommandShortcut>G D</CommandShortcut>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => router.push("/dashboard/journal"))}>
            <BookOpen className="mr-2 h-4 w-4 text-amber-500" />
            <span>Journal</span>
            <CommandShortcut>G J</CommandShortcut>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => router.push("/dashboard/mood"))}>
            <SmilePlus className="mr-2 h-4 w-4 text-yellow-500" />
            <span>Mood Tracker</span>
            <CommandShortcut>G M</CommandShortcut>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => router.push("/dashboard/assessments"))}>
            <PenLine className="mr-2 h-4 w-4 text-violet-500" />
            <span>Assessments</span>
            <CommandShortcut>G A</CommandShortcut>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => router.push("/dashboard/exercises"))}>
            <BicepsFlexed className="mr-2 h-4 w-4 text-emerald-500" />
            <span>Exercises</span>
            <CommandShortcut>G E</CommandShortcut>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => router.push("/dashboard/chatbot"))}>
            <BrainCircuit className="mr-2 h-4 w-4 text-cyan-500" />
            <span>MindCare AI</span>
            <CommandShortcut>G C</CommandShortcut>
          </CommandItem>
        </CommandGroup>

        <CommandSeparator />
        
        <CommandGroup heading="Quick Actions">
          <CommandItem onSelect={() => runCommand(() => router.push("/dashboard/journal/new"))}>
            <PenLine className="mr-2 h-4 w-4 text-primary" />
            <span className="font-semibold text-primary">New Journal Entry</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => router.push("/dashboard/appointments/new"))}>
            <Calendar className="mr-2 h-4 w-4 text-pink-500" />
            <span>Book Appointment</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => router.push("/dashboard/profile"))}>
            <Settings className="mr-2 h-4 w-4 text-slate-500" />
            <span>Profile & Settings</span>
            <CommandShortcut>G P</CommandShortcut>
          </CommandItem>
        </CommandGroup>

        <CommandSeparator />
        
        <CommandGroup heading="Appearance">
          <CommandItem onSelect={() => runCommand(() => setTheme("light"))}>
            <Sun className="mr-2 h-4 w-4" />
            <span>Light Theme</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => setTheme("dark"))}>
            <Moon className="mr-2 h-4 w-4" />
            <span>Dark Theme</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => setTheme("system"))}>
            <Settings className="mr-2 h-4 w-4" />
            <span>System Theme</span>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  )
}
