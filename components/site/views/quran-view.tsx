'use client'

import { useState } from 'react'
import { ArrowLeft, BookOpen } from 'lucide-react'
import { useNav } from '../nav'

/** บทสั้น / ดูอาอ์ ที่ใช้บ่อยสำหรับผู้แสวงบุญ */
const SECTIONS = [
  {
    id: 'fatiha',
    title: 'อัล-ฟาติฮะฮ์',
    titleAr: 'سُورَةُ الْفَاتِحَة',
    ayahs: [
      { ar: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ', th: 'ด้วยพระนามของอัลลอฮ์ ผู้ทรงกรุณาปราณี ผู้ทรงเมตตาเสมอ' },
      { ar: 'الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ', th: 'การสรรเสริญทั้งหลายเป็นของอัลลอฮ์ พระเจ้าแห่งสากลโลก' },
      { ar: 'الرَّحْمَٰنِ الرَّحِيمِ', th: 'ผู้ทรงกรุณาปราณี ผู้ทรงเมตตาเสมอ' },
      { ar: 'مَالِكِ يَوْمِ الدِّينِ', th: 'ผู้ทรงครอบครองวันแห่งการตอบแทน' },
      { ar: 'إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ', th: 'เฉพาะพระองค์เท่านั้นที่พวกข้าพระองค์เคารพอิบาดะฮ์ และเฉพาะพระองค์เท่านั้นที่พวกข้าพระองค์ขอความช่วยเหลือ' },
      { ar: 'اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ', th: 'โปรดชี้แนะพวกข้าพระองค์ซึ่งทางอันเที่ยงตรง' },
      { ar: 'صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ', th: 'ทางของบรรดาผู้ที่พระองค์ได้ทรงโปรดปานแก่พวกเขา ไม่ใช่ทางของบรรดาผู้ที่ถูกโกรธ และไม่ใช่ทางของบรรดาผู้หลงทาง' },
    ],
  },
  {
    id: 'ikhlas',
    title: 'อัล-อิคลาศ',
    titleAr: 'سُورَةُ الْإِخْلَاص',
    ayahs: [
      { ar: 'قُلْ هُوَ اللَّهُ أَحَدٌ', th: 'จงกล่าวเถิด (มุฮัมมัด) พระองค์คืออัลลอฮ์ ผู้ทรงเอกะ' },
      { ar: 'اللَّهُ الصَّمَدُ', th: 'อัลลอฮ์นั้นเป็นผู้ที่ทุกสิ่งต้องพึ่งพิง' },
      { ar: 'لَمْ يَلِدْ وَلَمْ يُولَدْ', th: 'พระองค์ไม่ทรงให้กำเนิด และไม่ถูกให้กำเนิด' },
      { ar: 'وَلَمْ يَكُن لَّهُ كُفُوًا أَحَدٌ', th: 'และไม่มีใครเสมอเหมือนพระองค์' },
    ],
  },
  {
    id: 'dua-travel',
    title: 'ดูอาอ์เดินทาง',
    titleAr: 'دُعَاءُ السَّفَرِ',
    ayahs: [
      {
        ar: 'سُبْحَانَ الَّذِي سَخَّرَ لَنَا هَٰذَا وَمَا كُنَّا لَهُ مُقْرِنِينَ وَإِنَّا إِلَىٰ رَبِّنَا لَمُنقَلِبُونَ',
        th: 'มหิทธิ์ไร้ซึ่งพระผู้ทรงอำนวยสิ่งนี้แก่เรา และเรามิอาจควบคุมมันได้ และแท้จริงเราจะกลับไปยังพระเจ้าของเรา',
      },
    ],
  },
  {
    id: 'talbiyah',
    title: 'ตัลบียะฮ์',
    titleAr: 'التَّلْبِيَة',
    ayahs: [
      {
        ar: 'لَبَّيْكَ اللَّهُمَّ لَبَّيْكَ، لَبَّيْكَ لَا شَرِيكَ لَكَ لَبَّيْكَ، إِنَّ الْحَمْدَ وَالنِّعْمَةَ لَكَ وَالْمُلْكَ، لَا شَرِيكَ لَكَ',
        th: 'ข้าพระองค์ขอตอบรับพระองค์ อัลลอฮ์เอ๋ย ข้าพระองค์ขอตอบรับ ไม่มีภาคีใดๆ แก่พระองค์ ข้าพระองค์ขอตอบรับ แท้จริงการสรรเสริญและนิอมะฮ์เป็นของพระองค์ และอำนาจการปกครอง ไม่มีภาคีใดๆ แก่พระองค์',
      },
    ],
  },
]

export function QuranView() {
  const { navigate } = useNav()
  const [active, setActive] = useState(SECTIONS[0].id)
  const section = SECTIONS.find((s) => s.id === active) ?? SECTIONS[0]
  const [fontSize, setFontSize] = useState(24)

  return (
    <div className="mx-auto max-w-2xl px-4 py-6">
      <button
        type="button"
        onClick={() => navigate('home')}
        className="mb-4 flex items-center gap-2 text-sm font-medium text-royal-blue"
      >
        <ArrowLeft className="size-4" />
        กลับหน้าแรก
      </button>

      <div className="mb-4 flex items-center gap-2">
        <BookOpen className="size-5 text-royal-blue" />
        <h1 className="text-xl font-bold text-deep-blue">อัลกุรอาน & ดูอาอ์</h1>
      </div>

      {/* Tabs */}
      <div className="mb-4 flex gap-2 overflow-x-auto pb-1">
        {SECTIONS.map((s) => (
          <button
            key={s.id}
            type="button"
            onClick={() => setActive(s.id)}
            className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition ${
              active === s.id
                ? 'bg-royal-blue text-white shadow-md'
                : 'bg-white text-deep-blue border border-border hover:bg-soft-mint'
            }`}
          >
            {s.title}
          </button>
        ))}
      </div>

      <div className="soft-card overflow-hidden">
        <div className="flex items-center justify-between border-b border-border bg-soft-mint/50 px-4 py-3">
          <div>
            <p className="font-semibold text-deep-blue">{section.title}</p>
            <p className="font-arabic text-sm text-royal-blue">{section.titleAr}</p>
          </div>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setFontSize((s) => Math.max(18, s - 2))}
              className="rounded-lg border border-border px-2 py-1 text-xs font-bold"
            >
              A−
            </button>
            <button
              type="button"
              onClick={() => setFontSize((s) => Math.min(36, s + 2))}
              className="rounded-lg border border-border px-2 py-1 text-xs font-bold"
            >
              A+
            </button>
          </div>
        </div>

        <div className="space-y-6 p-5">
          {section.ayahs.map((a, i) => (
            <div key={i} className="border-b border-border/50 pb-5 last:border-0 last:pb-0">
              <p
                className="font-arabic leading-[2] text-deep-blue text-right"
                style={{ fontSize: `${fontSize}px` }}
                dir="rtl"
              >
                {a.ar}
              </p>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{a.th}</p>
            </div>
          ))}
        </div>
      </div>

      <p className="mt-4 text-center text-xs text-muted-foreground">
        บทคัดสรรสำหรับผู้แสวงบุญ — อ่านเพิ่มเติมได้ในคลังความรู้
      </p>
    </div>
  )
}
