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

export function AppShell() {
  const [view, setView] = useState<View>('home')
  const [articleId, setArticleId] = useState<string | null>(null)

  const navigate = useCallback((next: View, id?: string) => {
    setView(next)
    setArticleId(id ?? null)
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }, [])

  return (
    <StoreProvider>
      <ToastProvider>
        <NavContext.Provider value={{ view, articleId, navigate }}>
          <div className="flex min-h-screen flex-col bg-background text-foreground">
            <TopBar />
            <Navbar />
            <CalendarRibbon />
            <main className="flex-1">
              {view === 'home' && <HomeView />}
              {view === 'hajj' && <ServiceView type="hajj" />}
              {view === 'umrah' && <ServiceView type="umrah" />}
              {view === 'knowledge' && <KnowledgeView />}
              {view === 'article' && <ArticleView articleId={articleId} />}
              {view === 'contact' && <ContactView />}
              {view === 'admin' && <AdminView />}
            </main>
            <Footer />
          </div>
        </NavContext.Provider>
      </ToastProvider>
    </StoreProvider>
  )
}
