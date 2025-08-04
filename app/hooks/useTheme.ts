'use client'

import { useState, useEffect } from 'react'

export type Theme = 'light' | 'dark' | 'system'

export function useTheme() {
  const [theme, setTheme] = useState<Theme>('system')
  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>('light')

  useEffect(() => {
    // Load theme from localStorage
    const savedTheme = localStorage.getItem('vici-theme') as Theme
    if (savedTheme && ['light', 'dark', 'system'].includes(savedTheme)) {
      setTheme(savedTheme)
    }
  }, [])

  useEffect(() => {
    const applyTheme = () => {
      const root = document.documentElement
      let effectiveTheme: 'light' | 'dark'

      if (theme === 'system') {
        effectiveTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
      } else {
        effectiveTheme = theme
      }

      setResolvedTheme(effectiveTheme)

      // Apply theme classes
      if (effectiveTheme === 'dark') {
        root.classList.add('dark')
      } else {
        root.classList.remove('dark')
      }

      // Store in localStorage
      localStorage.setItem('vici-theme', theme)
    }

    applyTheme()

    // Listen for system theme changes when using 'system' theme
    if (theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
      const handleChange = () => applyTheme()
      
      mediaQuery.addEventListener('change', handleChange)
      return () => mediaQuery.removeEventListener('change', handleChange)
    }
  }, [theme])

  const toggleTheme = () => {
    setTheme(current => {
      switch (current) {
        case 'light': return 'dark'
        case 'dark': return 'system'
        case 'system': return 'light'
        default: return 'light'
      }
    })
  }

  return {
    theme,
    resolvedTheme,
    setTheme,
    toggleTheme
  }
}