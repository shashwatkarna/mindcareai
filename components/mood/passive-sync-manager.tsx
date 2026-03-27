"use client"

import { Zap, Info, ShieldCheck } from "lucide-react"

export function PassiveSyncManager() {
    return (
        <div className="flex flex-col items-center justify-center p-12 text-center space-y-4 border-2 border-dashed border-primary/20 rounded-3xl bg-primary/5 min-h-[400px]">
            <div className="p-4 rounded-full bg-primary/10 text-primary animate-pulse">
                <Zap className="w-10 h-10" />
            </div>
            <div className="space-y-1">
                <div className="bg-primary/20 text-primary text-[8px] font-black px-2 py-0.5 rounded-full inline-block mb-1">
                    COMING SOON
                </div>
                <h3 className="text-lg font-bold">Automated Mood Tracking</h3>
                <p className="text-xs text-muted-foreground max-w-[200px] leading-relaxed">
                    We are currently working on this feature to bring you effortless, sensor-based mood logging.
                </p>
            </div>
            <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground pt-4 border-t border-primary/10 w-full justify-center">
                <ShieldCheck className="w-3 h-3 text-emerald-500" />
                Secure Biometric Integration
            </div>
        </div>
    )
}
