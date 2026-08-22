'use client'

import { ArrowRight, Tag } from 'lucide-react'
import { useStore } from '../store'
import { useNav } from '../nav'
import { SectionHeading } from '../package-card'

export function KnowledgeView() {
  const { articles } = useStore()
  const { navigate } = useNav()

  return (
    <section className="mx-auto max-w-7xl px-4 py-16">
      <SectionHeading
        eyebrow="คลังความรู้"
        title="บทความและสาระน่ารู้"
        subtitle="รวมความรู้เกี่ยวกับการประกอบพิธีฮัจญ์ อุมเราะห์ และการเตรียมตัวเดินทาง"
      />
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {articles.map((a) => (
          <article
            key={a.id}
            className="group flex flex-col overflow-hidden rounded-2xl border border-luxury-gold/20 bg-card shadow-lg transition hover:-translate-y-1 hover:shadow-2xl"
          >
            <div className="h-48 overflow-hidden">
              <img
                src={a.images?.[0] || '/placeholder.svg'}
                alt={a.title}
                crossOrigin="anonymous"
                className="size-full object-cover transition duration-500 group-hover:scale-105"
              />
            </div>
            <div className="flex flex-1 flex-col p-6">
              <span className="flex w-fit items-center gap-1 rounded-full bg-royal-blue/10 px-3 py-1 text-xs font-medium text-royal-blue">
                <Tag className="size-3" />
                {a.category}
              </span>
              <h3 className="mt-3 font-semibold leading-snug text-deep-blue">{a.title}</h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">{a.excerpt}</p>
              <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
                <span className="text-xs text-muted-foreground">{a.date}</span>
                <button
                  onClick={() => navigate('article', a.id)}
                  className="inline-flex items-center gap-1 text-sm font-semibold text-royal-blue transition hover:text-deep-blue"
                >
                  อ่านต่อ
                  <ArrowRight className="size-4" />
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
