import React from 'react'

interface LogoProps {
  size?: 'sm' | 'md' | 'lg'
  showText?: boolean
  className?: string
}

export default function Logo({ size = 'md', showText = true, className = '' }: LogoProps) {
  const sizes = {
    sm: { icon: 'w-8 h-8', text: 'text-xl' },
    md: { icon: 'w-10 h-10', text: 'text-2xl' },
    lg: { icon: 'w-16 h-16', text: 'text-4xl' }
  }

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Victory Laurel Wreath Icon */}
      <div className={`${sizes[size].icon} relative`}>
        <svg
          viewBox="0 0 40 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
        >
          {/* Gradient definitions */}
          <defs>
            <linearGradient id="violetGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#8B5CF6" />
              <stop offset="100%" stopColor="#7C3AED" />
            </linearGradient>
            <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FCD34D" />
              <stop offset="100%" stopColor="#F59E0B" />
            </linearGradient>
          </defs>
          
          {/* Left laurel branch */}
          <path
            d="M10 8 C8 10, 6 14, 6 18 C6 22, 8 26, 12 30 C14 28, 15 24, 15 20 C15 16, 14 12, 12 10 C11 9, 10.5 8.5, 10 8"
            fill="url(#violetGradient)"
            opacity="0.9"
          />
          
          {/* Right laurel branch */}
          <path
            d="M30 8 C32 10, 34 14, 34 18 C34 22, 32 26, 28 30 C26 28, 25 24, 25 20 C25 16, 26 12, 28 10 C29 9, 29.5 8.5, 30 8"
            fill="url(#violetGradient)"
            opacity="0.9"
          />
          
          {/* Center V shape */}
          <path
            d="M20 10 L14 22 L16 24 L20 16 L24 24 L26 22 L20 10"
            fill="url(#goldGradient)"
            strokeWidth="1"
            stroke="url(#goldGradient)"
          />
          
          {/* Victory star */}
          <circle cx="20" cy="28" r="2" fill="url(#goldGradient)" />
        </svg>
      </div>
      
      {showText && (
        <span className={`${sizes[size].text} font-black tracking-tight bg-gradient-to-r from-violet-600 to-violet-700 dark:from-violet-400 dark:to-violet-500 bg-clip-text text-transparent`}>
          Vici
        </span>
      )}
    </div>
  )
}