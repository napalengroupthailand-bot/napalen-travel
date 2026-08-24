'use client'

import { useState } from 'react'
import { Menu, X, MessageCircle, Lock } from 'lucide-react'
import { useStore } from './store'
import { useNav, NAV_LINKS, type View } from './nav'
import { COMPANY_LOGO } from '@/lib/site-data'

export function Navbar() {
  const { company } = useStore()
  const { view, navigate } = useNav()
  const [open, setOpen] = useState(false)

  const go = (v: View) => {
    navigate(v)
    setOpen(false)
  }

  return (
    <header className="sticky top-0 z-50 border-b border-luxury-gold/20 bg-deep-blue/95 backdrop-blur-md">
      <nav className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-3 py-2 sm:px-4 sm:py-3">
        <button
          onClick={() => go('home')}
          className="flex items-center gap-3 text-left"
          aria-label="ไปหน้าแรก"
        >
          <img
            src={COMPANY_LOGO || '/placeholder.svg'}
            alt="โลโก้ นาปาเลน แทรเวิล แอนด์ ทัวร์"
            width={48}
            height={48}
            className="size-9 rounded-full sm:size-11 border-2 border-luxury-gold bg-bright-sky object-cover"
          />
          <div className="leading-tight">
            <p className="text-sm font-semibold text-bright-sky sm:text-base">นาปาเลน แทรเวิล</p>
            <p className="text-[10px] font-light tracking-wide text-luxury-gold sm:text-xs">
              NAPALEN TRAVEL &amp; TOUR
            </p>
          </div>
        </button>

        <ul className="hidden items-center gap-1 lg:flex">
          {NAV_LINKS.map((link) => (
            <li key={link.view}>
              <button
                onClick={() => go(link.view)}
                className={`rounded-full px-3 py-2 text-sm font-medium transition ${
                  view === link.view
                    ? 'bg-royal-blue text-bright-sky'
                    : 'text-bright-sky/80 hover:bg-white/5 hover:text-luxury-gold'
                }`}
              >
                {link.label}
              </button>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <a
            href={company.lineLink}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden items-center gap-1.5 rounded-full bg-[#06C755] px-3 py-2 text-sm font-semibold text-white transition hover:brightness-110 sm:flex"
          >
            <MessageCircle className="size-4" />
            แอดไลน์
          </a>
          <button
            onClick={() => go('admin')}
            className="flex items-center gap-1.5 rounded-full border border-luxury-gold/50 px-3 py-2 text-sm font-medium text-luxury-gold transition hover:bg-luxury-gold hover:text-deep-blue"
          >
            <Lock className="size-4" />
            <span className="hidden sm:inline">Admin</span>
          </button>
          <button
            onClick={() => setOpen((o) => !o)}
            className="rounded-lg p-2 text-bright-sky lg:hidden"
            aria-label="เปิดเมนู"
            aria-expanded={open}
          >
            {open ? <X className="size-6" /> : <Menu className="size-6" />}
          </button>
        </div>
      </nav>

      {open && (
        <div className="border-t border-white/10 bg-deep-blue lg:hidden">
          <ul className="mx-auto flex max-w-7xl flex-col gap-1 px-3 py-2 sm:px-4 sm:py-3">
            {NAV_LINKS.map((link) => (
              <li key={link.view}>
                <button
                  onClick={() => go(link.view)}
                  className={`w-full rounded-lg px-3 py-2.5 text-left text-sm font-medium transition ${
                    view === link.view
                      ? 'bg-royal-blue text-bright-sky'
                      : 'text-bright-sky/80 hover:bg-white/5'
                  }`}
                >
                  {link.label}
                </button>
              </li>
            ))}
            <li>
              <a
                href={company.lineLink}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-1 flex items-center justify-center gap-1.5 rounded-lg bg-[#06C755] px-3 py-2.5 text-sm font-semibold text-white"
              >
                <MessageCircle className="size-4" />
                แอดไลน์ Official
              </a>
            </li>
          </ul>
        </div>
      )}
    </header>
  )
}
