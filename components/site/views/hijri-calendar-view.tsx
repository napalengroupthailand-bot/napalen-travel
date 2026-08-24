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

  const isToday = (d: number) =>
    d === now.getDate() && month === now.getMonth() && year === now.getFullYear()

  return (
    <div className="app-page page-enter">
      <div className="app-header-bar">
        <button
          type="button"
          onClick={() => navigate('home')}
          className="flex size-10 items-center justify-center rounded-full bg-white shadow-sm"
        >
          <ArrowLeft className="size-5 text-deep-blue" />
        </button>
        <h1 className="flex-1 text-center text-lg font-bold text-deep-blue">ปฏิทิน</h1>
        <button
          type="button"
          onClick={() => {
            setYear(now.getFullYear())
            setMonth(now.getMonth())
          }}
          className="flex size-10 items-center justify-center rounded-full bg-white shadow-sm"
        >
          <RefreshCw className="size-4 text-royal-blue" />
        </button>
      </div>

      <div className="soft-card overflow-hidden">
        {/* Today hero card — like Salaam */}
        <div className="relative overflow-hidden bg-gradient-to-br from-deep-blue via-royal-blue to-[#1e3a6e] px-5 py-7 text-white">
          <div className="relative z-10 flex items-end justify-between">
            <div>
              <p className="text-xs font-medium text-luxury-gold">วันนี้</p>
              <p className="mt-2 font-arabic text-2xl leading-snug">{clock.hijri}</p>
              <p className="mt-2 text-sm text-white/75">{clock.buddhist}</p>
            </div>
            <div className="text-right">
              <p className="text-5xl font-bold tabular-nums leading-none">{now.getDate()}</p>
              <p className="mt-1 text-sm text-white/70">{TH_MONTHS[now.getMonth()]}</p>
              <p className="text-xs text-white/50">{now.getFullYear() + 543} พ.ศ.</p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between px-3 py-3">
          <button type="button" onClick={prev} className="rounded-full p-2.5 hover:bg-soft-mint">
            <ChevronLeft className="size-5 text-deep-blue" />
          </button>
          <div className="text-center">
            <p className="font-bold text-deep-blue">
              {TH_MONTHS[month]} {year + 543}
            </p>
            <p className="text-xs text-muted-foreground">{year} ค.ศ.</p>
          </div>
          <button type="button" onClick={next} className="rounded-full p-2.5 hover:bg-soft-mint">
            <ChevronRight className="size-5 text-deep-blue" />
          </button>
        </div>

        <div className="px-4 pb-5">
          <div className="mb-1 grid grid-cols-7 text-center text-xs font-semibold text-muted-foreground">
            {TH_DAYS.map((d) => (
              <div key={d} className="py-2">
                {d}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {cells.map((d, i) => (
              <div
                key={i}
                className={`flex aspect-square items-center justify-center rounded-2xl text-sm transition ${
                  d == null
                    ? ''
                    : isToday(d)
                      ? 'bg-royal-blue font-bold text-white shadow-md shadow-royal-blue/30'
                      : 'text-deep-blue hover:bg-soft-mint'
                }`}
              >
                {d}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
