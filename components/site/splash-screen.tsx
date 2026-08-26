'use client'

import { useEffect, useState } from 'react'
import { COMPANY_LOGO } from '@/lib/site-data'

type Props = {
  durationMs?: number
  onDone?: () => void
}

export function SplashScreen({ durationMs = 1800, onDone }: Props) {
  const [phase, setPhase] = useState<'in' | 'out' | 'gone'>('in')

  useEffect(() => {
    const t1 = setTimeout(() => setPhase('out'), durationMs)
    return () => clearTimeout(t1)
  }, [durationMs])

  useEffect(() => {
    if (phase !== 'out') return
    const t = setTimeout(() => {
      setPhase('gone')
      onDone?.()
    }, 500)
    return () => clearTimeout(t)
  }, [phase, onDone])

  if (phase === 'gone') return null

  return (
    <div
      className={`splash-screen fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-deep-blue ${
        phase === 'out' ? 'splash-out' : 'splash-in'
      }`}
      aria-hidden={phase === 'out'}
    >
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="splash-glow absolute left-1/2 top-1/2 size-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-royal-blue/35 blur-3xl" />
      </div>

      <div className="relative flex flex-col items-center gap-5">
        {/* โลโก้ + วงโหลดหมุน */}
        <div className="splash-logo-wrap relative flex size-32 items-center justify-center sm:size-36">
          {/* วงกลมโหลดรอบโลโก้ */}
          <svg
            className="splash-ring absolute inset-0 size-full"
            viewBox="0 0 100 100"
            aria-hidden
          >
            <circle
              cx="50"
              cy="50"
              r="46"
              fill="none"
              stroke="rgba(255,255,255,0.12)"
              strokeWidth="2.5"
            />
            <circle
              className="splash-ring-arc"
              cx="50"
              cy="50"
              r="46"
              fill="none"
              stroke="url(#splashGold)"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeDasharray="70 220"
            />
            <defs>
              <linearGradient id="splashGold" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#d4af37" />
                <stop offset="100%" stopColor="#f5e6a8" />
              </linearGradient>
            </defs>
          </svg>

          <img
            src={COMPANY_LOGO || '/logo-napalen.png'}
            alt="NAPALEN TRAVEL & TOUR"
            width={112}
            height={112}
            className="splash-logo-img relative size-[4.75rem] rounded-full border-2 border-luxury-gold/80 bg-bright-sky object-cover shadow-[0_0_36px_rgba(255,255,255,0.22)] sm:size-[5.25rem]"
            draggable={false}
          />
        </div>

        <div className="splash-text text-center">
          <p className="text-base font-semibold tracking-wide text-bright-sky sm:text-lg">
            นาปาเลน แทรเวิล
          </p>
          <p className="mt-0.5 text-[11px] font-light tracking-[0.12em] text-luxury-gold sm:text-xs">
            NAPALEN TRAVEL &amp; TOUR
          </p>
        </div>
      </div>
    </div>
  )
}
