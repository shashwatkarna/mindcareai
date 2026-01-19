"use client"

import type React from "react"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface ProfileData {
  id: string
  full_name: string | null
  bio: string | null
  email: string | null
  timezone: string | null
}

export function ProfileForm({ initialData }: { initialData: ProfileData | null }) {
  const [fullName, setFullName] = useState(initialData?.full_name || "")
  const [bio, setBio] = useState(initialData?.bio || "")
  const [timezone, setTimezone] = useState(initialData?.timezone || "UTC")
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage(null)

    try {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) throw new Error("Not authenticated")

      const { error } = await supabase
        .from("profiles")
        .update({
          full_name: fullName,
          bio: bio || null,
          timezone,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id)

      if (error) throw error

      setMessage({ type: "success", text: "Profile updated successfully!" })
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to update profile"
      setMessage({ type: "error", text: errorMessage })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="border-[#e0d9d3] shadow-sm">
      <CardHeader>
        <CardTitle>Personal Information</CardTitle>
        <CardDescription>Update your profile details</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-2">
            <Label htmlFor="fullName" className="text-[#3d3d3d]">
              Full Name
            </Label>
            <Input
              id="fullName"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              disabled={isLoading}
              className="border-[#e0d9d3] bg-white"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="email" className="text-[#3d3d3d]">
              Email
            </Label>
            <Input id="email" value={initialData?.email || ""} disabled className="border-[#e0d9d3] bg-white" />
            <p className="text-xs text-[#6b6b6b]">Email cannot be changed</p>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="bio" className="text-[#3d3d3d]">
              Bio
            </Label>
            <Textarea
              id="bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              disabled={isLoading}
              placeholder="Tell us a bit about yourself..."
              className="border-[#e0d9d3] bg-white min-h-24"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="timezone" className="text-[#3d3d3d]">
              Timezone
            </Label>
            <select
              id="timezone"
              value={timezone}
              onChange={(e) => setTimezone(e.target.value)}
              disabled={isLoading}
              className="flex h-10 rounded-md border border-[#e0d9d3] bg-white px-3 py-2 text-sm"
            >
              <option value="UTC">UTC</option>
              <option value="EST">Eastern Standard Time</option>
              <option value="CST">Central Standard Time</option>
              <option value="MST">Mountain Standard Time</option>
              <option value="PST">Pacific Standard Time</option>
              <option value="GMT">Greenwich Mean Time</option>
              <option value="CET">Central European Time</option>
            </select>
          </div>

          {message && (
            <div
              className={`p-4 rounded-md text-sm ${
                message.type === "success"
                  ? "bg-green-50 text-green-700 border border-green-200"
                  : "bg-red-50 text-red-700 border border-red-200"
              }`}
            >
              {message.text}
            </div>
          )}

          <Button type="submit" disabled={isLoading} className="w-full bg-[#8b7355] hover:bg-[#6b5344] text-white">
            {isLoading ? "Saving..." : "Save Changes"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
