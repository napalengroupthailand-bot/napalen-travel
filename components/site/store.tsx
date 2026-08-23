'use client'

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from 'react'
import {
  defaultPackages,
  defaultArticles,
  defaultRegistrations,
  defaultCompany,
  defaultSettings,
  normalizePackage,
  normalizeArticle,
  type Package,
  type Article,
  type Registration,
  type CompanyInfo,
  type RegStatus,
  type SiteSettings,
  type Testimonial,
  type StaffContact,
} from '@/lib/site-data'
import { supabase } from '@/lib/supabase'

type StoreData = {
  packages: Package[]
  articles: Article[]
  registrations: Registration[]
  company: CompanyInfo
  settings: SiteSettings
}

type StoreContextValue = StoreData & {
  addRegistration: (r: Omit<Registration, 'id' | 'status' | 'createdAt'>) => void
  updateRegistrationStatus: (id: string, status: RegStatus) => void
  savePackage: (p: Package) => void
  deletePackage: (id: string) => void
  saveArticle: (a: Article) => void
  deleteArticle: (id: string) => void
  updateCompany: (c: CompanyInfo) => void
  updateSettings: (s: Partial<SiteSettings>) => void
  saveTestimonial: (t: Testimonial) => void
  deleteTestimonial: (id: string) => void
  saveStaff: (s: StaffContact) => void
  deleteStaff: (id: string) => void
  setGallery: (images: string[]) => void
  loading: boolean
}

const StoreContext = createContext<StoreContextValue | null>(null)

