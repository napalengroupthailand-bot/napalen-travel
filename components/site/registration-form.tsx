'use client'

import { useState } from 'react'
import { Send } from 'lucide-react'
import { useStore } from './store'
import { useToast } from './toast'
import type { PackageType } from '@/lib/site-data'

export function RegistrationForm({ type }: { type: PackageType }) {
  const { packages, addRegistration } = useStore()
  const { notify } = useToast()
  const options = packages.filter((p) => p.type === type)

  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    pax: '1',
    packageName: options[0]?.name ?? '',
    note: '',
  })

  const set = (k: keyof typeof form, v: string) => setForm((f) => ({ ...f, [k]: v }))

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name || !form.phone) {
      notify('กรุณากรอกชื่อและเบอร์โทรศัพท์')
      return
    }
    addRegistration({
      name: form.name,
      phone: form.phone,
      email: form.email,
      pax: Number(form.pax) || 1,
      packageName: form.packageName || options[0]?.name || '-',
      type,
      note: form.note,
    })
    notify('ลงทะเบียนสำเร็จ! ทีมงานจะติดต่อกลับโดยเร็วที่สุด อินชาอัลลอฮ์')
    setForm({ name: '', phone: '', email: '', pax: '1', packageName: options[0]?.name ?? '', note: '' })
  }

  const label = type === 'hajj' ? 'ฮัจญ์' : 'อุมเราะห์'
  const inputCls =
    'w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm text-foreground outline-none transition focus:border-royal-blue focus:ring-2 focus:ring-royal-blue/30'

  return (
    <form
      onSubmit={submit}
      className="rounded-2xl border border-luxury-gold/30 bg-card p-6 shadow-xl sm:p-8"
    >
      <h3 className="mb-1 text-xl font-semibold text-deep-blue">ลงทะเบียนสมัคร{label}</h3>
      <p className="mb-6 text-sm text-muted-foreground">
        กรอกข้อมูลเพื่อให้ทีมงานติดต่อกลับพร้อมรายละเอียดแพ็กเกจ
      </p>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className="mb-1.5 block text-sm font-medium text-deep-blue">ชื่อ-นามสกุล *</label>
          <input
            className={inputCls}
            value={form.name}
            onChange={(e) => set('name', e.target.value)}
            placeholder="กรอกชื่อของท่าน"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-deep-blue">เบอร์โทรศัพท์ *</label>
          <input
            className={inputCls}
            value={form.phone}
            onChange={(e) => set('phone', e.target.value)}
            placeholder="08X-XXX-XXXX"
            inputMode="tel"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-deep-blue">อีเมล</label>
          <input
            className={inputCls}
            type="email"
            value={form.email}
            onChange={(e) => set('email', e.target.value)}
            placeholder="example@email.com"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-deep-blue">จำนวนผู้เดินทาง</label>
          <input
            className={inputCls}
            type="number"
            min={1}
            value={form.pax}
            onChange={(e) => set('pax', e.target.value)}
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-deep-blue">แพ็กเกจที่สนใจ</label>
          <select
            className={inputCls}
            value={form.packageName}
            onChange={(e) => set('packageName', e.target.value)}
          >
            {options.map((p) => (
              <option key={p.id} value={p.name}>
                {p.name}
              </option>
            ))}
          </select>
        </div>
        <div className="sm:col-span-2">
          <label className="mb-1.5 block text-sm font-medium text-deep-blue">หมายเหตุ</label>
          <textarea
            className={`${inputCls} min-h-[90px] resize-y`}
            value={form.note}
            onChange={(e) => set('note', e.target.value)}
            placeholder="ความต้องการเพิ่มเติม เช่น ห้องพัก อาหาร ฯลฯ"
          />
        </div>
      </div>
      <button
        type="submit"
        className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg bg-royal-blue px-6 py-3 font-semibold text-bright-sky transition hover:bg-deep-blue"
      >
        <Send className="size-4" />
        ส่งใบสมัคร
      </button>
    </form>
  )
}
