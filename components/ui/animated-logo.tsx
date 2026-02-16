"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { useEffect, useState } from "react"

interface AnimatedLogoProps {
    href?: string
    size?: "sm" | "md" | "lg"
    showSubtitle?: boolean
    className?: string
}

export function AnimatedLogo({ href = "/", size = "md", showSubtitle = false, className = "" }: AnimatedLogoProps) {
    const [isHovered, setIsHovered] = useState(false)
    const [hasAnimated, setHasAnimated] = useState(false)

    useEffect(() => {
        // Trigger initial animation
        const timer = setTimeout(() => setHasAnimated(true), 100)
        return () => clearTimeout(timer)
    }, [])

    const sizes = {
        sm: { logo: "w-8 h-8", text: "text-lg", subtitle: "text-[10px]" },
        md: { logo: "w-10 h-10", text: "text-xl md:text-2xl", subtitle: "text-[11px]" },
        lg: { logo: "w-12 h-12", text: "text-2xl", subtitle: "text-xs" }
    }

    const currentSize = sizes[size]

    // Text animation variants - letter by letter reveal
    const textVariants = {
        hidden: { opacity: 0 },
        visible: (i: number) => ({
            opacity: 1,
            transition: {
                delay: i * 0.05,
                duration: 0.3,
            }
        })
    }

    // Logo animation
    const logoVariants = {
        initial: { scale: 0, rotate: -180 },
        animate: {
            scale: 1,
            rotate: 0,
            transition: {
                type: "spring",
                stiffness: 260,
                damping: 20,
                duration: 0.6
            }
        }
    }

    const text = "MindCare AI"
    const letters = text.split("")

    const content = (
        <div
            className={`flex items-center gap-3 group ${className}`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Animated Logo */}
            <div className="relative shrink-0">
                {/* Glow effect */}
                <motion.div
                    className="absolute inset-0 bg-primary/30 rounded-full blur-xl"
                    animate={{
                        opacity: isHovered ? 1 : 0.5,
                        scale: isHovered ? 1.2 : 1,
                    }}
                    transition={{ duration: 0.3 }}
                />

                {/* Logo */}
                <motion.img
                    src="/logo.png"
                    alt="MindCare AI"
                    className={`${currentSize.logo} object-contain relative z-10 drop-shadow-xl`}
                    variants={logoVariants}
                    initial="initial"
                    animate={hasAnimated ? "animate" : "initial"}
                    whileHover={{
                        scale: 1.1,
                        rotate: [0, -5, 5, 0],
                        transition: { duration: 0.5 }
                    }}
                />
            </div>

            {/* Animated Text */}
            <div className="overflow-hidden">
                <div className={`font-bold ${currentSize.text} tracking-tight flex`}>
                    {letters.map((letter, index) => (
                        <motion.span
                            key={index}
                            custom={index}
                            variants={textVariants}
                            initial="hidden"
                            animate={hasAnimated ? "visible" : "hidden"}
                            className={`inline-block bg-clip-text text-transparent bg-gradient-to-r from-primary ${letter === " " ? "w-2" : ""
                                }`}
                            style={{
                                backgroundImage: isHovered
                                    ? "linear-gradient(to right, rgb(139, 92, 246), rgb(236, 72, 153), rgb(139, 92, 246))"
                                    : "linear-gradient(to right, rgb(139, 92, 246), rgb(147, 51, 234))"
                            }}
                            whileHover={{
                                scale: 1.2,
                                y: -2,
                                transition: { duration: 0.2 }
                            }}
                        >
                            {letter === " " ? "\u00A0" : letter}
                        </motion.span>
                    ))}
                </div>

                {showSubtitle && (
                    <motion.p
                        className={`${currentSize.subtitle} text-muted-foreground uppercase tracking-wider font-semibold whitespace-nowrap`}
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.8, duration: 0.4 }}
                    >
                        Wellness Companion
                    </motion.p>
                )}
            </div>
        </div>
    )

    if (href) {
        return <Link href={href}>{content}</Link>
    }

    return content
}
