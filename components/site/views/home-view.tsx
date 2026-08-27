'use client'

import { useState, useEffect, useRef } from 'react'
import { ArrowRight, MessageCircle, MapPin, Quote, Users, Award, Heart, Volume2, VolumeX, ChevronLeft, ChevronRight, Compass, CircleDot, CalendarDays, BookOpen, Hotel } from 'lucide-react'
import { useStore } from '../store'
import { useNav } from '../nav'
import { SectionHeading } from '../package-card'
import { youtubeEmbedUrl, extractYoutubeId } from '@/lib/site-data'
import { tapFeedback } from '@/lib/sfx'
import { TranslateBox } from '../translate-box'

export function HomeView() {
  const { company, settings } = useStore()
  const { navigate } = useNav()
  const [muted, setMuted] = useState(true)
  const [videoStarted, setVideoStarted] = useState(false)
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const [isMobile, setIsMobile] = useState(false)
  const [slide, setSlide] = useState(0)
  const gallery = settings.gallery.filter(Boolean)
  const ytId = settings.heroMode !== 'image' ? extractYoutubeId(settings.youtubeHeroUrl) : ''
  // สร้าง URL ตอน video เริ่มแล้วเท่านั้น (ฝั่ง client) เพื่อให้ origin + autoplay ถูกต้องบน iPhone
  const embedSrc =
  ytId && videoStarted
    ? youtubeEmbedUrl(settings.youtubeHeroUrl, muted, { controls: isMobile })
    : ''

  // PC: เล่น YouTube ทันที (mute) | โหมดภาพ: โชว์รูป | มือถือ: รอเปิดเสียง
  useEffect(() => {
    const mobile =
      typeof window !== 'undefined' &&
      (/iPhone|iPad|iPod|Android/i.test(navigator.userAgent) ||
        (window.matchMedia && window.matchMedia('(max-width: 768px)').matches))
    setIsMobile(!!mobile)
    setMuted(true)
    const isYoutube = settings.heroMode !== 'image' && !!extractYoutubeId(settings.youtubeHeroUrl)
    if (!mobile && isYoutube) {
      setVideoStarted(true)
    } else {
      setVideoStarted(false)
    }
  }, [settings.heroMode, settings.youtubeHeroUrl])

  useEffect(() => {
    if (gallery.length <= 1) return
    const t = setInterval(() => setSlide((s) => (s + 1) % gallery.length), 4500)
    return () => clearInterval(t)
  }, [gallery.length])
  /** ต้องใส่ src ในจังหวะคลิกเดียวกัน — iOS ไม่อนุญาต autoplay หลัง re-render */
  const startVideoNow = (withSound: boolean) => {
    const url = youtubeEmbedUrl(settings.youtubeHeroUrl, !withSound, {
      controls: true,
    })
    setMuted(!withSound)
    setVideoStarted(true)
    // สำคัญ: ตั้ง src ทันทีใน user gesture (อย่ารอ React render)
    const el = iframeRef.current
    if (el) {
      el.src = url
    }
  }

  const handleStartVideo = () => {
    startVideoNow(true)
  }

  const handleToggleMute = () => {
    if (!videoStarted) {
      startVideoNow(true)
      return
    }
    // สลับเสียงผ่านโหลด URL ใหม่ + postMessage
    const nextMuted = !muted
    setMuted(nextMuted)
    const url = youtubeEmbedUrl(settings.youtubeHeroUrl, nextMuted, {
      controls: isMobile,
    })
    const el = iframeRef.current
    if (el) {
      el.src = url
      // ลองสั่ง play ซ้ำ
      try {
        el.contentWindow?.postMessage(
          JSON.stringify({ event: 'command', func: 'playVideo', args: [] }),
          '*',
        )
        el.contentWindow?.postMessage(
          JSON.stringify({
            event: 'command',
            func: nextMuted ? 'mute' : 'unMute',
            args: [],
          }),
          '*',
        )
      } catch {
        /* ignore */
      }
    }
  }

  return (
    <div>
    <section className="relative flex min-h-[85vh] items-center justify-center overflow-hidden sm:min-h-[80vh]">
      {/* พื้นหลังหน้าปก: ภาพ หรือ YouTube */}
      <div className="absolute inset-0 overflow-hidden">
        {(settings.heroMode === 'image' || !videoStarted || !ytId) && (
          <img
            src={
              settings.heroImage ||
              (ytId ? `https://img.youtube.com/vi/${ytId}/hqdefault.jpg` : '/images/hero-kaaba.png')
            }
            alt="หน้าปก"
            className="absolute inset-0 z-[1] size-full object-cover"
            onError={(e) => {
              ;(e.currentTarget as HTMLImageElement).src = '/images/hero-kaaba.png'
            }}
          />
        )}
        {ytId && (
          <iframe
            ref={iframeRef}
            title="Hero video"
            src={!isMobile && embedSrc ? embedSrc : undefined}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            className={`absolute border-0 ${isMobile ? 'z-[2]' : 'pointer-events-none'}`}
            style={{
              top: '50%',
              left: '50%',
              width: '100vw',
              height: '56.25vw',
              minHeight: '100%',
              minWidth: '177.78vh',
              transform: 'translate(-50%, -50%)',
              opacity: videoStarted && settings.heroMode !== 'image' ? 1 : 0,
            }}
          />
        )}
      </div>

      {/* มือถือ: ยังไม่เล่น — กดแล้วเปิดเสียง + เล่นวิดีโอ */}
      {ytId && isMobile && !videoStarted && (
        <button
          type="button"
          onClick={handleStartVideo}
          className="absolute left-1/2 top-[42%] z-20 flex flex-col items-center gap-2 -translate-x-1/2 -translate-y-1/2"
          aria-label="เปิดเสียงและเล่นวิดีโอ"
        >
          <span className="flex size-16 items-center justify-center rounded-full bg-white/20 text-white shadow-2xl ring-2 ring-white/40 backdrop-blur transition active:scale-90">
            <Volume2 className="size-7" />
          </span>
          <span className="rounded-full bg-black/55 px-3 py-1 text-[11px] font-medium text-white backdrop-blur">
            เปิดเสียงเพื่อเล่นวิดีโอ
          </span>
        </button>
      )}
  <div className="absolute inset-0 bg-gradient-to-b from-deep-blue/80 via-deep-blue/70 to-deep-blue/90 pointer-events-none" />

  {ytId && (videoStarted || isMobile) && (
    <button
      type="button"
      onClick={handleToggleMute}
      className="absolute bottom-6 right-6 z-20 flex items-center gap-2 rounded-full bg-black/50 px-4 py-2 text-sm text-white backdrop-blur transition hover:bg-black/70"
      aria-label={muted || !videoStarted ? 'เปิดเสียง' : 'ปิดเสียง'}
    >
      {muted || !videoStarted ? <VolumeX className="size-4" /> : <Volume2 className="size-4" />}
      <span className="hidden sm:inline">{muted || !videoStarted ? 'เปิดเสียง' : 'ปิดเสียง'}</span>
    </button>
  )}

  {/* เนื้อหาข้อความ + ปุ่มสมัคร เดิม ใส่ class relative z-10 ไว้ตามเดิม */}

  {/* เนื้อหาเดิม ... */}
        <div className="relative z-10 mx-auto max-w-3xl px-3 pb-16 pt-16 text-center sm:px-4 sm:py-20">
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
              className="flex w-full items-center justify-center gap-2 rounded-full bg-royal-blue px-8 py-3.5 font-semibold text-white shadow-lg shadow-royal-blue/25 transition-all duration-200 hover:brightness-110 hover:scale-[1.03] active:scale-95 sm:w-auto animate-float-up"
            >
              สมัครฮัจญ์
              <ArrowRight className="size-4" />
            </button>
            <button
              onClick={() => navigate('umrah')}
              className="flex w-full items-center justify-center gap-2 rounded-full border border-bright-sky/40 bg-white/10 px-8 py-3.5 font-semibold text-bright-sky backdrop-blur transition-all duration-200 hover:bg-white/20 hover:scale-[1.03] active:scale-95 sm:w-auto animate-float-up"
            >
              สมัครอุมเราะห์
              <ArrowRight className="size-4" />
            </button>
          </div>

          {/* แปลภาษา — อยู่บนหน้าปก */}
          <div className="mt-6 w-full max-w-3xl sm:mt-8">
            <TranslateBox />
          </div>
        </div>
      </section>


      {/* แกลเลอรีแทนแดชบอร์ด — มือถือ 1 ภาพ / PC 3 ภาพ เลื่อนอัตโนมัติ */}
      {gallery.length > 0 && (
        <section className="relative z-10 mt-6 bg-background px-3 pt-2 sm:mt-8 sm:px-4">
          <div className="mx-auto max-w-6xl animate-slide-up">
            {/* มือถือ: 1 ภาพ */}
            <div className="relative aspect-[16/11] overflow-hidden rounded-2xl sm:hidden">
              {gallery.map((src, i) => (
                <img
                  key={`m-${i}`}
                  src={src}
                  alt=""
                  className={`absolute inset-0 size-full object-cover transition-opacity duration-700 ${
                    i === slide % gallery.length ? 'opacity-100' : 'opacity-0'
                  }`}
                />
              ))}
            </div>
            {/* PC: 3 ภาพ */}
            <div className="hidden gap-3 sm:grid sm:grid-cols-3">
              {[0, 1, 2].map((offset) => {
                const i = gallery.length ? (slide + offset) % gallery.length : 0
                const src = gallery[i]
                return (
                  <div key={offset} className="relative aspect-[16/11] overflow-hidden rounded-2xl">
                    {src && (
                      <img
                        src={src}
                        alt=""
                        className="size-full object-cover transition duration-700"
                      />
                    )}
                  </div>
                )
              })}
            </div>
            {gallery.length > 1 && (
              <div className="mt-2 flex justify-center gap-1.5">
                {gallery.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setSlide(i)}
                    className={`h-1.5 rounded-full transition-all ${
                      i === slide % gallery.length ? 'w-5 bg-royal-blue' : 'w-1.5 bg-royal-blue/25'
                    }`}
                    aria-label={`สไลด์ ${i + 1}`}
                  />
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* เครื่องมือ — ไอคอนใหญ่ สีดำเรียบ */}
      <section className="mx-auto max-w-xl px-3 pt-10 sm:px-4 sm:pt-12">
        <div className="soft-card relative px-3 py-4 sm:px-5 sm:py-5 animate-scale-in">
          <div className="grid grid-cols-5 gap-1.5 sm:gap-3 stagger">
            {[
              { view: 'qibla' as const, label: 'กิบลัต', icon: Compass },
              { view: 'tasbih' as const, label: 'ตัสบีห์', icon: CircleDot },
              { view: 'hotels' as const, label: 'โรงแรม', icon: Hotel },
              { view: 'quran' as const, label: 'กุรอาน', icon: BookOpen },
              { view: 'hijri-calendar' as const, label: 'ปฏิทิน', icon: CalendarDays },
            ].map((tool) => (
              <button
                key={tool.view}
                type="button"
                onClick={(e) => { tapFeedback(e); navigate(tool.view) }}
                className="flex flex-col items-center gap-1.5 py-1 pressable"
              >
                <span className="flex size-14 items-center justify-center rounded-2xl bg-royal-blue/8 text-deep-blue transition-transform duration-200 active:scale-90 sm:size-16">
                  <tool.icon className="size-7 text-deep-blue sm:size-8" strokeWidth={1.75} />
                </span>
                <span className="text-[11px] font-semibold text-deep-blue sm:text-sm">{tool.label}</span>
              </button>
            ))}
          </div>
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
              role="button"
              tabIndex={0}
              onClick={() => navigate(s.go)}
              onKeyDown={(e) => { if (e.key === 'Enter') navigate(s.go) }}
              className="group relative cursor-pointer overflow-hidden rounded-[1.5rem] shadow-[0_8px_32px_rgba(10,22,40,0.12)] lift"
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
                <span
                  className="mt-4 inline-flex items-center gap-2 rounded-full bg-royal-blue px-5 py-2.5 text-sm font-semibold text-white transition group-hover:brightness-110"
                >
                  ดูรายละเอียด
                  <ArrowRight className="size-4" />
                </span>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* อัลบั้มภาพ — รองจากบริการ */}
      {(settings.photoAlbums?.length ?? 0) > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-16">
          <SectionHeading eyebrow="ภาพต่างๆ" title="อัลบั้มจากสถานที่ศักดิ์สิทธิ์" />
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {settings.photoAlbums.slice(0, 6).map((a) => (
              <button
                key={a.id}
                type="button"
                onClick={() => navigate('album', a.id)}
                className="soft-card lift overflow-hidden text-left"
              >
                <img src={a.cover || a.images[0]} alt={a.title} className="aspect-[4/3] w-full object-cover" />
                <div className="p-3">
                  <p className="font-bold text-deep-blue">{a.title}</p>
                  <p className="text-xs text-muted-foreground">{a.date}</p>
                </div>
              </button>
            ))}
          </div>
          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => navigate('albums')}
              className="inline-flex items-center gap-2 rounded-full bg-royal-blue px-5 py-2.5 text-sm font-semibold text-white"
            >
              ดูอัลบั้มทั้งหมด
              <ArrowRight className="size-4" />
            </button>
          </div>
        </section>
      )}

      {/* วิธีการทำฮัจญ์/อุมเราะห์ */}
      <section className="mx-auto max-w-7xl px-4 pb-8">
        <SectionHeading eyebrow="คลังข้อมูล" title="วิธีการทำฮัจญ์และอุมเราะห์" />
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <button type="button" onClick={() => navigate('guide-hajj')} className="soft-card lift p-6 text-left">
            <p className="text-lg font-bold text-deep-blue">ขั้นตอนฮัจญ์</p>
            <p className="mt-1 text-sm text-muted-foreground">รายละเอียดพิธีทีละขั้น พร้อมภาพประกอบ</p>
          </button>
          <button type="button" onClick={() => navigate('guide-umrah')} className="soft-card lift p-6 text-left">
            <p className="text-lg font-bold text-deep-blue">ขั้นตอนอุมเราะห์</p>
            <p className="mt-1 text-sm text-muted-foreground">รายละเอียดพิธีทีละขั้น พร้อมภาพประกอบ</p>
          </button>
        </div>
      </section>

      {false && gallery.length > 0 && (
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
            className="flex shrink-0 items-center gap-2 rounded-full bg-[#06C755] px-7 py-3.5 font-semibold text-white shadow-lg transition hover:brightness-110 active:scale-95"
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
                className="soft-card lift flex flex-col p-6"
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
          <div className="soft-card flex flex-col justify-center p-8">
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
              className="mt-6 inline-flex w-fit items-center gap-2 rounded-full bg-royal-blue px-6 py-3 text-sm font-semibold text-bright-sky shadow-md transition hover:brightness-110 active:scale-95"
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
