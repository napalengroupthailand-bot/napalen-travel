'use client'

import { Home, Landmark, BookOpen, Plane } from 'lucide-react'
import { useNav, type View } from './nav'

const ITEMS: { view: View; label: string; icon: typeof Home }[] = [
  { view: 'home', label: 'หน้าแรก', icon: Home },
  { view: 'hajj', label: 'ฮัจญ์', icon: Landmark },
  { view: 'umrah', label: 'อุมเราะห์', icon: Plane },
  { view: 'knowledge', label: 'ความรู้', icon: BookOpen },
]

export function MobileBottomNav() {
  const { view, navigate } = useNav()

  if (view === 'admin') return null

  const toolViews: View[] = ['qibla', 'tasbih', 'hijri-calendar', 'quran']
  const highlightHome = view === 'home' || toolViews.includes(view)

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 px-3 pb-[max(10px,env(safe-area-inset-bottom))] pt-1 lg:hidden">
      <ul className="mx-auto flex max-w-md items-stretch justify-around gap-0.5 rounded-[1.75rem] border border-white/80 bg-white/95 px-2 py-2 shadow-[0_8px_32px_rgba(10,20,40,0.14)] backdrop-blur-xl">
        {ITEMS.map((item) => {
          const isActive =
            item.view === 'home'
              ? highlightHome
              : view === item.view ||
                (view === 'article' && item.view === 'knowledge')

          return (
            <li key={item.view} className="flex-1">
              <button
                type="button"
                onClick={() => navigate(item.view)}
                className={`flex w-full flex-col items-center gap-0.5 rounded-2xl py-2.5 transition active:scale-95 ${
                  isActive
                    ? 'bg-royal-blue text-white shadow-md shadow-royal-blue/25'
                    : 'text-muted-foreground active:bg-soft-mint'
                }`}
              >
                <item.icon className={`size-5 ${isActive ? 'stroke-[2.5]' : 'stroke-2'}`} />
                <span className={`text-[11px] leading-none ${isActive ? 'font-bold' : 'font-medium'}`}>
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
