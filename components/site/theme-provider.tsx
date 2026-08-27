'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react'

type Theme = 'light' | 'dark'

type Ctx = {
  theme: Theme
  toggle: () => void
  setTheme: (t: Theme) => void
}

const ThemeCtx = createContext<Ctx | null>(null)

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('light')

  useEffect(() => {
    try {
      const saved = localStorage.getItem('napalen-theme') as Theme | null
      if (saved === 'dark' || saved === 'light') {
        setThemeState(saved)
        document.documentElement.classList.toggle('dark', saved === 'dark')
        return
      }
    } catch {
      /* ignore */
    }
  }, [])

  const setTheme = useCallback((t: Theme) => {
    setThemeState(t)
    try {
      localStorage.setItem('napalen-theme', t)
    } catch {
      /* ignore */
    }
    document.documentElement.classList.toggle('dark', t === 'dark')
  }, [])

  const toggle = useCallback(() => {
    setTheme(theme === 'light' ? 'dark' : 'light')
  }, [theme, setTheme])

  return (
    <ThemeCtx.Provider value={{ theme, toggle, setTheme }}>{children}</ThemeCtx.Provider>
  )
}

export function useTheme() {
  const ctx = useContext(ThemeCtx)
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider')
  return ctx
}
