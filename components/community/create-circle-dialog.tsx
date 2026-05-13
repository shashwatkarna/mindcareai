"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { PlusCircle } from "lucide-react"
import { toast } from "sonner"
import { createCircle } from "@/actions/community"
import { useRouter } from "next/navigation"

export function CreateCircleDialog() {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const router = useRouter()

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !description.trim()) return

    setIsLoading(true)
    const res = await createCircle(name, description)
    if (res.success) {
      toast.success("Circle created! You have automatically joined.")
      setIsOpen(false)
      setName("")
      setDescription("")
      router.push(`/dashboard/community/${res.circleId}`)
    } else {
      toast.error(res.error || "Failed to create circle")
    }
    setIsLoading(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2 border-primary/50 hover:bg-primary/10">
          <PlusCircle className="w-4 h-4" />
          Create Custom Circle
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-card/95 backdrop-blur-xl border-border/50 shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl">Create a Support Circle</DialogTitle>
          <DialogDescription>
            Start a new anonymous space for a specific topic. Anyone can join your circle.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleCreate} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="name">Circle Name</Label>
            <Input 
              id="name" 
              placeholder="e.g., Exam Stress Support" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="bg-background/50"
              maxLength={40}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea 
              id="description" 
              placeholder="What is this circle about?" 
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              className="bg-background/50 resize-none h-24"
              maxLength={200}
            />
          </div>
          <Button 
            type="submit" 
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
            disabled={isLoading || !name.trim() || !description.trim()}
          >
            {isLoading ? "Creating..." : "Create Circle"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
