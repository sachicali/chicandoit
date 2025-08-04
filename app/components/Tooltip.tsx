'use client'

import React, { useState } from 'react'
import { HelpCircle } from 'lucide-react'

interface TooltipProps {
  content: string
  children?: React.ReactNode
  position?: 'top' | 'bottom' | 'left' | 'right'
  className?: string
}

export function Tooltip({ content, children, position = 'top', className = '' }: TooltipProps) {
  const [visible, setVisible] = useState(false)

  const positionClasses = {
    top: 'bottom-full left-1/2 transform -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 transform -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 transform -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 transform -translate-y-1/2 ml-2'
  }

  return (
    <div 
      className={`relative inline-block ${className}`}
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
    >
      {children || (
        <HelpCircle className="w-4 h-4 text-gray-400 hover:text-violet-600 transition-colors cursor-help" />
      )}
      
      {visible && (
        <div className={`absolute z-50 ${positionClasses[position]} pointer-events-none`}>
          <div className="bg-slate-900 text-white px-3 py-2 rounded-lg text-sm max-w-xs shadow-lg">
            {content}
            {/* Arrow */}
            <div className={`absolute w-2 h-2 bg-slate-900 transform rotate-45 ${
              position === 'top' ? 'top-full left-1/2 -translate-x-1/2 -mt-1' :
              position === 'bottom' ? 'bottom-full left-1/2 -translate-x-1/2 -mb-1' :
              position === 'left' ? 'left-full top-1/2 -translate-y-1/2 -ml-1' :
              'right-full top-1/2 -translate-y-1/2 -mr-1'
            }`} />
          </div>
        </div>
      )}
    </div>
  )
}

// Vici-specific helpful tooltips
export const tooltips = {
  priority: "High = do now, Medium = pretty important, Low = whenever",
  timeEstimate: "Be honest! This helps you plan better and builds better habits",
  category: "Just for organizing. Pick whatever makes sense to you",
  victoryCheck: "Get a quick pep talk about how you're doing today",
  insights: "I'll spot patterns in your work and give you tips to improve",
  timeToVictory: "How much time you need to finish everything on your list"
}
