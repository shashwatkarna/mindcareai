"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"

export default function AuthCallback() {
  const router = useRouter()

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const supabase = createClient()
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession()

        if (error) {
          console.error("Auth callback error:", error)
          router.push("/auth/login")
          return
        }

        if (session) {
          router.push("/dashboard")
        } else {
          router.push("/auth/login")
        }
      } catch (error) {
        console.error("Callback error:", error)
        router.push("/auth/login")
      }
    }

    handleCallback()
  }, [router])

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <p className="text-[#6b6b6b]">Verifying your email...</p>
      </div>
    </div>
  )
}
