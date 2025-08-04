'use client'

import React, { useState } from 'react'
import { Play, Pause, Volume2, VolumeX } from 'lucide-react'
import { useInViewAnimation } from '../hooks/useInViewAnimation'

export function DemoSection() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(true)
  const { ref, isInView } = useInViewAnimation()

  return (
    <section 
      id="demo" 
      ref={ref as React.RefObject<HTMLElement>}
      className={`container mx-auto px-6 py-20 transition-all duration-700 ${
        isInView ? 'animate-fade-in opacity-100' : 'opacity-0'
      }`}
      aria-labelledby="demo-heading"
    >
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h2 id="demo-heading" className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-6">
            See ChiCanDoIt in Action
          </h2>
          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Watch how our AI-powered daily agenda tracker transforms chaotic task lists 
            into organized, actionable plans that actually get completed.
          </p>
        </div>

        <div className="relative max-w-4xl mx-auto">
          {/* Video placeholder with overlay */}
          <div className="relative aspect-video bg-gradient-to-br from-violet-100 to-purple-100 dark:from-violet-900/20 dark:to-purple-900/20 rounded-2xl overflow-hidden shadow-2xl">
            
            {/* Mockup content */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center space-y-4">
                <div className="w-24 h-24 mx-auto bg-gradient-to-br from-violet-500 to-purple-600 rounded-2xl flex items-center justify-center">
                  <Play className="w-12 h-12 text-white ml-1" />
                </div>
                <p className="text-slate-600 dark:text-slate-400 font-medium">
                  Interactive Demo Coming Soon
                </p>
                <p className="text-sm text-slate-500 dark:text-slate-500">
                  Experience the full ChiCanDoIt workflow
                </p>
              </div>
            </div>

            {/* Play button overlay */}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300 bg-black/20">
              <button
                className="flex items-center justify-center w-20 h-20 bg-white/90 hover:bg-white rounded-full shadow-xl transition-all duration-300 hover:scale-110"
                onClick={() => setIsPlaying(!isPlaying)}
                aria-label={isPlaying ? 'Pause demo video' : 'Play demo video'}
              >
                {isPlaying ? (
                  <Pause className="w-8 h-8 text-slate-800" />
                ) : (
                  <Play className="w-8 h-8 text-slate-800 ml-1" />
                )}
              </button>
            </div>

            {/* Video controls */}
            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button
                  className="flex items-center justify-center w-10 h-10 bg-black/50 hover:bg-black/70 text-white rounded-full transition-colors duration-200"
                  onClick={() => setIsPlaying(!isPlaying)}
                  aria-label={isPlaying ? 'Pause' : 'Play'}
                >
                  {isPlaying ? (
                    <Pause className="w-4 h-4" />
                  ) : (
                    <Play className="w-4 h-4 ml-0.5" />
                  )}
                </button>
                <button
                  className="flex items-center justify-center w-10 h-10 bg-black/50 hover:bg-black/70 text-white rounded-full transition-colors duration-200"
                  onClick={() => setIsMuted(!isMuted)}
                  aria-label={isMuted ? 'Unmute' : 'Mute'}
                >
                  {isMuted ? (
                    <VolumeX className="w-4 h-4" />
                  ) : (
                    <Volume2 className="w-4 h-4" />
                  )}
                </button>
              </div>
              
              <div className="text-white text-sm bg-black/50 px-3 py-1 rounded-full">
                2:47
              </div>
            </div>
          </div>

          {/* Demo highlights */}
          <div className="grid md:grid-cols-3 gap-6 mt-12">
            {[
              {
                title: "Smart Task Entry",
                description: "See how AI understands natural language and creates structured tasks instantly"
              },
              {
                title: "Intelligent Prioritization", 
                description: "Watch the system automatically organize tasks by importance and deadlines"
              },
              {
                title: "Real-time Insights",
                description: "Experience how AI provides actionable feedback on your productivity patterns"
              }
            ].map((highlight, index) => (
              <div key={index} className="text-center p-6 rounded-xl bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm">
                <h3 className="font-bold text-slate-900 dark:text-white mb-2">
                  {highlight.title}
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  {highlight.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA below demo */}
        <div className="text-center mt-12">
          <a
            href="/dashboard"
            className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white font-bold rounded-xl transition-all duration-300 hover:scale-105 shadow-lg"
          >
            Try It Yourself - It's Free
          </a>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-3">
            No signup required • Works immediately • Privacy-focused
          </p>
        </div>
      </div>
    </section>
  )
}