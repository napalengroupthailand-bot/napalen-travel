'use client'

import { useEffect, useState } from 'react'
import { COMPANY_LOGO } from '@/lib/site-data'

type Props = {
  durationMs?: number
  onDone?: () => void
}

export function SplashScreen({ durationMs = 1400, onDone }: Props) {
  const [phase, setPhase] = useState<'in' | 'out' | 'gone'>('in')
  const [isMobile, setIsMobile] = useState(false)
  const [canAutoClose, setCanAutoClose] = useState(false)

  useEffect(() => {
    const mobile =
      typeof window !== 'undefined' &&
      (/iPhone|iPad|iPod|Android/i.test(navigator.userAgent) ||
        window.matchMedia('(max-width: 768px)').matches)
    setIsMobile(!!mobile)
    // เดสก์ท็อปปิดเอง / มือถือรอแตะ (เพื่อปลดล็อก autoplay วิดีโอ)
    const t = setTimeout(() => {
      if (!mobile) {
        setPhase('out')
      } else {
        setCanAutoClose(true)
      }
    }, durationMs)
    return () => clearTimeout(t)
  }, [durationMs])

  useEffect(() => {
    if (phase !== 'out') return
    const t = setTimeout(() => {
      setPhase('gone')
      onDone?.()
    }, 450)
    return () => clearTimeout(t)
  }, [phase, onDone])

  const enter = () => {
    if (phase === 'out' || phase === 'gone') return
    // สำคัญ: เกิดจาก user gesture → ปลดล็อกเล่นวิดีโอบน iOS
    try {
      sessionStorage.setItem('napalen-user-gesture', '1')
    } catch {
      /* ignore */
    }
    setPhase('out')
  }

  if (phase === 'gone') return null

  return (
    <div
      className={`splash-screen fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-deep-blue ${
        phase === 'out' ? 'splash-out' : 'splash-in'
      }`}
      onClick={enter}
      onTouchStart={enter}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') enter()
      }}
      aria-label="แตะเพื่อเข้าสู่เว็บ"
    >
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="splash-glow absolute left-1/2 top-1/2 size-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-royal-blue/40 blur-3xl" />
      </div>

      <div className="relative flex flex-col items-center gap-4">
        <div className="splash-logo relative">
          <span className="absolute -inset-3 rounded-full bg-white/10 blur-md" />
          <img
            src={COMPANY_LOGO || '/logo-napalen.png'}
            alt="NAPALEN TRAVEL & TOUR"
            width={112}
            height={112}
            className="relative size-24 rounded-full border-2 border-luxury-gold/80 bg-bright-sky object-cover shadow-[0_0_40px_rgba(255,255,255,0.25)] sm:size-28"
            draggable={false}
          />
        </div>
        <div className="text-center">
          <p className="text-base font-semibold tracking-wide text-bright-sky sm:text-lg">
            นาปาเลน แทรเวิล
          </p>
          <p className="mt-0.5 text-[11px] font-light tracking-[0.12em] text-luxury-gold sm:text-xs">
            NAPALEN TRAVEL &amp; TOUR
          </p>
        </div>

        {isMobile ? (
          <p
            className={`mt-4 text-sm font-medium text-white/80 transition-opacity ${
              canAutoClose ? 'animate-pulse opacity-100' : 'opacity-60'
            }`}
          >
            แตะเพื่อเข้าสู่เว็บ
          </p>
        ) : (
          <div className="splash-bar mt-3 h-1 w-16 overflow-hidden rounded-full bg-white/15">
            <div className="splash-bar-fill h-full rounded-full bg-luxury-gold" />
          </div>
        )}
      </div>
    </div>
  )
}
