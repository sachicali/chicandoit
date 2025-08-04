'use client'

import { useCallback, useRef, useState } from 'react'

interface CacheEntry<T> {
  data: T
  timestamp: number
  ttl: number
}

class CacheManager {
  private cache = new Map<string, CacheEntry<any>>()
  private maxSize = 100 // Maximum cache entries

  get<T>(key: string): T | null {
    const entry = this.cache.get(key)
    if (!entry) return null

    if (Date.now() - entry.timestamp > entry.ttl) {
      this.cache.delete(key)
      return null
    }

    return entry.data
  }

  set<T>(key: string, data: T, ttl: number = 5 * 60 * 1000): void {
    // Remove oldest entries if cache is full
    if (this.cache.size >= this.maxSize) {
      const firstKey = this.cache.keys().next().value
      this.cache.delete(firstKey)
    }

    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl
    })
  }

  clear(): void {
    this.cache.clear()
  }

  delete(key: string): void {
    this.cache.delete(key)
  }
}

const cacheManager = new CacheManager()

export function useCache<T>(key: string, ttl: number = 5 * 60 * 1000) {
  const [data, setData] = useState<T | null>(() => cacheManager.get<T>(key))
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const requestRef = useRef<AbortController | null>(null)

  const fetchData = useCallback(async (fetcher: () => Promise<T>, forceRefresh = false) => {
    // Check cache first unless force refresh
    if (!forceRefresh) {
      const cachedData = cacheManager.get<T>(key)
      if (cachedData) {
        setData(cachedData)
        return cachedData
      }
    }

    // Cancel previous request if still pending
    if (requestRef.current) {
      requestRef.current.abort()
    }

    requestRef.current = new AbortController()
    setLoading(true)
    setError(null)

    try {
      const result = await fetcher()
      
      // Check if request was aborted
      if (requestRef.current?.signal.aborted) {
        return
      }

      // Cache the result
      cacheManager.set(key, result, ttl)
      setData(result)
      setLoading(false)
      return result
    } catch (err) {
      if (!requestRef.current?.signal.aborted) {
        setError(err as Error)
        setLoading(false)
      }
      throw err
    }
  }, [key, ttl])

  const invalidate = useCallback(() => {
    cacheManager.delete(key)
    setData(null)
  }, [key])

  const clearCache = useCallback(() => {
    cacheManager.clear()
  }, [])

  return {
    data,
    loading,
    error,
    fetchData,
    invalidate,
    clearCache,
    isFromCache: data !== null && !loading
  }
}