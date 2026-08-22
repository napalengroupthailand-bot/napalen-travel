'use client'

import { useEffect, useState } from 'react'

function timeInZone(date: Date, timeZone: string) {
  return new Intl.DateTimeFormat('th-TH', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
    timeZone,
  }).format(date)
}

export type CalendarInfo = {
  hijri: string
  buddhist: string
  gregorian: string
  bangkok: string
  makkah: string
}

const HIJRI_MONTHS_TH = [
  'มุฮัรรอม',
  'ซอฟัร',
  'รอบิอุลเอาวัล',
  'รอบิอุษษานี',
  'ญุมาดัลอูลา',
  'ญุมาดัษษานี',
  'รอญับ',
  'ชะอ์บาน',
  'รอมฎอน',
  'เชาวาล',
  'ซุลเกาะดะฮ์',
  'ซุลฮิจญะฮ์',
]

export function useClock(): CalendarInfo {
  const [now, setNow] = useState<Date | null>(null)

  useEffect(() => {
    setNow(new Date())
    const t = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(t)
  }, [])

  if (!now) {
    return { hijri: '—', buddhist: '—', gregorian: '—', bangkok: '--:--:--', makkah: '--:--:--' }
  }

  // Hijri via Intl islamic calendar
  let hijri = '—'
  try {
    const parts = new Intl.DateTimeFormat('en-u-ca-islamic', {
      day: 'numeric',
      month: 'numeric',
      year: 'numeric',
      timeZone: 'Asia/Riyadh',
    }).formatToParts(now)
    const d = parts.find((p) => p.type === 'day')?.value ?? ''
    const m = Number(parts.find((p) => p.type === 'month')?.value ?? '1')
    const y = parts.find((p) => p.type === 'year')?.value ?? ''
    hijri = `${d} ${HIJRI_MONTHS_TH[m - 1] ?? ''} ${y} ฮ.ศ.`
  } catch {
    hijri = '—'
  }

  const buddhistYear =
    Number(
      new Intl.DateTimeFormat('en', { year: 'numeric', timeZone: 'Asia/Bangkok' }).format(now),
    ) + 543
  const buddhistDayMonth = new Intl.DateTimeFormat('th-TH', {
    day: 'numeric',
    month: 'long',
    timeZone: 'Asia/Bangkok',
  }).format(now)
  const buddhist = `${buddhistDayMonth} ${buddhistYear} พ.ศ.`

  const gregorian = new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'Asia/Bangkok',
  }).format(now)

  return {
    hijri,
    buddhist,
    gregorian: `${gregorian} ค.ศ.`,
    bangkok: timeInZone(now, 'Asia/Bangkok'),
    makkah: timeInZone(now, 'Asia/Riyadh'),
  }
}
