import { NextRequest, NextResponse } from 'next/server'

const LANGS = new Set(['th', 'ar', 'en', 'ms'])

/** Google Translate แบบฟรี (client=gtx) — คุณภาพดีกว่า MyMemory */
async function translateGoogle(text: string, from: string, to: string) {
  const url =
    `https://translate.googleapis.com/translate_a/single` +
    `?client=gtx&sl=${encodeURIComponent(from)}&tl=${encodeURIComponent(to)}` +
    `&dt=t&q=${encodeURIComponent(text)}`

  const res = await fetch(url, {
    headers: {
      'User-Agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      Accept: '*/*',
    },
    next: { revalidate: 0 },
  })
  if (!res.ok) throw new Error(`google ${res.status}`)

  const data = (await res.json()) as unknown
  // รูปแบบ: [[["แปลแล้ว","ต้นฉบับ",...], ...], ...]
  if (!Array.isArray(data) || !Array.isArray(data[0])) {
    throw new Error('google bad shape')
  }
  const parts: string[] = []
  for (const row of data[0]) {
    if (Array.isArray(row) && typeof row[0] === 'string') {
      parts.push(row[0])
    }
  }
  const out = parts.join('').trim()
  if (!out) throw new Error('google empty')
  return out
}

/** สำรอง: MyMemory */
async function translateMyMemory(text: string, from: string, to: string) {
  const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${from}|${to}`
  const res = await fetch(url, { next: { revalidate: 0 } })
  if (!res.ok) throw new Error('mymemory failed')
  const data = (await res.json()) as {
    responseData?: { translatedText?: string }
  }
  const out = data.responseData?.translatedText?.trim()
  if (!out) throw new Error('mymemory empty')
  if (out.toUpperCase().includes('PLEASE SELECT')) throw new Error(out)
  // กันผลแปลแปลก ๆ ที่คืนเป็น URL / error
  if (out.startsWith('MYMEMORY WARNING')) throw new Error(out)
  return out
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

    if (!text) {
      return NextResponse.json({ error: 'empty' }, { status: 400 })
    }
    if (text.length > 2000) {
      return NextResponse.json({ error: 'too long' }, { status: 400 })
    }
    if (!LANGS.has(from) || !LANGS.has(to)) {
      return NextResponse.json({ error: 'unsupported lang' }, { status: 400 })
    }
    if (from === to) {
      return NextResponse.json({ text, engine: 'same' })
    }

    // ลอง Google ก่อน (แม่นกว่า) → ไม่ได้ค่อย MyMemory
    try {
      const translated = await translateGoogle(text, from, to)
      return NextResponse.json({ text: translated, engine: 'google' })
    } catch (e1) {
      console.warn('google translate failed, fallback mymemory', e1)
      const translated = await translateMyMemory(text, from, to)
      return NextResponse.json({ text: translated, engine: 'mymemory' })
    }
  } catch (e) {
    console.error('translate error', e)
    return NextResponse.json(
      { error: 'แปลไม่สำเร็จ ลองใหม่อีกครั้ง' },
      { status: 500 },
    )
  }
}
