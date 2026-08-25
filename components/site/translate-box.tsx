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
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const abortRef = useRef<AbortController | null>(null)

  const doTranslate = useCallback(
    async (text: string, f: LangCode, t: LangCode) => {
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
    },
    [],
  )

  // auto-translate เมื่อพิมพ์ (debounce 600ms)
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

  const isRtl = to === 'ar' || from === 'ar'

  return (
    <section className="relative z-10 mx-auto max-w-4xl px-4 pb-2 pt-4">
      <div className="soft-card overflow-hidden animate-slide-up">
        <div className="flex items-center gap-2 border-b border-border/50 bg-soft-mint/50 px-4 py-2.5">
          <Languages className="size-4 text-royal-blue" />
          <h3 className="text-sm font-bold text-deep-blue">แปลภาษา</h3>
          <span className="text-[10px] text-muted-foreground">ไทย · อาหรับ · อังกฤษ · มาลายู</span>
        </div>

        <div className="space-y-3 p-3 sm:p-4">
          {/* เลือกภาษา */}
          <div className="flex flex-wrap items-center justify-center gap-2">
            <div className="flex rounded-full bg-soft-mint p-0.5">
              {LANGS.map((l) => (
                <button
                  key={`from-${l.code}`}
                  type="button"
                  onClick={() => setFrom(l.code)}
                  className={`rounded-full px-2.5 py-1 text-[11px] font-semibold transition sm:px-3 sm:text-xs ${
                    from === l.code
                      ? 'bg-royal-blue text-white shadow-sm'
                      : 'text-deep-blue/70 hover:text-deep-blue'
                  }`}
                >
                  {l.short}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={swap}
              className="flex size-8 items-center justify-center rounded-full border border-border bg-white text-royal-blue transition hover:bg-royal-blue hover:text-white active:scale-90"
              aria-label="สลับภาษา"
            >
              <ArrowLeftRight className="size-3.5" />
            </button>

            <div className="flex rounded-full bg-soft-mint p-0.5">
              {LANGS.map((l) => (
                <button
                  key={`to-${l.code}`}
                  type="button"
                  onClick={() => setTo(l.code)}
                  className={`rounded-full px-2.5 py-1 text-[11px] font-semibold transition sm:px-3 sm:text-xs ${
                    to === l.code
                      ? 'bg-royal-blue text-white shadow-sm'
                      : 'text-deep-blue/70 hover:text-deep-blue'
                  }`}
                >
                  {l.short}
                </button>
              ))}
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-[10px] font-semibold text-muted-foreground">
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
                className="w-full resize-none rounded-2xl border border-border bg-white px-3 py-2.5 text-sm text-deep-blue outline-none transition focus:border-royal-blue focus:ring-2 focus:ring-royal-blue/20"
              />
            </div>

            <div>
              <div className="mb-1 flex items-center justify-between">
                <label className="text-[10px] font-semibold text-muted-foreground">
                  แปลเป็น · {LANGS.find((l) => l.code === to)?.label}
                </label>
                <div className="flex items-center gap-1">
                  {loading && <Loader2 className="size-3.5 animate-spin text-royal-blue" />}
                  <button
                    type="button"
                    onClick={copyOut}
                    disabled={!result}
                    className="flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium text-royal-blue transition hover:bg-royal-blue/10 disabled:opacity-40"
                  >
                    {copied ? <Check className="size-3" /> : <Copy className="size-3" />}
                    {copied ? 'คัดลอกแล้ว' : 'คัดลอก'}
                  </button>
                </div>
              </div>
              <div
                dir={to === 'ar' ? 'rtl' : 'ltr'}
                className={`min-h-[5.5rem] rounded-2xl border border-border bg-soft-mint/40 px-3 py-2.5 text-sm text-deep-blue ${
                  to === 'ar' ? 'font-arabic text-base leading-relaxed' : ''
                }`}
              >
                {error ? (
                  <span className="text-destructive">{error}</span>
                ) : result ? (
                  result
                ) : (
                  <span className="text-muted-foreground/60">ผลแปลจะแสดงที่นี่...</span>
                )}
              </div>
            </div>
          </div>

          <p className="text-center text-[10px] text-muted-foreground">
            พิมพ์แล้วแปลอัตโนมัติ · สลับภาษาได้ด้วยปุ่มลูกศร
          </p>
        </div>
      </div>
    </section>
  )
}
