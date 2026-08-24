'use client'

import { Home, Landmark, BookOpen, Plane } from 'lucide-react'
import { useNav, type View } from './nav'
import { tapFeedback } from '@/lib/sfx'

const ITEMS: { view: View; label: string; icon: typeof Home }[] = [
  { view: 'home', label: 'หน้าแรก', icon: Home },
  { view: 'hajj', label: 'ฮัจญ์', icon: Landmark },
  { view: 'umrah', label: 'อุมเราะห์', icon: Plane },
  { view: 'knowledge', label: 'ความรู้', icon: BookOpen },
]

export function MobileBottomNav() {
  const { view, navigate } = useNav()
  if (view === 'admin') return null

  const toolViews: View[] = ['qibla', 'tasbih', 'hijri-calendar', 'quran', 'hotels']
  const highlightHome = view === 'home' || toolViews.includes(view)

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 px-4 pb-[max(12px,env(safe-area-inset-bottom))] pt-2 lg:hidden">
      <ul className="mx-auto flex max-w-md items-stretch justify-around rounded-[1.75rem] bg-white/95 px-1.5 py-1.5 shadow-[0_8px_40px_rgba(10,22,40,0.16)] ring-1 ring-black/5 backdrop-blur-xl animate-slide-up">
        {ITEMS.map((item) => {
          const isActive =
            item.view === 'home'
              ? highlightHome
              : view === item.view || (view === 'article' && item.view === 'knowledge')

          return (
            <li key={item.view} className="flex-1">
              <button
                type="button"
                onClick={(e) => { tapFeedback(e); navigate(item.view) }}
                className={`flex w-full flex-col items-center gap-0 rounded-2xl py-1.5 transition-all duration-200 active:scale-90 ${
                  isActive
                    ? 'bg-soft-mint text-royal-blue scale-105'
                    : 'text-muted-foreground hover:text-deep-blue'
                }`}
              >
                <item.icon
                  className={`size-4.5 size-[18px] transition-transform duration-200 ${
                    isActive ? 'stroke-[2.5] scale-110' : 'stroke-2'
                  }`}
                />
                <span
                  className={`text-[10px] transition-all duration-200 ${
                    isActive ? 'font-bold' : 'font-medium'
                  }`}
                >
                  {item.label}
                </span>
              </button>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
