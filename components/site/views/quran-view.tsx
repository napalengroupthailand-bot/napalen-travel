'use client'

import { useEffect, useMemo, useState } from 'react'
import { ArrowLeft, Search, BookOpen } from 'lucide-react'
import { useNav } from '../nav'

type SurahMeta = {
  number: number
  name: string
  englishName: string
  englishNameTranslation: string
  numberOfAyahs: number
  revelationType: string
}

type Ayah = {
  numberInSurah: number
  ar: string
  th: string
}

const THAI_EDITION = 'th.thai'
const ARABIC_EDITION = 'quran-uthmani'

export function QuranView() {
  const { navigate } = useNav()
  const [surahs, setSurahs] = useState<SurahMeta[]>([])
  const [surahNo, setSurahNo] = useState(1)
  const [ayahs, setAyahs] = useState<Ayah[]>([])
  const [loadingList, setLoadingList] = useState(true)
  const [loadingAyahs, setLoadingAyahs] = useState(false)
  const [error, setError] = useState('')
  const [q, setQ] = useState('')
  const [fontSize, setFontSize] = useState(26)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        setLoadingList(true)
        const res = await fetch('https://api.alquran.cloud/v1/surah')
        const json = await res.json()
        if (!cancelled && json?.data) {
          setSurahs(json.data as SurahMeta[])
        }
      } catch {
        if (!cancelled) setError('โหลดรายชื่อซูเราะฮ์ไม่สำเร็จ')
      } finally {
        if (!cancelled) setLoadingList(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        setLoadingAyahs(true)
        setError('')
        const [arRes, thRes] = await Promise.all([
          fetch(`https://api.alquran.cloud/v1/surah/${surahNo}/${ARABIC_EDITION}`),
          fetch(`https://api.alquran.cloud/v1/surah/${surahNo}/${THAI_EDITION}`),
        ])
        const arJson = await arRes.json()
        const thJson = await thRes.json()
        if (cancelled) return
        const arList = (arJson?.data?.ayahs || []) as { numberInSurah: number; text: string }[]
        const thList = (thJson?.data?.ayahs || []) as { numberInSurah: number; text: string }[]
        const merged: Ayah[] = arList.map((a, i) => ({
          numberInSurah: a.numberInSurah,
          ar: a.text,
          th: thList[i]?.text || '',
        }))
        setAyahs(merged)
      } catch {
        if (!cancelled) setError('โหลดอายะฮ์ไม่สำเร็จ ตรวจสอบอินเน็ต')
      } finally {
        if (!cancelled) setLoadingAyahs(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [surahNo])

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase()
    if (!s) return surahs
    return surahs.filter(
      (x) =>
        String(x.number).includes(s) ||
        x.englishName.toLowerCase().includes(s) ||
        x.name.includes(q) ||
        x.englishNameTranslation.toLowerCase().includes(s),
    )
  }, [surahs, q])

  const current = surahs.find((s) => s.number === surahNo)

  return (
    <div className="app-page page-enter max-w-3xl">
      <div className="app-header-bar">
        <button
          type="button"
          onClick={() => navigate('home')}
          className="flex size-10 items-center justify-center rounded-full bg-white shadow-sm dark:bg-card"
        >
          <ArrowLeft className="size-5 text-deep-blue" />
        </button>
        <h1 className="flex-1 text-center text-lg font-bold text-deep-blue">อัลกุรอานทั้งเล่ม</h1>
        <div className="flex gap-1">
          <button
            type="button"
            onClick={() => setFontSize((f) => Math.max(18, f - 2))}
            className="rounded-lg bg-royal-blue/10 px-2 py-1 text-xs font-bold text-royal-blue"
          >
            A-
          </button>
          <button
            type="button"
            onClick={() => setFontSize((f) => Math.min(40, f + 2))}
            className="rounded-lg bg-royal-blue/10 px-2 py-1 text-xs font-bold text-royal-blue"
          >
            A+
          </button>
        </div>
      </div>

      <div className="relative mb-3">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="ค้นหาซูเราะฮ์..."
          className="w-full rounded-xl border border-border bg-white py-2.5 pl-9 pr-3 text-sm outline-none focus:border-royal-blue dark:bg-card"
        />
      </div>

      {loadingList ? (
        <p className="py-8 text-center text-sm text-muted-foreground">กำลังโหลดรายชื่อซูเราะฮ์...</p>
      ) : (
        <div className="mb-4 flex gap-2 overflow-x-auto pb-2 scrollbar-none">
          {filtered.map((s) => (
            <button
              key={s.number}
              type="button"
              onClick={() => setSurahNo(s.number)}
              className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                surahNo === s.number
                  ? 'bg-royal-blue text-white shadow'
                  : 'bg-white text-deep-blue border border-border dark:bg-card'
              }`}
            >
              {s.number}. {s.englishName}
            </button>
          ))}
        </div>
      )}

      {current && (
        <div className="mb-4 rounded-2xl bg-royal-blue px-4 py-4 text-white shadow-lg">
          <p className="font-arabic text-2xl leading-relaxed" dir="rtl">
            {current.name}
          </p>
          <p className="mt-1 text-sm font-semibold">
            {current.number}. {current.englishName} — {current.englishNameTranslation}
          </p>
          <p className="text-xs text-white/75">
            {current.numberOfAyahs} อายะฮ์ · {current.revelationType === 'Meccan' ? 'มักกียะฮ์' : 'มะดะนียะฮ์'}
          </p>
        </div>
      )}

      {error && <p className="mb-3 text-center text-sm text-rose-600">{error}</p>}

      {loadingAyahs ? (
        <p className="py-10 text-center text-sm text-muted-foreground">กำลังโหลดอายะฮ์...</p>
      ) : (
        <div className="space-y-4">
          {ayahs.map((a) => (
            <article key={a.numberInSurah} className="soft-card p-4">
              <div className="mb-2 flex items-center gap-2">
                <span className="flex size-7 items-center justify-center rounded-full bg-royal-blue/10 text-xs font-bold text-royal-blue">
                  {a.numberInSurah}
                </span>
              </div>
              <p
                className="font-arabic leading-[1.9] text-deep-blue"
                dir="rtl"
                style={{ fontSize }}
              >
                {a.ar}
              </p>
              {a.th && (
                <p className="mt-3 border-t border-border pt-3 text-sm leading-relaxed text-muted-foreground">
                  {a.th}
                </p>
              )}
            </article>
          ))}
        </div>
      )}

      <div className="mt-6 flex gap-2">
        <button
          type="button"
          disabled={surahNo <= 1}
          onClick={() => setSurahNo((n) => Math.max(1, n - 1))}
          className="flex-1 rounded-xl border border-border bg-white py-3 text-sm font-semibold text-deep-blue disabled:opacity-40 dark:bg-card"
        >
          ← ซูเราะฮ์ก่อน
        </button>
        <button
          type="button"
          disabled={surahNo >= 114}
          onClick={() => setSurahNo((n) => Math.min(114, n + 1))}
          className="flex-1 rounded-xl bg-royal-blue py-3 text-sm font-semibold text-white disabled:opacity-40"
        >
          ซูเราะฮ์ถัดไป →
        </button>
      </div>
    </div>
  )
}
