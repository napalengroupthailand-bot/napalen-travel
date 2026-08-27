'use client'

import { BookOpen, Images, ListOrdered, ArrowRight } from 'lucide-react'
import { useStore } from '../store'
import { useNav } from '../nav'
import { SectionHeading } from '../package-card'
import { useState } from 'react'

export function KnowledgeView() {
  const { articles } = useStore()
  const { navigate } = useNav()
  const [showArticles, setShowArticles] = useState(false)

  const hubs = [
    {
      key: 'photos',
      title: 'ภาพต่างๆ',
      desc: 'อัลบั้มภาพสถานที่ศักดิ์สิทธิ์',
      icon: Images,
      onClick: () => navigate('albums'),
    },
    {
      key: 'articles',
      title: 'บทความและสาระน่ารู้',
      desc: 'ความรู้ทั่วไปเกี่ยวกับฮัจญ์ อุมเราะห์ และการเดินทาง',
      icon: BookOpen,
      onClick: () => setShowArticles(true),
    },
    {
      key: 'guides',
      title: 'วิธีการทำฮัจญ์และอุมเราะห์',
      desc: 'ขั้นตอนละเอียดพร้อมภาพประกอบ',
      icon: ListOrdered,
      onClick: () => navigate('guides'),
    },
  ]

  if (showArticles) {
    return (
      <div className="app-page page-enter max-w-5xl">
        <button
          type="button"
          onClick={() => setShowArticles(false)}
          className="mb-4 text-sm font-semibold text-royal-blue"
        >
          ← กลับคลังข้อมูล
        </button>
        <SectionHeading eyebrow="บทความและสาระน่ารู้" title="สาระน่ารู้" />
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {articles.map((a) => (
            <button
              key={a.id}
              type="button"
              onClick={() => navigate('article', a.id)}
              className="soft-card lift overflow-hidden text-left page-enter"
            >
              <img
                src={a.images?.[0] || '/placeholder.svg'}
                alt={a.title}
                className="aspect-video w-full object-cover"
              />
              <div className="p-4">
                <p className="text-[10px] font-semibold text-royal-blue">{a.category}</p>
                <h3 className="mt-1 font-bold text-deep-blue">{a.title}</h3>
                <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{a.excerpt}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="app-page page-enter max-w-lg sm:max-w-xl">
      <SectionHeading
        eyebrow="คลังข้อมูล"
        title="แหล่งความรู้และภาพจากเส้นทางศรัทธา"
        subtitle="เลือกหมวดที่ต้องการ"
      />
      <div className="mt-8 flex flex-col gap-4">
        {hubs.map((h, i) => (
          <button
            key={h.key}
            type="button"
            onClick={h.onClick}
            className="knowledge-block group relative flex w-full items-center gap-4 overflow-hidden rounded-2xl bg-royal-blue px-5 py-5 text-left text-white shadow-lg shadow-royal-blue/25 transition hover:brightness-110 active:scale-[0.99] sm:px-6 sm:py-6"
            style={{ animationDelay: `${i * 0.08}s` }}
          >
            <span className="knowledge-sweep pointer-events-none absolute inset-0" />
            <span className="relative flex size-14 shrink-0 items-center justify-center rounded-2xl bg-white/15 sm:size-16">
              <h.icon className="size-7 text-white sm:size-8" strokeWidth={1.75} />
            </span>
            <span className="relative min-w-0 flex-1">
              <span className="block text-base font-bold sm:text-lg">{h.title}</span>
              <span className="mt-0.5 block text-sm text-white/80">{h.desc}</span>
            </span>
            <ArrowRight className="relative size-5 shrink-0 text-white/90 transition group-hover:translate-x-1" />
          </button>
        ))}
      </div>
    </div>
  )
}
