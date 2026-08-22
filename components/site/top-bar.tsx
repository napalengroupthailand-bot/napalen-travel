'use client'

import { MapPin, Phone, Clock } from 'lucide-react'
import { useStore } from './store'
import { useClock } from './use-clock'

export function TopBar() {
  const { company } = useStore()
  const clock = useClock()

  return (
    <div className="bg-deep-blue text-bright-sky/90">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-2 text-xs sm:flex-row">
        <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-1">
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
        <div className="flex items-center gap-4 font-medium">
          <span className="flex items-center gap-1.5">
            <Clock className="size-3.5 text-light-cyan" />
            ไทย <span className="tabular-nums text-bright-sky">{clock.bangkok}</span>
          </span>
          <span className="flex items-center gap-1.5">
            <Clock className="size-3.5 text-luxury-gold" />
            มักกะฮ์ <span className="tabular-nums text-bright-sky">{clock.makkah}</span>
          </span>
        </div>
      </div>
    </div>
  )
}
