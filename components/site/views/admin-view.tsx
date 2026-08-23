'use client'

import { useState, useEffect } from 'react'
import {
  Lock,
  LogOut,
  Users,
  Package as PackageIcon,
  BookOpen,
  Building2,
  Plus,
  Pencil,
  Trash2,
  Video,
  Image as ImageIcon,
  MessageCircle,
  Phone,
  BarChart3,
} from 'lucide-react'
import { useStore } from '../store'
import { useToast } from '../toast'
import { PackageEditor, ArticleEditor } from './admin-editors'
import { MultiImageUpload, ImageUpload } from '../image-upload'
import {
  STATUS_LABELS,
  type Package,
  type Article,
  type RegStatus,
  type CompanyInfo,
  type Testimonial,
  type StaffContact,
  type SiteStats,
} from '@/lib/site-data'

type Tab =
  | 'registrations'
  | 'packages'
  | 'articles'
  | 'company'
  | 'youtube'
  | 'gallery'
  | 'testimonials'
  | 'staff'
  | 'stats'

const STATUS_STYLES: Record<RegStatus, string> = {
  pending: 'bg-amber-100 text-amber-700',
  contacted: 'bg-sky-100 text-sky-700',
  confirmed: 'bg-emerald-100 text-emerald-700',
  cancelled: 'bg-rose-100 text-rose-700',
}

const ADMIN_AUTH_KEY = 'napalen-admin-authed'

export function AdminView() {
  const [authed, setAuthed] = useState(false)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    try {
      if (localStorage.getItem(ADMIN_AUTH_KEY) === '1') {
        setAuthed(true)
      }
    } catch {
      /* ignore */
    }
    setReady(true)
  }, [])

  const login = () => {
    try {
      localStorage.setItem(ADMIN_AUTH_KEY, '1')
    } catch {
      /* ignore */
    }
    setAuthed(true)
  }

  const logout = () => {
    try {
      localStorage.removeItem(ADMIN_AUTH_KEY)
    } catch {
      /* ignore */
    }
    setAuthed(false)
  }

  if (!ready) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center text-sm text-muted-foreground">
        กำลังโหลด...
      </div>
    )
  }

  if (!authed) return <AdminLogin onSuccess={login} />
  return <AdminDashboard onLogout={logout} />
}

function AdminLogin({ onSuccess }: { onSuccess: () => void }) {
  const { notify } = useToast()
  const [user, setUser] = useState('')
  const [pass, setPass] = useState('')

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (user === 'napalen' && pass === '91160') {
      notify('เข้าสู่ระบบสำเร็จ ยินดีต้อนรับผู้ดูแลระบบ')
      onSuccess()
    } else {
      notify('ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง')
    }
  }

  const inputCls =
    'w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm text-foreground outline-none transition focus:border-royal-blue focus:ring-2 focus:ring-royal-blue/30'

  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4 py-16">
      <form onSubmit={submit} className="w-full max-w-sm rounded-2xl border border-luxury-gold/30 bg-card p-8 shadow-2xl">
        <div className="mb-6 flex flex-col items-center text-center">
          <div className="flex size-14 items-center justify-center rounded-full bg-royal-blue/10 text-royal-blue">
            <Lock className="size-7" />
          </div>
          <h1 className="mt-4 text-xl font-bold text-deep-blue">ระบบผู้ดูแล</h1>
          <p className="mt-1 text-sm text-muted-foreground">เข้าสู่ระบบเพื่อจัดการข้อมูล</p>
        </div>
        <div className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-deep-blue">ชื่อผู้ใช้</label>
            <input className={inputCls} value={user} onChange={(e) => setUser(e.target.value)} placeholder="napalen" />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-deep-blue">รหัสผ่าน</label>
            <input
              className={inputCls}
              type="password"
              value={pass}
              onChange={(e) => setPass(e.target.value)}
              placeholder="••••"
            />
          </div>
        </div>
        <button type="submit" className="mt-6 w-full rounded-lg bg-royal-blue px-6 py-3 font-semibold text-bright-sky transition hover:bg-deep-blue">
          เข้าสู่ระบบ
        </button>
      
      </form>
    </div>
  )
}

