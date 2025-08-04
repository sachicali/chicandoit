'use client'

import { useEffect } from 'react'
import { useWebVitals } from '../hooks/useWebVitals'

export function WebVitalsTracker() {
  useWebVitals()
  
  return null // This component only tracks performance, no UI
}