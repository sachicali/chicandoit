import React from 'react'
import Link from 'next/link'
import { ArrowRight, Brain, Zap, BarChart3, Bell, Shield, Smartphone } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Features - ChiCanDoIt | AI-Powered Task Management & Productivity Tools',
  description: 'Discover ChiCanDoIt\'s powerful features: AI task insights, smart notifications, productivity analytics, cross-platform sync, and more. Transform how you manage your daily agenda.',
  keywords: [
    'AI task management features', 'smart notifications', 'productivity analytics', 
    'task insights', 'cross-platform sync', 'habit tracking', 'time management tools',
    'intelligent reminders', 'task automation', 'productivity metrics'
  ],
  openGraph: {
    title: 'ChiCanDoIt Features - AI-Powered Productivity Tools',
    description: 'Explore intelligent task management, smart notifications, and analytics that transform your productivity.',
    type: 'website',
  },
}

const features = [
  {
    icon: Brain,
    title: 'AI-Powered Task Insights',
    description: 'Get intelligent recommendations and pattern analysis to optimize your productivity.',
    features: [
      'Smart task prioritization based on deadlines and importance',
      'Productivity pattern recognition and insights',
      'Intelligent time estimation for better planning',
      'Personalized recommendations for task scheduling'
    ]
  },
  {
    icon: Zap,
    title: 'Smart Accountability System',
    description: 'Stay on track with intelligent notifications and gentle reminders that actually work.',
    features: [
      'Context-aware notifications that don\'t interrupt deep work',
      'Adaptive reminder timing based on your behavior patterns',
      'Achievement celebrations to maintain motivation',
      'Progress check-ins at optimal moments'
    ]
  },
  {
    icon: BarChart3,
    title: 'Comprehensive Analytics',
    description: 'Understand your productivity with detailed insights and actionable metrics.',
    features: [
      'Daily, weekly, and monthly productivity reports',
      'Task completion rate tracking and trends',
      'Time allocation analysis across categories',
      'Goal achievement metrics and progress visualization'
    ]
  },
  {
    icon: Bell,
    title: 'Intelligent Notifications',
    description: 'Get notified at the right time with context-aware alerts and reminders.',
    features: [
      'Smart notification scheduling based on your calendar',
      'Focus-mode integration to minimize distractions',
      'Customizable notification preferences',
      'Cross-device synchronization of alerts'
    ]
  },
  {
    icon: Smartphone,
    title: 'Cross-Platform Sync',
    description: 'Access your tasks and insights seamlessly across all your devices.',
    features: [
      'Real-time synchronization across desktop and mobile',
      'Offline mode with automatic sync when connected',
      'Cloud backup and data security',
      'Native performance on all platforms'
    ]
  },
  {
    icon: Shield,
    title: 'Privacy & Security',
    description: 'Your data stays private with enterprise-grade security and local-first architecture.',
    features: [
      'End-to-end encryption for all data',
      'Local-first data storage with optional cloud sync',
      'No tracking or data mining of personal information',
      'GDPR compliant data handling'
    ]
  }
]

export default function FeaturesPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-900">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-b from-violet-50/50 to-white dark:from-violet-950/20 dark:to-slate-900">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-black text-slate-900 dark:text-white mb-6">
              Powerful Features for
              <span className="block bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
                Maximum Productivity
              </span>
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-400 mb-8 max-w-2xl mx-auto">
              Discover how ChiCanDoIt's AI-powered features transform your daily agenda 
              management with intelligent insights and seamless accountability.
            </p>
            <Link 
              href="/dashboard"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white rounded-xl font-bold text-lg transition-all duration-200 transform hover:scale-105"
            >
              Start Your Journey
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center text-slate-900 dark:text-white mb-16">
              Everything You Need to Succeed
            </h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <article key={index} className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 hover:shadow-lg transition-all duration-200">
                  <div className="w-12 h-12 bg-violet-100 dark:bg-violet-900/30 rounded-lg flex items-center justify-center mb-4">
                    <feature.icon className="w-6 h-6 text-violet-600 dark:text-violet-400" />
                  </div>
                  
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
                    {feature.title}
                  </h3>
                  
                  <p className="text-slate-600 dark:text-slate-400 mb-4">
                    {feature.description}
                  </p>
                  
                  <ul className="space-y-2">
                    {feature.features.map((item, itemIndex) => (
                      <li key={itemIndex} className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-400">
                        <div className="w-1.5 h-1.5 bg-violet-600 rounded-full mt-2 flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-violet-600 to-purple-600">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center text-white">
            <h2 className="text-4xl font-bold mb-6">
              Ready to Transform Your Productivity?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Join thousands of professionals who have already revolutionized 
              their daily agenda management with ChiCanDoIt.
            </p>
            <Link 
              href="/dashboard"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-violet-600 rounded-xl font-bold text-lg hover:bg-slate-50 transition-all duration-200 transform hover:scale-105"
            >
              Get Started Free
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}