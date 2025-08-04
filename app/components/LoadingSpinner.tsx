'use client'

import React from 'react'

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function LoadingSpinner({ size = 'md', className = '' }: LoadingSpinnerProps) {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  }

  return (
    <div className={`inline-flex items-center justify-center ${className}`}>
      <div
        className={`${sizes[size]} animate-spin rounded-full border-2 border-gray-300 border-t-violet-600 dark:border-gray-600 dark:border-t-violet-400`}
        role="status"
        aria-label="Loading"
      >
        <span className="sr-only">Loading...</span>
      </div>
    </div>
  )
}

interface LoadingSkeletonProps {
  className?: string
  lines?: number
}

export function LoadingSkeleton({ className = '', lines = 1 }: LoadingSkeletonProps) {
  return (
    <div className={`animate-pulse ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className={`bg-gray-200 dark:bg-slate-700 rounded ${
            lines > 1 ? 'h-4 mb-2 last:mb-0' : 'h-4'
          }`}
          style={{
            width: lines > 1 ? `${Math.random() * 40 + 60}%` : '100%'
          }}
        />
      ))}
    </div>
  )
}

interface LoadingCardProps {
  className?: string
}

export function LoadingCard({ className = '' }: LoadingCardProps) {
  return (
    <div className={`bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg p-4 ${className}`}>
      <div className="animate-pulse">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-5 h-5 bg-gray-200 dark:bg-slate-700 rounded-full" />
          <div className="flex-1">
            <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded mb-2" />
            <div className="h-3 bg-gray-200 dark:bg-slate-700 rounded w-3/4" />
          </div>
          <div className="w-16 h-6 bg-gray-200 dark:bg-slate-700 rounded-full" />
        </div>
      </div>
    </div>
  )
}