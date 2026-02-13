"use client"

import { useState } from "react"
import { updateUserProfile } from "@/actions/dashboard"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { User, Mail, FileText, Loader2, Globe, Save } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface ProfileData {
  id: string
  full_name: string | null
  bio: string | null
  email: string | null
  timezone: string | null
  avatar_url?: string | null
}

const TIMEZONES = [
  "UTC",
  "America/New_York",
  "America/Los_Angeles",
  "America/Chicago",
  "Europe/London",
  "Europe/Paris",
  "Europe/Berlin",
  "Asia/Tokyo",
  "Asia/Dubai",
  "Asia/Singapore",
  "Australia/Sydney",
  "Pacific/Auckland",
]

export function ProfileForm({ initialData, userId, initialNameChangeCount }: { initialData: ProfileData | null, userId: string, initialNameChangeCount: number }) {
  const [fullName, setFullName] = useState(initialData?.full_name || "")
  const [bio, setBio] = useState(initialData?.bio || "")
  const [timezone, setTimezone] = useState(initialData?.timezone || "UTC")
  const [nameChangeCount, setNameChangeCount] = useState(initialNameChangeCount)
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage(null)

    try {
      const result = await updateUserProfile(userId, {
        fullName,
        bio,
        timezone
      })

      if (result && result.success) {
        setMessage({ type: "success", text: "Profile updated successfully!" })
        if (result.nameChangeCount !== undefined) {
          setNameChangeCount(result.nameChangeCount)
        }
        setTimeout(() => setMessage(null), 3000)
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to update profile"
      setMessage({ type: "error", text: errorMessage })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Feedback Message */}
      {message && (
        <div
          className={`p-4 rounded-lg flex items-center gap-2 text-sm font-medium animate-in fade-in slide-in-from-top-2 ${message.type === "success"
              ? "bg-green-50 text-green-700 border border-green-200"
              : "bg-red-50 text-red-700 border border-red-200"
            }`}
        >
          {message.type === "success" ? "✅" : "⚠️"} {message.text}
        </div>
      )}

      <Card className="border-border shadow-sm overflow-hidden">
        <div className="h-32 bg-gradient-to-r from-primary/10 to-purple-500/10 dark:from-primary/5 dark:to-purple-500/5" />
        <CardHeader className="-mt-12 relative z-10 space-y-4 pb-2">
          <div className="flex justify-between items-end">
            <div className="relative group">
              <Avatar className="h-24 w-24 border-4 border-background shadow-xl">
                <AvatarImage src={initialData?.avatar_url || ""} alt={initialData?.full_name || "User"} />
                <AvatarFallback className="text-2xl font-bold bg-primary/10 text-primary">
                  {initialData?.full_name?.[0] || "U"}
                </AvatarFallback>
              </Avatar>
              <div className="absolute bottom-0 right-0 p-1.5 bg-background rounded-full border border-border shadow-sm cursor-pointer hover:bg-muted transition-colors" title="Change Avatar (Coming Soon)">
                <div className="w-3 h-3 bg-green-500 rounded-full border-2 border-background" />
              </div>
            </div>
          </div>

          <div>
            <CardTitle className="text-2xl">{initialData?.full_name || "User Profile"}</CardTitle>
            <CardDescription>
              Manage your personal information and public profile settings.
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6 mt-4">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="fullName" className="flex items-center gap-2">
                    <User className="w-4 h-4 text-muted-foreground" />
                    Full Name
                  </Label>
                  <span className={`text-[10px] ${nameChangeCount >= 3 ? "text-red-500 font-bold" : "text-muted-foreground"}`}>
                    {3 - nameChangeCount} changes remaining
                  </span>
                </div>
                <Input
                  id="fullName"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  disabled={isLoading}
                  className="bg-muted/50 focus:bg-background transition-colors"
                  placeholder="e.g. Jane Doe"
                />
                {nameChangeCount >= 3 && (
                  <p className="text-[10px] text-red-500">Name change limit reached.</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  Email Address
                </Label>
                <Input
                  id="email"
                  value={initialData?.email || ""}
                  disabled
                  className="bg-muted/50 opacity-70 cursor-not-allowed"
                />
                <p className="text-[10px] text-muted-foreground">Contact support to change email.</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="timezone" className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-muted-foreground" />
                  Timezone
                </Label>
                <Select value={timezone} onValueChange={setTimezone} disabled={isLoading}>
                  <SelectTrigger className="bg-muted/50 focus:bg-background transition-colors">
                    <SelectValue placeholder="Select timezone" />
                  </SelectTrigger>
                  <SelectContent>
                    {TIMEZONES.map((tz) => (
                      <SelectItem key={tz} value={tz}>
                        {tz}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio" className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-muted-foreground" />
                Bio
              </Label>
              <Textarea
                id="bio"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                disabled={isLoading}
                placeholder="Tell us a little about yourself..."
                className="resize-none min-h-[120px] bg-muted/50 focus:bg-background transition-colors"
              />
              <p className="text-xs text-muted-foreground text-right">
                {bio.length}/500 characters
              </p>
            </div>

            <div className="flex justify-end pt-4 border-t border-border/50">
              <Button type="submit" disabled={isLoading} className="min-w-[140px] gap-2">
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
