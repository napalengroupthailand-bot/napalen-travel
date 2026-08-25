'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { Languages, ArrowLeftRight, Copy, Check, Loader2 } from 'lucide-react'

const LANGS = [
  { code: 'th', label: 'ไทย', short: 'TH' },
  { code: 'ar', label: 'العربية', short: 'AR' },
  { code: 'en', label: 'English', short: 'EN' },
  { code: 'ms', label: 'Melayu', short: 'MS' },
] as const

type LangCode = (typeof LANGS)[number]['code']

export function TranslateBox() {
  const [from, setFrom] = useState<LangCode>('th')
  const [to, setTo] = useState<LangCode>('ar')
  const [source, setSource] = useState('')
  const [result, setResult] = useState('')
  const [displayResult, setDisplayResult] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)
  const [typing, setTyping] = useState(false)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const typeTimer = useRef<ReturnType<typeof setInterval> | null>(null)
  const abortRef = useRef<AbortController | null>(null)

  useEffect(() => {
    if (typeTimer.current) {
      clearInterval(typeTimer.current)
      typeTimer.current = null
    }
    if (!result) {
      setDisplayResult('')
      setTyping(false)
      return
    }
    setTyping(true)
    setDisplayResult('')
    let i = 0
    typeTimer.current = setInterval(() => {
      i += 1
      setDisplayResult(result.slice(0, i))
      if (i >= result.length) {
        if (typeTimer.current) clearInterval(typeTimer.current)
        typeTimer.current = null
        setTyping(false)
      }
    }, 28)
    return () => {
      if (typeTimer.current) clearInterval(typeTimer.current)
    }
  }, [result])

  const doTranslate = useCallback(async (text: string, f: LangCode, t: LangCode) => {
    const trimmed = text.trim()
    if (!trimmed) {
      setResult('')
      setError('')
      setLoading(false)
      return
    }
    if (f === t) {
      setResult(trimmed)
      setError('')
      setLoading(false)
      return
    }

    abortRef.current?.abort()
    const ac = new AbortController()
    abortRef.current = ac
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: trimmed, from: f, to: t }),
        signal: ac.signal,
      })
      const data = (await res.json()) as { text?: string; error?: string }
      if (!res.ok) throw new Error(data.error || 'failed')
      setResult(data.text || '')
    } catch (e) {
      if ((e as Error).name === 'AbortError') return
      setError('แปลไม่สำเร็จ ลองใหม่')
      setResult('')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (timer.current) clearTimeout(timer.current)
    timer.current = setTimeout(() => {
      void doTranslate(source, from, to)
    }, 600)
    return () => {
      if (timer.current) clearTimeout(timer.current)
    }
  }, [source, from, to, doTranslate])

  const swap = () => {
    setFrom(to)
    setTo(from)
    setSource(result)
    setResult(source)
  }

  const copyOut = async () => {
    if (!result) return
    try {
      await navigator.clipboard.writeText(result)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {
      /* ignore */
    }
  }

  return (
    <div className="glass-panel glow-border w-full overflow-hidden text-left animate-slide-up">
      <div className="pointer-events-none absolute -left-8 -top-8 size-24 rounded-full bg-sky-200/25 blur-3xl animate-glow-orb sm:size-32" />
      <div className="pointer-events-none absolute -bottom-6 -right-6 size-20 rounded-full bg-white/20 blur-3xl animate-glow-orb-delay sm:size-28" />

      <div className="relative flex items-center gap-1.5 border-b border-white/20 px-3 py-2 sm:gap-2 sm:px-4 sm:py-2.5">
        <Languages className="size-3.5 shrink-0 text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.9)] sm:size-4" />
        <h3 className="text-xs font-bold text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.55)] sm:text-sm">
          แปลภาษา
        </h3>
        <span className="hidden text-[10px] text-white/70 xs:inline sm:inline">
          ไทย · อาหรับ · อังกฤษ · มาลายู
        </span>
      </div>

      <div className="relative space-y-2.5 p-2.5 sm:space-y-3 sm:p-4">
        {/* language switcher — compact on mobile */}
        <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2">
          <div className="flex rounded-full border border-white/30 bg-black/20 p-0.5 backdrop-blur-md">
            {LANGS.map((l) => (
              <button
                key={`from-${l.code}`}
                type="button"
                onClick={() => setFrom(l.code)}
                className={`rounded-full px-2 py-1 text-[10px] font-bold transition sm:px-3 sm:text-xs ${
                  from === l.code
                    ? 'bg-white text-deep-blue shadow-[0_0_14px_rgba(255,255,255,0.6)]'
                    : 'text-white/85 hover:text-white'
                }`}
              >
                {l.short}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={swap}
            className="flex size-7 items-center justify-center rounded-full border border-white/35 bg-white/15 text-white backdrop-blur transition hover:bg-white/30 active:scale-90 sm:size-8"
            aria-label="สลับภาษา"
          >
            <ArrowLeftRight className="size-3 sm:size-3.5" />
          </button>

          <div className="flex rounded-full border border-white/30 bg-black/20 p-0.5 backdrop-blur-md">
            {LANGS.map((l) => (
              <button
                key={`to-${l.code}`}
                type="button"
                onClick={() => setTo(l.code)}
                className={`rounded-full px-2 py-1 text-[10px] font-bold transition sm:px-3 sm:text-xs ${
                  to === l.code
                    ? 'bg-white text-deep-blue shadow-[0_0_14px_rgba(255,255,255,0.6)]'
                    : 'text-white/85 hover:text-white'
                }`}
              >
                {l.short}
              </button>
            ))}
          </div>
        </div>

        <div className="grid gap-2 sm:grid-cols-2 sm:gap-3">
          <div>
            <label className="mb-1 block text-[10px] font-semibold text-white/80">
              ต้นทาง · {LANGS.find((l) => l.code === from)?.label}
            </label>
            <textarea
              value={source}
              onChange={(e) => setSource(e.target.value)}
              placeholder={
                from === 'th'
                  ? 'พิมพ์ข้อความ...'
                  : from === 'ar'
                    ? 'اكتب هنا...'
                    : from === 'ms'
                      ? 'Tulis di sini...'
                      : 'Type here...'
              }
              dir={from === 'ar' ? 'rtl' : 'ltr'}
              rows={2}
              className="w-full resize-none rounded-xl border border-white/30 bg-black/25 px-2.5 py-2 text-sm text-white placeholder:text-white/45 outline-none backdrop-blur-md transition focus:border-white/55 focus:bg-black/35 focus:shadow-[0_0_20px_rgba(255,255,255,0.18)] sm:rounded-2xl sm:px-3 sm:py-2.5"
            />
          </div>

          <div>
            <div className="mb-1 flex items-center justify-between">
              <label className="text-[10px] font-semibold text-white/80">
                แปลเป็น · {LANGS.find((l) => l.code === to)?.label}
              </label>
              <div className="flex items-center gap-1">
                {loading && <Loader2 className="size-3.5 animate-spin text-white" />}
                <button
                  type="button"
                  onClick={copyOut}
                  disabled={!result}
                  className="flex items-center gap-1 rounded-full px-1.5 py-0.5 text-[10px] font-medium text-white/85 transition hover:bg-white/15 disabled:opacity-40"
                >
                  {copied ? <Check className="size-3" /> : <Copy className="size-3" />}
                  <span className="hidden sm:inline">{copied ? 'คัดลอกแล้ว' : 'คัดลอก'}</span>
                </button>
              </div>
            </div>
            <div
              dir={to === 'ar' ? 'rtl' : 'ltr'}
              className={`typing-glow-box min-h-[3.5rem] rounded-xl border border-white/30 bg-black/25 px-2.5 py-2 text-sm backdrop-blur-md sm:min-h-[5rem] sm:rounded-2xl sm:px-3 sm:py-2.5 ${
                to === 'ar' ? 'font-arabic text-base leading-relaxed' : ''
              } ${typing || loading ? 'is-typing' : ''}`}
            >
              {error ? (
                <span className="text-rose-200">{error}</span>
              ) : displayResult || loading ? (
                <span className="typing-glow-text">
                  {displayResult}
                  {(typing || loading) && <span className="typing-caret" />}
                </span>
              ) : (
                <span className="text-white/40">ผลแปล...</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
