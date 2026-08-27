'use client'

import { useRef } from 'react'
import { Upload, X, ImageIcon } from 'lucide-react'

/** อ่านไฟล์เป็น data URL (base64) — เก็บใน localStorage ได้ */
export function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result))
    reader.onerror = () => reject(reader.error)
    reader.readAsDataURL(file)
  })
}

/** บีบอัดรูป JPEG ก่อนเก็บ เพื่อลดขนาด localStorage */
export async function compressImage(file: File, maxWidth = 1280, quality = 0.72): Promise<string> {
  const dataUrl = await readFileAsDataUrl(file)
  return new Promise((resolve) => {
    const img = new Image()
    img.onload = () => {
      const scale = Math.min(1, maxWidth / img.width)
      const w = Math.round(img.width * scale)
      const h = Math.round(img.height * scale)
      const canvas = document.createElement('canvas')
      canvas.width = w
      canvas.height = h
      const ctx = canvas.getContext('2d')
      if (!ctx) {
        resolve(dataUrl)
        return
      }
      ctx.drawImage(img, 0, 0, w, h)
      resolve(canvas.toDataURL('image/jpeg', quality))
    }
    img.onerror = () => resolve(dataUrl)
    img.src = dataUrl
  })
}

type SingleProps = {
  value: string
  onChange: (url: string) => void
  label?: string
  className?: string
  /** true = เก็บต้นฉบับไม่บีบอัด (เหมาะภาพหน้าปก) */
  original?: boolean
}

export function ImageUpload({
  value,
  onChange,
  label = 'อัปโหลดรูปภาพ',
  className,
  original = false,
}: SingleProps) {
  const inputRef = useRef<HTMLInputElement>(null)

  const handle = async (files: FileList | null) => {
    const file = files?.[0]
    if (!file || !file.type.startsWith('image/')) return
    try {
      const url = original ? await readFileAsDataUrl(file) : await compressImage(file)
      onChange(url)
    } catch {
      /* ignore */
    }
  }

  return (
    <div className={className}>
      {label && <label className="mb-1 block text-xs font-medium text-deep-blue">{label}</label>}
      <div className="flex items-start gap-3">
        {value ? (
          <div className="relative shrink-0">
            <img src={value} alt="" className="size-20 rounded-lg object-cover border border-border" />
            <button
              type="button"
              onClick={() => onChange('')}
              className="absolute -right-1.5 -top-1.5 rounded-full bg-destructive p-0.5 text-white"
              aria-label="ลบรูป"
            >
              <X className="size-3.5" />
            </button>
          </div>
        ) : (
          <div className="flex size-20 items-center justify-center rounded-lg border border-dashed border-border bg-muted/40">
            <ImageIcon className="size-6 text-muted-foreground" />
          </div>
        )}
        <div className="flex flex-col gap-1.5">
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="inline-flex items-center gap-1.5 rounded-lg border border-royal-blue/40 px-3 py-1.5 text-xs font-medium text-royal-blue transition hover:bg-royal-blue hover:text-bright-sky"
          >
            <Upload className="size-3.5" />
            เลือกไฟล์รูป
          </button>
          <p className="text-[10px] text-muted-foreground">{original ? 'JPG, PNG, WebP — เก็บต้นฉบับ (ไม่บีบอัด)' : 'JPG, PNG, WebP — บีบอัดอัตโนมัติ'}</p>
        </div>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            handle(e.target.files)
            e.target.value = ''
          }}
        />
      </div>
    </div>
  )
}

type MultiProps = {
  values: string[]
  onChange: (urls: string[]) => void
  label?: string
  max?: number
}

export function MultiImageUpload({ values, onChange, label = 'อัปโหลดรูปหลายภาพ', max = 12 }: MultiProps) {
  const inputRef = useRef<HTMLInputElement>(null)

  const handle = async (files: FileList | null) => {
    if (!files?.length) return
    const remaining = max - values.length
    const list = Array.from(files).filter((f) => f.type.startsWith('image/')).slice(0, remaining)
    const urls: string[] = []
    for (const f of list) {
      try {
        urls.push(await compressImage(f))
      } catch {
        /* skip */
      }
    }
    if (urls.length) onChange([...values, ...urls])
  }

  const remove = (idx: number) => onChange(values.filter((_, i) => i !== idx))

  return (
    <div>
      {label && <label className="mb-1.5 block text-xs font-medium text-deep-blue">{label}</label>}
      <div className="flex flex-wrap gap-2">
        {values.map((src, i) => (
          <div key={i} className="relative">
            <img src={src} alt="" className="size-16 rounded-lg object-cover border border-border" />
            <button
              type="button"
              onClick={() => remove(i)}
              className="absolute -right-1.5 -top-1.5 rounded-full bg-destructive p-0.5 text-white"
              aria-label="ลบรูป"
            >
              <X className="size-3" />
            </button>
          </div>
        ))}
        {values.length < max && (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="flex size-16 flex-col items-center justify-center gap-0.5 rounded-lg border border-dashed border-royal-blue/40 text-royal-blue transition hover:bg-royal-blue/5"
          >
            <Upload className="size-4" />
            <span className="text-[9px]">เพิ่ม</span>
          </button>
        )}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => {
          handle(e.target.files)
          e.target.value = ''
        }}
      />
    </div>
  )
}
