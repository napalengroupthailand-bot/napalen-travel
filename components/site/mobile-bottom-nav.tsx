'use client'

import { Home, Landmark, BookOpen, Plane, Phone } from 'lucide-react'
import { useNav, type View } from './nav'
import { tapFeedback } from '@/lib/sfx'

const ITEMS: { view: View; label: string; icon: typeof Home }[] = [
  { view: 'home', label: 'หน้าแรก', icon: Home },
  { view: 'hajj', label: 'ฮัจญ์', icon: Landmark },
  { view: 'umrah', label: 'อุมเราะห์', icon: Plane },
  { view: 'knowledge', label: 'ข้อมูล', icon: BookOpen },
  { view: 'contact', label: 'ติดต่อ', icon: Phone },
]

export function MobileBottomNav() {
  const { view, navigate } = useNav()
  if (view === 'admin') return null

  const toolViews: View[] = ['qibla', 'tasbih', 'hijri-calendar', 'quran', 'hotels']
  const highlightHome = view === 'home' || toolViews.includes(view)

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 px-5 pb-[max(20px,env(safe-area-inset-bottom))] pt-2 lg:hidden">
      <ul className="iphone-dock mx-auto flex max-w-md items-stretch justify-around gap-0.5 rounded-[1.75rem] px-2 py-2.5 animate-slide-up">
        {ITEMS.map((item) => {
          const isActive =
            item.view === 'home'
              ? highlightHome
              : view === item.view || (view === 'article' && item.view === 'knowledge')

          return (
            <li key={item.view} className="flex-1">
              <button
                type="button"
                onClick={(e) => {
                  tapFeedback(e)
                  navigate(item.view)
                }}
                className={`dock-item flex w-full flex-col items-center gap-0.5 rounded-2xl py-2 transition-all duration-200 ${
                  isActive ? 'is-active text-royal-blue' : 'text-deep-blue/55'
                }`}
              >
                <item.icon
                  className={`icon-depth size-6 transition-transform duration-200 ${
                    isActive ? 'stroke-[2.4] scale-110 icon-depth-active' : 'stroke-[1.75]'
                  }`}
                />
                <span
                  className={`text-[10px] leading-tight ${
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
