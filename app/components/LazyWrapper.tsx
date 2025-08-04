'use client'

import React, { useState, useEffect, useRef, ReactNode } from 'react'

interface LazyWrapperProps {
  children: ReactNode
  fallback?: ReactNode
  threshold?: number
  rootMargin?: string
  className?: string
}

export function LazyWrapper({
  children,
  fallback = <div className="animate-pulse bg-slate-200 dark:bg-slate-700 rounded-lg h-32" />,
  threshold = 0.1,
  rootMargin = '100px',
  className = ''
}: LazyWrapperProps) {
  const [isInView, setIsInView] = useState(false)
  const [hasLoaded, setHasLoaded] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasLoaded) {
          setIsInView(true)
          setHasLoaded(true)
          observer.disconnect()
        }
      },
      { threshold, rootMargin }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [threshold, rootMargin, hasLoaded])

  return (
    <div ref={ref} className={className}>
      {hasLoaded || isInView ? children : fallback}
    </div>
  )
}