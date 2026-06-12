"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { LogOut } from "lucide-react"
import { toast } from "sonner"

export function AdminLogoutButton() {
  const router = useRouter()

  const handleLogout = async () => {
    try {
      await fetch("/api/admin/logout", { method: "POST" })
      toast.success("Logged out successfully")
      router.push("/admin/login")
      router.refresh()
    } catch (error) {
      toast.error("Failed to logout")
    }
  }

  return (
    <Button variant="ghost" size="sm" onClick={handleLogout} className="text-muted-foreground hover:text-foreground">
      <LogOut className="w-4 h-4 mr-2" />
      Sign Out
    </Button>
  )
}
