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

  // viral typing + glow effect for result
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
    <section className="relative z-20 -mt-8 px-4 sm:-mt-12">
      <div className="glass-panel glow-border mx-auto max-w-3xl overflow-hidden animate-slide-up">
        {/* soft light orbs */}
        <div className="pointer-events-none absolute -left-10 -top-10 size-32 rounded-full bg-sky-300/30 blur-3xl animate-glow-orb" />
        <div className="pointer-events-none absolute -bottom-8 -right-8 size-28 rounded-full bg-royal-blue/25 blur-3xl animate-glow-orb-delay" />

        <div className="relative flex items-center gap-2 border-b border-white/20 px-4 py-2.5">
          <Languages className="size-4 text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]" />
          <h3 className="text-sm font-bold text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]">
            แปลภาษา
          </h3>
          <span className="text-[10px] text-white/70">ไทย · อาหรับ · อังกฤษ · มาลายู</span>
        </div>

        <div className="relative space-y-3 p-3 sm:p-4">
          <div className="flex flex-wrap items-center justify-center gap-2">
            <div className="flex rounded-full border border-white/25 bg-white/10 p-0.5 backdrop-blur-md">
              {LANGS.map((l) => (
                <button
                  key={`from-${l.code}`}
                  type="button"
                  onClick={() => setFrom(l.code)}
                  className={`rounded-full px-2.5 py-1 text-[11px] font-semibold transition sm:px-3 sm:text-xs ${
                    from === l.code
                      ? 'bg-white text-deep-blue shadow-[0_0_16px_rgba(255,255,255,0.55)]'
                      : 'text-white/80 hover:text-white'
                  }`}
                >
                  {l.short}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={swap}
              className="flex size-8 items-center justify-center rounded-full border border-white/30 bg-white/15 text-white backdrop-blur transition hover:bg-white/30 hover:shadow-[0_0_20px_rgba(255,255,255,0.45)] active:scale-90"
              aria-label="สลับภาษา"
            >
              <ArrowLeftRight className="size-3.5" />
            </button>

            <div className="flex rounded-full border border-white/25 bg-white/10 p-0.5 backdrop-blur-md">
              {LANGS.map((l) => (
                <button
                  key={`to-${l.code}`}
                  type="button"
                  onClick={() => setTo(l.code)}
                  className={`rounded-full px-2.5 py-1 text-[11px] font-semibold transition sm:px-3 sm:text-xs ${
                    to === l.code
                      ? 'bg-white text-deep-blue shadow-[0_0_16px_rgba(255,255,255,0.55)]'
                      : 'text-white/80 hover:text-white'
                  }`}
                >
                  {l.short}
                </button>
              ))}
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-[10px] font-semibold text-white/75">
                ต้นทาง · {LANGS.find((l) => l.code === from)?.label}
              </label>
              <textarea
                value={source}
                onChange={(e) => setSource(e.target.value)}
                placeholder={
                  from === 'th'
                    ? 'พิมพ์ข้อความภาษาไทย...'
                    : from === 'ar'
                      ? 'اكتب النص هنا...'
                      : from === 'ms'
                        ? 'Tulis teks di sini...'
                        : 'Type text here...'
                }
                dir={from === 'ar' ? 'rtl' : 'ltr'}
                rows={3}
                className="w-full resize-none rounded-2xl border border-white/25 bg-white/10 px-3 py-2.5 text-sm text-white placeholder:text-white/40 outline-none backdrop-blur-md transition focus:border-white/50 focus:bg-white/15 focus:shadow-[0_0_24px_rgba(255,255,255,0.2)]"
              />
            </div>

            <div>
              <div className="mb-1 flex items-center justify-between">
                <label className="text-[10px] font-semibold text-white/75">
                  แปลเป็น · {LANGS.find((l) => l.code === to)?.label}
                </label>
                <div className="flex items-center gap-1">
                  {loading && <Loader2 className="size-3.5 animate-spin text-white" />}
                  <button
                    type="button"
                    onClick={copyOut}
                    disabled={!result}
                    className="flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium text-white/80 transition hover:bg-white/15 disabled:opacity-40"
                  >
                    {copied ? <Check className="size-3" /> : <Copy className="size-3" />}
                    {copied ? 'คัดลอกแล้ว' : 'คัดลอก'}
                  </button>
                </div>
              </div>
              <div
                dir={to === 'ar' ? 'rtl' : 'ltr'}
                className={`typing-glow-box min-h-[5.5rem] rounded-2xl border border-white/25 bg-white/10 px-3 py-2.5 text-sm backdrop-blur-md ${
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
                  <span className="text-white/35">ผลแปลจะแสดงที่นี่...</span>
                )}
              </div>
            </div>
          </div>

          <p className="text-center text-[10px] text-white/50">
            พิมพ์แล้วแปลอัตโนมัติ · สลับภาษาได้ด้วยปุ่มลูกศร
          </p>
        </div>
      </div>
    </section>
  )
}
