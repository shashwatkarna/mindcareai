"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Moon, Sun, Menu, X, ArrowRight } from "lucide-react"
import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"
import { useTheme } from "next-themes"
import { motion, AnimatePresence } from "framer-motion"

export function Navbar() {
    const { theme, setTheme } = useTheme()
    const [scrolled, setScrolled] = useState(false)
    const [isOpen, setIsOpen] = useState(false)
    const [mounted, setMounted] = useState(false)
    const pathname = usePathname()

    useEffect(() => {
        setMounted(true)
        const handleScroll = () => {
            setScrolled(window.scrollY > 20)
        }
        window.addEventListener("scroll", handleScroll)
        return () => window.removeEventListener("scroll", handleScroll)
    }, [])

    const isActive = (path: string) => pathname === path

    const navLinks = [
        { href: "/features", label: "Features" },
        { href: "/about", label: "About" },
        { href: "/contact", label: "Contact" },
    ]

    // Animation variants for mobile menu
    const menuVariants = {
        closed: { opacity: 0, scale: 0.95 },
        open: { opacity: 1, scale: 1, transition: { staggerChildren: 0.1, delayChildren: 0.2 } }
    }

    const linkVariants = {
        closed: { y: 20, opacity: 0 },
        open: { y: 0, opacity: 1 }
    }

    return (
        <>
            <motion.nav
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.5 }}
                className={`fixed left-0 right-0 z-50 transition-all duration-500 ease-in-out ${scrolled
                        ? "top-4 mx-auto w-[92%] max-w-5xl rounded-full bg-background/60 backdrop-blur-xl border border-border/40 shadow-xl"
                        : "top-0 w-full bg-transparent border-b border-transparent"
                    }`}
            >
                <div className="px-6 md:px-8 h-16 md:h-20 flex items-center justify-between">
                    {/* Logo Section */}
                    <div className="flex items-center gap-3">
                        <Link href="/" className="flex items-center gap-3 group">
                            <div className="relative">
                                <div className="absolute inset-0 bg-primary/30 rounded-full blur-xl opacity-50 group-hover:opacity-100 transition-opacity duration-500"></div>
                                <img
                                    src="/logo.png"
                                    alt="MindCare AI"
                                    className="w-9 h-9 md:w-10 md:h-10 object-contain relative z-10 transition-transform group-hover:scale-110 duration-300"
                                />
                            </div>
                            <span className="font-bold text-xl md:text-2xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-600">
                                MindCare AI
                            </span>
                        </Link>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-1">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`relative px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 hover:bg-primary/5 ${isActive(link.href) ? "text-primary" : "text-muted-foreground hover:text-foreground"
                                    }`}
                            >
                                {link.label}
                                {isActive(link.href) && (
                                    <motion.div
                                        layoutId="navbar-indicator"
                                        className="absolute inset-0 bg-primary/10 rounded-full -z-10"
                                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                    />
                                )}
                            </Link>
                        ))}
                    </div>

                    {/* Desktop Actions */}
                    <div className="hidden md:flex items-center gap-4">
                        <button
                            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                            className="p-2 rounded-full hover:bg-muted transition-colors duration-200 text-muted-foreground hover:text-foreground active:scale-95"
                            aria-label="Toggle theme"
                        >
                            {mounted ? (
                                theme === "dark" ? (
                                    <Sun className="w-5 h-5 text-yellow-500 transition-all" />
                                ) : (
                                    <Moon className="w-5 h-5 text-indigo-600 transition-all" />
                                )
                            ) : (
                                <div className="w-5 h-5" />
                            )}
                        </button>

                        <Link href="/auth/login">
                            <Button variant="ghost" className="text-sm font-medium hover:bg-transparent hover:text-primary transition-colors">
                                Sign In
                            </Button>
                        </Link>

                        <Link href="/auth/sign-up">
                            <div className="relative group">
                                <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-600 to-purple-600 rounded-lg blur opacity-60 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-tilt"></div>
                                <Button className="relative bg-black dark:bg-white text-white dark:text-black overflow-hidden px-6 transition-all hover:scale-105 active:scale-95">
                                    <span className="relative z-10 flex items-center gap-2 font-semibold">
                                        Get Started <ArrowRight className="w-4 h-4" />
                                    </span>
                                    {/* Shimmer Effect */}
                                    <div className="absolute top-0 -inset-full h-full w-1/2 z-5 block transform -skew-x-12 bg-gradient-to-r from-transparent to-white opacity-40 group-hover:animate-shine" />
                                </Button>
                            </div>
                        </Link>
                    </div>

                    {/* Mobile Menu Toggle */}
                    <div className="md:hidden flex items-center gap-4">
                        <button
                            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                            className="p-2 rounded-full hover:bg-muted transition-colors duration-200 text-muted-foreground"
                        >
                            {mounted && (theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />)}
                        </button>

                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="p-2 text-foreground focus:outline-none z-50 relative"
                            aria-label="Toggle menu"
                        >
                            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>
            </motion.nav>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial="closed"
                        animate="open"
                        exit="closed"
                        variants={menuVariants}
                        className="fixed inset-0 z-40 bg-background/95 backdrop-blur-2xl flex flex-col justify-center items-center md:hidden"
                    >
                        <div className="flex flex-col gap-8 text-center">
                            {navLinks.map((link) => (
                                <motion.div key={link.href} variants={linkVariants}>
                                    <Link
                                        href={link.href}
                                        onClick={() => setIsOpen(false)}
                                        className={`text-4xl font-bold tracking-tight transition-colors ${isActive(link.href) ? "text-primary" : "text-foreground/80"
                                            }`}
                                    >
                                        {link.label}
                                    </Link>
                                </motion.div>
                            ))}

                            <motion.div variants={linkVariants} className="h-px w-24 bg-border mx-auto my-4" />

                            <motion.div variants={linkVariants} className="flex flex-col gap-4">
                                <Link href="/auth/login" onClick={() => setIsOpen(false)}>
                                    <Button variant="ghost" className="text-xl">Sign In</Button>
                                </Link>
                                <Link href="/auth/sign-up" onClick={() => setIsOpen(false)}>
                                    <Button size="lg" className="text-lg bg-primary hover:bg-primary/90 rounded-full px-8">Get Started</Button>
                                </Link>
                            </motion.div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    )
}
