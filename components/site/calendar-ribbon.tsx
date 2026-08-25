'use client'

import { Moon, CalendarDays, Sun } from 'lucide-react'
import { useClock } from './use-clock'

export function CalendarRibbon() {
  const clock = useClock()
  return (
    <div className="border-b border-white/15 bg-white/10 text-bright-sky backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-3 gap-y-1.5 px-3 py-2 text-center text-[10px] font-medium sm:gap-x-5 sm:px-4 sm:text-xs">
        <span className="flex items-center gap-1.5 rounded-full border border-white/30 bg-white/10 px-3 py-1 shadow-[0_0_12px_rgba(255,255,255,0.08)] backdrop-blur-sm">
          <Moon className="size-3.5 text-luxury-gold" />
          {clock.hijri}
        </span>
        <span className="flex items-center gap-1.5 rounded-full border border-white/30 bg-white/10 px-3 py-1 shadow-[0_0_12px_rgba(255,255,255,0.08)] backdrop-blur-sm">
          <CalendarDays className="size-3.5 text-light-cyan" />
          {clock.buddhist}
        </span>
        <span className="flex items-center gap-1.5 rounded-full border border-white/30 bg-white/10 px-3 py-1 shadow-[0_0_12px_rgba(255,255,255,0.08)] backdrop-blur-sm">
          <Sun className="size-3.5 text-luxury-gold" />
          {clock.gregorian}
        </span>
      </div>
    </div>
  )
}
