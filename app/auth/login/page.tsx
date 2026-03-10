"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Eye, EyeOff, Sparkles, ArrowLeft } from "lucide-react"

export default function LoginPage() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username.trim(),
          password,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || "Invalid username or password")
        return
      }

      router.push("/dashboard")
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "An error occurred during login"
      setError(message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen w-full items-center justify-center p-4 md:p-6 bg-[#0A0118] relative overflow-hidden font-sans selection:bg-purple-500/30">
      {/* Background blobs */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[100px] animate-pulse-slow"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[100px] animate-pulse-slow delay-1000"></div>
      </div>

      <div className="w-full max-w-5xl relative z-10 grid md:grid-cols-2 gap-8 lg:gap-16 items-center">
        {/* Left Side Form (Order 1 on Desktop) */}
        <div className="w-full flex flex-col items-center md:items-start order-2 md:order-1">
          <Link href="/" className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-6 group text-sm font-medium self-start md:ml-2">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Home
          </Link>

          <Card className="border-white/10 bg-white/5 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.3)] animate-scale-in w-full max-w-md relative overflow-hidden">
            <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent"></div>
            <CardContent className="pt-8 px-6 sm:px-8 border-0">

              <form onSubmit={handleLogin} className="flex flex-col gap-5">
                <div className="grid gap-2">
                  <Label htmlFor="username" className="text-gray-200 font-bold text-[15px]">Username</Label>
                  <Input
                    id="username"
                    type="text"
                    placeholder="yourname"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    disabled={isLoading}
                    className="border-white/10 bg-black/20 text-white placeholder:text-gray-600 focus:border-purple-500/50 focus:bg-white/5 focus:ring-2 focus:ring-purple-500/20 transition-all duration-300 h-11"
                    required
                    autoComplete="username"
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="password" className="text-gray-200 font-bold text-[15px]">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      disabled={isLoading}
                      className="border-white/10 bg-black/20 text-white placeholder:text-gray-600 pr-10 focus:border-purple-500/50 focus:bg-white/5 focus:ring-2 focus:ring-purple-500/20 transition-all duration-300 h-11"
                      required
                      autoComplete="current-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {error && (
                  <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm animate-shake">
                    {error}
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white shadow-lg shadow-purple-900/20 transition-all duration-300 mt-2 h-11"
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                      Signing in...
                    </span>
                  ) : "Sign In"}
                </Button>
              </form>

              <div className="mt-8 text-center text-sm text-gray-400">
                Don&apos;t have an account?{" "}
                <Link href="/auth/sign-up" className="text-purple-400 hover:text-purple-300 font-semibold transition-colors">
                  Create one
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Side Branding & Notice (Order 2 on Desktop) */}
        <div className="text-center md:text-left animate-slide-in-down flex flex-col items-center md:items-start order-1 md:order-2 pl-0 md:pl-8">
          <Link href="/" className="inline-flex flex-col md:flex-row items-center md:items-start gap-5 group cursor-pointer mb-4 md:mb-10 hover:opacity-90 transition-opacity">
            <div className="h-14 w-14 md:h-16 md:w-16 bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-purple-500/40 transition-all duration-500 group-hover:scale-105">
              <Sparkles className="w-7 h-7 md:w-8 md:h-8 text-white" />
            </div>
            <div className="flex flex-col justify-center">
              <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-300 tracking-tight">Welcome Back</h1>
              <p className="text-gray-400 mt-2 md:mt-3 text-lg font-light">Sign in to continue your wellness journey.</p>
            </div>
          </Link>

          {/* Desktop Notice */}
          <div className="hidden md:block mt-6 p-6 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-purple-200/90 text-sm leading-relaxed relative overflow-hidden group shadow-[0_0_30px_rgba(168,85,247,0.05)] w-full max-w-md backdrop-blur-sm transition-all hover:bg-purple-500/20 hover:border-purple-500/40">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/0 via-purple-500/10 to-purple-500/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
            <div className="flex items-start gap-4 relative z-10">
              <div className="p-3 bg-purple-500/20 rounded-xl shrink-0 shadow-inner">
                <Sparkles className="w-6 h-6 text-purple-400 animate-pulse" />
              </div>
              <div className="pt-0.5">
                <strong className="text-purple-400 block mb-2 text-base tracking-wide font-semibold">Your Safe Space</strong>
                <p className="text-purple-200/80">Every session is private and anonymous.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