const TABS: { id: Tab; label: string; icon: typeof Users }[] = [
  { id: 'registrations', label: 'การลงทะเบียน', icon: Users },
  { id: 'stats', label: 'สถิติแดชบอร์ด', icon: BarChart3 },
  { id: 'youtube', label: 'วิดีโอหน้าปก', icon: Video },
  { id: 'gallery', label: 'แกลเลอรี / สไลด์', icon: ImageIcon },
  { id: 'packages', label: 'แพ็กเกจ', icon: PackageIcon },
  { id: 'articles', label: 'คลังความรู้', icon: BookOpen },
  { id: 'testimonials', label: 'ความประทับใจ', icon: MessageCircle },
  { id: 'staff', label: 'เบอร์ติดต่อ', icon: Phone },
  { id: 'company', label: 'ข้อมูลบริษัท', icon: Building2 },
]

function AdminDashboard({ onLogout }: { onLogout: () => void }) {
  const [tab, setTab] = useState<Tab>('registrations')

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-deep-blue">แดชบอร์ดผู้ดูแล</h1>
          <p className="text-sm text-muted-foreground">จัดการข้อมูลเว็บไซต์ทั้งหมด — แก้ไขได้ทุกส่วน</p>
        </div>
        <button
          onClick={onLogout}
          className="inline-flex items-center gap-2 rounded-lg border border-destructive/40 px-4 py-2 text-sm font-medium text-destructive transition hover:bg-destructive hover:text-bright-sky"
        >
          <LogOut className="size-4" />
          ออกจากระบบ
        </button>
      </div>

      <div className="mb-6 flex flex-wrap gap-1 border-b border-border">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`-mb-px flex items-center gap-1.5 border-b-2 px-3 py-2.5 text-xs font-medium transition sm:text-sm ${
              tab === t.id
                ? 'border-royal-blue text-royal-blue'
                : 'border-transparent text-muted-foreground hover:text-deep-blue'
            }`}
          >
            <t.icon className="size-3.5" />
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'registrations' && <RegistrationsTab />}
      {tab === 'stats' && <StatsTab />}
      {tab === 'youtube' && <YoutubeTab />}
      {tab === 'gallery' && <GalleryTab />}
      {tab === 'packages' && <PackagesTab />}
      {tab === 'articles' && <ArticlesTab />}
      {tab === 'testimonials' && <TestimonialsTab />}
      {tab === 'staff' && <StaffTab />}
      {tab === 'company' && <CompanyTab />}
    </div>
  )
}

