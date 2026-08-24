'use client'

import { useState, useCallback } from 'react'
import { StoreProvider } from '@/components/site/store'
import { ToastProvider } from '@/components/site/toast'
import { NavContext, type View } from '@/components/site/nav'
import { TopBar } from '@/components/site/top-bar'
import { Navbar } from '@/components/site/navbar'
import { CalendarRibbon } from '@/components/site/calendar-ribbon'
import { Footer } from '@/components/site/footer'
import { HomeView } from '@/components/site/views/home-view'
import { ServiceView } from '@/components/site/views/service-view'
import { KnowledgeView } from '@/components/site/views/knowledge-view'
import { ArticleView } from '@/components/site/views/article-view'
import { ContactView } from '@/components/site/views/contact-view'
import { AdminView } from '@/components/site/views/admin-view'
import { PackageDetailView } from '@/components/site/views/package-detail-view'
import { QiblaView } from '@/components/site/views/qibla-view'
import { TasbihView } from '@/components/site/views/tasbih-view'
import { HijriCalendarView } from '@/components/site/views/hijri-calendar-view'
import { QuranView } from '@/components/site/views/quran-view'
import { HotelsView } from '@/components/site/views/hotels-view'
import { MobileBottomNav } from '@/components/site/mobile-bottom-nav'

export function AppShell() {
  const [view, setView] = useState<View>('home')
  const [articleId, setArticleId] = useState<string | null>(null)
  const [packageId, setPackageId] = useState<string | null>(null)

  const navigate = useCallback((next: View, id?: string) => {
    setView(next)
    if (next === 'article') {
      setArticleId(id ?? null)
      setPackageId(null)
    } else if (next === 'package') {
      setPackageId(id ?? null)
      setArticleId(null)
    } else {
      setArticleId(null)
      setPackageId(null)
    }
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }, [])

  return (
    <StoreProvider>
      <ToastProvider>
        <NavContext.Provider value={{ view, articleId, packageId, navigate }}>
          <div className="flex min-h-screen flex-col bg-background text-foreground">
            <TopBar />
            <Navbar />
            <CalendarRibbon />
            <main className="flex-1 pb-20 lg:pb-0">
              <div style={{ display: view === 'home' ? 'block' : 'none' }}>
                <HomeView />
              </div>

              {view === 'hajj' && <ServiceView type="hajj" />}
              {view === 'umrah' && <ServiceView type="umrah" />}
              {view === 'knowledge' && <KnowledgeView />}
              {view === 'article' && <ArticleView articleId={articleId} />}
              {view === 'package' && <PackageDetailView packageId={packageId} />}
              {view === 'contact' && <ContactView />}
              {view === 'admin' && <AdminView />}
              {view === 'qibla' && <QiblaView />}
              {view === 'tasbih' && <TasbihView />}
              {view === 'hijri-calendar' && <HijriCalendarView />}
              {view === 'quran' && <QuranView />}
              {view === 'hotels' && <HotelsView />}
            </main>
            <Footer />
            <MobileBottomNav />
          </div>
        </NavContext.Provider>
      </ToastProvider>
    </StoreProvider>
  )
}
