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

const KEY = 'napalen-data-v2'

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
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY) || localStorage.getItem('napalen-data-v1')
      if (raw) {
        const parsed = JSON.parse(raw) as Partial<StoreData> & {
          packages?: Array<Partial<Package> & { image?: string }>
          articles?: Array<Partial<Article> & { image?: string }>
        }
        setData({
          packages: (parsed.packages ?? seed.packages).map(normalizePackage),
          articles: (parsed.articles ?? seed.articles).map(normalizeArticle),
          registrations: parsed.registrations ?? seed.registrations,
          company: parsed.company ?? seed.company,
          settings: {
            ...seed.settings,
            ...(parsed.settings || {}),
            testimonials: parsed.settings?.testimonials ?? seed.settings.testimonials,
            staffContacts: parsed.settings?.staffContacts ?? seed.settings.staffContacts,
            gallery: parsed.settings?.gallery ?? seed.settings.gallery,
            stats: { ...seed.settings.stats, ...(parsed.settings?.stats || {}) },
          },
        })
      }
    } catch {
      /* ignore */
    }
    setHydrated(true)
  }, [])

  useEffect(() => {
    if (!hydrated) return
    try {
      localStorage.setItem(KEY, JSON.stringify(data))
    } catch {
      /* quota exceeded — ignore */
    }
  }, [data, hydrated])

  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if ((e.key === KEY || e.key === 'napalen-data-v1') && e.newValue) {
        try {
          setData(JSON.parse(e.newValue))
        } catch {
          /* ignore */
        }
      }
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  const addRegistration = useCallback(
    (r: Omit<Registration, 'id' | 'status' | 'createdAt'>) => {
      setData((d) => ({
        ...d,
        registrations: [
          {
            ...r,
            id: `reg-${Date.now()}`,
            status: 'pending',
            createdAt: new Date().toLocaleDateString('th-TH'),
          },
          ...d.registrations,
        ],
      }))
    },
    [],
  )

  const updateRegistrationStatus = useCallback((id: string, status: RegStatus) => {
    setData((d) => ({
      ...d,
      registrations: d.registrations.map((r) => (r.id === id ? { ...r, status } : r)),
    }))
  }, [])

  const savePackage = useCallback((p: Package) => {
    setData((d) => {
      const exists = d.packages.some((x) => x.id === p.id)
      return {
        ...d,
        packages: exists
          ? d.packages.map((x) => (x.id === p.id ? p : x))
          : [...d.packages, p],
      }
    })
  }, [])

  const deletePackage = useCallback((id: string) => {
    setData((d) => ({ ...d, packages: d.packages.filter((x) => x.id !== id) }))
  }, [])

  const saveArticle = useCallback((a: Article) => {
    setData((d) => {
      const exists = d.articles.some((x) => x.id === a.id)
      return {
        ...d,
        articles: exists
          ? d.articles.map((x) => (x.id === a.id ? a : x))
          : [...d.articles, a],
      }
    })
  }, [])

  const deleteArticle = useCallback((id: string) => {
    setData((d) => ({ ...d, articles: d.articles.filter((x) => x.id !== id) }))
  }, [])

  const updateCompany = useCallback((c: CompanyInfo) => {
    setData((d) => ({ ...d, company: c }))
  }, [])

  const updateSettings = useCallback((s: Partial<SiteSettings>) => {
    setData((d) => ({ ...d, settings: { ...d.settings, ...s } }))
  }, [])

  const saveTestimonial = useCallback((t: Testimonial) => {
    setData((d) => {
      const exists = d.settings.testimonials.some((x) => x.id === t.id)
      return {
        ...d,
        settings: {
          ...d.settings,
          testimonials: exists
            ? d.settings.testimonials.map((x) => (x.id === t.id ? t : x))
            : [...d.settings.testimonials, t],
        },
      }
    })
  }, [])

  const deleteTestimonial = useCallback((id: string) => {
    setData((d) => ({
      ...d,
      settings: {
        ...d.settings,
        testimonials: d.settings.testimonials.filter((x) => x.id !== id),
      },
    }))
  }, [])

  const saveStaff = useCallback((s: StaffContact) => {
    setData((d) => {
      const exists = d.settings.staffContacts.some((x) => x.id === s.id)
      return {
        ...d,
        settings: {
          ...d.settings,
          staffContacts: exists
            ? d.settings.staffContacts.map((x) => (x.id === s.id ? s : x))
            : [...d.settings.staffContacts, s],
        },
      }
    })
  }, [])

  const deleteStaff = useCallback((id: string) => {
    setData((d) => ({
      ...d,
      settings: {
        ...d.settings,
        staffContacts: d.settings.staffContacts.filter((x) => x.id !== id),
      },
    }))
  }, [])

  const setGallery = useCallback((images: string[]) => {
    setData((d) => ({
      ...d,
      settings: { ...d.settings, gallery: images },
    }))
  }, [])

  return (
    <StoreContext.Provider
      value={{
        ...data,
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
