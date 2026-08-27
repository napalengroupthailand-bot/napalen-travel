'use client'

import { Moon, CalendarDays, Sun } from 'lucide-react'
import { useClock } from './use-clock'

export function CalendarRibbon() {
  const clock = useClock()
  return (
    <div className="relative overflow-hidden border-b border-sky-100 bg-white text-deep-blue">
      <span className="pointer-events-none absolute inset-0 light-sweep-slow opacity-30" />
      <div className="relative mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-2 gap-y-1.5 px-2 py-1.5 text-center text-[10px] font-medium sm:gap-x-4 sm:px-4 sm:py-2 sm:text-xs">
        <span className="flex items-center gap-1 rounded-full border border-royal-blue/15 bg-royal-blue/5 px-2.5 py-1 sm:gap-1.5 sm:px-3">
          <Moon className="size-3.5 shrink-0 text-royal-blue" />
          {clock.hijri}
        </span>
        <span className="flex items-center gap-1 rounded-full border border-royal-blue/15 bg-royal-blue/5 px-2.5 py-1 sm:gap-1.5 sm:px-3">
          <CalendarDays className="size-3.5 shrink-0 text-royal-blue" />
          {clock.buddhist}
        </span>
        <span className="flex items-center gap-1 rounded-full border border-royal-blue/15 bg-royal-blue/5 px-2.5 py-1 sm:gap-1.5 sm:px-3">
          <Sun className="size-3.5 shrink-0 text-amber-500" />
          {clock.gregorian}
        </span>
      </div>
    </div>
  )
}
