'use client'

import React, { useState, useEffect } from 'react'
import { X, Lightbulb, ArrowRight } from 'lucide-react'

interface OnboardingTipsProps {
  onComplete?: () => void
}

const tips = [
  {
    title: "Start simple",
    content: "Add a few tasks to get going. Don't overthink it - you can always adjust later."
  },
  {
    title: "Be honest with time",
    content: "Your time estimates will get better as you go. Start with your best guess."
  },
  {
    title: "Use the victory check",
    content: "Hit 'How's it going?' when you need motivation or want to see your progress."
  },
  {
    title: "Trust the process",
    content: "Complete a few tasks and I'll start showing you patterns to help you improve."
  }
]

export function OnboardingTips({ onComplete }: OnboardingTipsProps) {
  const [currentTip, setCurrentTip] = useState(0)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Show onboarding only for first-time users
    const hasSeenOnboarding = localStorage.getItem('vici-onboarding-complete')
    if (!hasSeenOnboarding) {
      setIsVisible(true)
    }
  }, [])

  const nextTip = () => {
    if (currentTip < tips.length - 1) {
      setCurrentTip(currentTip + 1)
    } else {
      completeOnboarding()
    }
  }

  const completeOnboarding = () => {
    localStorage.setItem('vici-onboarding-complete', 'true')
    setIsVisible(false)
    onComplete?.()
  }

  if (!isVisible) return null

  const tip = tips[currentTip]
  const isLastTip = currentTip === tips.length - 1

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 max-w-md w-full shadow-2xl border border-slate-200 dark:border-slate-700">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-amber-500" />
            <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
              Tip {currentTip + 1} of {tips.length}
            </span>
          </div>
          <button
            onClick={completeOnboarding}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
          {tip.title}
        </h3>
        
        <p className="text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">
          {tip.content}
        </p>

        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            {tips.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentTip 
                    ? 'bg-violet-600' 
                    : index < currentTip 
                    ? 'bg-violet-300' 
                    : 'bg-slate-200 dark:bg-slate-600'
                }`}
              />
            ))}
          </div>

          <div className="flex gap-2">
            {currentTip > 0 && (
              <button
                onClick={() => setCurrentTip(currentTip - 1)}
                className="px-4 py-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
              >
                Back
              </button>
            )}
            
            <button
              onClick={nextTip}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white rounded-lg font-medium transition-all duration-200 transform hover:scale-105"
            >
              {isLastTip ? "Let's go!" : "Next tip"}
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// Quick tip component for contextual help
interface QuickTipProps {
  tip: string
  isVisible: boolean
  onDismiss: () => void
}

export function QuickTip({ tip, isVisible, onDismiss }: QuickTipProps) {
  if (!isVisible) return null

  return (
    <div className="fixed bottom-4 right-4 z-40 max-w-sm">
      <div className="bg-violet-600 text-white p-4 rounded-lg shadow-lg relative">
        <button
          onClick={onDismiss}
          className="absolute top-2 right-2 text-white/70 hover:text-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
        <div className="flex items-start gap-3 pr-6">
          <Lightbulb className="w-5 h-5 text-yellow-300 flex-shrink-0 mt-0.5" />
          <p className="text-sm leading-relaxed">{tip}</p>
        </div>
      </div>
    </div>
  )
}
