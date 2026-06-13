"use client"

import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"

interface AdSenseBannerProps {
  dataAdSlot: string;
  dataAdFormat?: string;
  className?: string;
}

export function AdSenseBanner({ dataAdSlot, dataAdFormat = "auto", className }: AdSenseBannerProps) {
  const [isDev, setIsDev] = useState(false)

  useEffect(() => {
    setIsDev(process.env.NODE_ENV === "development")
    
    // Only attempt to push ads in production or if ID is available
    if (process.env.NODE_ENV !== "development" && process.env.NEXT_PUBLIC_ADSENSE_ID) {
      try {
        // @ts-ignore
        (window.adsbygoogle = window.adsbygoogle || []).push({})
      } catch (err) {
        console.error("AdSense error", err)
      }
    }
  }, [])

  if (isDev || !process.env.NEXT_PUBLIC_ADSENSE_ID) {
    return (
      <div className={cn("w-full bg-slate-100/10 border border-dashed border-slate-500/50 rounded-xl flex items-center justify-center text-slate-500 min-h-[100px]", className)}>
        <p className="text-sm">Google AdSense Placeholder (ID: {dataAdSlot})</p>
      </div>
    )
  }

  return (
    <div className={cn("w-full overflow-hidden flex justify-center", className)}>
      <ins
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client={process.env.NEXT_PUBLIC_ADSENSE_ID}
        data-ad-slot={dataAdSlot}
        data-ad-format={dataAdFormat}
        data-full-width-responsive="true"
      />
    </div>
  )
}
