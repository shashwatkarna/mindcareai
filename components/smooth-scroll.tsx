"use client"

import { ReactLenis } from 'lenis/react'
import { ReactNode } from 'react'

export function SmoothScroll({ 
  children, 
  root = true,
  className = ""
}: { 
  children: ReactNode,
  root?: boolean,
  className?: string
}) {
  return (
    <ReactLenis root={root} className={className} options={{ lerp: 0.1, duration: 1.2, smoothWheel: true }}>
      {children}
    </ReactLenis>
  )
}
