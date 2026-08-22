'use client'

import { Moon, CalendarDays, Sun } from 'lucide-react'
import { useClock } from './use-clock'

export function CalendarRibbon() {
  const clock = useClock()
  return (
    <div className="border-b border-luxury-gold/20 bg-royal-blue text-bright-sky">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-6 gap-y-1 px-4 py-1.5 text-center text-xs font-medium">
        <span className="flex items-center gap-1.5">
          <Moon className="size-3.5 text-luxury-gold" />
          {clock.hijri}
        </span>
        <span className="hidden text-bright-sky/40 sm:inline">|</span>
        <span className="flex items-center gap-1.5">
          <CalendarDays className="size-3.5 text-light-cyan" />
          {clock.buddhist}
        </span>
        <span className="hidden text-bright-sky/40 sm:inline">|</span>
        <span className="flex items-center gap-1.5">
          <Sun className="size-3.5 text-luxury-gold" />
          {clock.gregorian}
        </span>
      </div>
    </div>
  )
}
