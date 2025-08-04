'use client'

import { useReportWebVitals } from 'next/web-vitals'

export function WebVitals() {
  useReportWebVitals((metric) => {
    if (metric.label === 'web-vital') {
      console.log(metric)
      
      // In production, send to your analytics endpoint
      if (process.env.NODE_ENV === 'production') {
        const body = {
          metric: metric.name,
          value: metric.value,
          id: metric.id,
          page: window.location.pathname,
        }
        
        // Example: Send to your analytics endpoint
        // fetch('/api/analytics', {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify(body),
        // })
      }
    }
  })
  
  return null
}