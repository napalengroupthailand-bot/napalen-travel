'use client'

import { ArrowLeft, BookOpen } from 'lucide-react'
import { useStore } from '../store'
import { useNav } from '../nav'
import { SectionHeading } from '../package-card'

export function GuidesHubView() {
  const { navigate } = useNav()
  return (
    <div className="app-page page-enter max-w-3xl">
      <div className="app-header-bar">
        <button
          type="button"
          onClick={() => navigate('knowledge')}
          className="flex size-9 items-center justify-center rounded-full bg-royal-blue/10 text-royal-blue"
        >
          <ArrowLeft className="size-4" />
        </button>
        <h1 className="text-lg font-bold text-deep-blue">วิธีการทำฮัจญ์และอุมเราะห์</h1>
      </div>
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {[
          { view: 'guide-hajj' as const, title: 'ขั้นตอนฮัจญ์', desc: 'รายละเอียดพิธีฮัจญ์ทีละขั้น พร้อมภาพประกอบ' },
          { view: 'guide-umrah' as const, title: 'ขั้นตอนอุมเราะห์', desc: 'รายละเอียดพิธีอุมเราะห์ทีละขั้น พร้อมภาพประกอบ' },
        ].map((x) => (
          <button
            key={x.view}
            type="button"
            onClick={() => navigate(x.view)}
            className="soft-card lift p-5 text-left"
          >
            <BookOpen className="size-8 text-royal-blue" />
            <p className="mt-3 text-lg font-bold text-deep-blue">{x.title}</p>
            <p className="mt-1 text-sm text-muted-foreground">{x.desc}</p>
          </button>
        ))}
      </div>
    </div>
  )
}

export function GuideDetailView({ type }: { type: 'hajj' | 'umrah' }) {
  const { settings } = useStore()
  const { navigate } = useNav()
  const steps = (settings.guideSteps || [])
    .filter((s) => s.type === type)
    .sort((a, b) => a.order - b.order)

  return (
    <div className="app-page page-enter max-w-3xl">
      <div className="app-header-bar">
        <button
          type="button"
          onClick={() => navigate('guides')}
          className="flex size-9 items-center justify-center rounded-full bg-royal-blue/10 text-royal-blue"
        >
          <ArrowLeft className="size-4" />
        </button>
        <h1 className="text-lg font-bold text-deep-blue">
          {type === 'hajj' ? 'ขั้นตอนฮัจญ์' : 'ขั้นตอนอุมเราะห์'}
        </h1>
      </div>
      <div className="mt-4 space-y-6">
        {steps.map((s, i) => (
          <article key={s.id} className="soft-card overflow-hidden">
            <div className="border-b border-border bg-royal-blue/5 px-4 py-3">
              <p className="text-xs font-semibold text-royal-blue">ขั้นตอนที่ {i + 1}</p>
              <h2 className="text-lg font-bold text-deep-blue">{s.title}</h2>
            </div>
            <div className="space-y-3 p-4">
              <p className="text-sm leading-relaxed text-foreground/90 whitespace-pre-wrap">{s.content}</p>
              {s.images?.length > 0 && (
                <div className="grid gap-2 sm:grid-cols-2">
                  {s.images.map((img, j) => (
                    <img key={j} src={img} alt="" className="rounded-xl object-cover aspect-video w-full" />
                  ))}
                </div>
              )}
            </div>
          </article>
        ))}
        {steps.length === 0 && (
          <p className="text-center text-sm text-muted-foreground">ยังไม่มีขั้นตอน — เพิ่มได้ใน Admin</p>
        )}
      </div>
    </div>
  )
}
