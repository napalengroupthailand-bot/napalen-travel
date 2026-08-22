'use client'

import { BookOpen, Compass, ShieldCheck, Sparkles } from 'lucide-react'
import { useStore } from '../store'
import { SectionHeading, PackageCard } from '../package-card'
import { RegistrationForm } from '../registration-form'
import type { PackageType } from '@/lib/site-data'

const CONTENT: Record<
  PackageType,
  {
    hero: string
    title: string
    intro: string
    knowledgeTitle: string
    steps: { icon: typeof BookOpen; title: string; desc: string }[]
  }
> = {
  hajj: {
    hero: '/images/hajj-arafat.png',
    title: 'บริการฮัจญ์',
    intro:
      'ฮัจญ์คือหนึ่งในเสาหลักทั้งห้าของศาสนาอิสลาม เราพร้อมนำท่านสู่การประกอบพิธีอันสมบูรณ์ ด้วยทีมแซะหฺผู้เชี่ยวชาญและการดูแลระดับพรีเมียม',
    knowledgeTitle: 'เตรียมตัวก่อนประกอบพิธีฮัจญ์',
    steps: [
      { icon: BookOpen, title: 'ศึกษาศาสนกิจ', desc: 'เรียนรู้ขั้นตอนและหลักการประกอบพิธีฮัจญ์ให้เข้าใจอย่างถ่องแท้' },
      { icon: ShieldCheck, title: 'เตรียมสุขภาพ', desc: 'ตรวจสุขภาพ ฉีดวัคซีน และฝึกร่างกายให้พร้อมสำหรับการเดินทาง' },
      { icon: Compass, title: 'เตรียมเอกสาร', desc: 'หนังสือเดินทาง วีซ่าฮัจญ์ และเอกสารสำคัญครบถ้วน' },
      { icon: Sparkles, title: 'ตั้งเจตนา', desc: 'ตั้งนียะฮ์ให้บริสุทธิ์เพื่ออัลลอฮ์ พร้อมทั้งกายและใจ' },
    ],
  },
  umrah: {
    hero: '/images/medina-mosque.png',
    title: 'บริการอุมเราะห์',
    intro:
      'อุมเราะห์สามารถประกอบพิธีได้ตลอดทั้งปี เป็นการเยือนบัยตุลลอฮ์เพื่อความใกล้ชิดกับอัลลอฮ์ เราจัดโปรแกรมครบครันพร้อมที่พักหรูใกล้มัสยิด',
    knowledgeTitle: 'ความรู้เกี่ยวกับอุมเราะห์',
    steps: [
      { icon: Sparkles, title: 'ครองอิห์รอม', desc: 'ครองอิห์รอมและตั้งเจตนา ณ จุดมีก็อตก่อนเข้าสู่พิธี' },
      { icon: Compass, title: 'เฏาะวาฟ', desc: 'เวียนรอบกะอ์บะฮ์ 7 รอบด้วยความสำรวมและศรัทธา' },
      { icon: BookOpen, title: 'สะแอ', desc: 'เดินระหว่างเนินซอฟาและมัรวะฮ์ 7 เที่ยว' },
      { icon: ShieldCheck, title: 'ตะฮัลลุล', desc: 'ตัดผมเพื่อสิ้นสุดพิธีอย่างสมบูรณ์' },
    ],
  },
}

export function ServiceView({ type }: { type: PackageType }) {
  const { packages } = useStore()
  const c = CONTENT[type]
  const list = packages.filter((p) => p.type === type)

  return (
    <div>
      {/* Hero */}
      <section className="relative flex min-h-[42vh] items-center justify-center overflow-hidden">
        <img
          src={c.hero || '/placeholder.svg'}
          alt={c.title}
          crossOrigin="anonymous"
          className="absolute inset-0 size-full object-cover"
        />
        <div className="absolute inset-0 bg-deep-blue/80" />
        <div className="relative z-10 mx-auto max-w-2xl px-4 py-16 text-center">
          <h1 className="text-3xl font-bold text-bright-sky sm:text-4xl">{c.title}</h1>
          <p className="mx-auto mt-4 text-pretty text-sm leading-relaxed text-bright-sky/85 sm:text-base">
            {c.intro}
          </p>
        </div>
      </section>

      {/* Knowledge / prep */}
      <section className="mx-auto max-w-7xl px-4 py-16">
        <SectionHeading eyebrow="เตรียมความพร้อม" title={c.knowledgeTitle} />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {c.steps.map((s, i) => (
            <div
              key={s.title}
              className="rounded-2xl border border-luxury-gold/20 bg-card p-6 shadow-lg"
            >
              <div className="flex size-12 items-center justify-center rounded-xl bg-royal-blue/10 text-royal-blue">
                <s.icon className="size-6" />
              </div>
              <p className="mt-4 text-xs font-semibold text-luxury-gold">ขั้นตอนที่ {i + 1}</p>
              <h3 className="mt-1 font-semibold text-deep-blue">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Packages */}
      <section className="bg-bright-sky px-4 py-16">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            eyebrow="แพ็กเกจ"
            title={`แพ็กเกจ${c.title.replace('บริการ', '')}`}
            subtitle="เลือกแพ็กเกจที่เหมาะกับท่าน ทุกแพ็กเกจรวมการดูแลจากทีมงานมืออาชีพ"
          />
          {list.length ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {list.map((p) => (
                <PackageCard key={p.id} pkg={p} />
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground">ยังไม่มีแพ็กเกจในขณะนี้</p>
          )}
        </div>
      </section>

      {/* Registration */}
      <section id="register" className="mx-auto max-w-3xl scroll-mt-24 px-4 py-16">
        <RegistrationForm type={type} />
      </section>
    </div>
  )
}
