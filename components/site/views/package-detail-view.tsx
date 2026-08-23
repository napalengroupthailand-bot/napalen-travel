'use client'

import { useState } from 'react'
import { ArrowLeft, Check, Clock, Hotel, MapPin, ChevronLeft, ChevronRight } from 'lucide-react'
import { useStore } from '../store'
import { useNav } from '../nav'
import { RegistrationForm } from '../registration-form'

export function PackageDetailView({ packageId }: { packageId: string | null }) {
  const { packages } = useStore()
  const { navigate } = useNav()
  const [imgIndex, setImgIndex] = useState(0)

  const pkg = packages.find((p) => p.id === packageId)

  if (!pkg) {
    return (
      <div className="flex min-h-[40vh] flex-col items-center justify-center gap-4 px-4">
        <p className="text-muted-foreground">ไม่พบแพ็กเกจที่ต้องการ</p>
        <button
          onClick={() => navigate('umrah')}
          className="rounded-lg bg-royal-blue px-4 py-2 text-sm text-bright-sky"
        >
          กลับไปหน้าบริการ
        </button>
      </div>
    )
  }

  const images = pkg.images?.length ? pkg.images : ['/placeholder.svg']
  const backView = pkg.type === 'hajj' ? 'hajj' : 'umrah'

  return (
    <div>
      {/* Header */}
      <div className="border-b border-border bg-card px-4 py-4">
        <div className="mx-auto flex max-w-5xl items-center gap-3">
          <button
            onClick={() => navigate(backView)}
            className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-sm text-deep-blue transition hover:bg-muted"
          >
            <ArrowLeft className="size-4" />
            กลับ
          </button>
          <h1 className="text-lg font-semibold text-deep-blue sm:text-xl">{pkg.name}</h1>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-4 py-8">
        {/* Gallery */}
        <div className="relative overflow-hidden rounded-2xl">
          <img
            src={images[imgIndex]}
            alt={pkg.name}
            className="aspect-[16/9] w-full object-cover"
          />
          {images.length > 1 && (
            <>
              <button
                type="button"
                onClick={() => setImgIndex((i) => (i - 1 + images.length) % images.length)}
                className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white backdrop-blur"
              >
                <ChevronLeft className="size-5" />
              </button>
              <button
                type="button"
                onClick={() => setImgIndex((i) => (i + 1) % images.length)}
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white backdrop-blur"
              >
                <ChevronRight className="size-5" />
              </button>
              <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5">
                {images.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setImgIndex(i)}
                    className={`size-2 rounded-full ${i === imgIndex ? 'bg-luxury-gold' : 'bg-white/50'}`}
                  />
                ))}
              </div>
            </>
          )}
        </div>

        {/* Meta */}
        <div className="mt-6 flex flex-wrap items-center gap-4">
          <span className="rounded-lg bg-deep-blue px-4 py-2 text-xl font-bold text-luxury-gold">
            {pkg.price}
          </span>
          <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <Clock className="size-4 text-royal-blue" />
            {pkg.duration}
          </span>
          <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <Hotel className="size-4 text-royal-blue" />
            {pkg.hotel}
          </span>
          <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <MapPin className="size-4 text-royal-blue" />
            {pkg.distance}
          </span>
        </div>

        {/* Highlights */}
        {pkg.highlights?.length > 0 && (
          <section className="mt-8">
            <h2 className="mb-4 text-lg font-semibold text-deep-blue">รายละเอียดแพ็กเกจ</h2>
            <ul className="space-y-2.5">
              {pkg.highlights.map((h) => (
                <li key={h} className="flex items-start gap-2.5 text-sm leading-relaxed text-foreground/90">
                  <Check className="mt-0.5 size-4 shrink-0 text-light-cyan" />
                  {h}
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Sub blocks */}
        {pkg.subBlocks?.map((sb) => (
          <section key={sb.id} className="mt-8 rounded-2xl border border-border bg-card p-5">
            <h3 className="text-base font-semibold text-deep-blue">{sb.title}</h3>
            {sb.content && (
              <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-muted-foreground">
                {sb.content}
              </p>
            )}
            {sb.images?.length > 0 && (
              <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3">
                {sb.images.map((src, i) => (
                  <img
                    key={i}
                    src={src}
                    alt=""
                    className="aspect-video w-full rounded-lg object-cover"
                  />
                ))}
              </div>
            )}
          </section>
        ))}

        {/* Register */}
        <section id="register" className="mt-12 scroll-mt-24">
          <RegistrationForm type={pkg.type} defaultPackageName={pkg.name} />
        </section>
      </div>
    </div>
  )
}
