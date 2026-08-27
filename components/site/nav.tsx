'use client'

import { createContext, useContext } from 'react'

export type View =
  | 'home'
  | 'hajj'
  | 'umrah'
  | 'knowledge'
  | 'article'
  | 'package'
  | 'contact'
  | 'admin'
  | 'qibla'
  | 'tasbih'
  | 'hijri-calendar'
  | 'quran'
  | 'hotels'
  | 'albums'
  | 'album'
  | 'guides'
  | 'guide-hajj'
  | 'guide-umrah'

type NavValue = {
  view: View
  articleId: string | null
  packageId: string | null
  albumId: string | null
  navigate: (view: View, id?: string) => void
}

export const NavContext = createContext<NavValue | null>(null)

export function useNav() {
  const ctx = useContext(NavContext)
  if (!ctx) throw new Error('useNav must be used within NavContext')
  return ctx
}

export const NAV_LINKS: { view: View; label: string }[] = [
  { view: 'home', label: 'หน้าแรก' },
  { view: 'hajj', label: 'บริการฮัจญ์' },
  { view: 'umrah', label: 'บริการอุมเราะห์' },
  { view: 'knowledge', label: 'คลังข้อมูล' },
  { view: 'contact', label: 'ติดต่อเรา' },
]
