'use client'

import { Home, Mosque, BookOpen, Plane } from 'lucide-react'
import { useNav, type View } from './nav'

const ITEMS: { view: View; label: string; icon: typeof Home }[] = [
  { view: 'home', label: 'หน้าแรก', icon: Home },
  { view: 'hajj', label: 'ฮัจญ์', icon: Mosque },
  { view: 'umrah', label: 'อุมเราะห์', icon: Plane },
  { view: 'knowledge', label: 'ความรู้', icon: BookOpen },
]

export function MobileBottomNav() {
  const { view, navigate } = useNav()

  // ซ่อนตอนอยู่หน้า admin
  if (view === 'admin') return null

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-luxury-gold/20 bg-deep-blue/95 backdrop-blur-md lg:hidden">
      <ul className="mx-auto flex max-w-lg items-stretch justify-around px-1 pb-[env(safe-area-inset-bottom)]">
        {ITEMS.map((item) => {
          const active =
            view === item.view ||
            (item.view === 'hajj' && view === 'package') ||
            (item.view === 'knowledge' && view === 'article')
          // package detail: highlight ตาม type จะยาก — เน้น home/hajj/umrah/knowledge อย่างง่าย
          const isActive =
            view === item.view ||
            (view === 'article' && item.view === 'knowledge')

          return (
            <li key={item.view} className="flex-1">
              <button
                type="button"
                onClick={() => navigate(item.view)}
                className={`flex w-full flex-col items-center gap-0.5 py-2.5 text-[10px] font-medium transition ${
                  isActive
                    ? 'text-luxury-gold'
                    : 'text-bright-sky/60 hover:text-bright-sky'
                }`}
              >
                <item.icon
                  className={`size-5 ${isActive ? 'stroke-[2.5]' : ''}`}
                />
                {item.label}
              </button>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
