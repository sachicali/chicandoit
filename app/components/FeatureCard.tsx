'use client'

import React from 'react'
import { Check } from 'lucide-react'
import { useInViewAnimation } from '../hooks/useInViewAnimation'

interface FeatureCardProps {
  title: string
  description: string
  features: string[]
  delay?: number
}

export function FeatureCard({ title, description, features, delay = 0 }: FeatureCardProps) {
  const { ref, isInView } = useInViewAnimation()
  
  return (
    <div 
      ref={ref as React.RefObject<HTMLDivElement>}
      className={`group transition-all duration-700 ${
        isInView ? 'animate-slide-up opacity-100' : 'opacity-0 translate-y-8'
      }`}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="p-8 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-violet-500 dark:hover:border-violet-500 transition-all duration-300 hover:shadow-lg hover:shadow-violet-500/10 transform hover:-translate-y-1">
        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
          {title}
        </h3>
        <p className="text-slate-600 dark:text-slate-400 mb-4">
          {description}
        </p>
        <ul className="space-y-2" role="list">
          {features.map((feature, index) => (
            <li key={index} className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
              <Check className="w-4 h-4 text-green-500 flex-shrink-0" aria-hidden="true" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}