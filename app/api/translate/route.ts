import { NextRequest, NextResponse } from 'next/server'

const LANGS = new Set(['th', 'ar', 'en', 'ms'])

function joinGoogleSegments(data: unknown): string {
  if (!Array.isArray(data) || !Array.isArray(data[0])) return ''
  const parts: string[] = []
  for (const row of data[0]) {
    if (Array.isArray(row) && typeof row[0] === 'string') {
      parts.push(row[0])
    }
  }
  return parts.join('').trim()
}

/** Google Translate ฟรี — endpoint หลัก */
async function translateGoogleGtx(text: string, from: string, to: string) {
  const url =
    `https://translate.googleapis.com/translate_a/single` +
    `?client=gtx&sl=${encodeURIComponent(from)}&tl=${encodeURIComponent(to)}` +
    `&hl=en&dt=t&ie=UTF-8&oe=UTF-8&q=${encodeURIComponent(text)}`

  const res = await fetch(url, {
    headers: {
      'User-Agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
      Accept: 'application/json, text/plain, */*',
      'Accept-Language': 'en-US,en;q=0.9,th;q=0.8',
    },
    cache: 'no-store',
  })
  if (!res.ok) throw new Error(`gtx ${res.status}`)
  const data = await res.json()
  const out = joinGoogleSegments(data)
  if (!out) throw new Error('gtx empty')
  return out
}

/** สำรอง Google อีก endpoint */
async function translateGoogleAlt(text: string, from: string, to: string) {
  const url =
    `https://clients5.google.com/translate_a/t` +
    `?client=dict-chrome-ex&sl=${encodeURIComponent(from)}` +
    `&tl=${encodeURIComponent(to)}&q=${encodeURIComponent(text)}`

  const res = await fetch(url, {
    headers: {
      'User-Agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
    },
    cache: 'no-store',
  })
  if (!res.ok) throw new Error(`alt ${res.status}`)
  const data = await res.json()
  // รูปแบบมักเป็น [["แปล","ต้นฉบับ"]] หรือ [[["แปล"],"ต้น"]]
  let out = ''
  if (Array.isArray(data)) {
    if (typeof data[0] === 'string') out = data[0]
    else if (Array.isArray(data[0])) {
      if (typeof data[0][0] === 'string') out = data[0][0]
      else if (Array.isArray(data[0][0]) && typeof data[0][0][0] === 'string')
        out = data[0].map((r: unknown) => (Array.isArray(r) ? r[0] : '')).join('')
    }
  }
  out = String(out || '').trim()
  if (!out) throw new Error('alt empty')
  return out
}

async function translateMyMemory(text: string, from: string, to: string) {
  const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${from}|${to}`
  const res = await fetch(url, { cache: 'no-store' })
  if (!res.ok) throw new Error('mymemory failed')
  const data = (await res.json()) as {
    responseData?: { translatedText?: string }
  }
  const out = data.responseData?.translatedText?.trim() || ''
  if (!out || out.toUpperCase().includes('PLEASE SELECT') || out.startsWith('MYMEMORY')) {
    throw new Error('mymemory bad')
  }
  return out
}

/** ล้างผลแปลแปลก ๆ */
function cleanResult(text: string, to: string) {
  let t = text.replace(/\u200f|\u200e/g, '').trim()
  // ถ้าเป็นอาหรับ ให้ช่องว่างและเครื่องหมายคำถามอยู่ถูกฝั่ง
  if (to === 'ar') {
    t = t.replace(/\s+/g, ' ').trim()
  }
  return t
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as {
      text?: string
      from?: string
      to?: string
    }
    const text = (body.text || '').trim()
    const from = (body.from || 'th').toLowerCase()
    const to = (body.to || 'en').toLowerCase()

    if (!text) return NextResponse.json({ error: 'empty' }, { status: 400 })
    if (text.length > 2000) return NextResponse.json({ error: 'too long' }, { status: 400 })
    if (!LANGS.has(from) || !LANGS.has(to)) {
      return NextResponse.json({ error: 'unsupported lang' }, { status: 400 })
    }
    if (from === to) return NextResponse.json({ text, engine: 'same' })

    const engines = [
      { name: 'google', fn: () => translateGoogleGtx(text, from, to) },
      { name: 'google-alt', fn: () => translateGoogleAlt(text, from, to) },
      { name: 'mymemory', fn: () => translateMyMemory(text, from, to) },
    ] as const

    let lastErr: unknown
    for (const eng of engines) {
      try {
        const raw = await eng.fn()
        const translated = cleanResult(raw, to)
        if (translated) {
          return NextResponse.json({ text: translated, engine: eng.name })
        }
      } catch (e) {
        lastErr = e
        console.warn(`translate ${eng.name} failed`, e)
      }
    }

    console.error('all engines failed', lastErr)
    return NextResponse.json({ error: 'แปลไม่สำเร็จ ลองใหม่อีกครั้ง' }, { status: 500 })
  } catch (e) {
    console.error('translate error', e)
    return NextResponse.json({ error: 'แปลไม่สำเร็จ ลองใหม่อีกครั้ง' }, { status: 500 })
  }
}
