'use client'

import { useState } from 'react'
import { X, Plus, Trash2 } from 'lucide-react'
import type { Package, Article, PackageType, SubBlock } from '@/lib/site-data'
import { MultiImageUpload } from '../image-upload'

const inputCls =
  'w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground outline-none transition focus:border-royal-blue focus:ring-2 focus:ring-royal-blue/30'
const labelCls = 'mb-1 block text-xs font-medium text-deep-blue'

function Modal({
  title,
  onClose,
  children,
}: {
  title: string
  onClose: () => void
  children: React.ReactNode
}) {
  return (
    <div className="fixed inset-0 z-[70] flex items-start justify-center overflow-y-auto bg-deep-blue/60 p-4 backdrop-blur-sm">
      <div className="my-8 w-full max-w-xl rounded-2xl border border-luxury-gold/30 bg-card shadow-2xl">
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <h3 className="font-semibold text-deep-blue">{title}</h3>
          <button onClick={onClose} aria-label="ปิด" className="rounded-full p-1 text-muted-foreground hover:text-deep-blue">
            <X className="size-5" />
          </button>
        </div>
        <div className="max-h-[75vh] overflow-y-auto p-6">{children}</div>
      </div>
    </div>
  )
}

function SubBlocksEditor({
  blocks,
  onChange,
}: {
  blocks: SubBlock[]
  onChange: (b: SubBlock[]) => void
}) {
  const add = () =>
    onChange([
      ...blocks,
      { id: `sb-${Date.now()}`, title: '', content: '', images: [] },
    ])
  const update = (i: number, patch: Partial<SubBlock>) =>
    onChange(blocks.map((b, idx) => (idx === i ? { ...b, ...patch } : b)))
  const remove = (i: number) => onChange(blocks.filter((_, idx) => idx !== i))

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className={labelCls}>บล็อกย่อย (อัปโหลดภาพหลายภาพได้)</label>
        <button
          type="button"
          onClick={add}
          className="inline-flex items-center gap-1 rounded-md border border-royal-blue/40 px-2 py-1 text-xs text-royal-blue"
        >
          <Plus className="size-3" /> เพิ่มบล็อกย่อย
        </button>
      </div>
      {blocks.map((b, i) => (
        <div key={b.id} className="rounded-xl border border-border bg-muted/30 p-3 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">บล็อกย่อย #{i + 1}</span>
            <button type="button" onClick={() => remove(i)} className="text-destructive">
              <Trash2 className="size-3.5" />
            </button>
          </div>
          <input
            className={inputCls}
            placeholder="หัวข้อบล็อกย่อย"
            value={b.title}
            onChange={(e) => update(i, { title: e.target.value })}
          />
          <textarea
            className={`${inputCls} min-h-[60px] resize-y`}
            placeholder="เนื้อหา"
            value={b.content}
            onChange={(e) => update(i, { content: e.target.value })}
          />
          <MultiImageUpload
            values={b.images}
            onChange={(images) => update(i, { images })}
            label="รูปในบล็อกย่อย"
          />
        </div>
      ))}
    </div>
  )
}

