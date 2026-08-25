'use client'

import { Moon, CalendarDays, Sun } from 'lucide-react'
import { useClock } from './use-clock'

export function CalendarRibbon() {
  const clock = useClock()
  return (
    <div className="border-b border-black/5 bg-white/85 text-deep-blue backdrop-blur-xl max-lg:text-deep-blue lg:border-white/10 lg:bg-deep-blue/75 lg:text-bright-sky">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-2 gap-y-1.5 px-2 py-1.5 text-center text-[10px] font-medium sm:gap-x-4 sm:px-4 sm:py-2 sm:text-xs">
        <span className="flex items-center gap-1 rounded-full border border-black/10 bg-black/[0.04] px-2.5 py-1 text-deep-blue shadow-sm backdrop-blur-md sm:gap-1.5 sm:px-3 lg:border-white/25 lg:bg-white/15 lg:text-bright-sky">
          <Moon className="size-3.5 shrink-0 text-amber-600 lg:text-luxury-gold" />
          {clock.hijri}
        </span>
        <span className="flex items-center gap-1 rounded-full border border-black/10 bg-black/[0.04] px-2.5 py-1 text-deep-blue shadow-sm backdrop-blur-md sm:gap-1.5 sm:px-3 lg:border-white/25 lg:bg-white/15 lg:text-bright-sky">
          <CalendarDays className="size-3.5 shrink-0 text-royal-blue lg:text-light-cyan" />
          {clock.buddhist}
        </span>
        <span className="flex items-center gap-1 rounded-full border border-black/10 bg-black/[0.04] px-2.5 py-1 text-deep-blue shadow-sm backdrop-blur-md sm:gap-1.5 sm:px-3 lg:border-white/25 lg:bg-white/15 lg:text-bright-sky">
          <Sun className="size-3.5 shrink-0 text-amber-600 lg:text-luxury-gold" />
          {clock.gregorian}
        </span>
      </div>
    </div>
  )
}
