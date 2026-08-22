'use client'

import { createContext, useContext } from 'react'

export type View =
  | 'home'
  | 'hajj'
  | 'umrah'
  | 'knowledge'
  | 'article'
  | 'contact'
  | 'admin'

type NavValue = {
  view: View
  articleId: string | null
  navigate: (view: View, articleId?: string) => void
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
  { view: 'knowledge', label: 'คลังความรู้' },
  { view: 'contact', label: 'ติดต่อเรา' },
]
