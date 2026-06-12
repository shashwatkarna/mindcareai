"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { ShieldCheck, Loader2, Key } from "lucide-react"
import { toast } from "sonner"
import Link from "next/link"

export default function AdminLoginPage() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!username || !password) {
      toast.error("Credentials required")
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

      toast.success("Authentication successful")
      router.push("/admin")
      router.refresh()
    } catch (error: any) {
      toast.error(error.message || "Invalid credentials")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-zinc-950 p-4">
      {/* Background glow effects */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="w-full max-w-md relative z-10">
        <div className="flex flex-col items-center mb-8 text-center">
          <div className="w-16 h-16 bg-zinc-900 border border-zinc-800 rounded-2xl flex items-center justify-center mb-6 shadow-2xl">
            <ShieldCheck className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">MindCare Portal</h1>
          <p className="text-zinc-400 mt-2 text-sm">Authorized personnel only.</p>
        </div>

        <Card className="bg-zinc-900/80 border-zinc-800 backdrop-blur-xl shadow-2xl overflow-hidden">
          <form onSubmit={handleLogin}>
            <CardHeader className="space-y-1 pt-8 pb-4 border-b border-zinc-800/50">
              <CardTitle className="text-xl text-zinc-100 flex items-center gap-2">
                <Key className="w-5 h-5 text-zinc-400" />
                System Authentication
              </CardTitle>
              <CardDescription className="text-zinc-400">
                Enter your administrative credentials to proceed.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5 pt-6 pb-6">
              <div className="space-y-2">
                <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider">Admin ID</label>
                <Input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="bg-zinc-950/50 border-zinc-800 text-zinc-100 placeholder:text-zinc-600 focus-visible:ring-primary/50"
                  placeholder="Enter ID"
                  autoComplete="off"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider">Password</label>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-zinc-950/50 border-zinc-800 text-zinc-100 placeholder:text-zinc-600 focus-visible:ring-primary/50"
                  placeholder="••••••••"
                />
              </div>
            </CardContent>
            <CardFooter className="bg-zinc-950/30 border-t border-zinc-800/50 pt-6 pb-8">
              <Button 
                type="submit" 
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg"
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : null}
                Authenticate
              </Button>
            </CardFooter>
          </form>
        </Card>

        <div className="mt-8 text-center">
          <Link href="/" className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors">
            &larr; Return to public site
          </Link>
        </div>
      </div>
    </div>
  )
}
