'use client'

import { useEffect } from 'react'

export function useWebVitals() {
  useEffect(() => {
    const reportWebVitals = (metric: any) => {
      // Log to console in development
      if (process.env.NODE_ENV === 'development') {
        console.log(`[Web Vital] ${metric.name}:`, {
          value: metric.value,
          rating: metric.rating,
          id: metric.id
        })
      }

      // Send to analytics in production (example)
      if (process.env.NODE_ENV === 'production') {
        // Replace with your analytics endpoint
        fetch('/api/web-vitals', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            metric: metric.name,
            value: metric.value,
            id: metric.id,
            rating: metric.rating,
            timestamp: Date.now(),
          }),
        }).catch(console.error)
      }
    }

    // Dynamically import web-vitals to avoid blocking the main thread
    import('web-vitals').then(({ onCLS, onINP, onFCP, onLCP, onTTFB }) => {
      onCLS(reportWebVitals)
      onINP(reportWebVitals) // FID has been replaced with INP
      onFCP(reportWebVitals)
      onLCP(reportWebVitals)
      onTTFB(reportWebVitals)
    }).catch(console.error)
  }, [])
}

// Performance thresholds for ChiCanDoIt
export const PERFORMANCE_THRESHOLDS = {
  LCP: { good: 2500, poor: 4000 }, // Largest Contentful Paint
  INP: { good: 200, poor: 500 },   // Interaction to Next Paint (replaces FID)
  CLS: { good: 0.1, poor: 0.25 },  // Cumulative Layout Shift
  FCP: { good: 1800, poor: 3000 }, // First Contentful Paint
  TTFB: { good: 800, poor: 1800 }  // Time to First Byte
}