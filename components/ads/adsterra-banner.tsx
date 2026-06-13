"use client"

import { useEffect, useRef, useState } from "react"
import { cn } from "@/lib/utils"

interface AdsterraBannerProps {
  adKey: string; // The 32-character key Adsterra gives you
  width?: number;
  height?: number;
  className?: string;
}

export function AdsterraBanner({ adKey, width = 728, height = 90, className }: AdsterraBannerProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (adKey && containerRef.current && !containerRef.current.hasChildNodes()) {
      // Adsterra configuration
      const confScript = document.createElement('script')
      confScript.type = 'text/javascript'
      confScript.innerHTML = `
        atOptions = {
          'key' : '${adKey}',
          'format' : 'iframe',
          'height' : ${height},
          'width' : ${width},
          'params' : {}
        };
      `
      
      const invokeScript = document.createElement('script')
      invokeScript.type = 'text/javascript'
      invokeScript.src = `//www.highperformanceformat.com/${adKey}/invoke.js`
      
      containerRef.current.appendChild(confScript)
      containerRef.current.appendChild(invokeScript)
    }
  }, [adKey, width, height])

  if (!adKey) {
    return (
      <div className={cn("w-full bg-slate-100/10 border border-dashed border-slate-500/50 rounded-xl flex items-center justify-center text-slate-500", className)} style={{ minHeight: height, maxWidth: width, width: '100%' }}>
        <p className="text-sm">Adsterra Ad Placeholder ({width}x{height})</p>
      </div>
    )
  }

  return (
    <div className={cn("w-full overflow-hidden flex justify-center", className)}>
      <div ref={containerRef}></div>
    </div>
  )
}
