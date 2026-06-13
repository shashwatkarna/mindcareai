"use client"

import { useEffect, useState, useRef } from "react"
import { cn } from "@/lib/utils"

interface MediaNetBannerProps {
  id: string; // The specific ad div id like "123456789"
  size?: string; // like "728x90"
  className?: string;
}

export function MediaNetBanner({ id, size = "728x90", className }: MediaNetBannerProps) {
  const [isDev, setIsDev] = useState(false)
  const isLoaded = useRef(false)

  useEffect(() => {
    setIsDev(process.env.NODE_ENV === "development")
    
    if (process.env.NODE_ENV !== "development" && process.env.NEXT_PUBLIC_MEDIANET_CID && !isLoaded.current) {
      try {
        // @ts-ignore
        window._mNHandle = window._mNHandle || {};
        // @ts-ignore
        window._mNHandle.queue = window._mNHandle.queue || [];
        // @ts-ignore
        window._mNHandle.queue.push(function () {
          // @ts-ignore
          window._mNDetails.loadTag(id, size, id);
        });
        isLoaded.current = true;
      } catch (error) {
        console.error("Media.net ad failed to load", error)
      }
    }
  }, [id, size])

  if (isDev || !process.env.NEXT_PUBLIC_MEDIANET_CID) {
    const minHeight = size.includes('x') ? size.split('x')[1] + 'px' : '90px'
    return (
      <div className={cn("w-full bg-slate-100/10 border border-dashed border-slate-500/50 rounded-xl flex items-center justify-center text-slate-500", className)} style={{ minHeight }}>
        <p className="text-sm">Media.net Placeholder ({size})</p>
      </div>
    )
  }

  return (
    <div className={cn("w-full overflow-hidden flex justify-center", className)}>
      <div id={id}></div>
    </div>
  )
}
