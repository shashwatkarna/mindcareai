"use client"

import * as React from "react"
import { motion, HTMLMotionProps } from "framer-motion"
import { Button, ButtonProps } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type HapticButtonProps = ButtonProps & {
    hapticStrength?: "light" | "medium" | "heavy"
}

export const HapticButton = React.forwardRef<HTMLButtonElement, HapticButtonProps>(
    ({ className, hapticStrength = "medium", ...props }, ref) => {
        const variants = {
            light: { scale: 0.98, x: 0 },
            medium: { scale: 0.95, x: 0 },
            heavy: { scale: 0.9, x: 0 },
        }

        return (
            <motion.div
                whileHover={{ scale: 1.02, y: -1 }}
                whileTap={variants[hapticStrength]}
                transition={{ type: "spring", stiffness: 400, damping: 15 }}
                className="w-fit h-fit"
            >
                <Button
                    ref={ref}
                    className={cn(className)}
                    {...props}
                />
            </motion.div>
        )
    }
)

HapticButton.displayName = "HapticButton"
