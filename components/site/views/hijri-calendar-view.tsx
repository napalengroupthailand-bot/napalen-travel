'use client'

import { useState, useMemo } from 'react'
import { ArrowLeft, ChevronLeft, ChevronRight, RefreshCw } from 'lucide-react'
import { useNav } from '../nav'
import { useClock } from '../use-clock'

const TH_DAYS = ['อา', 'จ', 'อ', 'พ', 'พฤ', 'ศ', 'ส']
const TH_MONTHS = [
  'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
  'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม',
]

function daysInMonth(y: number, m: number) {
  return new Date(y, m + 1, 0).getDate()
}

export function HijriCalendarView() {
  const { navigate } = useNav()
  const clock = useClock()
  const now = new Date()
  const [year, setYear] = useState(now.getFullYear())
  const [month, setMonth] = useState(now.getMonth())

  const cells = useMemo(() => {
    const first = new Date(year, month, 1).getDay()
    const total = daysInMonth(year, month)
    const arr: (number | null)[] = []
    for (let i = 0; i < first; i++) arr.push(null)
    for (let d = 1; d <= total; d++) arr.push(d)
    while (arr.length % 7 !== 0) arr.push(null)
    return arr
  }, [year, month])

  const prev = () => {
    if (month === 0) {
      setMonth(11)
      setYear((y) => y - 1)
    } else setMonth((m) => m - 1)
  }
  const next = () => {
    if (month === 11) {
      setMonth(0)
      setYear((y) => y + 1)
    } else setMonth((m) => m + 1)
  }
  const goToday = () => {
    setYear(now.getFullYear())
    setMonth(now.getMonth())
  }

  const isToday = (d: number) =>
    d === now.getDate() && month === now.getMonth() && year === now.getFullYear()

  return (
    <div className="mx-auto max-w-lg px-4 py-6">
      <button
        type="button"
        onClick={() => navigate('home')}
        className="mb-4 flex items-center gap-2 text-sm font-medium text-royal-blue"
      >
        <ArrowLeft className="size-4" />
        กลับหน้าแรก
      </button>

      <div className="soft-card overflow-hidden">
        {/* Today banner */}
        <div className="relative overflow-hidden bg-gradient-to-br from-deep-blue to-royal-blue px-5 py-6 text-bright-sky">
          <div className="relative z-10 flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-medium text-luxury-gold">วันนี้</p>
              <p className="mt-1 font-arabic text-2xl leading-snug">{clock.hijri}</p>
              <p className="mt-2 text-sm text-bright-sky/80">{clock.buddhist}</p>
              <p className="text-xs text-bright-sky/60">{clock.gregorian}</p>
            </div>
            <div className="text-right">
              <p className="text-4xl font-bold tabular-nums">{now.getDate()}</p>
              <p className="text-sm text-bright-sky/70">{TH_MONTHS[now.getMonth()]}</p>
            </div>
          </div>
        </div>

        {/* Month nav */}
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <button type="button" onClick={prev} className="rounded-full p-2 hover:bg-muted" aria-label="เดือนก่อน">
            <ChevronLeft className="size-5 text-deep-blue" />
          </button>
          <div className="text-center">
            <p className="font-semibold text-deep-blue">
              {TH_MONTHS[month]} {year + 543}
            </p>
            <p className="text-xs text-muted-foreground">{year} ค.ศ.</p>
          </div>
          <button type="button" onClick={next} className="rounded-full p-2 hover:bg-muted" aria-label="เดือนถัดไป">
            <ChevronRight className="size-5 text-deep-blue" />
          </button>
        </div>

        {/* Grid */}
        <div className="p-4">
          <div className="mb-2 grid grid-cols-7 text-center text-xs font-semibold text-muted-foreground">
            {TH_DAYS.map((d) => (
              <div key={d} className="py-1">
                {d}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {cells.map((d, i) => (
              <div
                key={i}
                className={`flex aspect-square items-center justify-center rounded-xl text-sm ${
                  d == null
                    ? ''
                    : isToday(d)
                      ? 'bg-royal-blue font-bold text-white shadow-md'
                      : 'text-deep-blue hover:bg-soft-mint'
                }`}
              >
                {d}
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={goToday}
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-full border border-royal-blue/25 py-2.5 text-sm font-medium text-royal-blue hover:bg-soft-mint"
          >
            <RefreshCw className="size-4" />
            กลับไปวันนี้
          </button>
        </div>
      </div>
    </div>
  )
}
