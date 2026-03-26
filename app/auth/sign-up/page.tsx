"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Eye, EyeOff, Sparkles, ShieldAlert, ArrowLeft } from "lucide-react"

export default function SignUpPage() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [fullName, setFullName] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [agreeToTerms, setAgreeToTerms] = useState(false)
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuggestions([])

    // Validation
    if (!username.trim()) {
      setError("Please enter a username")
      return
    }

    if (username.length < 3) {
      setError("Username must be at least 3 characters")
      return
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match")
      return
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters long")
      return
    }

    if (!agreeToTerms) {
      setError("You must agree to the terms and privacy policy")
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch("/api/auth/sign-up", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username.trim(),
          password,
          fullName: fullName.trim() || username.trim(),
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || "Sign up failed")
        if (data.suggestions && data.suggestions.length > 0) {
          setSuggestions(data.suggestions)
        }
        return
      }

      router.push("/auth/sign-up-success")
    } catch (error) {
      const message = error instanceof Error ? error.message : "An error occurred during sign up"
      setError(message)
    } finally {
      setIsLoading(false)
    }
  }

  const applySuggestion = (suggestion: string) => {
    setUsername(suggestion)
    setSuggestions([])
    setError(null)
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
              {/* Mobile-only notice */}
              <div className="md:hidden mb-6 p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200/90 text-xs leading-relaxed relative overflow-hidden">
                <div className="flex items-start gap-3 relative z-10">
                  <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-amber-400 block mb-1">Fully Anonymous</strong>
                    Write down your credentials. They <strong>cannot be recovered</strong>.
                  </div>
                </div>
              </div>

              <form onSubmit={handleSignUp} className="flex flex-col gap-5">
                <div className="grid gap-2">
                  <Label htmlFor="username" className="text-gray-200 font-bold text-[15px]">Username</Label>
                  <Input
                    id="username"
                    type="text"
                    placeholder="yourname"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    disabled={isLoading}
                    className="font-audiowide border-white/10 bg-black/20 text-white placeholder:font-sans placeholder:text-gray-600 focus:border-purple-500/50 focus:bg-white/5 focus:ring-2 focus:ring-purple-500/20 transition-all duration-300 h-11"
                    required
                  />
                  <div className="flex justify-between items-start pt-1">
                    <p className="text-xs text-gray-500">3+ characters, letters and numbers only</p>
                  </div>
                  
                  {/* Suggestions UI (Aetheric Glass Design System by Stitch) */}
                  {suggestions.length > 0 && (
                    <div className="mt-4 animate-slide-in-up bg-[#1c1a24]/60 backdrop-blur-2xl shadow-[0_20px_60px_-15px_rgba(93,33,223,0.2)] rounded-2xl p-4 border border-[#494456]/30 relative overflow-hidden group/popup">
                      
                      {/* Inner Glow Effect */}
                      <div className="absolute inset-0 bg-gradient-to-br from-[#5d21df]/5 to-[#00a7f1]/5 pointer-events-none opacity-50 group-hover/popup:opacity-100 transition-opacity duration-500"></div>
                      
                      <p className="mb-3 font-semibold flex gap-2 items-center text-[10px] uppercase tracking-[0.1em] text-[#cdbdff] relative z-10">
                        Use this
                      </p>
                      <div className="flex flex-wrap gap-2.5 relative z-10">
                        {suggestions.map((s, i) => (
                          <button
                            key={i}
                            type="button"
                            onClick={() => applySuggestion(s)}
                            className="text-xs font-audiowide bg-[#36333e]/40 hover:bg-[#5d21df]/20 hover:border-[#cdbdff]/30 hover:shadow-[inset_0_0_0_1px_rgba(205,189,255,0.3)] transition-all duration-300 border border-[#494456]/20 rounded-lg px-3.5 py-2 text-[#e6e0ee] cursor-pointer"
                          >
                            {s}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="fullName" className="text-gray-200 font-bold text-[15px]">Full Name <span className="text-gray-500 font-normal text-sm ml-1">(Optional)</span></Label>
                  <Input
                    id="fullName"
                    type="text"
                    placeholder="John Doe"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    disabled={isLoading}
                    className="font-audiowide border-white/10 bg-black/20 text-white placeholder:font-sans placeholder:text-gray-600 focus:border-purple-500/50 focus:bg-white/5 focus:ring-2 focus:ring-purple-500/20 transition-all duration-300 h-11"
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
                      className="font-audiowide border-white/10 bg-black/20 text-white placeholder:font-sans placeholder:text-gray-600 pr-10 focus:border-purple-500/50 focus:bg-white/5 focus:ring-2 focus:ring-purple-500/20 transition-all duration-300 h-11"
                      required
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

                <div className="grid gap-2">
                  <Label htmlFor="confirmPassword" className="text-gray-200 font-bold text-[15px]">Confirm Password</Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      disabled={isLoading}
                      className="font-audiowide border-white/10 bg-black/20 text-white placeholder:font-sans placeholder:text-gray-600 pr-10 focus:border-purple-500/50 focus:bg-white/5 focus:ring-2 focus:ring-purple-500/20 transition-all duration-300 h-11"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-start space-x-2 pt-2">
                  <Checkbox
                    id="terms"
                    checked={agreeToTerms}
                    onCheckedChange={(checked) => setAgreeToTerms(checked as boolean)}
                    disabled={isLoading}
                    className="border-white/20 data-[state=checked]:bg-purple-600 data-[state=checked]:border-purple-600"
                  />
                  <Label htmlFor="terms" className="text-sm font-normal cursor-pointer leading-relaxed text-gray-400">
                    I agree to the{" "}
                    <Link href="/privacy" className="text-purple-400 hover:text-purple-300 hover:underline">
                      privacy policy
                    </Link>{" "}
                    and{" "}
                    <Link href="/terms" className="text-purple-400 hover:text-purple-300 hover:underline">
                      terms of service
                    </Link>
                  </Label>
                </div>

                {error && (
                  <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm animate-shake">
                    {error}
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={isLoading || !agreeToTerms}
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white shadow-lg shadow-purple-900/20 transition-all duration-300 mt-2 h-11"
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                      Creating account...
                    </span>
                  ) : "Create Account"}
                </Button>
              </form>

              <div className="mt-8 text-center text-sm text-gray-400">
                Already have an account?{" "}
                <Link href="/auth/login" className="text-purple-400 hover:text-purple-300 font-semibold transition-colors">
                  Sign in
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Side Branding & Notice (Order 2 on Desktop) */}
        <div className="text-center md:text-left animate-slide-in-down flex flex-col items-center md:items-start order-1 md:order-2 pl-0 md:pl-8">
          <Link href="/" className="inline-flex flex-col md:flex-row items-center md:items-start gap-5 group cursor-pointer mb-4 md:mb-10 hover:opacity-90 transition-opacity">
            <div className="h-14 w-14 md:h-16 md:w-16 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-purple-500/40 transition-all duration-500 group-hover:scale-105 backdrop-blur-sm">
              <img src="/logo.png" alt="MindCare AI Logo" className="w-8 h-8 md:w-10 md:h-10 object-contain drop-shadow-md" />
            </div>
            <div className="flex flex-col justify-center">
              <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-300 tracking-tight">Join MindCare</h1>
              <p className="text-gray-400 mt-2 md:mt-3 text-lg font-light">Start your deeply personal mental health journey today.</p>
            </div>
          </Link>

          {/* Desktop Notice */}
          <div className="hidden md:block mt-6 p-6 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-200/90 text-sm leading-relaxed relative overflow-hidden group shadow-[0_0_30px_rgba(245,158,11,0.05)] w-full max-w-md backdrop-blur-sm transition-all hover:bg-amber-500/20 hover:border-amber-500/40">
            <div className="absolute inset-0 bg-gradient-to-r from-amber-500/0 via-amber-500/10 to-amber-500/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
            <div className="flex items-start gap-4 relative z-10">
              <div className="p-3 bg-amber-500/20 rounded-xl shrink-0 shadow-inner">
                <ShieldAlert className="w-6 h-6 text-amber-400 animate-pulse" />
              </div>
              <div className="pt-0.5">
                <strong className="text-amber-400 block mb-2 text-base tracking-wide font-semibold">Strictly Anonymous</strong>
                <p className="text-amber-200/80">We collect zero personal data. Write down your credentials carefully—they <span className="font-bold border-b border-amber-400/50 pb-0.5 text-amber-300">cannot be recovered</span> if lost.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
