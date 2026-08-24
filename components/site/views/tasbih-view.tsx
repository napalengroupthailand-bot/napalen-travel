'use client'

import { useState, useEffect } from 'react'
import { ArrowLeft, RotateCcw, ChevronDown } from 'lucide-react'
import { useNav } from '../nav'

const DHIKR_LIST = [
  { ar: 'سُبْحَانَ اللَّهِ', th: 'สุบฮานัลลอฮ์', en: 'Subhanallah', target: 33 },
  { ar: 'الْحَمْدُ لِلَّهِ', th: 'อัลฮัมดุลิลลาฮ์', en: 'Alhamdulillah', target: 33 },
  { ar: 'اللَّهُ أَكْبَرُ', th: 'อัลลอฮุอักบัร', en: 'Allahu Akbar', target: 33 },
  { ar: 'لَا إِلَٰهَ إِلَّا اللَّهُ', th: 'ลาอิลาฮะอิลลัลลอฮ์', en: 'La ilaha illallah', target: 100 },
  { ar: 'أَسْتَغْفِرُ اللَّهَ', th: 'อัสตัฆฟิรุลลอฮ์', en: 'Astaghfirullah', target: 100 },
]

const STORAGE_KEY = 'napalen-tasbih'

export function TasbihView() {
  const { navigate } = useNav()
  const [idx, setIdx] = useState(0)
  const [count, setCount] = useState(0)
  const [rounds, setRounds] = useState(0)
  const [showList, setShowList] = useState(false)

  const current = DHIKR_LIST[idx]

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) {
        const d = JSON.parse(raw)
        if (typeof d.count === 'number') setCount(d.count)
        if (typeof d.rounds === 'number') setRounds(d.rounds)
        if (typeof d.idx === 'number') setIdx(d.idx)
      }
    } catch {
      /* ignore */
    }
  }, [])

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ count, rounds, idx }))
    } catch {
      /* ignore */
    }
  }, [count, rounds, idx])

  const tap = () => {
    const next = count + 1
    if (next >= current.target) {
      setCount(0)
      setRounds((r) => r + 1)
    } else {
      setCount(next)
    }
    // haptic if available
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      navigator.vibrate(12)
    }
  }

  const reset = () => {
    setCount(0)
    setRounds(0)
  }

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
        <div className="bg-gradient-to-br from-deep-blue via-royal-blue to-deep-blue px-5 py-8 text-center text-bright-sky">
          <p className="font-arabic text-3xl leading-relaxed sm:text-4xl">{current.ar}</p>
          <p className="mt-2 text-lg font-semibold text-luxury-gold">{current.en}</p>
          <p className="mt-1 text-sm text-bright-sky/70">{current.th}</p>
          <button
            type="button"
            onClick={() => setShowList((s) => !s)}
            className="mt-4 inline-flex items-center gap-1 rounded-full bg-white/10 px-3 py-1.5 text-xs text-bright-sky/90"
          >
            เปลี่ยนคำซิกร์
            <ChevronDown className={`size-3.5 transition ${showList ? 'rotate-180' : ''}`} />
          </button>
        </div>

        {showList && (
          <ul className="border-b border-border divide-y divide-border">
            {DHIKR_LIST.map((d, i) => (
              <li key={d.en}>
                <button
                  type="button"
                  onClick={() => {
                    setIdx(i)
                    setCount(0)
                    setShowList(false)
                  }}
                  className={`flex w-full flex-col items-start px-5 py-3 text-left transition ${
                    i === idx ? 'bg-soft-mint' : 'hover:bg-muted/50'
                  }`}
                >
                  <span className="font-arabic text-lg text-deep-blue">{d.ar}</span>
                  <span className="text-xs text-muted-foreground">
                    {d.en} · {d.th} · เป้า {d.target}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        )}

        <div className="flex flex-col items-center gap-6 px-5 py-10">
          {/* Pearl-style counter ring visual */}
          <button
            type="button"
            onClick={tap}
            className="relative flex size-48 items-center justify-center rounded-full bg-gradient-to-br from-royal-blue to-deep-blue text-white shadow-xl shadow-royal-blue/30 transition active:scale-95"
            aria-label="นับตัสบีห์"
          >
            <div className="text-center">
              <p className="text-5xl font-bold tabular-nums">{count}</p>
              <p className="mt-1 text-sm text-white/70">/ {current.target}</p>
            </div>
            {/* progress ring */}
            <svg className="pointer-events-none absolute inset-0 size-full -rotate-90 p-1" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="46"
                fill="none"
                stroke="rgba(255,255,255,0.15)"
                strokeWidth="3"
              />
              <circle
                cx="50"
                cy="50"
                r="46"
                fill="none"
                stroke="#d4af37"
                strokeWidth="3"
                strokeLinecap="round"
                strokeDasharray={`${(count / current.target) * 289} 289`}
              />
            </svg>
          </button>

          <p className="text-sm text-muted-foreground">แตะวงกลมเพื่อนับ</p>

          <div className="flex w-full gap-3">
            <div className="flex-1 rounded-2xl bg-soft-mint px-4 py-3 text-center">
              <p className="text-xs text-muted-foreground">รอบที่</p>
              <p className="text-xl font-bold text-deep-blue">{rounds}</p>
            </div>
            <div className="flex-1 rounded-2xl bg-soft-mint px-4 py-3 text-center">
              <p className="text-xs text-muted-foreground">รวมทั้งหมด</p>
              <p className="text-xl font-bold text-deep-blue">
                {rounds * current.target + count}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={reset}
            className="flex items-center gap-2 rounded-full border border-border px-5 py-2.5 text-sm font-medium text-muted-foreground hover:bg-muted"
          >
            <RotateCcw className="size-4" />
            รีเซ็ต
          </button>
        </div>
      </div>
    </div>
  )
}
