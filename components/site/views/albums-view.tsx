'use client'

import { ArrowLeft, Images, X, ChevronLeft, ChevronRight } from 'lucide-react'
import { useStore } from '../store'
import { useNav } from '../nav'
import { SectionHeading } from '../package-card'
import { useCallback, useEffect, useState } from 'react'

export function AlbumsView() {
  const { settings } = useStore()
  const { navigate } = useNav()
  const albums = settings.photoAlbums || []

  return (
    <div className="app-page page-enter max-w-5xl">
      <div className="app-header-bar">
        <button
          type="button"
          onClick={() => navigate('knowledge')}
          className="flex size-9 items-center justify-center rounded-full bg-royal-blue/10 text-royal-blue"
        >
          <ArrowLeft className="size-4" />
        </button>
        <h1 className="text-lg font-bold text-deep-blue">ภาพต่างๆ</h1>
      </div>
      <SectionHeading
        eyebrow="คลังข้อมูล"
        title="อัลบั้มภาพสถานที่"
        subtitle="เลือกอัลบั้มเพื่อดูภาพทั้งหมด"
      />
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {albums.map((a) => (
          <button
            key={a.id}
            type="button"
            onClick={() => navigate('album', a.id)}
            className="soft-card lift overflow-hidden text-left"
          >
            <div className="relative aspect-[4/3] w-full overflow-hidden">
              <img
                src={a.cover || a.images[0] || '/placeholder.svg'}
                alt={a.title}
                className="size-full object-cover"
              />
              <span className="absolute bottom-2 right-2 flex items-center gap-1 rounded-full bg-black/55 px-2 py-0.5 text-[10px] text-white">
                <Images className="size-3" />
                {a.images.length}
              </span>
            </div>
            <div className="p-3">
              <p className="font-bold text-deep-blue">{a.title}</p>
              <p className="text-xs text-muted-foreground">{a.date}</p>
            </div>
          </button>
        ))}
        {albums.length === 0 && (
          <p className="col-span-full text-center text-sm text-muted-foreground">
            ยังไม่มีอัลบั้ม — เพิ่มได้ใน Admin
          </p>
        )}
      </div>
    </div>
  )
}

export function AlbumDetailView() {
  const { settings } = useStore()
  const { navigate, albumId } = useNav()
  const album = (settings.photoAlbums || []).find((a) => a.id === albumId)
  const [idx, setIdx] = useState(0)
  const [lightbox, setLightbox] = useState(false)

  const imgs = album
    ? album.images.length
      ? album.images
      : album.cover
        ? [album.cover]
        : []
    : []

  const openAt = (i: number) => {
    setIdx(i)
    setLightbox(true)
  }

  const prev = useCallback(() => {
    setIdx((i) => (imgs.length ? (i - 1 + imgs.length) % imgs.length : 0))
  }, [imgs.length])

  const next = useCallback(() => {
    setIdx((i) => (imgs.length ? (i + 1) % imgs.length : 0))
  }, [imgs.length])

  useEffect(() => {
    if (!lightbox) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightbox(false)
      if (e.key === 'ArrowLeft') prev()
      if (e.key === 'ArrowRight') next()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [lightbox, prev, next])

  if (!album) {
    return (
      <div className="app-page">
        <p className="text-sm text-muted-foreground">ไม่พบอัลบั้ม</p>
        <button type="button" onClick={() => navigate('albums')} className="mt-3 text-royal-blue">
          กลับ
        </button>
      </div>
    )
  }

  return (
    <div className="app-page page-enter max-w-4xl !px-3 sm:!px-4">
      <div className="app-header-bar mb-3">
        <button
          type="button"
          onClick={() => navigate('albums')}
          className="flex size-9 items-center justify-center rounded-full bg-royal-blue/10 text-royal-blue"
        >
          <ArrowLeft className="size-4" />
        </button>
        <div>
          <h1 className="text-lg font-bold text-deep-blue">{album.title}</h1>
          <p className="text-xs text-muted-foreground">{album.date}</p>
        </div>
      </div>

      {/* ภาพหลัก ใหญ่เต็มขอบ */}
      <button
        type="button"
        onClick={() => openAt(idx)}
        className="relative block w-full overflow-hidden rounded-2xl bg-black/5 shadow-lg"
      >
        <img
          src={imgs[idx]}
          alt=""
          className="aspect-[4/3] w-full object-cover sm:aspect-[16/10]"
        />
        <span className="absolute bottom-3 right-3 rounded-full bg-black/55 px-3 py-1 text-[11px] font-medium text-white backdrop-blur">
          แตะเพื่อขยาย · {idx + 1}/{imgs.length}
        </span>
      </button>

      {/* แถบรูปย่อ */}
      <div className="mt-3 flex gap-2 overflow-x-auto pb-2">
        {imgs.map((src, i) => (
          <button
            key={i}
            type="button"
            onClick={() => openAt(i)}
            className={`relative size-16 shrink-0 overflow-hidden rounded-xl border-2 sm:size-20 ${
              i === idx ? 'border-royal-blue' : 'border-transparent'
            }`}
          >
            <img src={src} alt="" className="size-full object-cover" />
          </button>
        ))}
      </div>

      {/* กริดภาพทั้งหมด ใหญ่สมส่วน */}
      <div className="mt-6 grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3">
        {imgs.map((src, i) => (
          <button
            key={`g-${i}`}
            type="button"
            onClick={() => openAt(i)}
            className="overflow-hidden rounded-xl shadow-sm transition active:scale-[0.98]"
          >
            <img src={src} alt="" className="aspect-square w-full object-cover sm:aspect-[4/3]" />
          </button>
        ))}
      </div>

      {/* Lightbox เต็มจอ + animation */}
      {lightbox && (
        <div
          className="lightbox-overlay fixed inset-0 z-[10000] flex items-center justify-center bg-black/90 p-3 backdrop-blur-md"
          onClick={() => setLightbox(false)}
          role="dialog"
          aria-modal
        >
          <button
            type="button"
            className="lightbox-chrome absolute right-3 top-3 z-10 flex size-10 items-center justify-center rounded-full bg-white/15 text-white transition hover:bg-white/25"
            onClick={() => setLightbox(false)}
            aria-label="ปิด"
          >
            <X className="size-5" />
          </button>

          <button
            type="button"
            className="lightbox-chrome absolute left-2 top-1/2 z-10 flex size-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/15 text-white transition hover:bg-white/25 sm:left-4"
            onClick={(e) => {
              e.stopPropagation()
              prev()
            }}
            aria-label="ก่อนหน้า"
          >
            <ChevronLeft className="size-6" />
          </button>

          <img
            key={idx}
            src={imgs[idx]}
            alt=""
            className="lightbox-img max-h-[88vh] max-w-[96vw] object-contain"
            onClick={(e) => e.stopPropagation()}
          />

          <button
            type="button"
            className="lightbox-chrome absolute right-2 top-1/2 z-10 flex size-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/15 text-white transition hover:bg-white/25 sm:right-4"
            onClick={(e) => {
              e.stopPropagation()
              next()
            }}
            aria-label="ถัดไป"
          >
            <ChevronRight className="size-6" />
          </button>

          <p className="lightbox-chrome absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-black/50 px-3 py-1 text-xs text-white">
            {idx + 1} / {imgs.length}
          </p>
        </div>
      )}
    </div>
  )
}