export function PackageEditor({
  initial,
  defaultType,
  onSave,
  onClose,
}: {
  initial: Package | null
  defaultType: PackageType
  onSave: (p: Package) => void
  onClose: () => void
}) {
  const [p, setP] = useState<Package>(
    initial ?? {
      id: `pkg-${Date.now()}`,
      type: defaultType,
      name: '',
      price: '',
      duration: '',
      hotel: '',
      distance: '',
      images: [],
      highlights: [''],
      featured: false,
      subBlocks: [],
    },
  )
  const set = <K extends keyof Package>(k: K, v: Package[K]) => setP((x) => ({ ...x, [k]: v }))

  return (
    <Modal title={initial ? 'แก้ไขแพ็กเกจ' : 'เพิ่มแพ็กเกจ'} onClose={onClose}>
      <div className="space-y-3">
        <div>
          <label className={labelCls}>ประเภท</label>
          <select className={inputCls} value={p.type} onChange={(e) => set('type', e.target.value as PackageType)}>
            <option value="hajj">ฮัจญ์</option>
            <option value="umrah">อุมเราะห์</option>
          </select>
        </div>
        <div>
          <label className={labelCls}>ชื่อแพ็กเกจ</label>
          <input className={inputCls} value={p.name} onChange={(e) => set('name', e.target.value)} />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelCls}>ราคา</label>
            <input className={inputCls} value={p.price} onChange={(e) => set('price', e.target.value)} placeholder="฿0" />
          </div>
          <div>
            <label className={labelCls}>ระยะเวลา</label>
            <input className={inputCls} value={p.duration} onChange={(e) => set('duration', e.target.value)} placeholder="X วัน" />
          </div>
          <div>
            <label className={labelCls}>โรงแรม</label>
            <input className={inputCls} value={p.hotel} onChange={(e) => set('hotel', e.target.value)} />
          </div>
          <div>
            <label className={labelCls}>ระยะทาง</label>
            <input className={inputCls} value={p.distance} onChange={(e) => set('distance', e.target.value)} />
          </div>
        </div>
        <MultiImageUpload
          values={p.images}
          onChange={(images) => set('images', images)}
          label="รูปภาพแพ็กเกจ (หลายภาพ)"
        />
        <div>
          <label className={labelCls}>จุดเด่น (บรรทัดละ 1 ข้อ)</label>
          <textarea
            className={`${inputCls} min-h-[100px] resize-y`}
            value={p.highlights.join('\n')}
            onChange={(e) => set('highlights', e.target.value.split('\n'))}
          />
        </div>
        <SubBlocksEditor blocks={p.subBlocks} onChange={(subBlocks) => set('subBlocks', subBlocks)} />
        <label className="flex items-center gap-2 text-sm text-deep-blue">
          <input
            type="checkbox"
            checked={!!p.featured}
            onChange={(e) => set('featured', e.target.checked)}
            className="size-4 accent-royal-blue"
          />
          แพ็กเกจแนะนำ
        </label>
        <div className="flex justify-end gap-2 pt-2">
          <button onClick={onClose} className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-muted-foreground">
            ยกเลิก
          </button>
          <button
            onClick={() => onSave({ ...p, highlights: p.highlights.filter((h) => h.trim()) })}
            className="rounded-lg bg-royal-blue px-5 py-2 text-sm font-semibold text-bright-sky"
          >
            บันทึก
          </button>
        </div>
      </div>
    </Modal>
  )
}

export function ArticleEditor({
  initial,
  onSave,
  onClose,
}: {
  initial: Article | null
  onSave: (a: Article) => void
  onClose: () => void
}) {
  const [a, setA] = useState<Article>(
    initial ?? {
      id: `art-${Date.now()}`,
      title: '',
      category: 'ความรู้ทั่วไป',
      excerpt: '',
      images: [],
      date: new Date().toLocaleDateString('th-TH', { day: 'numeric', month: 'long', year: 'numeric' }),
      content: '',
      subBlocks: [],
    },
  )
  const set = <K extends keyof Article>(k: K, v: Article[K]) => setA((x) => ({ ...x, [k]: v }))

  return (
    <Modal title={initial ? 'แก้ไขบทความ' : 'เพิ่มบทความ'} onClose={onClose}>
      <div className="space-y-3">
        <div>
          <label className={labelCls}>หัวข้อ</label>
          <input className={inputCls} value={a.title} onChange={(e) => set('title', e.target.value)} />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelCls}>หมวดหมู่</label>
            <input className={inputCls} value={a.category} onChange={(e) => set('category', e.target.value)} />
          </div>
          <div>
            <label className={labelCls}>วันที่</label>
            <input className={inputCls} value={a.date} onChange={(e) => set('date', e.target.value)} />
          </div>
        </div>
        <MultiImageUpload
          values={a.images}
          onChange={(images) => set('images', images)}
          label="รูปภาพบทความ (หลายภาพ)"
        />
        <div>
          <label className={labelCls}>คำโปรย</label>
          <textarea
            className={`${inputCls} min-h-[70px] resize-y`}
            value={a.excerpt}
            onChange={(e) => set('excerpt', e.target.value)}
          />
        </div>
        <div>
          <label className={labelCls}>เนื้อหา (เว้น 1 บรรทัดว่างเพื่อขึ้นย่อหน้าใหม่)</label>
          <textarea
            className={`${inputCls} min-h-[160px] resize-y`}
            value={a.content}
            onChange={(e) => set('content', e.target.value)}
          />
        </div>
        <SubBlocksEditor blocks={a.subBlocks} onChange={(subBlocks) => set('subBlocks', subBlocks)} />
        <div className="flex justify-end gap-2 pt-2">
          <button onClick={onClose} className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-muted-foreground">
            ยกเลิก
          </button>
          <button onClick={() => onSave(a)} className="rounded-lg bg-royal-blue px-5 py-2 text-sm font-semibold text-bright-sky">
            บันทึก
          </button>
        </div>
      </div>
    </Modal>
  )
}
