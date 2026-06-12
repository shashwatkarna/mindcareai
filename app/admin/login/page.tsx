"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Loader2, User, Lock } from "lucide-react"

export default function AdminLoginPage() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState("")
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg("")

    if (!username || !password) {
      setErrorMsg("Credentials required")
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Login failed")
      }

      router.push("/admin")
      router.refresh()
    } catch (error: any) {
      setErrorMsg(error.message || "Invalid credentials")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#f5f5f5]">
      <div className="w-full max-w-[320px] mx-auto p-4 flex flex-col items-center">
        
        <div className="mb-8 w-full text-center border-b-[3px] border-[#1d2a5a] pb-2 inline-block">
          <h1 className="text-3xl font-bold text-black tracking-tight inline">Login</h1>
        </div>

        <form onSubmit={handleLogin} className="w-full space-y-6">
          <div className="relative">
            <User className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 text-black" strokeWidth={2.5} />
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Adminname"
              className="w-full bg-transparent border-0 border-b border-black/30 text-black placeholder:text-black/60 pl-7 py-2 focus:ring-0 focus:border-black transition-colors"
              autoComplete="off"
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 text-black" strokeWidth={2.5} />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full bg-transparent border-0 border-b border-black/30 text-black placeholder:text-black/60 pl-7 py-2 focus:ring-0 focus:border-black transition-colors"
            />
          </div>

          <button 
            type="submit" 
            className="w-full bg-[#1d2a5a] hover:bg-[#152044] text-white py-2.5 rounded-sm shadow-sm transition-colors font-medium flex items-center justify-center mt-2"
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : null}
            Sign In
          </button>
          
          {errorMsg && (
            <p className="text-red-500 text-sm text-center font-medium mt-4">
              {errorMsg}
            </p>
          )}
        </form>
      </div>
    </div>
  )
}
