'use client'

import { ArrowRight, Tag } from 'lucide-react'
import { useStore } from '../store'
import { useNav } from '../nav'
import { SectionHeading } from '../package-card'
import { tapFeedback } from '@/lib/sfx'

export function KnowledgeView() {
  const { articles } = useStore()
  const { navigate } = useNav()

  return (
    <section className="page-enter mx-auto max-w-7xl px-4 py-12">
      <SectionHeading
        eyebrow="คลังความรู้"
        title="บทความและสาระน่ารู้"
        subtitle="รวมความรู้เกี่ยวกับการประกอบพิธีฮัจญ์ อุมเราะห์ และการเตรียมตัวเดินทาง"
      />
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3 stagger">
        {articles.map((a) => (
          <article
            key={a.id}
            role="button"
            tabIndex={0}
            onClick={(e) => { tapFeedback(e); navigate('article', a.id) }}
            onKeyDown={(e) => e.key === 'Enter' && navigate('article', a.id)}
            className="group soft-card lift flex cursor-pointer flex-col overflow-hidden"
          >
            <div className="h-40 overflow-hidden sm:h-44">
              <img
                src={a.images?.[0] || '/placeholder.svg'}
                alt={a.title}
                className="size-full object-cover transition duration-500 group-hover:scale-105"
              />
            </div>
            <div className="flex flex-1 flex-col p-4 sm:p-5">
              <span className="flex w-fit items-center gap-1 rounded-full bg-royal-blue/10 px-2.5 py-0.5 text-[10px] font-semibold text-royal-blue sm:text-xs">
                <Tag className="size-3" />
                {a.category}
              </span>
              <h3 className="mt-2 font-bold leading-snug text-deep-blue sm:mt-3">{a.title}</h3>
              <p className="mt-2 flex-1 text-xs leading-relaxed text-muted-foreground sm:text-sm">{a.excerpt}</p>
              <div className="mt-3 flex items-center justify-between border-t border-border/60 pt-3 sm:mt-4 sm:pt-4">
                <span className="text-[10px] text-muted-foreground sm:text-xs">{a.date}</span>
                <span className="inline-flex items-center gap-1 text-xs font-bold text-royal-blue sm:text-sm">
                  อ่านต่อ
                  <ArrowRight className="size-3.5" />
                </span>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
