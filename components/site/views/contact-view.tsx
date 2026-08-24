'use client'

import { useState } from 'react'
import { Phone, Send, UserRound, MapPin, Mail } from 'lucide-react'
import { useStore } from '../store'
import { useToast } from '../toast'
import { SectionHeading } from '../package-card'

export function ContactView() {
  const { company, settings } = useStore()
  const { notify } = useToast()
  const [form, setForm] = useState({ name: '', phone: '', message: '' })

  const inputCls =
    'w-full rounded-2xl border border-border bg-soft-mint/40 px-4 py-3 text-sm text-foreground outline-none transition focus:border-royal-blue focus:bg-white focus:ring-2 focus:ring-royal-blue/20'

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
    <div className="page-enter mx-auto max-w-7xl px-4 py-12">
      <SectionHeading
        eyebrow="ติดต่อเรา"
        title="เราพร้อมดูแลท่าน"
        subtitle="ติดต่อทีมงานของเราได้ทุกช่องทาง เราพร้อมให้คำปรึกษาด้วยความจริงใจ"
      />

      <div className="mb-10 grid gap-4 sm:grid-cols-3 stagger">
        {settings.staffContacts.map((s) => (
          <div key={s.id} className="soft-card lift flex flex-col items-center p-6 text-center">
            <div className="flex size-16 items-center justify-center rounded-full bg-royal-blue/10 text-royal-blue">
              <UserRound className="size-8" />
            </div>
            <h3 className="mt-4 font-bold text-deep-blue">{s.name}</h3>
            <p className="text-sm text-muted-foreground">{s.role}</p>
            <a
              href={`tel:${s.phone}`}
              className="mt-4 inline-flex items-center gap-2 rounded-full bg-royal-blue px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-royal-blue/20 transition hover:brightness-110 active:scale-95"
            >
              <Phone className="size-4" />
              {s.phone}
            </a>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="soft-card space-y-4 p-6">
          <h3 className="font-bold text-deep-blue">ข้อมูลติดต่อ</h3>
          <p className="flex items-start gap-3 text-sm text-muted-foreground">
            <MapPin className="mt-0.5 size-4 shrink-0 text-royal-blue" />
            {company.address}
          </p>
          <p className="flex items-center gap-3 text-sm">
            <Phone className="size-4 shrink-0 text-royal-blue" />
            <a href={`tel:${company.phone}`} className="font-medium text-deep-blue hover:text-royal-blue">
              {company.phone}
            </a>
          </p>
          <p className="flex items-center gap-3 text-sm">
            <Mail className="size-4 shrink-0 text-royal-blue" />
            <a href={`mailto:${company.email}`} className="font-medium text-deep-blue hover:text-royal-blue">
              {company.email}
            </a>
          </p>
          {company.mapEmbed && (
            <div className="mt-4 overflow-hidden rounded-2xl border border-border">
              <iframe
                src={company.mapEmbed}
                title="แผนที่"
                className="h-56 w-full"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          )}
        </div>

        <form onSubmit={submit} className="soft-card space-y-4 p-6">
          <h3 className="font-bold text-deep-blue">ส่งข้อความถึงเรา</h3>
          <input
            className={inputCls}
            placeholder="ชื่อของคุณ"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <input
            className={inputCls}
            placeholder="เบอร์โทร"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
          />
          <textarea
            className={`${inputCls} min-h-[120px] resize-y`}
            placeholder="ข้อความ"
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
          />
          <button
            type="submit"
            className="flex w-full items-center justify-center gap-2 rounded-full bg-royal-blue py-3.5 text-sm font-bold text-white shadow-lg shadow-royal-blue/25 transition hover:brightness-110 active:scale-[0.98]"
          >
            <Send className="size-4" />
            ส่งข้อความ
          </button>
        </form>
      </div>
    </div>
  )
}
