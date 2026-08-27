'use client'

import { useEffect, useMemo, useState } from 'react'
import { ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react'
import { useNav } from '../nav'

type SurahMeta = {
  number: number
  name: string
  englishName: string
  englishNameTranslation: string
  numberOfAyahs: number
}

type Ayah = { numberInSurah: number; ar: string; th: string }

const THAI_EDITION = 'th.thai'
const ARABIC_EDITION = 'quran-uthmani'
/** ประมาณ 1 หน้ามุศฮัฟ (ตัวอักษรอาหรับ) */
const CHARS_PER_PAGE = 900

function paginateAyahs(ayahs: Ayah[]): Ayah[][] {
  if (!ayahs.length) return [[]]
  const pages: Ayah[][] = []
  let buf: Ayah[] = []
  let count = 0
  for (const a of ayahs) {
    const len = a.ar.length + 4
    if (buf.length > 0 && count + len > CHARS_PER_PAGE) {
      pages.push(buf)
      buf = []
      count = 0
    }
    buf.push(a)
    count += len
  }
  if (buf.length) pages.push(buf)
  return pages
}

export function QuranBookView() {
  const { navigate } = useNav()
  const [surahs, setSurahs] = useState<SurahMeta[]>([])
  const [surahNo, setSurahNo] = useState(1)
  const [ayahs, setAyahs] = useState<Ayah[]>([])
  const [page, setPage] = useState(0)
  const [flip, setFlip] = useState<'idle' | 'left' | 'right'>('idle')
  const [loading, setLoading] = useState(true)
  const [showTh, setShowTh] = useState(false)

  useEffect(() => {
    fetch('https://api.alquran.cloud/v1/surah')
      .then((r) => r.json())
      .then((j) => setSurahs(j?.data || []))
      .catch(() => {})
  }, [])

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setPage(0)
    Promise.all([
      fetch(`https://api.alquran.cloud/v1/surah/${surahNo}/${ARABIC_EDITION}`).then((r) => r.json()),
      fetch(`https://api.alquran.cloud/v1/surah/${surahNo}/${THAI_EDITION}`).then((r) => r.json()),
    ])
      .then(([arJson, thJson]) => {
        if (cancelled) return
        const arList = arJson?.data?.ayahs || []
        const thList = thJson?.data?.ayahs || []
        setAyahs(
          arList.map((a: { numberInSurah: number; text: string }, i: number) => ({
            numberInSurah: a.numberInSurah,
            ar: a.text,
            th: thList[i]?.text || '',
          })),
        )
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [surahNo])

  const pages = useMemo(() => paginateAyahs(ayahs), [ayahs])
  const totalPages = Math.max(1, pages.length)
  const slice = pages[page] || []
  const current = surahs.find((s) => s.number === surahNo)

  const goPage = (dir: -1 | 1) => {
    const next = page + dir
    if (next < 0 || next >= totalPages) return
    setFlip(dir > 0 ? 'left' : 'right')
    window.setTimeout(() => {
      setPage(next)
      setFlip('idle')
    }, 280)
  }

  const goSurah = (n: number) => {
    if (n < 1 || n > 114) return
    setSurahNo(n)
  }

  return (
    <div className="app-page page-enter max-w-2xl !bg-transparent">
      <div className="app-header-bar">
        <button
          type="button"
          onClick={() => navigate('home')}
          className="flex size-10 items-center justify-center rounded-full bg-white shadow-sm"
        >
          <ArrowLeft className="size-5 text-deep-blue" />
        </button>
        <h1 className="flex-1 text-center text-lg font-bold text-deep-blue">มุศฮัฟ · แบบหน้ากระดาษ</h1>
        <button
          type="button"
          onClick={() => setShowTh((v) => !v)}
          className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${
            showTh ? 'bg-royal-blue text-white' : 'bg-white text-deep-blue border border-border'
          }`}
        >
          แปลไทย
        </button>
      </div>

      <div className="mb-3 flex gap-2 overflow-x-auto pb-1 scrollbar-none">
        {surahs.map((s) => (
          <button
            key={s.number}
            type="button"
            onClick={() => goSurah(s.number)}
            className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${
              surahNo === s.number
                ? 'bg-royal-blue text-white'
                : 'bg-white text-deep-blue border border-border'
            }`}
          >
            {s.number}. {s.englishName}
          </button>
        ))}
      </div>

      <div className="quran-book-shell mx-auto max-w-lg">
        <div
          className={`quran-mushaf ${
            flip === 'left' ? 'flip-next' : flip === 'right' ? 'flip-prev' : ''
          }`}
        >
          {/* กรอบมุศฮัฟ */}
          <div className="quran-mushaf-frame">
            <div className="quran-mushaf-inner">
              <header className="mb-3 text-center">
                <p className="font-arabic text-[1.35rem] text-[#3d2914]" dir="rtl">
                  {current?.name || '…'}
                </p>
                <p className="mt-0.5 text-[10px] tracking-wide text-[#8b7355]">
                  {current
                    ? `ซูเราะฮ์ ${current.number} · หน้า ${page + 1}/${totalPages}`
                    : 'กำลังโหลด…'}
                </p>
              </header>

              {loading ? (
                <p className="py-20 text-center text-sm text-[#8b7355]">กำลังเปิดหน้ามุศฮัฟ…</p>
              ) : (
                <div
                  className="font-arabic text-justify leading-[2.15] text-[#1a120c]"
                  dir="rtl"
                  style={{ fontSize: '1.28rem' }}
                >
                  {slice.map((a) => (
                    <span key={a.numberInSurah} className="quran-ayah-inline">
                      {a.ar}
                      <span className="quran-ayah-num" aria-label={`อายะฮ์ ${a.numberInSurah}`}>
                        ﴿{a.numberInSurah}﴾
                      </span>{' '}
                    </span>
                  ))}
                </div>
              )}

              {showTh && !loading && (
                <div className="mt-4 space-y-2 border-t border-[#c4a574]/35 pt-3">
                  {slice.map((a) => (
                    <p key={`th-${a.numberInSurah}`} className="text-[12px] leading-relaxed text-[#5c4a32]">
                      <span className="font-semibold text-[#6b4f2e]">{a.numberInSurah}.</span> {a.th}
                    </p>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-5 flex items-center justify-center gap-3">
        <button
          type="button"
          onClick={() => goPage(-1)}
          disabled={page <= 0 || loading}
          className="flex size-11 items-center justify-center rounded-full bg-royal-blue text-white shadow disabled:opacity-35"
        >
          <ChevronLeft className="size-5" />
        </button>
        <span className="min-w-[5rem] text-center text-sm font-semibold text-deep-blue">
          {page + 1} / {totalPages}
        </span>
        <button
          type="button"
          onClick={() => goPage(1)}
          disabled={page >= totalPages - 1 || loading}
          className="flex size-11 items-center justify-center rounded-full bg-royal-blue text-white shadow disabled:opacity-35"
        >
          <ChevronRight className="size-5" />
        </button>
      </div>

      <div className="mt-3 flex gap-2">
        <button
          type="button"
          disabled={surahNo <= 1}
          onClick={() => goSurah(surahNo - 1)}
          className="flex-1 rounded-xl border border-border bg-white py-2.5 text-sm font-semibold text-deep-blue disabled:opacity-40"
        >
          ← ซูเราะฮ์ก่อน
        </button>
        <button
          type="button"
          disabled={surahNo >= 114}
          onClick={() => goSurah(surahNo + 1)}
          className="flex-1 rounded-xl bg-royal-blue py-2.5 text-sm font-semibold text-white disabled:opacity-40"
        >
          ซูเราะฮ์ถัดไป →
        </button>
      </div>
    </div>
  )
}
