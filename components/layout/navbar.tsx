"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Moon, Sun } from "lucide-react"
import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"

export function Navbar() {
    const [isDark, setIsDark] = useState(false)
    const [scrolled, setScrolled] = useState(false)
    const pathname = usePathname()

    useEffect(() => {
        setIsDark(document.documentElement.classList.contains("dark"))

        const handleScroll = () => {
            setScrolled(window.scrollY > 20)
        }
        window.addEventListener("scroll", handleScroll)
        return () => window.removeEventListener("scroll", handleScroll)
    }, [])

    const toggleTheme = () => {
        const html = document.documentElement
        html.classList.toggle("dark")
        setIsDark(!isDark)
        localStorage.setItem("theme", isDark ? "light" : "dark")
    }

    const isActive = (path: string) => pathname === path

    return (
        <nav
            className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? "bg-background/80 backdrop-blur-md border-b border-border shadow-sm" : "bg-transparent"
                }`}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <Link href="/" className="flex items-center gap-2 group">
                        <div className="relative">
                            <div className="absolute inset-0 bg-primary/20 rounded-full blur-lg opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            <img src="/logo.png" alt="MindCare AI" className="w-10 h-10 object-contain relative z-10" />
                        </div>
                        <span className="font-bold text-xl tracking-tight">MindCare AI</span>
                    </Link>
                </div>

                <div className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
                    <Link
                        href="/features"
                        className={`transition-colors hover:text-primary ${isActive('/features') ? 'text-primary font-semibold' : ''}`}
                    >
                        Features
                    </Link>
                    <Link
                        href="/about"
                        className={`transition-colors hover:text-primary ${isActive('/about') ? 'text-primary font-semibold' : ''}`}
                    >
                        About
                    </Link>
                    <Link
                        href="/contact"
                        className={`transition-colors hover:text-primary ${isActive('/contact') ? 'text-primary font-semibold' : ''}`}
                    >
                        Contact
                    </Link>
                </div>

                <div className="flex items-center gap-4">
                    <button
                        onClick={toggleTheme}
                        className="p-2 rounded-full hover:bg-muted transition-colors duration-200 text-muted-foreground hover:text-foreground"
                        aria-label="Toggle theme"
                    >
                        {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                    </button>
                    <Link href="/auth/login" className="hidden sm:block">
                        <Button variant="ghost" className="hover:bg-primary/10 hover:text-primary transition-colors duration-200">
                            Sign In
                        </Button>
                    </Link>
                    <Link href="/auth/sign-up">
                        <Button className="bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all duration-300">
                            Get Started
                        </Button>
                    </Link>
                </div>
            </div>
        </nav>
    )
}
