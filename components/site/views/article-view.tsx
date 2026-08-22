'use client'

import { ArrowLeft, Tag, CalendarDays } from 'lucide-react'
import { useStore } from '../store'
import { useNav } from '../nav'

export function ArticleView({ articleId }: { articleId: string | null }) {
  const { articles } = useStore()
  const { navigate } = useNav()
  const article = articles.find((a) => a.id === articleId)

  if (!article) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-24 text-center">
        <p className="text-muted-foreground">ไม่พบบทความที่ต้องการ</p>
        <button
          onClick={() => navigate('knowledge')}
          className="mt-4 inline-flex items-center gap-2 rounded-lg bg-royal-blue px-5 py-2.5 text-sm font-semibold text-bright-sky"
        >
          <ArrowLeft className="size-4" />
          กลับสู่คลังความรู้
        </button>
      </div>
    )
  }

  const cover = article.images?.[0] || '/placeholder.svg'

  return (
    <article className="mx-auto max-w-3xl px-4 py-12">
      <button
        onClick={() => navigate('knowledge')}
        className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-royal-blue transition hover:text-deep-blue"
      >
        <ArrowLeft className="size-4" />
        กลับสู่คลังความรู้
      </button>
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <span className="flex items-center gap-1 rounded-full bg-royal-blue/10 px-3 py-1 text-xs font-medium text-royal-blue">
          <Tag className="size-3" />
          {article.category}
        </span>
        <span className="flex items-center gap-1 text-xs text-muted-foreground">
          <CalendarDays className="size-3.5" />
          {article.date}
        </span>
      </div>
      <h1 className="text-balance text-2xl font-bold leading-tight text-deep-blue sm:text-3xl">
        {article.title}
      </h1>
      <div className="my-6 overflow-hidden rounded-2xl border border-luxury-gold/20 shadow-lg">
        <img src={cover} alt={article.title} className="h-64 w-full object-cover sm:h-80" />
      </div>
      {article.images && article.images.length > 1 && (
        <div className="mb-6 flex gap-2 overflow-x-auto">
          {article.images.slice(1).map((src, i) => (
            <img key={i} src={src} alt="" className="h-24 w-36 shrink-0 rounded-lg object-cover border border-border" />
          ))}
        </div>
      )}
      <div className="space-y-4 text-pretty leading-relaxed text-foreground/85">
        {article.content.split('\n\n').map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </div>
      {article.subBlocks && article.subBlocks.length > 0 && (
        <div className="mt-10 space-y-8">
          {article.subBlocks.map((sb) => (
            <section key={sb.id} className="rounded-2xl border border-luxury-gold/20 bg-card p-6 shadow-sm">
              {sb.title && <h2 className="mb-3 text-xl font-semibold text-deep-blue">{sb.title}</h2>}
              {sb.content && (
                <div className="space-y-3 text-sm leading-relaxed text-foreground/85">
                  {sb.content.split('\n\n').map((p, i) => (
                    <p key={i}>{p}</p>
                  ))}
                </div>
              )}
              {sb.images.length > 0 && (
                <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3">
                  {sb.images.map((src, i) => (
                    <img key={i} src={src} alt="" className="aspect-video w-full rounded-lg object-cover" />
                  ))}
                </div>
              )}
            </section>
          ))}
        </div>
      )}
    </article>
  )
}
