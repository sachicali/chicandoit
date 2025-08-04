'use client'

import { useState, useEffect } from 'react'

export interface BreakpointConfig {
  sm: number    // 640px
  md: number    // 768px  
  lg: number    // 1024px
  xl: number    // 1280px
  '2xl': number // 1536px
}

const defaultBreakpoints: BreakpointConfig = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536
}

export type Breakpoint = keyof BreakpointConfig

export function useResponsive(breakpoints: Partial<BreakpointConfig> = {}) {
  const config = { ...defaultBreakpoints, ...breakpoints }
  
  const [windowSize, setWindowSize] = useState<{
    width: number
    height: number
  }>({
    width: 0,
    height: 0
  })

  useEffect(() => {
    function handleResize() {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      })
    }

    // Set initial size
    handleResize()
    
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const isMobile = windowSize.width < config.sm
  const isTablet = windowSize.width >= config.sm && windowSize.width < config.lg
  const isDesktop = windowSize.width >= config.lg

  const currentBreakpoint: Breakpoint = 
    windowSize.width >= config['2xl'] ? '2xl' :
    windowSize.width >= config.xl ? 'xl' :
    windowSize.width >= config.lg ? 'lg' :
    windowSize.width >= config.md ? 'md' :
    windowSize.width >= config.sm ? 'sm' : 'sm'

  const isBreakpoint = (breakpoint: Breakpoint) => {
    return windowSize.width >= config[breakpoint]
  }

  const belowBreakpoint = (breakpoint: Breakpoint) => {
    return windowSize.width < config[breakpoint]
  }

  return {
    windowSize,
    currentBreakpoint,
    isMobile,
    isTablet,
    isDesktop,
    isBreakpoint,
    belowBreakpoint,
    breakpoints: config
  }
}

export function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(false)

  useEffect(() => {
    const media = window.matchMedia(query)
    
    if (media.matches !== matches) {
      setMatches(media.matches)
    }
    
    const listener = () => setMatches(media.matches)
    media.addEventListener('change', listener)
    
    return () => media.removeEventListener('change', listener)
  }, [matches, query])

  return matches
}