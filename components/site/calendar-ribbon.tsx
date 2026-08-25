'use client'

import { Moon, CalendarDays, Sun } from 'lucide-react'
import { useClock } from './use-clock'

export function CalendarRibbon() {
  const clock = useClock()
  return (
    <div className="border-b border-white/10 bg-deep-blue/75 text-bright-sky backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-3 gap-y-1.5 px-3 py-2 text-center text-[10px] font-medium sm:gap-x-5 sm:px-4 sm:text-xs">
        <span className="flex items-center gap-1.5 rounded-full border border-white/25 bg-white/15 px-3 py-1 shadow-[inset_0_1px_0_rgba(255,255,255,0.25)] backdrop-blur-md">
          <Moon className="size-3.5 shrink-0 text-luxury-gold" />
          <span className="text-bright-sky">{clock.hijri}</span>
        </span>
        <span className="flex items-center gap-1.5 rounded-full border border-white/25 bg-white/15 px-3 py-1 shadow-[inset_0_1px_0_rgba(255,255,255,0.25)] backdrop-blur-md">
          <CalendarDays className="size-3.5 shrink-0 text-light-cyan" />
          <span className="text-bright-sky">{clock.buddhist}</span>
        </span>
        <span className="flex items-center gap-1.5 rounded-full border border-white/25 bg-white/15 px-3 py-1 shadow-[inset_0_1px_0_rgba(255,255,255,0.25)] backdrop-blur-md">
          <Sun className="size-3.5 shrink-0 text-luxury-gold" />
          <span className="text-bright-sky">{clock.gregorian}</span>
        </span>
      </div>
    </div>
  )
}
