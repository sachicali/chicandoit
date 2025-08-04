'use client'

import React, { useEffect, useState } from 'react'
import { Activity, Zap, Clock, Database } from 'lucide-react'

interface PerformanceMetrics {
  fcp: number | null // First Contentful Paint
  lcp: number | null // Largest Contentful Paint
  fid: number | null // First Input Delay
  cls: number | null // Cumulative Layout Shift
  ttfb: number | null // Time to First Byte
  domLoad: number | null
  windowLoad: number | null
  memoryUsage?: {
    used: number
    total: number
  }
}

interface PerformanceMonitorProps {
  enabled?: boolean
  showIndicator?: boolean
  className?: string
}

export function PerformanceMonitor({ 
  enabled = process.env.NODE_ENV === 'development',
  showIndicator = true,
  className = ''
}: PerformanceMonitorProps) {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    fcp: null,
    lcp: null,
    fid: null,
    cls: null,
    ttfb: null,
    domLoad: null,
    windowLoad: null
  })
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (!enabled) return

    const measurePerformance = () => {
      // Core Web Vitals
      const observer = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          switch (entry.entryType) {
            case 'paint':
              if (entry.name === 'first-contentful-paint') {
                setMetrics(prev => ({ ...prev, fcp: entry.startTime }))
              }
              break
            case 'largest-contentful-paint':
              setMetrics(prev => ({ ...prev, lcp: entry.startTime }))
              break
            case 'first-input':
              setMetrics(prev => ({ ...prev, fid: (entry as any).processingStart - entry.startTime }))
              break
            case 'layout-shift':
              if (!(entry as any).hadRecentInput) {
                setMetrics(prev => ({ ...prev, cls: (prev.cls || 0) + (entry as any).value }))
              }
              break
          }
        })
      })

      // Observe different entry types
      try {
        observer.observe({ entryTypes: ['paint', 'largest-contentful-paint', 'first-input', 'layout-shift'] })
      } catch (e) {
        // Fallback for browsers that don't support all entry types
        try {
          observer.observe({ entryTypes: ['paint'] })
        } catch (e) {
          console.warn('Performance Observer not supported')
        }
      }

      // Navigation timing
      const navigationEntries = performance.getEntriesByType('navigation') as PerformanceNavigationTiming[]
      if (navigationEntries.length > 0) {
        const nav = navigationEntries[0]
        setMetrics(prev => ({
          ...prev,
          ttfb: nav.responseStart - nav.requestStart,
          domLoad: nav.domContentLoadedEventEnd - nav.fetchStart,
          windowLoad: nav.loadEventEnd - nav.fetchStart
        }))
      }

      return () => observer.disconnect()
    }

    const cleanup = measurePerformance()

    // Memory usage (if available)
    const updateMemoryUsage = () => {
      if ('memory' in performance) {
        const memory = (performance as any).memory
        setMetrics(prev => ({
          ...prev,
          memoryUsage: {
            used: Math.round(memory.usedJSHeapSize / 1024 / 1024),
            total: Math.round(memory.totalJSHeapSize / 1024 / 1024)
          }
        }))
      }
    }

    updateMemoryUsage()
    const memoryInterval = setInterval(updateMemoryUsage, 5000)

    return () => {
      cleanup?.()
      clearInterval(memoryInterval)
    }
  }, [enabled])

  const getScoreColor = (metric: string, value: number | null) => {
    if (value === null) return 'text-gray-400'
    
    switch (metric) {
      case 'fcp':
        return value <= 1800 ? 'text-green-500' : value <= 3000 ? 'text-yellow-500' : 'text-red-500'
      case 'lcp':
        return value <= 2500 ? 'text-green-500' : value <= 4000 ? 'text-yellow-500' : 'text-red-500'
      case 'fid':
        return value <= 100 ? 'text-green-500' : value <= 300 ? 'text-yellow-500' : 'text-red-500'
      case 'cls':
        return value <= 0.1 ? 'text-green-500' : value <= 0.25 ? 'text-yellow-500' : 'text-red-500'
      case 'ttfb':
        return value <= 800 ? 'text-green-500' : value <= 1800 ? 'text-yellow-500' : 'text-red-500'
      default:
        return 'text-gray-400'
    }
  }

  const formatValue = (value: number | null) => {
    if (value === null) return 'N/A'
    return value < 1000 ? `${Math.round(value)}ms` : `${(value / 1000).toFixed(2)}s`
  }

  if (!enabled || !showIndicator) return null

  return (
    <div className={`fixed bottom-4 right-4 z-50 ${className}`}>
      {/* Performance Indicator */}
      <button
        onClick={() => setIsVisible(!isVisible)}
        className="flex items-center gap-2 px-3 py-2 bg-black/80 text-white rounded-lg backdrop-blur-sm hover:bg-black/90 transition-colors text-sm"
        title="Performance Metrics"
      >
        <Activity className="w-4 h-4" />
        <span className="hidden sm:inline">
          {metrics.memoryUsage ? `${metrics.memoryUsage.used}MB` : 'Perf'}
        </span>
      </button>

      {/* Detailed Metrics Panel */}
      {isVisible && (
        <div className="absolute bottom-full right-0 mb-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <Zap className="w-4 h-4" />
              Performance Metrics
            </h3>
            <button
              onClick={() => setIsVisible(false)}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              ×
            </button>
          </div>

          <div className="space-y-3">
            {/* Core Web Vitals */}
            <div>
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Core Web Vitals</h4>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">FCP:</span>
                  <span className={getScoreColor('fcp', metrics.fcp)}>{formatValue(metrics.fcp)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">LCP:</span>
                  <span className={getScoreColor('lcp', metrics.lcp)}>{formatValue(metrics.lcp)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">FID:</span>
                  <span className={getScoreColor('fid', metrics.fid)}>{formatValue(metrics.fid)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">CLS:</span>
                  <span className={getScoreColor('cls', metrics.cls)}>
                    {metrics.cls !== null ? metrics.cls.toFixed(3) : 'N/A'}
                  </span>
                </div>
              </div>
            </div>

            {/* Loading Times */}
            <div>
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-1">
                <Clock className="w-3 h-3" />
                Loading Times
              </h4>
              <div className="grid grid-cols-1 gap-1 text-xs">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">TTFB:</span>
                  <span className={getScoreColor('ttfb', metrics.ttfb)}>{formatValue(metrics.ttfb)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">DOM Load:</span>
                  <span className="text-gray-500">{formatValue(metrics.domLoad)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Window Load:</span>
                  <span className="text-gray-500">{formatValue(metrics.windowLoad)}</span>
                </div>
              </div>
            </div>

            {/* Memory Usage */}
            {metrics.memoryUsage && (
              <div>
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-1">
                  <Database className="w-3 h-3" />
                  Memory Usage
                </h4>
                <div className="text-xs">
                  <div className="flex justify-between mb-1">
                    <span className="text-gray-600 dark:text-gray-400">Used:</span>
                    <span className="text-gray-900 dark:text-white">{metrics.memoryUsage.used}MB</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${(metrics.memoryUsage.used / metrics.memoryUsage.total) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-700">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              <span className="text-green-500">●</span> Good &nbsp;
              <span className="text-yellow-500">●</span> Needs improvement &nbsp;
              <span className="text-red-500">●</span> Poor
            </p>
          </div>
        </div>
      )}
    </div>
  )
}