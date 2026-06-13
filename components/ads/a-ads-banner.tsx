"use client"

import { cn } from "@/lib/utils"

interface AAdsBannerProps {
  adUnitId: string; // e.g. "2313620"
  width?: number | string;
  height?: number | string;
  className?: string;
}

export function AAdsBanner({ adUnitId, width = 728, height = 90, className }: AAdsBannerProps) {
  // A-ADS is basically just an iframe, so it's very easy to integrate
  
  if (!adUnitId || process.env.NODE_ENV === "development") {
      return (
          <div className={cn("w-full bg-slate-100/10 border border-dashed border-slate-500/50 rounded-xl flex items-center justify-center text-slate-500", className)} style={{ minHeight: height, maxWidth: width, width: "100%" }}>
            <p className="text-sm">A-ADS Placeholder ({width}x{height})</p>
          </div>
      )
  }

  return (
    <div className={cn("w-full overflow-hidden flex justify-center", className)}>
      <iframe
        src={`https://ad.a-ads.com/${adUnitId}?size=${width}x${height}`}
        width={width}
        height={height}
        style={{ border: "none", padding: 0, margin: 0, overflow: "hidden" }}
        title="A-ADS Banner"
        allowTransparency={true}
      />
    </div>
  )
}
