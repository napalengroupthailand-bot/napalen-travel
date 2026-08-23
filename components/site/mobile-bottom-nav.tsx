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

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-luxury-gold/30 bg-deep-blue shadow-[0_-4px_20px_rgba(0,0,0,0.25)] lg:hidden">
      <ul className="mx-auto flex max-w-lg items-stretch justify-around px-2 pt-2 pb-[max(12px,env(safe-area-inset-bottom))]">
        {ITEMS.map((item) => {
          const isActive =
            view === item.view ||
            (view === 'article' && item.view === 'knowledge')

          return (
            <li key={item.view} className="flex-1">
              <button
                type="button"
                onClick={() => navigate(item.view)}
                className={`flex w-full flex-col items-center gap-1 rounded-xl py-2.5 transition ${
                  isActive
                    ? 'bg-white/10 text-luxury-gold'
                    : 'text-bright-sky/70 active:bg-white/5'
                }`}
              >
                <item.icon className={`size-6 ${isActive ? 'stroke-[2.5]' : 'stroke-2'}`} />
                <span className="text-xs font-semibold">{item.label}</span>
              </button>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
