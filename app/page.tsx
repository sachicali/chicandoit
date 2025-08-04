import React from 'react'
import Link from 'next/link'
import { ArrowRight, Check, Github, Twitter, Sparkles, Trophy, Zap } from 'lucide-react'
import Logo from './components/Logo'
import { FeatureCard } from './components/FeatureCard'

// Move metadata to layout.tsx for better SEO
// This page is now a server component by default

const features = [
  {
    title: "Tasks that respect your time",
    description: "Add a task. Set priority. Crush it. Move on. No 17-step workflows or \"methodologies\" that take longer than the actual work.",
    features: ["Quick add with ⌘+N", "Time tracking that works", "Categories that make sense"]
  },
  {
    title: "AI that kicks your ass (nicely)",
    description: "Not another \"AI-powered\" gimmick. Get real insights about your patterns and gentle reminders when you're procrastinating. Again.",
    features: ["Pattern recognition", "Accountability check-ins", "No creepy tracking"]
  },
  {
    title: "Lightning fast, not bloated",
    description: "Built with Tauri because Electron is for quitters. Starts instantly, uses 10x less memory. Your laptop battery will thank you.",
    features: ["Native performance", "Works offline", "Your data, your device"]
  },
  {
    title: "Stats for champions",
    description: "See your win rate, time estimates vs reality, and when you're crushing it. No participation trophies or feel-good metrics.",
    features: ["Real productivity metrics", "Automatic time tracking", "Weekly victory reports"]
  }
]

