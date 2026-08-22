'use client'

import { MapPin, Phone, Mail, MessageCircle } from 'lucide-react'
import { useStore } from './store'
import { useNav, NAV_LINKS } from './nav'
import { COMPANY_LOGO } from '@/lib/site-data'

export function Footer() {
  const { company } = useStore()
  const { navigate } = useNav()

  return (
    <footer className="relative z-10 border-t border-luxury-gold/20 bg-deep-blue text-bright-sky/80">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 md:grid-cols-3">
        <div>
          <div className="mb-4 flex items-center gap-3">
            <img
              src={COMPANY_LOGO || '/placeholder.svg'}
              alt="โลโก้บริษัท"
              width={44}
              height={44}
              crossOrigin="anonymous"
              className="size-11 rounded-full border-2 border-luxury-gold bg-bright-sky object-cover"
              onError={(e) => {
                ;(e.currentTarget as HTMLImageElement).style.display = 'none'
              }}
            />
            <div>
              <p className="font-semibold text-bright-sky">{company.name}</p>
              <p className="text-xs text-luxury-gold">{company.nameEn}</p>
            </div>
          </div>
          <p className="text-sm leading-relaxed">
            บริการฮัจญ์และอุมเราะห์ครบวงจร ด้วยความศรัทธา ความจริงใจ และมาตรฐานพรีเมียม
            เพื่อการเดินทางสู่บ้านของพระเจ้าที่สมบูรณ์แบบ
          </p>
        </div>

        <div>
          <h3 className="mb-4 font-semibold text-luxury-gold">เมนูลัด</h3>
          <ul className="space-y-2 text-sm">
            {NAV_LINKS.map((l) => (
              <li key={l.view}>
                <button onClick={() => navigate(l.view)} className="transition hover:text-luxury-gold">
                  {l.label}
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="mb-4 font-semibold text-luxury-gold">ติดต่อเรา</h3>
          <ul className="space-y-3 text-sm">
            <li className="flex items-start gap-2">
              <MapPin className="mt-0.5 size-4 shrink-0 text-light-cyan" />
              {company.address}
            </li>
            <li className="flex items-center gap-2">
              <Phone className="size-4 shrink-0 text-light-cyan" />
              <a href={`tel:${company.phone}`} className="hover:text-luxury-gold">
                {company.phone}
              </a>
            </li>
            <li className="flex items-center gap-2">
              <Mail className="size-4 shrink-0 text-light-cyan" />
              <a href={`mailto:${company.email}`} className="hover:text-luxury-gold">
                {company.email}
              </a>
            </li>
            <li>
              <a
                href={company.lineLink}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-1 inline-flex items-center gap-1.5 rounded-lg bg-[#06C755] px-3 py-2 text-sm font-semibold text-white"
              >
                <MessageCircle className="size-4" />
                แอดไลน์ Official
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10 py-4 text-center text-xs text-bright-sky/60">
        © {new Date().getFullYear()} {company.name} — สงวนลิขสิทธิ์
      </div>
    </footer>
  )
}
