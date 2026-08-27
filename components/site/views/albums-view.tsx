'use client'

import { ArrowLeft, Images } from 'lucide-react'
import { useStore } from '../store'
import { useNav } from '../nav'
import { SectionHeading } from '../package-card'
import { useState } from 'react'

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
      <SectionHeading eyebrow="คลังข้อมูล" title="อัลบั้มภาพสถานที่" subtitle="เลือกอัลบั้มเพื่อดูภาพทั้งหมด" />
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {albums.map((a) => (
          <button
            key={a.id}
            type="button"
            onClick={() => navigate('album', a.id)}
            className="soft-card lift overflow-hidden text-left"
          >
            <div className="relative aspect-[4/3] overflow-hidden">
              <img src={a.cover || a.images[0] || '/placeholder.svg'} alt={a.title} className="size-full object-cover" />
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
          <p className="col-span-full text-center text-sm text-muted-foreground">ยังไม่มีอัลบั้ม — เพิ่มได้ใน Admin</p>
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

  const imgs = album.images.length ? album.images : [album.cover]

  return (
    <div className="app-page page-enter max-w-3xl">
      <div className="app-header-bar">
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
      <div className="overflow-hidden rounded-2xl border border-border bg-black/5">
        <img src={imgs[idx]} alt="" className="aspect-video w-full object-contain bg-black/80" />
      </div>
      <div className="mt-3 flex gap-2 overflow-x-auto pb-2">
        {imgs.map((src, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setIdx(i)}
            className={`size-16 shrink-0 overflow-hidden rounded-lg border-2 ${
              i === idx ? 'border-royal-blue' : 'border-transparent'
            }`}
          >
            <img src={src} alt="" className="size-full object-cover" />
          </button>
        ))}
      </div>
    </div>
  )
}