function RegistrationsTab() {
  const { registrations, updateRegistrationStatus } = useStore()
  const { notify } = useToast()

  return (
    <div className="overflow-x-auto rounded-2xl border border-border bg-card shadow-lg">
      <table className="w-full min-w-[720px] text-left text-sm">
        <thead className="bg-bright-sky text-xs uppercase text-muted-foreground">
          <tr>
            <th className="px-4 py-3">ชื่อ</th>
            <th className="px-4 py-3">ติดต่อ</th>
            <th className="px-4 py-3">แพ็กเกจ</th>
            <th className="px-4 py-3">จำนวน</th>
            <th className="px-4 py-3">วันที่</th>
            <th className="px-4 py-3">สถานะ</th>
          </tr>
        </thead>
        <tbody>
          {registrations.map((r) => (
            <tr key={r.id} className="border-t border-border">
              <td className="px-4 py-3">
                <p className="font-medium text-deep-blue">{r.name}</p>
                {r.note && <p className="text-xs text-muted-foreground">{r.note}</p>}
              </td>
              <td className="px-4 py-3 text-foreground/80">
                <p>{r.phone}</p>
                <p className="text-xs text-muted-foreground">{r.email || '-'}</p>
              </td>
              <td className="px-4 py-3 text-foreground/80">{r.packageName}</td>
              <td className="px-4 py-3 text-center text-foreground/80">{r.pax}</td>
              <td className="px-4 py-3 text-foreground/80">{r.createdAt}</td>
              <td className="px-4 py-3">
                <span className={`mb-1 inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_STYLES[r.status]}`}>
                  {STATUS_LABELS[r.status]}
                </span>
                <select
                  value={r.status}
                  onChange={(e) => {
                    updateRegistrationStatus(r.id, e.target.value as RegStatus)
                    notify('อัพเดทสถานะเรียบร้อย')
                  }}
                  className="block w-full rounded-md border border-input bg-background px-2 py-1 text-xs text-foreground"
                >
                  {Object.entries(STATUS_LABELS).map(([k, v]) => (
                    <option key={k} value={k}>
                      {v}
                    </option>
                  ))}
                </select>
              </td>
            </tr>
          ))}
          {registrations.length === 0 && (
            <tr>
              <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">
                ยังไม่มีการลงทะเบียน
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}

function StatsTab() {
  const { settings, updateSettings } = useStore()
  const { notify } = useToast()
  const [form, setForm] = useState<SiteStats>(settings.stats)
  const inputCls =
    'w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm text-foreground outline-none transition focus:border-royal-blue focus:ring-2 focus:ring-royal-blue/30'

  return (
    <div className="max-w-lg rounded-2xl border border-luxury-gold/30 bg-card p-6 shadow-lg">
      <h2 className="mb-4 text-lg font-semibold text-deep-blue">สถิติบนหน้าแรก (แก้ไขได้)</h2>
      <div className="space-y-4">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-deep-blue">จำนวนผู้ไปอุมเราะห์</label>
          <input className={inputCls} value={form.umrahCount} onChange={(e) => setForm({ ...form, umrahCount: e.target.value })} placeholder="3,200+" />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-deep-blue">จำนวนผู้ไปฮัจญ์</label>
          <input className={inputCls} value={form.hajjCount} onChange={(e) => setForm({ ...form, hajjCount: e.target.value })} placeholder="1,800+" />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-deep-blue">จำนวนผู้ใช้บริการทั้งหมด</label>
          <input className={inputCls} value={form.totalCustomers} onChange={(e) => setForm({ ...form, totalCustomers: e.target.value })} placeholder="5,000+" />
        </div>
      </div>
      <button
        onClick={() => {
          updateSettings({ stats: form })
          notify('บันทึกสถิติเรียบร้อย')
        }}
        className="mt-6 rounded-lg bg-royal-blue px-6 py-3 font-semibold text-bright-sky transition hover:bg-deep-blue"
      >
        บันทึกสถิติ
      </button>
    </div>
  )
}

function YoutubeTab() {
  const { settings, updateSettings } = useStore()
  const { notify } = useToast()
  const [url, setUrl] = useState(settings.youtubeHeroUrl)
  const inputCls =
    'w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm text-foreground outline-none transition focus:border-royal-blue focus:ring-2 focus:ring-royal-blue/30'

  return (
    <div className="max-w-xl rounded-2xl border border-luxury-gold/30 bg-card p-6 shadow-lg">
      <h2 className="mb-2 text-lg font-semibold text-deep-blue">วิดีโอ YouTube หน้าปก</h2>
      <p className="mb-4 text-sm text-muted-foreground">
        วางลิงก์ YouTube หรือ Video ID — วิดีโอจะเล่นวนอัตโนมัติบนหน้าแรก มีปุ่มเปิด/ปิดเสียง
      </p>
      <input
        className={inputCls}
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="https://www.youtube.com/watch?v=xxxxx หรือ Video ID"
      />
      <button
        onClick={() => {
          updateSettings({ youtubeHeroUrl: url.trim() })
          notify('บันทึกลิงก์ YouTube เรียบร้อย')
        }}
        className="mt-4 rounded-lg bg-royal-blue px-6 py-3 font-semibold text-bright-sky transition hover:bg-deep-blue"
      >
        บันทึกลิงก์
      </button>
    </div>
  )
}

function GalleryTab() {
  const { settings, setGallery } = useStore()
  const { notify } = useToast()

  return (
    <div className="max-w-2xl rounded-2xl border border-luxury-gold/30 bg-card p-6 shadow-lg">
      <h2 className="mb-2 text-lg font-semibold text-deep-blue">แกลเลอรี / ภาพสไลด์</h2>
      <p className="mb-4 text-sm text-muted-foreground">
        อัปโหลดภาพหลายภาพ — จะแสดงเป็นสไลด์บนหน้าแรกและหน้าแกลเลอรี
      </p>
      <MultiImageUpload
        values={settings.gallery}
        onChange={(images) => {
          setGallery(images)
          notify('อัปเดตแกลเลอรีแล้ว')
        }}
        label="ภาพในแกลเลอรี"
        max={24}
      />
    </div>
  )
}

function PackagesTab() {
  const { packages, savePackage, deletePackage } = useStore()
  const { notify } = useToast()
  const [editing, setEditing] = useState<Package | null>(null)
  const [creating, setCreating] = useState(false)

  return (
    <div>
      <div className="mb-4 flex justify-end">
        <button
          onClick={() => setCreating(true)}
          className="inline-flex items-center gap-2 rounded-lg bg-royal-blue px-4 py-2 text-sm font-semibold text-bright-sky transition hover:bg-deep-blue"
        >
          <Plus className="size-4" />
          เพิ่มแพ็กเกจ
        </button>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {packages.map((p) => (
          <div key={p.id} className="flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-lg">
            <img
              src={p.images[0] || '/placeholder.svg'}
              alt={p.name}
              className="h-32 w-full object-cover"
            />
            <div className="flex flex-1 flex-col p-4">
              <span className="text-xs font-medium text-luxury-gold">
                {p.type === 'hajj' ? 'ฮัจญ์' : 'อุมเราะห์'} · {p.images.length} ภาพ
                {p.subBlocks.length > 0 ? ` · ${p.subBlocks.length} บล็อกย่อย` : ''}
              </span>
              <h3 className="mt-1 font-semibold text-deep-blue">{p.name}</h3>
              <p className="mt-1 text-sm text-royal-blue">{p.price}</p>
              <div className="mt-4 flex gap-2">
                <button
                  onClick={() => setEditing(p)}
                  className="inline-flex flex-1 items-center justify-center gap-1 rounded-lg border border-royal-blue/40 py-2 text-xs font-medium text-royal-blue transition hover:bg-royal-blue hover:text-bright-sky"
                >
                  <Pencil className="size-3.5" />
                  แก้ไข
                </button>
                <button
                  onClick={() => {
                    deletePackage(p.id)
                    notify('ลบแพ็กเกจเรียบร้อย')
                  }}
                  className="inline-flex items-center justify-center gap-1 rounded-lg border border-destructive/40 px-3 py-2 text-xs font-medium text-destructive transition hover:bg-destructive hover:text-bright-sky"
                >
                  <Trash2 className="size-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {(creating || editing) && (
        <PackageEditor
          initial={editing}
          defaultType="hajj"
          onClose={() => {
            setCreating(false)
            setEditing(null)
          }}
          onSave={(p) => {
            savePackage(p)
            notify('บันทึกแพ็กเกจเรียบร้อย')
            setCreating(false)
            setEditing(null)
          }}
        />
      )}
    </div>
  )
}

function ArticlesTab() {
  const { articles, saveArticle, deleteArticle } = useStore()
  const { notify } = useToast()
  const [editing, setEditing] = useState<Article | null>(null)
  const [creating, setCreating] = useState(false)

  return (
    <div>
      <div className="mb-4 flex justify-end">
        <button
          onClick={() => setCreating(true)}
          className="inline-flex items-center gap-2 rounded-lg bg-royal-blue px-4 py-2 text-sm font-semibold text-bright-sky transition hover:bg-deep-blue"
        >
          <Plus className="size-4" />
          เพิ่มบทความ
        </button>
      </div>
      <div className="space-y-3">
        {articles.map((a) => (
          <div key={a.id} className="flex items-center gap-4 rounded-2xl border border-border bg-card p-3 shadow-sm">
            <img src={a.images[0] || '/placeholder.svg'} alt={a.title} className="size-16 shrink-0 rounded-lg object-cover" />
            <div className="min-w-0 flex-1">
              <span className="text-xs font-medium text-luxury-gold">
                {a.category} · {a.images.length} ภาพ
                {a.subBlocks.length > 0 ? ` · ${a.subBlocks.length} บล็อกย่อย` : ''}
              </span>
              <h3 className="truncate font-semibold text-deep-blue">{a.title}</h3>
              <p className="text-xs text-muted-foreground">{a.date}</p>
            </div>
            <div className="flex shrink-0 gap-2">
              <button
                onClick={() => setEditing(a)}
                className="inline-flex items-center gap-1 rounded-lg border border-royal-blue/40 px-3 py-2 text-xs font-medium text-royal-blue transition hover:bg-royal-blue hover:text-bright-sky"
              >
                <Pencil className="size-3.5" />
                แก้ไข
              </button>
              <button
                onClick={() => {
                  deleteArticle(a.id)
                  notify('ลบบทความเรียบร้อย')
                }}
                className="inline-flex items-center gap-1 rounded-lg border border-destructive/40 px-3 py-2 text-xs font-medium text-destructive transition hover:bg-destructive hover:text-bright-sky"
              >
                <Trash2 className="size-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {(creating || editing) && (
        <ArticleEditor
          initial={editing}
          onClose={() => {
            setCreating(false)
            setEditing(null)
          }}
          onSave={(a) => {
            saveArticle(a)
            notify('บันทึกบทความเรียบร้อย')
            setCreating(false)
            setEditing(null)
          }}
        />
      )}
    </div>
  )
}

function TestimonialsTab() {
  const { settings, saveTestimonial, deleteTestimonial } = useStore()
  const { notify } = useToast()
  const [editing, setEditing] = useState<Testimonial | null>(null)
  const [creating, setCreating] = useState(false)
  const [form, setForm] = useState<Testimonial | null>(null)

  const openCreate = () => {
    setForm({
      id: `t-${Date.now()}`,
      name: '',
      role: '',
      text: '',
      image: '',
    })
    setCreating(true)
  }
  const openEdit = (t: Testimonial) => {
    setForm({ ...t })
    setEditing(t)
  }

  const inputCls =
    'w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground outline-none transition focus:border-royal-blue focus:ring-2 focus:ring-royal-blue/30'

  return (
    <div>
      <div className="mb-4 flex justify-end">
        <button
          onClick={openCreate}
          className="inline-flex items-center gap-2 rounded-lg bg-royal-blue px-4 py-2 text-sm font-semibold text-bright-sky transition hover:bg-deep-blue"
        >
          <Plus className="size-4" />
          เพิ่มความประทับใจ
        </button>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {settings.testimonials.map((t) => (
          <div key={t.id} className="rounded-2xl border border-border bg-card p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <img src={t.image || '/placeholder-user.jpg'} alt="" className="size-12 rounded-full object-cover" />
              <div>
                <p className="font-semibold text-deep-blue">{t.name}</p>
                <p className="text-xs text-muted-foreground">{t.role}</p>
              </div>
            </div>
            <p className="mt-3 line-clamp-3 text-sm text-foreground/80">{t.text}</p>
            <div className="mt-3 flex gap-2">
              <button
                onClick={() => openEdit(t)}
                className="inline-flex flex-1 items-center justify-center gap-1 rounded-lg border border-royal-blue/40 py-1.5 text-xs font-medium text-royal-blue"
              >
                <Pencil className="size-3.5" /> แก้ไข
              </button>
              <button
                onClick={() => {
                  deleteTestimonial(t.id)
                  notify('ลบเรียบร้อย')
                }}
                className="rounded-lg border border-destructive/40 px-2 py-1.5 text-destructive"
              >
                <Trash2 className="size-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {(creating || editing) && form && (
        <div className="fixed inset-0 z-[70] flex items-start justify-center overflow-y-auto bg-deep-blue/60 p-4 backdrop-blur-sm">
          <div className="my-8 w-full max-w-md rounded-2xl border border-luxury-gold/30 bg-card p-6 shadow-2xl">
            <h3 className="mb-4 font-semibold text-deep-blue">{editing ? 'แก้ไข' : 'เพิ่ม'}ความประทับใจ</h3>
            <div className="space-y-3">
              <ImageUpload value={form.image} onChange={(image) => setForm({ ...form, image })} label="รูปผู้แสวงบุญ" />
              <input className={inputCls} placeholder="ชื่อ" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              <input className={inputCls} placeholder="บทบาท เช่น ผู้แสวงบุญฮัจญ์" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} />
              <textarea
                className={`${inputCls} min-h-[100px]`}
                placeholder="ข้อความความประทับใจ"
                value={form.text}
                onChange={(e) => setForm({ ...form, text: e.target.value })}
              />
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={() => {
                  setCreating(false)
                  setEditing(null)
                  setForm(null)
                }}
                className="rounded-lg border border-border px-4 py-2 text-sm"
              >
                ยกเลิก
              </button>
              <button
                onClick={() => {
                  saveTestimonial(form)
                  notify('บันทึกเรียบร้อย')
                  setCreating(false)
                  setEditing(null)
                  setForm(null)
                }}
                className="rounded-lg bg-royal-blue px-5 py-2 text-sm font-semibold text-bright-sky"
              >
                บันทึก
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function StaffTab() {
  const { settings, saveStaff, deleteStaff } = useStore()
  const { notify } = useToast()
  const [form, setForm] = useState<StaffContact | null>(null)
  const inputCls =
    'w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground outline-none transition focus:border-royal-blue focus:ring-2 focus:ring-royal-blue/30'

  return (
    <div>
      <div className="mb-4 flex justify-end">
        <button
          onClick={() =>
            setForm({
              id: `s-${Date.now()}`,
              name: '',
              role: '',
              phone: '',
            })
          }
          className="inline-flex items-center gap-2 rounded-lg bg-royal-blue px-4 py-2 text-sm font-semibold text-bright-sky transition hover:bg-deep-blue"
        >
          <Plus className="size-4" />
          เพิ่มเบอร์ติดต่อ
        </button>
      </div>
      <div className="space-y-3">
        {settings.staffContacts.map((s) => (
          <div key={s.id} className="flex items-center justify-between rounded-xl border border-border bg-card p-4">
            <div>
              <p className="font-semibold text-deep-blue">{s.name}</p>
              <p className="text-sm text-muted-foreground">{s.role}</p>
              <p className="text-sm text-royal-blue">{s.phone}</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setForm({ ...s })}
                className="rounded-lg border border-royal-blue/40 px-3 py-1.5 text-xs text-royal-blue"
              >
                <Pencil className="size-3.5" />
              </button>
              <button
                onClick={() => {
                  deleteStaff(s.id)
                  notify('ลบเรียบร้อย')
                }}
                className="rounded-lg border border-destructive/40 px-3 py-1.5 text-destructive"
              >
                <Trash2 className="size-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {form && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-deep-blue/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-2xl border border-luxury-gold/30 bg-card p-6 shadow-2xl">
            <h3 className="mb-4 font-semibold text-deep-blue">เบอร์ติดต่อ</h3>
            <div className="space-y-3">
              <input className={inputCls} placeholder="ชื่อ" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              <input className={inputCls} placeholder="ตำแหน่ง" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} />
              <input className={inputCls} placeholder="เบอร์โทร" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <button onClick={() => setForm(null)} className="rounded-lg border border-border px-4 py-2 text-sm">
                ยกเลิก
              </button>
              <button
                onClick={() => {
                  saveStaff(form)
                  notify('บันทึกเรียบร้อย')
                  setForm(null)
                }}
                className="rounded-lg bg-royal-blue px-5 py-2 text-sm font-semibold text-bright-sky"
              >
                บันทึก
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function CompanyTab() {
  const { company, updateCompany } = useStore()
  const { notify } = useToast()
  const [form, setForm] = useState<CompanyInfo>(company)
  const set = <K extends keyof CompanyInfo>(k: K, v: CompanyInfo[K]) => setForm((f) => ({ ...f, [k]: v }))

  const inputCls =
    'w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm text-foreground outline-none transition focus:border-royal-blue focus:ring-2 focus:ring-royal-blue/30'
  const labelCls = 'mb-1.5 block text-sm font-medium text-deep-blue'

  return (
    <div className="max-w-2xl rounded-2xl border border-luxury-gold/30 bg-card p-6 shadow-lg sm:p-8">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className={labelCls}>ชื่อบริษัท (ไทย)</label>
          <input className={inputCls} value={form.name} onChange={(e) => set('name', e.target.value)} />
        </div>
        <div className="sm:col-span-2">
          <label className={labelCls}>ชื่อบริษัท (อังกฤษ)</label>
          <input className={inputCls} value={form.nameEn} onChange={(e) => set('nameEn', e.target.value)} />
        </div>
        <div className="sm:col-span-2">
          <label className={labelCls}>ที่อยู่</label>
          <textarea
            className={`${inputCls} min-h-[70px] resize-y`}
            value={form.address}
            onChange={(e) => set('address', e.target.value)}
          />
        </div>
        <div>
          <label className={labelCls}>เบอร์โทรศัพท์</label>
          <input className={inputCls} value={form.phone} onChange={(e) => set('phone', e.target.value)} />
        </div>
        <div>
          <label className={labelCls}>อีเมล</label>
          <input className={inputCls} value={form.email} onChange={(e) => set('email', e.target.value)} />
        </div>
        <div className="sm:col-span-2">
          <label className={labelCls}>ลิงก์ไลน์ (Line Link)</label>
          <input className={inputCls} value={form.lineLink} onChange={(e) => set('lineLink', e.target.value)} />
        </div>
        <div className="sm:col-span-2">
          <label className={labelCls}>ลิงก์ฝังแผนที่ Google Maps (Embed URL)</label>
          <textarea
            className={`${inputCls} min-h-[70px] resize-y`}
            value={form.mapEmbed}
            onChange={(e) => set('mapEmbed', e.target.value)}
            placeholder="https://www.google.com/maps/embed?..."
          />
        </div>
      </div>
      <button
        onClick={() => {
          updateCompany(form)
          notify('บันทึกข้อมูลบริษัทเรียบร้อย')
        }}
        className="mt-6 rounded-lg bg-royal-blue px-6 py-3 font-semibold text-bright-sky transition hover:bg-deep-blue"
      >
        บันทึกข้อมูล
      </button>
    </div>
  )
}
