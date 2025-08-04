'use client'

import React, { memo, useCallback, useEffect, useState } from 'react'
import { Check } from 'lucide-react'
import { useInViewAnimation } from '../hooks/useInViewAnimation'

interface FeatureCardProps {
  title: string
  description: string
  features: string[]
  delay?: number
  icon?: React.ReactNode
}

export const FeatureCard = memo(function FeatureCard({ 
  title, 
  description, 
  features, 
  delay = 0, 
  icon 
}: FeatureCardProps) {
  const { ref, isInView } = useInViewAnimation({
    threshold: 0.1,
    rootMargin: '100px',
    delay,
    triggerOnce: true
  })
  
  // Fallback to show cards after a delay if intersection observer fails
  const [showFallback, setShowFallback] = useState(false)
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowFallback(true)
    }, Math.max(500, delay + 200)) // Show after animation delay + buffer
    return () => clearTimeout(timer)
  }, [delay])
  
  const cardClassName = useCallback(() => {
    const shouldShow = isInView || showFallback
    return `group transition-all duration-700 will-change-transform gpu-accelerated ${
      shouldShow ? 'animate-slide-up opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
    }`
  }, [isInView, showFallback])
  
  return (
    <div 
      ref={ref as React.RefObject<HTMLDivElement>}
      className={cardClassName()}
      style={{ 
        animationDelay: `${delay}ms`,
        contain: 'layout style paint'
      }}
    >
      <div className="p-8 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 hover:border-violet-500 dark:hover:border-violet-500 transition-all duration-300 hover:shadow-lg hover:shadow-violet-500/10 transform hover:-translate-y-1 will-change-transform backdrop-blur-sm">
        <div className="flex items-center gap-3 mb-4">
          {icon && <div className="flex-shrink-0">{icon}</div>}
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">
            {title}
          </h3>
        </div>
        <p className="text-slate-600 dark:text-slate-400 mb-4">
          {description}
        </p>
        <ul className="space-y-2" role="list">
          {features.map((feature, index) => (
            <li key={`${title}-feature-${index}`} className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
              <Check className="w-4 h-4 text-green-500 flex-shrink-0" aria-hidden="true" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
})