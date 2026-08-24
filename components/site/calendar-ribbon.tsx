'use client'

import { Moon, CalendarDays, Sun } from 'lucide-react'
import { useClock } from './use-clock'

export function CalendarRibbon() {
  const clock = useClock()
  return (
    <div className="border-b border-border/40 bg-gradient-to-r from-deep-blue via-royal-blue to-deep-blue text-bright-sky">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-5 gap-y-1 px-4 py-2 text-center text-[10px] font-medium sm:text-xs">
        <span className="flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1">
          <Moon className="size-3.5 text-luxury-gold" />
          {clock.hijri}
        </span>
        <span className="flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1">
          <CalendarDays className="size-3.5 text-light-cyan" />
          {clock.buddhist}
        </span>
        <span className="flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1">
          <Sun className="size-3.5 text-luxury-gold" />
          {clock.gregorian}
        </span>
      </div>
    </div>
  )
}
