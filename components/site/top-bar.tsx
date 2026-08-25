'use client'

import { MapPin, Phone, Clock } from 'lucide-react'
import { useStore } from './store'
import { useClock } from './use-clock'

export function TopBar() {
  const { company } = useStore()
  const clock = useClock()

  // ที่อยู่สั้นบนมือถือ: เอาส่วนแรกของที่อยู่บริษัท
  const shortAddress =
    company.address?.split('จ.')[0]?.trim() ||
    company.address?.slice(0, 28) ||
    'หาดใหญ่ สงขลา'

  return (
    <div className="border-b border-black/5 bg-white/90 text-deep-blue backdrop-blur-xl max-lg:text-deep-blue lg:border-white/10 lg:bg-deep-blue/80 lg:text-bright-sky/90">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-1 px-3 py-1.5 text-[10px] sm:flex-row sm:gap-1.5 sm:px-4 sm:py-2 sm:text-xs">
        <div className="flex max-w-full flex-wrap items-center justify-center gap-x-3 gap-y-0.5">
          <span className="flex max-w-[70vw] items-center gap-1 sm:max-w-none sm:gap-1.5">
            <MapPin className="size-3.5 shrink-0 text-royal-blue lg:text-luxury-gold" />
            <span className="truncate font-medium text-deep-blue lg:hidden">{shortAddress}</span>
            <span className="hidden text-bright-sky/90 lg:inline">{company.address}</span>
          </span>
          <a
            href={`tel:${company.phone}`}
            className="flex items-center gap-1 font-medium text-deep-blue hover:text-royal-blue sm:gap-1.5 lg:text-bright-sky/90 lg:hover:text-luxury-gold"
          >
            <Phone className="size-3.5 shrink-0 text-royal-blue lg:text-luxury-gold" />
            {company.phone}
          </a>
        </div>
        <div className="flex items-center gap-1.5 font-medium sm:gap-3">
          <span className="flex items-center gap-1 rounded-full border border-black/10 bg-black/5 px-2 py-0.5 text-deep-blue backdrop-blur-sm sm:gap-1.5 sm:px-2.5 lg:border-white/25 lg:bg-white/15 lg:text-bright-sky">
            <Clock className="size-3 text-royal-blue lg:text-light-cyan" />
            ไทย <span className="tabular-nums">{clock.bangkok}</span>
          </span>
          <span className="flex items-center gap-1 rounded-full border border-black/10 bg-black/5 px-2 py-0.5 text-deep-blue backdrop-blur-sm sm:gap-1.5 sm:px-2.5 lg:border-white/25 lg:bg-white/15 lg:text-bright-sky">
            <Clock className="size-3 text-amber-600 lg:text-luxury-gold" />
            มักกะฮ์ <span className="tabular-nums">{clock.makkah}</span>
          </span>
        </div>
      </div>
    </div>
  )
}
