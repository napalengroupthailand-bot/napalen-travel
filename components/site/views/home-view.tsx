'use client'

import { useState, useEffect } from 'react'
import { ArrowRight, MessageCircle, MapPin, Quote, Users, Award, Heart, Volume2, VolumeX, ChevronLeft, ChevronRight } from 'lucide-react'
import { useStore } from '../store'
import { useNav } from '../nav'
import { SectionHeading } from '../package-card'
import { youtubeEmbedUrl, extractYoutubeId } from '@/lib/site-data'

export function HomeView() {
  const { company, settings } = useStore()
  const { navigate } = useNav()
  const [muted, setMuted] = useState(true)
  const [slide, setSlide] = useState(0)
  const gallery = settings.gallery.filter(Boolean)
  const ytId = extractYoutubeId(settings.youtubeHeroUrl)
  const embedSrc = ytId ? youtubeEmbedUrl(settings.youtubeHeroUrl, muted) : ''

  useEffect(() => {
    if (gallery.length <= 1) return
    const t = setInterval(() => setSlide((s) => (s + 1) % gallery.length), 4500)
    return () => clearInterval(t)
  }, [gallery.length])

  const stats = [
    { icon: Heart, value: settings.stats.umrahCount, label: 'ผู้ไปอุมเราะห์' },
    { icon: Award, value: settings.stats.hajjCount, label: 'ผู้ไปฮัจญ์' },
    { icon: Users, value: settings.stats.totalCustomers, label: 'ผู้ใช้บริการทั้งหมด' },
  ]

  return (
    <div>
     <section className="relative flex min-h-[80vh] items-center justify-center overflow-hidden">
  {embedSrc ? (
    <div className="pointer-events-none absolute inset-0 scale-150">
      <iframe
        key={embedSrc}
        src={embedSrc}
        title="Hero video"
        allow="autoplay; encrypted-media; picture-in-picture"
        allowFullScreen
        playsInline
        className="absolute left-1/2 top-1/2 h-[56.25vw] min-h-full w-[177.78vh] min-w-full -translate-x-1/2 -translate-y-1/2 border-0"
      />
    </div>
  ) : (
    <img
      src="/images/hero-kaaba.png"
      alt="กะอ์บะฮ์ มัสยิดอัลหะรอม"
      className="absolute inset-0 size-full object-cover"
    />
  )}
  <div className="absolute inset-0 bg-gradient-to-b from-deep-blue/80 via-deep-blue/70 to-deep-blue/90" />

  {/* ปุ่มเปิด/ปิดเสียง — มือถือและเดสก์ท็อป */}
  {ytId && (
    <button
      type="button"
      onClick={() => setMuted((m) => !m)}
      className="absolute bottom-6 right-6 z-20 flex items-center gap-2 rounded-full bg-black/50 px-4 py-2 text-sm text-white backdrop-blur transition hover:bg-black/70"
      aria-label={muted ? 'เปิดเสียง' : 'ปิดเสียง'}
    >
      {muted ? <VolumeX className="size-4" /> : <Volume2 className="size-4" />}
      <span className="hidden sm:inline">{muted ? 'เปิดเสียง' : 'ปิดเสียง'}</span>
    </button>
  )}

  {/* เนื้อหาเดิม ... */}
        <div className="relative z-10 mx-auto max-w-3xl px-4 py-20 text-center">
          <p className="animate-float-up font-arabic text-2xl text-luxury-gold sm:text-3xl">
            بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
          </p>
          <h1 className="mt-4 text-balance text-4xl font-bold leading-tight text-bright-sky sm:text-5xl md:text-6xl">
            เดินทางสู่<span className="gold-text">บ้านของพระเจ้า</span>
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-pretty text-base leading-relaxed text-bright-sky/85 sm:text-lg">
            บริการฮัจญ์และอุมเราะห์ครบวงจร ด้วยความศรัทธา ความจริงใจ
            และการดูแลระดับพรีเมียมในทุกย่างก้าวของการเดินทางอันศักดิ์สิทธิ์
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <button
              onClick={() => navigate('hajj')}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-luxury-gold px-7 py-3 font-semibold text-deep-blue transition hover:brightness-110 sm:w-auto"
            >
              สมัครฮัจญ์
              <ArrowRight className="size-4" />
            </button>
            <button
              onClick={() => navigate('umrah')}
              className="flex w-full items-center justify-center gap-2 rounded-lg border border-bright-sky/40 bg-white/5 px-7 py-3 font-semibold text-bright-sky backdrop-blur transition hover:bg-white/10 sm:w-auto"
            >
              สมัครอุมเราะห์
              <ArrowRight className="size-4" />
            </button>
          </div>
        </div>
      </section>

      <section className="relative z-10 -mt-14 px-4">
        <div className="mx-auto grid max-w-4xl gap-4 rounded-2xl border border-luxury-gold/30 bg-card p-6 shadow-2xl sm:grid-cols-3">
          {stats.map((s) => (
            <div key={s.label} className="flex flex-col items-center gap-1 py-2 text-center">
              <s.icon className="size-8 text-luxury-gold" />
              <p className="text-3xl font-bold text-deep-blue">{s.value}</p>
              <p className="text-sm text-muted-foreground">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20">
        <SectionHeading
          eyebrow="บริการของเรา"
          title="เลือกเส้นทางแห่งศรัทธาของท่าน"
          subtitle="เราพร้อมดูแลทุกขั้นตอน ตั้งแต่การเตรียมตัวจนกลับถึงบ้านอย่างปลอดภัย"
        />
        <div className="grid gap-6 md:grid-cols-2">
          {[
            {
              title: 'บริการฮัจญ์',
              desc: 'การประกอบพิธีฮัจญ์อันสมบูรณ์ ตามหลักศาสนา พร้อมทีมแซะหฺผู้เชี่ยวชาญนำคณะตลอดการเดินทาง',
              img: '/images/hajj-arafat.png',
              go: 'hajj' as const,
            },
            {
              title: 'บริการอุมเราะห์',
              desc: 'อุมเราะห์ได้ตลอดทั้งปี ที่พักหรูใกล้มัสยิด พร้อมโปรแกรมเยือนมะดีนะฮ์และสถานที่สำคัญ',
              img: '/images/medina-mosque.png',
              go: 'umrah' as const,
            },
          ].map((s) => (
            <article
              key={s.title}
              className="group relative overflow-hidden rounded-2xl border border-luxury-gold/20 shadow-lg"
            >
              <img
                src={s.img || '/placeholder.svg'}
                alt={s.title}
                className="h-72 w-full object-cover transition duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-deep-blue via-deep-blue/50 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-7">
                <h3 className="text-2xl font-bold text-bright-sky">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-bright-sky/85">{s.desc}</p>
                <button
                  onClick={() => navigate(s.go)}
                  className="mt-4 inline-flex items-center gap-2 rounded-lg bg-luxury-gold px-5 py-2.5 text-sm font-semibold text-deep-blue transition hover:brightness-110"
                >
                  ดูรายละเอียด
                  <ArrowRight className="size-4" />
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      {gallery.length > 0 && (
        <section className="bg-deep-blue px-4 py-16">
          <div className="mx-auto max-w-5xl">
            <SectionHeading eyebrow="แกลเลอรี" title="ภาพจากเส้นทางศรัทธา" light />
            <div className="relative mt-8 overflow-hidden rounded-2xl">
              <div className="relative aspect-[16/9] w-full">
                {gallery.map((src, i) => (
                  <img
                    key={i}
                    src={src}
                    alt={`แกลเลอรี ${i + 1}`}
                    className={`absolute inset-0 size-full object-cover transition-opacity duration-700 ${
                      i === slide ? 'opacity-100' : 'opacity-0'
                    }`}
                  />
                ))}
              </div>
              {gallery.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={() => setSlide((s) => (s - 1 + gallery.length) % gallery.length)}
                    className="absolute left-3 top-1/2 z-10 -translate-y-1/2 rounded-full bg-black/40 p-2 text-white backdrop-blur hover:bg-black/60"
                    aria-label="ก่อนหน้า"
                  >
                    <ChevronLeft className="size-5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setSlide((s) => (s + 1) % gallery.length)}
                    className="absolute right-3 top-1/2 z-10 -translate-y-1/2 rounded-full bg-black/40 p-2 text-white backdrop-blur hover:bg-black/60"
                    aria-label="ถัดไป"
                  >
                    <ChevronRight className="size-5" />
                  </button>
                  <div className="absolute bottom-3 left-1/2 z-10 flex -translate-x-1/2 gap-1.5">
                    {gallery.map((_, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setSlide(i)}
                        className={`size-2 rounded-full transition ${
                          i === slide ? 'bg-luxury-gold' : 'bg-white/50'
                        }`}
                        aria-label={`สไลด์ ${i + 1}`}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </section>
      )}

      <section className="px-4 py-20">
        <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-6 rounded-2xl bg-deep-blue p-8 text-center sm:flex-row sm:text-left">
          <div>
            <h3 className="text-xl font-bold text-bright-sky sm:text-2xl">
              สอบถามรายละเอียดเพิ่มเติมได้ทันที
            </h3>
            <p className="mt-2 text-sm text-bright-sky/80">
              แอดไลน์ Official ของเราเพื่อรับคำปรึกษาฟรี และข่าวสารโปรโมชั่นล่าสุด
            </p>
          </div>
          <a
            href={company.lineLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex shrink-0 items-center gap-2 rounded-lg bg-[#06C755] px-7 py-3.5 font-semibold text-white transition hover:brightness-110"
          >
            <MessageCircle className="size-5" />
            แอดไลน์ Official
          </a>
        </div>
      </section>

      <section className="bg-bright-sky px-4 py-20">
        <div className="mx-auto max-w-7xl">
          <SectionHeading eyebrow="เสียงจากผู้เดินทาง" title="ความประทับใจจากผู้แสวงบุญ" />
          <div className="grid gap-6 md:grid-cols-3">
            {settings.testimonials.map((t) => (
              <figure
                key={t.id}
                className="flex flex-col rounded-2xl border border-luxury-gold/20 bg-card p-6 shadow-lg"
              >
                <Quote className="size-8 text-luxury-gold/40" />
                <blockquote className="mt-3 flex-1 text-sm leading-relaxed text-foreground/80">
                  {t.text}
                </blockquote>
                <figcaption className="mt-5 flex items-center gap-3 border-t border-border pt-4">
                  <img
                    src={t.image || '/placeholder-user.jpg'}
                    alt={t.name}
                    className="size-11 rounded-full object-cover"
                  />
                  <div>
                    <p className="text-sm font-semibold text-deep-blue">{t.name}</p>
                    <p className="text-xs text-muted-foreground">{t.role}</p>
                  </div>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20">
        <SectionHeading eyebrow="เยี่ยมชมเรา" title="สำนักงานของเรา" />
        <div className="grid items-stretch gap-6 lg:grid-cols-2">
          <div className="flex flex-col justify-center rounded-2xl border border-luxury-gold/20 bg-card p-8 shadow-lg">
            <h3 className="text-xl font-semibold text-deep-blue">{company.name}</h3>
            <p className="mt-1 text-sm text-luxury-gold">{company.nameEn}</p>
            <p className="mt-5 flex items-start gap-2 text-sm text-foreground/80">
              <MapPin className="mt-0.5 size-5 shrink-0 text-royal-blue" />
              {company.address}
            </p>
            <p className="mt-3 text-sm text-foreground/80">โทร. {company.phone}</p>
            <p className="mt-1 text-sm text-foreground/80">อีเมล {company.email}</p>
            {settings.staffContacts.length > 0 && (
              <div className="mt-4 space-y-1 border-t border-border pt-4">
                {settings.staffContacts.map((s) => (
                  <p key={s.id} className="text-sm text-foreground/80">
                    <span className="font-medium text-deep-blue">{s.name}</span>
                    <span className="text-muted-foreground"> · {s.role}</span>
                    <span className="text-royal-blue"> · {s.phone}</span>
                  </p>
                ))}
              </div>
            )}
            <button
              onClick={() => navigate('contact')}
              className="mt-6 inline-flex w-fit items-center gap-2 rounded-lg bg-royal-blue px-6 py-3 text-sm font-semibold text-bright-sky transition hover:bg-deep-blue"
            >
              ติดต่อเรา
              <ArrowRight className="size-4" />
            </button>
          </div>
          <div className="min-h-[320px] overflow-hidden rounded-2xl border border-luxury-gold/20 shadow-lg">
            <iframe
              src={company.mapEmbed}
              title="แผนที่สำนักงาน"
              className="size-full min-h-[320px]"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </section>
    </div>
  )
}
