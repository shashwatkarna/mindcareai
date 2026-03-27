"use client"

import { useState, useEffect } from "react"
import { updateUserProfile } from "@/actions/dashboard"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { User, Mail, FileText, Loader2, Globe, Save, Camera } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { motion, AnimatePresence } from "framer-motion"

interface ProfileData {
  id: string
  full_name: string | null
  bio: string | null
  email: string | null
  timezone: string | null
  avatar_url?: string | null
  cover_url?: string | null
}

const DEFAULT_AVATARS = [
  { id: "lotus", url: "/defaults/avatar_lotus.png", label: "Zen Lotus" },
  { id: "mountain", url: "/defaults/avatar_mountain.png", label: "Stable Mountain" },
  { id: "cloud", url: "/defaults/avatar_cloud.png", label: "Peaceful Cloud" },
  { id: "sun", url: "/defaults/avatar_sun.png", label: "Energy Sun" },
]

const DEFAULT_COVERS = [
  { id: "forest", url: "/defaults/cover_forest.png", label: "Misty Forest" },
  { id: "sunset", url: "/defaults/cover_sunset.png", label: "Serene Sunset" },
  { id: "nightsky", url: "/defaults/cover_nightsky.png", label: "Peaceful Night" },
  { id: "abstract", url: "/defaults/cover_abstract.png", label: "Ethereal Flow" },
]

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
  const [avatarUrl, setAvatarUrl] = useState(initialData?.avatar_url || DEFAULT_AVATARS[0].url)
  const [coverUrl, setCoverUrl] = useState(initialData?.cover_url || DEFAULT_COVERS[0].url)
  const [nameChangeCount, setNameChangeCount] = useState(initialNameChangeCount)
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const [isAvatarPickerOpen, setIsAvatarPickerOpen] = useState(false)
  const [isCoverPickerOpen, setIsCoverPickerOpen] = useState(false)

  // Debug log to check the initial data coming from server
  useEffect(() => {
    console.log("Initial Profile Data:", initialData);
  }, [initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage(null)

    try {
      const result = await updateUserProfile(userId, {
        fullName,
        bio,
        timezone,
        avatarUrl,
        coverUrl
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
        <div 
          className="h-32 bg-cover bg-center transition-all duration-500 relative group cursor-pointer overflow-hidden"
          style={{ backgroundImage: `url(${coverUrl})` }}
        >
          <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors" />
          
          <AnimatePresence>
            {!isCoverPickerOpen ? (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsCoverPickerOpen(true)}
                className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <div className="bg-black/50 backdrop-blur-md text-white px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-2 border border-white/20">
                  <Camera className="w-3.5 h-3.5" />
                  Change Cover
                </div>
              </motion.div>
            ) : (
              <motion.div 
                initial={{ y: "100%", opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: "100%", opacity: 0 }}
                className="absolute inset-0 bg-black/80 backdrop-blur-lg z-30 flex items-center justify-center p-4"
              >
                <div className="w-full max-w-lg space-y-3">
                  <div className="flex items-center justify-between text-white">
                    <span className="text-xs font-semibold uppercase tracking-wider opacity-70">Pick a Cover</span>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => setIsCoverPickerOpen(false)}
                      className="h-7 text-[10px] text-white hover:bg-white/10"
                    >
                      Cancel
                    </Button>
                  </div>
                  <div className="grid grid-cols-4 gap-2">
                    {DEFAULT_COVERS.map((cover) => (
                      <button
                        key={cover.id}
                        type="button"
                        onClick={() => {
                          setCoverUrl(cover.url)
                          setIsCoverPickerOpen(false)
                        }}
                        className={`relative h-12 rounded-lg overflow-hidden border-2 transition-all ${
                          coverUrl === cover.url ? "border-primary scale-105 shadow-[0_0_10px_rgba(var(--primary-rgb),0.5)]" : "border-transparent opacity-50 hover:opacity-100"
                        }`}
                      >
                        <img src={cover.url} className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <CardHeader className="-mt-12 relative z-10 space-y-4 pb-2">
          <div className="flex justify-between items-end">
            <div className="relative group p-0.5">
              <Avatar className="h-24 w-24 border-4 border-background shadow-xl">
                <AvatarImage src={avatarUrl} alt={fullName || "User"} />
                <AvatarFallback className="text-2xl font-bold bg-primary/10 text-primary">
                  {fullName?.[0] || "U"}
                </AvatarFallback>
              </Avatar>
              
              <AnimatePresence>
                {!isAvatarPickerOpen ? (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setIsAvatarPickerOpen(true)}
                    className="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity border-4 border-transparent cursor-pointer"
                  >
                    <Camera className="w-6 h-6 text-white" />
                  </motion.div>
                ) : (
                  <motion.div 
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    className="absolute inset-[-10px] rounded-[2rem] bg-background/90 backdrop-blur-xl border border-border shadow-2xl z-40 flex flex-col items-center justify-center p-2"
                  >
                    <div className="grid grid-cols-2 gap-2 mb-2">
                      {DEFAULT_AVATARS.map((avatar) => (
                        <button
                          key={avatar.id}
                          type="button"
                          onClick={() => {
                            setAvatarUrl(avatar.url)
                            setIsAvatarPickerOpen(false)
                          }}
                          className={`rounded-full overflow-hidden border-2 p-0.5 transition-all ${
                            avatarUrl === avatar.url ? "border-primary scale-110 shadow-lg" : "border-transparent opacity-60 hover:opacity-100"
                          }`}
                        >
                          <Avatar className="h-9 w-9">
                            <AvatarImage src={avatar.url} />
                          </Avatar>
                        </button>
                      ))}
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => setIsAvatarPickerOpen(false)}
                      className="h-6 w-full text-[10px]"
                    >
                      Close
                    </Button>
                  </motion.div>
                )}
              </AnimatePresence>
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
