'use client'

import { MapPin, Phone, Clock } from 'lucide-react'
import { useStore } from './store'
import { useClock } from './use-clock'

export function TopBar() {
  const { company } = useStore()
  const clock = useClock()

  const shortAddress =
    company.address?.split('จ.')[0]?.trim() ||
    company.address?.slice(0, 28) ||
    'หาดใหญ่ สงขลา'

  return (
    <div className="relative overflow-hidden border-b border-white/20 bg-royal-blue text-white">
      <span className="pointer-events-none absolute inset-0 light-sweep-slow opacity-40" />
      <div className="relative mx-auto flex max-w-7xl flex-col items-center justify-between gap-1 px-3 py-1.5 text-[10px] sm:flex-row sm:gap-1.5 sm:px-4 sm:py-2 sm:text-xs">
        <div className="flex max-w-full flex-wrap items-center justify-center gap-x-3 gap-y-0.5">
          <span className="flex max-w-[70vw] items-center gap-1 sm:max-w-none sm:gap-1.5">
            <MapPin className="size-3.5 shrink-0 text-sky-200" />
            <span className="truncate font-medium text-white/95 lg:hidden">{shortAddress}</span>
            <span className="hidden text-white/95 lg:inline">{company.address}</span>
          </span>
          <a
            href={`tel:${company.phone}`}
            className="flex items-center gap-1 font-medium text-white hover:text-sky-100 sm:gap-1.5"
          >
            <Phone className="size-3.5 shrink-0 text-sky-200" />
            {company.phone}
          </a>
        </div>
        <div className="flex items-center gap-1.5 font-medium sm:gap-3">
          <span className="flex items-center gap-1 rounded-full border border-white/25 bg-white/10 px-2 py-0.5 backdrop-blur-sm sm:gap-1.5 sm:px-2.5">
            <Clock className="size-3 text-sky-200" />
            ไทย <span className="tabular-nums">{clock.bangkok}</span>
          </span>
          <span className="flex items-center gap-1 rounded-full border border-white/25 bg-white/10 px-2 py-0.5 backdrop-blur-sm sm:gap-1.5 sm:px-2.5">
            <Clock className="size-3 text-amber-200" />
            มักกะฮ์ <span className="tabular-nums">{clock.makkah}</span>
          </span>
        </div>
      </div>
    </div>
  )
}
