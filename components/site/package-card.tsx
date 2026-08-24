'use client'

import { Check, Clock, Hotel, MapPin, Star } from 'lucide-react'
import type { Package } from '@/lib/site-data'
import { useNav } from './nav'
import { tapFeedback } from '@/lib/sfx'

export function PackageCard({ pkg }: { pkg: Package }) {
  const { navigate } = useNav()
  const cover = pkg.images?.[0] || '/placeholder.svg'
  const previewHighlights = (pkg.highlights || []).slice(0, 4)

  return (
    <article
      className="group soft-card lift flex cursor-pointer flex-col overflow-hidden"
      onClick={(e) => { tapFeedback(e); navigate('package', pkg.id) }}
    >
      <div className="relative h-48 overflow-hidden">
        <img
          src={cover}
          alt={pkg.name}
          className="size-full object-cover transition duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-deep-blue/70 to-transparent" />
        {pkg.featured && (
          <span className="absolute left-3 top-3 flex items-center gap-1 rounded-full bg-luxury-gold px-3 py-1 text-xs font-bold text-deep-blue shadow">
            <Star className="size-3.5 fill-deep-blue" />
            แนะนำ
          </span>
        )}
        <div className="absolute bottom-3 right-3 rounded-2xl bg-deep-blue/90 px-3 py-1.5 text-right backdrop-blur">
          <p className="text-[10px] text-bright-sky/70">เริ่มต้น</p>
          <p className="text-base font-bold text-luxury-gold">{pkg.price}</p>
        </div>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-lg font-bold text-deep-blue">{pkg.name}</h3>
        <div className="mt-3 flex flex-wrap gap-x-3 gap-y-1.5 text-xs text-muted-foreground">
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
        {previewHighlights.length > 0 && (
          <ul className="mt-4 space-y-1.5">
            {previewHighlights.map((h) => (
              <li key={h} className="flex items-start gap-2 text-xs text-muted-foreground">
                <Check className="mt-0.5 size-3.5 shrink-0 text-royal-blue" />
                {h}
              </li>
            ))}
          </ul>
        )}
        <span className="mt-5 inline-flex items-center justify-center rounded-full bg-royal-blue/10 py-2.5 text-sm font-bold text-royal-blue transition group-hover:bg-royal-blue group-hover:text-white">
          ดูรายละเอียด
        </span>
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
    <div className="mb-8 text-center">
      {eyebrow && (
        <p className={`mb-2 text-xs font-bold uppercase tracking-widest ${light ? 'text-luxury-gold' : 'text-royal-blue'}`}>
          {eyebrow}
        </p>
      )}
      <h2 className={`text-2xl font-bold sm:text-3xl ${light ? 'text-white' : 'text-deep-blue'}`}>{title}</h2>
      {subtitle && (
        <p className={`mx-auto mt-2 max-w-xl text-sm leading-relaxed sm:text-base ${light ? 'text-white/75' : 'text-muted-foreground'}`}>
          {subtitle}
        </p>
      )}
    </div>
  )
}
