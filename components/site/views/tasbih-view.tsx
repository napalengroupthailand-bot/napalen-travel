'use client'

import { useState, useEffect } from 'react'
import { ArrowLeft, RotateCcw, ChevronDown } from 'lucide-react'
import { useNav } from '../nav'

const DHIKR_LIST = [
  { ar: 'سُبْحَانَ اللَّهِ', th: 'มหาบริสุทธิ์แห่งอัลลอฮ์', en: 'Subhanallah', target: 33 },
  { ar: 'الْحَمْدُ لِلَّهِ', th: 'การสรรเสริญเป็นของอัลลอฮ์', en: 'Alhamdulillah', target: 33 },
  { ar: 'اللَّهُ أَكْبَرُ', th: 'อัลลอฮ์ยิ่งใหญ่ที่สุด', en: 'Allahu Akbar', target: 33 },
  { ar: 'لَا إِلَٰهَ إِلَّا اللَّهُ', th: 'ไม่มีพระเจ้าอื่นใดนอกจากอัลลอฮ์', en: 'La ilaha illallah', target: 100 },
  { ar: 'أَسْتَغْفِرُ اللَّهَ', th: 'ข้าพระองค์ขออภัยโทษต่ออัลลอฮ์', en: 'Astaghfirullah', target: 100 },
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
    } catch { /* */ }
  }, [])

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ count, rounds, idx }))
    } catch { /* */ }
  }, [count, rounds, idx])

  const tap = () => {
    const next = count + 1
    if (next >= current.target) {
      setCount(0)
      setRounds((r) => r + 1)
    } else setCount(next)
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) navigator.vibrate(10)
  }

  return (
    <div className="app-page">
      <div className="app-header-bar">
        <button
          type="button"
          onClick={() => navigate('home')}
          className="flex size-10 items-center justify-center rounded-full bg-white shadow-sm"
        >
          <ArrowLeft className="size-5 text-deep-blue" />
        </button>
        <h1 className="flex-1 text-center text-lg font-bold text-deep-blue">ตัสบีห์</h1>
        <button
          type="button"
          onClick={() => {
            setCount(0)
            setRounds(0)
          }}
          className="flex size-10 items-center justify-center rounded-full bg-white shadow-sm"
        >
          <RotateCcw className="size-4 text-royal-blue" />
        </button>
      </div>

      <div className="soft-card overflow-hidden">
        <div className="bg-gradient-to-b from-deep-blue via-royal-blue to-deep-blue px-6 py-10 text-center text-white">
          <p className="font-arabic text-4xl leading-relaxed sm:text-5xl">{current.ar}</p>
          <p className="mt-3 text-xl font-semibold text-luxury-gold">{current.en}</p>
          <p className="mt-1 text-sm text-white/70">{current.th}</p>
          <button
            type="button"
            onClick={() => setShowList((s) => !s)}
            className="mt-5 inline-flex items-center gap-1 rounded-full bg-white/15 px-4 py-1.5 text-xs"
          >
            เปลี่ยนคำซิกร์
            <ChevronDown className={`size-3.5 transition ${showList ? 'rotate-180' : ''}`} />
          </button>
        </div>

        {showList && (
          <ul className="divide-y divide-border border-b border-border bg-white">
            {DHIKR_LIST.map((d, i) => (
              <li key={d.en}>
                <button
                  type="button"
                  onClick={() => {
                    setIdx(i)
                    setCount(0)
                    setShowList(false)
                  }}
                  className={`flex w-full flex-col items-start px-5 py-3 text-left ${
                    i === idx ? 'bg-soft-mint' : ''
                  }`}
                >
                  <span className="font-arabic text-lg text-deep-blue">{d.ar}</span>
                  <span className="text-xs text-muted-foreground">
                    {d.en} · เป้า {d.target}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        )}

        <div className="flex flex-col items-center gap-6 bg-gradient-to-b from-soft-mint/40 to-white px-6 py-10">
          <button
            type="button"
            onClick={tap}
            className="relative flex size-44 items-center justify-center rounded-full bg-white shadow-[0_8px_40px_rgba(26,77,181,0.2)] ring-4 ring-royal-blue/10 transition active:scale-95 sm:size-52"
            aria-label="นับ"
          >
            <div className="text-center">
              <p className="text-5xl font-bold tabular-nums text-deep-blue sm:text-6xl">{count}</p>
              <p className="mt-1 text-sm text-muted-foreground">/ {current.target}</p>
            </div>
            <svg className="pointer-events-none absolute inset-0 size-full -rotate-90 p-1.5" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="46" fill="none" stroke="rgba(26,77,181,0.1)" strokeWidth="3" />
              <circle
                cx="50"
                cy="50"
                r="46"
                fill="none"
                stroke="#d4af37"
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeDasharray={`${(count / current.target) * 289} 289`}
              />
            </svg>
          </button>

          <p className="text-sm text-muted-foreground">แตะวงกลมเพื่อนับ · เป้า {current.target}</p>

          <div className="grid w-full grid-cols-2 gap-3">
            <div className="rounded-2xl bg-soft-mint px-4 py-3 text-center">
              <p className="text-xs text-muted-foreground">รอบที่</p>
              <p className="text-2xl font-bold text-deep-blue">{rounds}</p>
            </div>
            <div className="rounded-2xl bg-soft-mint px-4 py-3 text-center">
              <p className="text-xs text-muted-foreground">รวมทั้งหมด</p>
              <p className="text-2xl font-bold text-royal-blue">
                {rounds * current.target + count}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