const seed: StoreData = {
  packages: defaultPackages,
  articles: defaultArticles,
  registrations: defaultRegistrations,
  company: defaultCompany,
  settings: defaultSettings,
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<StoreData>(seed)
  const [loading, setLoading] = useState(true)

  // โหลดข้อมูลจาก Supabase
  useEffect(() => {
    async function load() {
      try {
        const [
          { data: pkgs },
          { data: arts },
          { data: regs },
          { data: comp },
          { data: sett },
        ] = await Promise.all([
          supabase.from('site_packages').select('id, data'),
          supabase.from('site_articles').select('id, data'),
          supabase
            .from('site_registrations')
            .select('id, data')
            .order('created_at', { ascending: false }),
          supabase.from('site_company').select('data').eq('id', 'main').maybeSingle(),
          supabase.from('site_settings').select('data').eq('id', 'main').maybeSingle(),
        ])

        setData({
          packages: pkgs?.length
            ? pkgs.map((r) => normalizePackage(r.data))
            : seed.packages,
          articles: arts?.length
            ? arts.map((r) => normalizeArticle(r.data))
            : seed.articles,
          registrations: regs?.length
            ? regs.map((r) => r.data as Registration)
            : seed.registrations,
          company: (comp?.data as CompanyInfo) ?? seed.company,
          settings: {
            ...seed.settings,
            ...((sett?.data as SiteSettings) || {}),
            testimonials:
              (sett?.data as SiteSettings)?.testimonials ?? seed.settings.testimonials,
            staffContacts:
              (sett?.data as SiteSettings)?.staffContacts ?? seed.settings.staffContacts,
            gallery: (sett?.data as SiteSettings)?.gallery ?? seed.settings.gallery,
            stats: {
              ...seed.settings.stats,
              ...((sett?.data as SiteSettings)?.stats || {}),
            },
          },
        })
      } catch (err) {
        console.error('Failed to load from Supabase', err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const persistPackage = async (p: Package) => {
    await supabase.from('site_packages').upsert({ id: p.id, data: p })
  }
  const persistArticle = async (a: Article) => {
    await supabase.from('site_articles').upsert({ id: a.id, data: a })
  }
  const persistCompany = async (c: CompanyInfo) => {
    await supabase.from('site_company').upsert({ id: 'main', data: c })
  }
  const persistSettings = async (s: SiteSettings) => {
    await supabase.from('site_settings').upsert({ id: 'main', data: s })
  }

  const addRegistration = useCallback(
    async (r: Omit<Registration, 'id' | 'status' | 'createdAt'>) => {
      const newReg: Registration = {
        ...r,
        id: `reg-${Date.now()}`,
        status: 'pending',
        createdAt: new Date().toLocaleDateString('th-TH'),
      }
      setData((d) => ({ ...d, registrations: [newReg, ...d.registrations] }))
      await supabase.from('site_registrations').insert({ id: newReg.id, data: newReg })
    },
    [],
  )

  const updateRegistrationStatus = useCallback(async (id: string, status: RegStatus) => {
    setData((d) => ({
      ...d,
      registrations: d.registrations.map((r) => (r.id === id ? { ...r, status } : r)),
    }))
    const { data: existing } = await supabase
      .from('site_registrations')
      .select('data')
      .eq('id', id)
      .single()
    if (existing) {
      await supabase
        .from('site_registrations')
        .update({ data: { ...existing.data, status } })
        .eq('id', id)
    }
  }, [])

  const savePackage = useCallback(async (p: Package) => {
    setData((d) => {
      const exists = d.packages.some((x) => x.id === p.id)
      return {
        ...d,
        packages: exists
          ? d.packages.map((x) => (x.id === p.id ? p : x))
          : [...d.packages, p],
      }
    })
    await persistPackage(p)
  }, [])

  const deletePackage = useCallback(async (id: string) => {
    setData((d) => ({ ...d, packages: d.packages.filter((x) => x.id !== id) }))
    await supabase.from('site_packages').delete().eq('id', id)
  }, [])

  const saveArticle = useCallback(async (a: Article) => {
    setData((d) => {
      const exists = d.articles.some((x) => x.id === a.id)
      return {
        ...d,
        articles: exists
          ? d.articles.map((x) => (x.id === a.id ? a : x))
          : [...d.articles, a],
      }
    })
    await persistArticle(a)
  }, [])

  const deleteArticle = useCallback(async (id: string) => {
    setData((d) => ({ ...d, articles: d.articles.filter((x) => x.id !== id) }))
    await supabase.from('site_articles').delete().eq('id', id)
  }, [])

  const updateCompany = useCallback(async (c: CompanyInfo) => {
    setData((d) => ({ ...d, company: c }))
    await persistCompany(c)
  }, [])

  const updateSettings = useCallback(async (s: Partial<SiteSettings>) => {
    setData((d) => {
      const next = { ...d.settings, ...s }
      persistSettings(next)
      return { ...d, settings: next }
    })
  }, [])

  const saveTestimonial = useCallback(async (t: Testimonial) => {
    setData((d) => {
      const exists = d.settings.testimonials.some((x) => x.id === t.id)
      const next = {
        ...d.settings,
        testimonials: exists
          ? d.settings.testimonials.map((x) => (x.id === t.id ? t : x))
          : [...d.settings.testimonials, t],
      }
      persistSettings(next)
      return { ...d, settings: next }
    })
  }, [])

  const deleteTestimonial = useCallback(async (id: string) => {
    setData((d) => {
      const next = {
        ...d.settings,
        testimonials: d.settings.testimonials.filter((x) => x.id !== id),
      }
      persistSettings(next)
      return { ...d, settings: next }
    })
  }, [])

  const saveStaff = useCallback(async (s: StaffContact) => {
    setData((d) => {
      const exists = d.settings.staffContacts.some((x) => x.id === s.id)
      const next = {
        ...d.settings,
        staffContacts: exists
          ? d.settings.staffContacts.map((x) => (x.id === s.id ? s : x))
          : [...d.settings.staffContacts, s],
      }
      persistSettings(next)
      return { ...d, settings: next }
    })
  }, [])

  const deleteStaff = useCallback(async (id: string) => {
    setData((d) => {
      const next = {
        ...d.settings,
        staffContacts: d.settings.staffContacts.filter((x) => x.id !== id),
      }
      persistSettings(next)
      return { ...d, settings: next }
    })
  }, [])

  const setGallery = useCallback(async (images: string[]) => {
    setData((d) => {
      const next = { ...d.settings, gallery: images }
      persistSettings(next)
      return { ...d, settings: next }
    })
  }, [])

  return (
    <StoreContext.Provider
      value={{
        ...data,
        loading,
        addRegistration,
        updateRegistrationStatus,
        savePackage,
        deletePackage,
        saveArticle,
        deleteArticle,
        updateCompany,
        updateSettings,
        saveTestimonial,
        deleteTestimonial,
        saveStaff,
        deleteStaff,
        setGallery,
      }}
    >
      {children}
    </StoreContext.Provider>
  )
}

export function useStore() {
  const ctx = useContext(StoreContext)
  if (!ctx) throw new Error('useStore must be used within StoreProvider')
  return ctx
}
