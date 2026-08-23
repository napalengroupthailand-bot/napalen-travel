'use client'

import { Check, Clock, Hotel, MapPin, Star } from 'lucide-react'
import type { Package } from '@/lib/site-data'
import { useNav } from './nav'

export function PackageCard({ pkg }: { pkg: Package }) {
  const { navigate } = useNav()
  const cover = pkg.images?.[0] || '/placeholder.svg'
  // แสดง highlights แค่ 4 ข้อแรก
  const previewHighlights = (pkg.highlights || []).slice(0, 4)

  return (
    <article
      className="group flex cursor-pointer flex-col overflow-hidden rounded-2xl border border-luxury-gold/20 bg-card shadow-lg transition hover:-translate-y-1 hover:shadow-2xl"
      onClick={() => navigate('package', pkg.id)}
    >
      <div className="relative h-52 overflow-hidden">
        <img
          src={cover}
          alt={pkg.name}
          className="size-full object-cover transition duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-deep-blue/70 to-transparent" />
        {pkg.featured && (
          <span className="absolute left-3 top-3 flex items-center gap-1 rounded-full bg-luxury-gold px-3 py-1 text-xs font-semibold text-deep-blue">
            <Star className="size-3.5 fill-deep-blue" />
            แนะนำ
          </span>
        )}
        <div className="absolute bottom-3 right-3 rounded-lg bg-deep-blue/90 px-3 py-1.5 text-right">
          <p className="text-xs text-bright-sky/70">เริ่มต้น</p>
          <p className="text-lg font-bold text-luxury-gold">{pkg.price}</p>
        </div>
      </div>
      <div className="flex flex-1 flex-col p-6">
        <h3 className="text-lg font-semibold text-deep-blue">{pkg.name}</h3>
        <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Clock className="size-3.5 text-royal-blue" />
            {pkg.duration}
          </span>
          <span className="flex items-center gap-1">
            <Hotel className="size-3.5 text-royal-blue" />
            {pkg.hotel}
          </span>
          <span className="flex items-center gap-1">
            <MapPin className="size-3.5 text-royal-blue" />
            {pkg.distance}
          </span>
        </div>
        <ul className="mt-4 flex-1 space-y-2">
          {previewHighlights.map((h) => (
            <li key={h} className="flex items-start gap-2 text-sm text-foreground/80">
              <Check className="mt-0.5 size-4 shrink-0 text-light-cyan" />
              {h}
            </li>
          ))}
          {(pkg.highlights?.length || 0) > 4 && (
            <li className="text-xs text-royal-blue font-medium">+ ดูรายละเอียดเพิ่มเติม</li>
          )}
        </ul>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            navigate('package', pkg.id)
          }}
          className="mt-6 rounded-lg bg-royal-blue px-4 py-2.5 text-center text-sm font-semibold text-bright-sky transition hover:bg-deep-blue"
        >
          ดูรายละเอียด
        </button>
      </div>
    </article>
  )
}

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  light,
}: {
  eyebrow?: string
  title: string
  subtitle?: string
  light?: boolean
}) {
  return (
    <div className="mx-auto mb-10 max-w-2xl text-center">
      {eyebrow && (
        <p className={`mb-2 text-sm font-semibold uppercase tracking-widest ${light ? 'text-luxury-gold' : 'text-luxury-gold'}`}>
          {eyebrow}
        </p>
      )}
      <h2 className={`text-balance text-2xl font-bold sm:text-3xl ${light ? 'text-bright-sky' : 'text-deep-blue'}`}>
        {title}
      </h2>
      <div className="mx-auto mt-3 h-1 w-20 rounded-full bg-luxury-gold" />
      {subtitle && (
        <p className={`mt-4 text-pretty ${light ? 'text-bright-sky/70' : 'text-muted-foreground'}`}>{subtitle}</p>
      )}
    </div>
  )
}