export default function LandingPage() {
  return (
    <>
      {/* Skip to main content link for accessibility */}
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-violet-600 text-white px-4 py-2 rounded-lg z-50">
        Skip to main content
      </a>
      
      <div className="min-h-screen bg-white dark:bg-slate-900 grain-texture">
        {/* Hero Section */}
        <header role="banner" className="relative container mx-auto px-6 pt-32 pb-20">
          {/* Subtle background gradient */}
          <div className="absolute inset-0 bg-gradient-to-b from-violet-50/50 via-transparent to-transparent dark:from-violet-950/20 dark:via-transparent" aria-hidden="true" />
          
          <div className="relative max-w-5xl mx-auto z-10">
            <div className="mb-8 animate-fade-in">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20 rounded-full text-amber-700 dark:text-amber-400 text-sm font-medium backdrop-blur-sm">
                <span className="relative flex h-2 w-2" aria-hidden="true">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                </span>
                Veni, vidi, vici - I came, I saw, I conquered
              </div>
            </div>
            
            <div className="flex justify-center mb-8 animate-fade-in-delay-1">
              <Logo size="lg" showText={false} />
            </div>
            
            <h1 className="text-6xl md:text-7xl font-black text-slate-900 dark:text-white mb-6 tracking-tight animate-fade-in-delay-2">
              Stop talking about it.
              <br />
              <span className="bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
                Start conquering it.
              </span>
            </h1>
            
            <p className="text-xl text-slate-600 dark:text-slate-400 mb-12 max-w-2xl leading-relaxed animate-fade-in-delay-3">
              Vici is a no-BS task tracker that actually keeps you accountable. 
              Named after Julius Caesar's famous "I came, I saw, I conquered" - 
              because that's exactly what you'll do with your to-do list.
            </p>
            
            <nav className="flex flex-col sm:flex-row gap-4 mb-16 animate-fade-in-delay-4" aria-label="Primary actions">
              <Link 
                href="/dashboard" 
                className="group inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white bg-gradient-to-r from-violet-600 to-purple-600 rounded-xl hover:from-violet-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 shadow-xl"
                aria-label="Start using Vici"
              >
                Claim your victory
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
              </Link>
              <a 
                href="https://github.com" 
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center justify-center px-8 py-4 text-lg font-medium text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-all duration-200 hover:scale-105"
                aria-label="View Vici on GitHub"
              >
                <Github className="mr-2 w-5 h-5" aria-hidden="true" />
                Star on GitHub
                <Sparkles className="ml-1 w-4 h-4 text-yellow-500 opacity-0 group-hover:opacity-100 transition-opacity" aria-hidden="true" />
              </a>
            </nav>

            {/* Social Proof */}
            <div className="flex items-center gap-8 text-sm text-slate-500 dark:text-slate-400 animate-fade-in-delay-5">
              <div className="flex -space-x-2" aria-label="User avatars">
                {[1,2,3,4,5].map((i) => (
                  <div key={i} className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-400 to-purple-600 border-2 border-white dark:border-slate-900 animate-bounce-in" style={{animationDelay: `${i * 100}ms`}} aria-hidden="true" />
                ))}
              </div>
              <span>Join 1,337 daily conquerors</span>
            </div>
          </div>
        </header>

        {/* Main content */}
        <main id="main-content" role="main">
          {/* Features Grid */}
          <section className="container mx-auto px-6 py-20" aria-labelledby="features-heading">
            <div className="max-w-5xl mx-auto">
              <h2 id="features-heading" className="text-3xl font-bold text-slate-900 dark:text-white mb-16 animate-fade-in">
                Built for winners. Not wishers.
              </h2>
              
              <div className="grid md:grid-cols-2 gap-8">
                {features.map((feature, index) => (
                  <FeatureCard
                    key={index}
                    title={feature.title}
                    description={feature.description}
                    features={feature.features}
                    delay={(index + 1) * 100}
                  />
                ))}
              </div>
            </div>
          </section>

          {/* Testimonial */}
          <section className="container mx-auto px-6 py-20" aria-labelledby="testimonial-heading">
            <h2 id="testimonial-heading" className="sr-only">User testimonial</h2>
            <div className="max-w-3xl mx-auto animate-fade-in">
              <blockquote className="bg-gradient-to-br from-violet-50 to-purple-50 dark:from-violet-900/20 dark:to-purple-900/20 rounded-2xl p-8 md:p-12 backdrop-blur-sm">
                <Trophy className="w-12 h-12 text-amber-500 mb-6" aria-hidden="true" />
                <p className="text-2xl font-medium text-slate-900 dark:text-white mb-6 leading-relaxed">
                  "Other apps promise productivity. Vici delivers victory. 
                  I've conquered more tasks in a week than I did in a month with those other apps."
                </p>
                <footer className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-400 to-pink-600" aria-hidden="true" />
                  <div>
                    <cite className="font-bold text-slate-900 dark:text-white not-italic">Marcus A.</cite>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Daily conqueror since day 1</p>
                  </div>
                </footer>
              </blockquote>
            </div>
          </section>

          {/* CTA Section */}
          <section className="relative py-32 overflow-hidden" aria-labelledby="cta-heading">
            {/* Subtle background pattern */}
            <div className="absolute inset-0" aria-hidden="true">
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-violet-50/30 to-transparent dark:via-violet-950/10" />
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px]">
                <div className="absolute inset-0 bg-violet-200/20 dark:bg-violet-800/10 rounded-full blur-3xl animate-pulse" />
              </div>
            </div>
            
            <div className="relative container mx-auto px-6">
              <div className="max-w-3xl mx-auto">
                {/* Simple, bold CTA */}
                <div className="text-center space-y-8">
                  <div className="inline-block animate-bounce-in">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-violet-100 dark:bg-violet-900/30 rounded-full text-violet-700 dark:text-violet-400 text-sm font-medium mb-6">
                      <Zap className="w-4 h-4" aria-hidden="true" />
                      <span>Ready when you are</span>
                    </div>
                  </div>
                  
                  <h2 id="cta-heading" className="text-5xl md:text-7xl font-black text-slate-900 dark:text-white leading-tight animate-fade-in">
                    Alright, let's do this.
                  </h2>
                  
                  <p className="text-2xl text-slate-600 dark:text-slate-400 max-w-xl mx-auto animate-fade-in-delay-1">
                    You've read this far. That's already more effort than most people put in. 
                    Now finish what you started.
                  </p>
                  
                  <div className="pt-8 space-y-6 animate-fade-in-delay-2">
                    <div>
                      <Link 
                        href="/dashboard" 
                        className="group relative inline-flex items-center gap-3 px-10 py-5 text-xl font-bold transition-all duration-300"
                        aria-label="Get started with Vici"
                      >
                        {/* Background effect */}
                        <div className="absolute inset-0 bg-gradient-to-r from-violet-600 to-purple-600 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl" aria-hidden="true" />
                        
                        {/* Button */}
                        <div className="relative flex items-center gap-3 px-10 py-5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl group-hover:scale-105 transition-transform duration-300">
                          <span>Get Vici</span>
                          <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" aria-hidden="true" />
                        </div>
                      </Link>
                    </div>
                    
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      Takes 30 seconds. No BS. No credit card.
                    </p>
                    
                    {/* Trust signals */}
                    <div className="flex items-center justify-center gap-8 pt-4">
                      <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                        <div className="flex -space-x-2" aria-label="User avatars">
                          {[1,2,3].map((i) => (
                            <div key={i} className="w-6 h-6 rounded-full bg-gradient-to-br from-violet-400 to-purple-600 border-2 border-white dark:border-slate-900" aria-hidden="true" />
                          ))}
                        </div>
                        <span>1,337 winners</span>
                      </div>
                      <div className="text-sm text-slate-600 dark:text-slate-400">
                        ⚡ Instant access
                      </div>
                      <div className="text-sm text-slate-600 dark:text-slate-400">
                        🏆 Actually works
                      </div>
                    </div>
                  </div>
                  
                  {/* Quirky testimonial */}
                  <div className="mt-20 pt-16 border-t border-slate-200 dark:border-slate-800 animate-fade-in-delay-3">
                    <div className="relative">
                      <div className="absolute -top-8 left-1/2 -translate-x-1/2">
                        <div className="px-4 py-2 bg-amber-100 dark:bg-amber-900/30 rounded-full text-amber-700 dark:text-amber-400 text-xs font-medium">
                          Real human review
                        </div>
                      </div>
                      
                      <blockquote className="text-xl text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                        "I was skeptical. Another task app? But then I actually used it for a week 
                        and got more done than I did in the previous month. Now I'm insufferable 
                        at parties talking about my 'productivity system'."
                      </blockquote>
                      <cite className="block mt-4 text-sm text-slate-500 dark:text-slate-500 not-italic">
                        — Sarah K., reformed procrastinator
                      </cite>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </main>

        {/* Footer */}
        <footer className="relative overflow-hidden" role="contentinfo">
          {/* Background decoration */}
          <div className="absolute inset-0 bg-gradient-to-br from-violet-50 to-purple-50 dark:from-violet-950/20 dark:to-purple-950/20 opacity-50" aria-hidden="true" />
          
          <div className="relative container mx-auto px-6 py-16">
            <div className="max-w-5xl mx-auto">
              <div className="grid md:grid-cols-3 gap-12 mb-12">
                {/* Brand */}
                <div>
                  <Logo size="md" />
                  <p className="mt-4 text-sm text-slate-600 dark:text-slate-400">
                    The productivity app for people who actually want to get stuff done.
                    No fluff. Just victory.
                  </p>
                  <nav className="flex gap-4 mt-6" aria-label="Social media">
                    <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" 
                       className="text-slate-600 dark:text-slate-400 hover:text-violet-600 dark:hover:text-violet-400 transition-colors"
                       aria-label="Follow Vici on Twitter">
                      <Twitter className="w-5 h-5" />
                    </a>
                    <a href="https://github.com" target="_blank" rel="noopener noreferrer"
                       className="text-slate-600 dark:text-slate-400 hover:text-violet-600 dark:hover:text-violet-400 transition-colors"
                       aria-label="View Vici on GitHub">
                      <Github className="w-5 h-5" />
                    </a>
                  </nav>
                </div>
                
                {/* Quick Links */}
                <nav aria-label="Footer navigation">
                  <h3 className="font-bold text-slate-900 dark:text-white mb-4">Conquer</h3>
                  <ul className="space-y-2 text-sm">
                    <li>
                      <Link href="/dashboard" className="text-slate-600 dark:text-slate-400 hover:text-violet-600 dark:hover:text-violet-400 transition-colors">
                        Start winning
                      </Link>
                    </li>
                    <li>
                      <a href="#features" className="text-slate-600 dark:text-slate-400 hover:text-violet-600 dark:hover:text-violet-400 transition-colors">
                        Features
                      </a>
                    </li>
                    <li>
                      <a href="#pricing" className="text-slate-600 dark:text-slate-400 hover:text-violet-600 dark:hover:text-violet-400 transition-colors">
                        Pricing (it's free)
                      </a>
                    </li>
                    <li>
                      <a href="#stories" className="text-slate-600 dark:text-slate-400 hover:text-violet-600 dark:hover:text-violet-400 transition-colors">
                        Victory stories
                      </a>
                    </li>
                  </ul>
                </nav>
                
                {/* Company */}
                <nav aria-label="Company links">
                  <h3 className="font-bold text-slate-900 dark:text-white mb-4">Company</h3>
                  <ul className="space-y-2 text-sm">
                    <li>
                      <a href="#about" className="text-slate-600 dark:text-slate-400 hover:text-violet-600 dark:hover:text-violet-400 transition-colors">
                        About
                      </a>
                    </li>
                    <li>
                      <a href="#blog" className="text-slate-600 dark:text-slate-400 hover:text-violet-600 dark:hover:text-violet-400 transition-colors">
                        Blog
                      </a>
                    </li>
                    <li>
                      <a href="#privacy" className="text-slate-600 dark:text-slate-400 hover:text-violet-600 dark:hover:text-violet-400 transition-colors">
                        Privacy (we don't track you)
                      </a>
                    </li>
                    <li>
                      <a href="#terms" className="text-slate-600 dark:text-slate-400 hover:text-violet-600 dark:hover:text-violet-400 transition-colors">
                        Terms
                      </a>
                    </li>
                  </ul>
                </nav>
              </div>
              
              {/* Bottom */}
              <div className="pt-8 border-t border-slate-200 dark:border-slate-800">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    © 2024 Vici. Conquer your day, every day.
                  </p>
                  <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <Zap className="w-4 h-4 text-yellow-500" aria-hidden="true" />
                    <span>Built with caffeine and determination</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  )
}