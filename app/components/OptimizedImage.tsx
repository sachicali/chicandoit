'use client'

import React, { useState } from 'react'

interface OptimizedImageProps {
  src: string
  alt: string
  width?: number
  height?: number
  className?: string
  loading?: 'lazy' | 'eager'
  priority?: boolean
}

export function OptimizedImage({ 
  src, 
  alt, 
  width, 
  height, 
  className = '', 
  loading = 'lazy',
  priority = false 
}: OptimizedImageProps) {
  const [isLoaded, setIsLoaded] = useState(false)
  const [hasError, setHasError] = useState(false)

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Placeholder while loading */}
      {!isLoaded && !hasError && (
        <div 
          className="absolute inset-0 bg-gradient-to-br from-violet-100 to-purple-100 dark:from-violet-900/20 dark:to-purple-900/20 animate-pulse"
          style={{ width, height }}
        />
      )}
      
      {/* Actual image */}
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        loading={priority ? 'eager' : loading}
        className={`transition-opacity duration-300 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        } ${hasError ? 'hidden' : ''}`}
        onLoad={() => setIsLoaded(true)}
        onError={() => setHasError(true)}
        style={{
          maxWidth: '100%',
          height: 'auto',
        }}
      />
      
      {/* Error fallback */}
      {hasError && (
        <div 
          className="flex items-center justify-center bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400"
          style={{ width, height }}
        >
          <span className="text-sm">Image unavailable</span>
        </div>
      )}
    </div>
  )
}