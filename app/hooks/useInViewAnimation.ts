'use client'

import { useEffect, useRef, useState, useCallback, useMemo } from 'react'

interface UseInViewAnimationOptions {
  threshold?: number
  rootMargin?: string
  triggerOnce?: boolean
  delay?: number
}

// Shared observer instances for performance
const observerMap = new Map<string, IntersectionObserver>()

function getObserver(options: IntersectionObserverInit, callback: IntersectionObserverCallback) {
  const key = JSON.stringify(options)
  
  if (!observerMap.has(key)) {
    observerMap.set(key, new IntersectionObserver(callback, options))
  }
  
  return observerMap.get(key)!
}

export function useInViewAnimation(options: UseInViewAnimationOptions = {}) {
  const {
    threshold = 0.1,
    rootMargin = '50px',
    triggerOnce = true,
    delay = 0
  } = options

  const ref = useRef<HTMLElement>(null)
  const [isInView, setIsInView] = useState(false)
  const [hasTriggered, setHasTriggered] = useState(false)

  const observerOptions = useMemo(() => ({
    threshold,
    rootMargin
  }), [threshold, rootMargin])

  const handleIntersection = useCallback((entries: IntersectionObserverEntry[]) => {
    const [entry] = entries
    
    if (entry.isIntersecting && !hasTriggered) {
      if (delay > 0) {
        setTimeout(() => {
          setIsInView(true)
          if (triggerOnce) {
            setHasTriggered(true)
          }
        }, delay)
      } else {
        setIsInView(true)
        if (triggerOnce) {
          setHasTriggered(true)
        }
      }
    } else if (!triggerOnce && !entry.isIntersecting) {
      setIsInView(false)
    }
  }, [triggerOnce, delay, hasTriggered])

  useEffect(() => {
    const element = ref.current
    if (!element) return
    
    // Check if IntersectionObserver is supported
    if (!window.IntersectionObserver) {
      // Fallback for unsupported browsers
      setIsInView(true)
      return
    }

    const observer = getObserver(observerOptions, handleIntersection)
    observer.observe(element)

    return () => {
      if (element) {
        observer.unobserve(element)
      }
    }
  }, [observerOptions, handleIntersection])

  // Cleanup observers when component unmounts
  useEffect(() => {
    return () => {
      if (hasTriggered && triggerOnce) {
        // Clean up if this was the last component using this observer
        const key = JSON.stringify(observerOptions)
        const observer = observerMap.get(key)
        if (observer && observer.takeRecords().length === 0) {
          observer.disconnect()
          observerMap.delete(key)
        }
      }
    }
  }, [hasTriggered, triggerOnce, observerOptions])

  return { ref, isInView }
}