'use client'

import { useState } from 'react'
import { Phone, Send, UserRound } from 'lucide-react'
import { useStore } from '../store'
import { useToast } from '../toast'
import { SectionHeading } from '../package-card'

export function ContactView() {
  const { company, settings } = useStore()
  const { notify } = useToast()
  const [form, setForm] = useState({ name: '', phone: '', message: '' })

  const inputCls =
    'w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm text-foreground outline-none transition focus:border-royal-blue focus:ring-2 focus:ring-royal-blue/30'

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name || !form.phone || !form.message) {
      notify('กรุณากรอกข้อมูลให้ครบถ้วน')
      return
    }
    notify('ส่งข้อความเรียบร้อยแล้ว ทีมงานจะติดต่อกลับโดยเร็ว')
    setForm({ name: '', phone: '', message: '' })
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-16">
      <SectionHeading
        eyebrow="ติดต่อเรา"
        title="เราพร้อมดูแลท่าน"
        subtitle="ติดต่อทีมงานของเราได้ทุกช่องทาง เราพร้อมให้คำปรึกษาด้วยความจริงใจ"
      />

      <div className="mb-12 grid gap-5 sm:grid-cols-3">
        {settings.staffContacts.map((s) => (
          <div
            key={s.id}
            className="flex flex-col items-center rounded-2xl border border-luxury-gold/20 bg-card p-6 text-center shadow-lg"
          >
            <div className="flex size-16 items-center justify-center rounded-full bg-royal-blue/10 text-royal-blue">
              <UserRound className="size-8" />
            </div>
            <h3 className="mt-4 font-semibold text-deep-blue">{s.name}</h3>
            <p className="text-sm text-muted-foreground">{s.role}</p>
            <a
              href={`tel:${s.phone}`}
              className="mt-4 inline-flex items-center gap-2 rounded-lg bg-royal-blue px-5 py-2.5 text-sm font-semibold text-bright-sky transition hover:bg-deep-blue"
            >
              <Phone className="size-4" />
              {s.phone}
            </a>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="min-h-[360px] overflow-hidden rounded-2xl border border-luxury-gold/20 shadow-lg">
          <iframe
            src={company.mapEmbed}
            title="แผนที่สำนักงาน"
            className="size-full min-h-[360px]"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
        <form
          onSubmit={submit}
          className="rounded-2xl border border-luxury-gold/30 bg-card p-6 shadow-xl sm:p-8"
        >
          <h3 className="mb-6 text-xl font-semibold text-deep-blue">ส่งข้อความถึงเรา</h3>
          <div className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-deep-blue">ชื่อ-นามสกุล</label>
              <input
                className={inputCls}
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-deep-blue">เบอร์โทรศัพท์</label>
              <input
                className={inputCls}
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-deep-blue">ข้อความ</label>
              <textarea
                className={`${inputCls} min-h-[120px] resize-y`}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
              />
            </div>
          </div>
          <button
            type="submit"
            className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-royal-blue px-6 py-3 font-semibold text-bright-sky transition hover:bg-deep-blue"
          >
            <Send className="size-4" />
            ส่งข้อความ
          </button>
          <p className="mt-4 text-center text-sm text-muted-foreground">
            หรือโทร {company.phone} · {company.email}
          </p>
        </form>
      </div>
    </div>
  )
}
