'use client'

import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'
import { CheckCircle2, X } from 'lucide-react'

type Toast = { id: number; message: string }

const ToastContext = createContext<{ notify: (m: string) => void } | null>(null)

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const notify = useCallback((message: string) => {
    const id = Date.now() + Math.random()
    setToasts((t) => [...t, { id, message }])
    setTimeout(() => {
      setToasts((t) => t.filter((x) => x.id !== id))
    }, 3500)
  }, [])

  const dismiss = (id: number) => setToasts((t) => t.filter((x) => x.id !== id))

  return (
    <ToastContext.Provider value={{ notify }}>
      {children}
      <div className="fixed bottom-6 right-6 z-[60] flex flex-col gap-3">
        {toasts.map((t) => (
          <div
            key={t.id}
            role="status"
            className="animate-float-up flex items-center gap-3 rounded-xl border border-luxury-gold/40 bg-deep-blue px-5 py-4 text-bright-sky shadow-2xl"
          >
            <CheckCircle2 className="size-5 shrink-0 text-luxury-gold" />
            <span className="text-sm leading-relaxed">{t.message}</span>
            <button
              onClick={() => dismiss(t.id)}
              aria-label="ปิดการแจ้งเตือน"
              className="ml-2 rounded-full p-1 text-bright-sky/60 transition hover:text-bright-sky"
            >
              <X className="size-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within ToastProvider')
  return ctx
}
