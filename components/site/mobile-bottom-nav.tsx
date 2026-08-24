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
    <nav className="fixed bottom-0 left-0 right-0 z-50 px-4 pb-[max(12px,env(safe-area-inset-bottom))] pt-2 lg:hidden">
      <ul className="mx-auto flex max-w-md items-stretch justify-around rounded-[2rem] bg-white/95 px-2 py-2 shadow-[0_8px_40px_rgba(10,22,40,0.16)] ring-1 ring-black/5 backdrop-blur-xl">
        {ITEMS.map((item) => {
          const isActive =
            item.view === 'home'
              ? highlightHome
              : view === item.view || (view === 'article' && item.view === 'knowledge')

          return (
            <li key={item.view} className="flex-1">
              <button
                type="button"
                onClick={() => navigate(item.view)}
                className={`flex w-full flex-col items-center gap-0.5 rounded-[1.25rem] py-2.5 transition active:scale-95 ${
                  isActive
                    ? 'bg-soft-mint text-royal-blue'
                    : 'text-muted-foreground'
                }`}
              >
                <item.icon className={`size-5 ${isActive ? 'stroke-[2.5]' : 'stroke-2'}`} />
                <span className={`text-[11px] ${isActive ? 'font-bold' : 'font-medium'}`}>
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
