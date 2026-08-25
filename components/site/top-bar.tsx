'use client'

import { MapPin, Phone, Clock } from 'lucide-react'
import { useStore } from './store'
import { useClock } from './use-clock'

export function TopBar() {
  const { company } = useStore()
  const clock = useClock()

  return (
    <div className="border-b border-white/10 bg-deep-blue/80 text-bright-sky/90 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-1.5 px-3 py-1.5 text-[10px] sm:flex-row sm:px-4 sm:py-2 sm:text-xs">
        <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1">
          <span className="flex items-center gap-1.5">
            <MapPin className="size-3.5 text-luxury-gold" />
            <span className="hidden sm:inline">{company.address}</span>
            <span className="sm:hidden">หาดใหญ่ สงขลา</span>
          </span>
          <a href={`tel:${company.phone}`} className="flex items-center gap-1.5 hover:text-luxury-gold">
            <Phone className="size-3.5 text-luxury-gold" />
            {company.phone}
          </a>
        </div>
        <div className="flex items-center gap-2 font-medium sm:gap-3">
          <span className="flex items-center gap-1.5 rounded-full border border-white/25 bg-white/15 px-2.5 py-0.5 backdrop-blur-md">
            <Clock className="size-3 text-light-cyan" />
            ไทย <span className="tabular-nums text-bright-sky">{clock.bangkok}</span>
          </span>
          <span className="flex items-center gap-1.5 rounded-full border border-white/25 bg-white/15 px-2.5 py-0.5 backdrop-blur-md">
            <Clock className="size-3 text-luxury-gold" />
            มักกะฮ์ <span className="tabular-nums text-bright-sky">{clock.makkah}</span>
          </span>
        </div>
      </div>
    </div>
  )
}
