import { NextRequest, NextResponse } from 'next/server'

const LANGS = new Set(['th', 'ar', 'en', 'ms'])

/** แปลผ่าน MyMemory (ฟรี) — ไม่ต้องใช้ API key */
async function translateMyMemory(text: string, from: string, to: string) {
  const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${from}|${to}`
  const res = await fetch(url, { next: { revalidate: 0 } })
  if (!res.ok) throw new Error('translate failed')
  const data = (await res.json()) as {
    responseData?: { translatedText?: string }
    responseStatus?: number
  }
  const out = data.responseData?.translatedText?.trim()
  if (!out) throw new Error('empty translation')
  // MyMemory sometimes returns "PLEASE SELECT TWO DISTINCT LANGUAGES"
  if (out.toUpperCase().includes('PLEASE SELECT')) throw new Error(out)
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
      return NextResponse.json({ text })
    }

    const translated = await translateMyMemory(text, from, to)
    return NextResponse.json({ text: translated })
  } catch (e) {
    console.error('translate error', e)
    return NextResponse.json(
      { error: 'แปลไม่สำเร็จ ลองใหม่อีกครั้ง' },
      { status: 500 },
    )
  }
}
