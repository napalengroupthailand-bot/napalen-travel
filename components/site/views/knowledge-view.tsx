'use client'

import { BookOpen, Images, ListOrdered, ArrowRight } from 'lucide-react'
import { useStore } from '../store'
import { useNav } from '../nav'
import { SectionHeading } from '../package-card'

export function KnowledgeView() {
  const { articles } = useStore()
  const { navigate } = useNav()

  const hubs = [
    {
      title: 'ภาพต่างๆ',
      desc: 'อัลบั้มภาพสถานที่ศักดิ์สิทธิ์',
      icon: Images,
      go: () => navigate('albums'),
    },
    {
      title: 'บทความและสาระน่ารู้',
      desc: 'ความรู้ทั่วไปเกี่ยวกับฮัจญ์ อุมเราะห์ และการเดินทาง',
      icon: BookOpen,
      go: () => navigate('knowledge'),
      scrollArticles: true,
    },
    {
      title: 'วิธีการทำฮัจญ์และอุมเราะห์',
      desc: 'ขั้นตอนละเอียดพร้อมภาพประกอบ',
      icon: ListOrdered,
      go: () => navigate('guides'),
    },
  ]

  return (
    <div className="app-page page-enter max-w-5xl">
      <SectionHeading
        eyebrow="คลังข้อมูล"
        title="แหล่งความรู้และภาพจากเส้นทางศรัทธา"
        subtitle="เลือกหมวดที่ต้องการ"
      />
      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        {hubs.map((h) => (
          <button
            key={h.title}
            type="button"
            onClick={h.go}
            className="soft-card lift flex flex-col items-start gap-3 p-5 text-left"
          >
            <span className="flex size-12 items-center justify-center rounded-2xl bg-royal-blue/10 text-royal-blue">
              <h.icon className="size-6" />
            </span>
            <p className="font-bold text-deep-blue">{h.title}</p>
            <p className="text-sm text-muted-foreground">{h.desc}</p>
            <span className="mt-auto inline-flex items-center gap-1 text-sm font-semibold text-royal-blue">
              เปิดดู <ArrowRight className="size-4" />
            </span>
          </button>
        ))}
      </div>

      <div className="mt-12" id="articles">
        <SectionHeading eyebrow="บทความ" title="สาระน่ารู้" />
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {articles.map((a) => (
            <button
              key={a.id}
              type="button"
              onClick={() => navigate('article', a.id)}
              className="soft-card lift overflow-hidden text-left"
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
    </div>
  )
}
