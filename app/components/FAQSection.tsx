'use client'

import React, { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { useInViewAnimation } from '../hooks/useInViewAnimation'

interface FAQItem {
  question: string
  answer: string
}

const faqs: FAQItem[] = [
  {
    question: "How does ChiCanDoIt's AI actually help with task management?",
    answer: "Our AI analyzes your task completion patterns, time estimates, and productivity trends to provide intelligent insights. It learns when you're most productive, identifies procrastination patterns, and suggests optimal task scheduling. Unlike generic reminders, our AI provides personalized recommendations based on your actual behavior."
  },
  {
    question: "Is my data private and secure?",
    answer: "Absolutely. ChiCanDoIt is designed with privacy-first principles. All your data is stored locally on your device and never sent to external servers. The AI processing happens locally, ensuring your personal information and task details remain completely private."
  },
  {
    question: "What makes ChiCanDoIt different from other productivity apps?",
    answer: "ChiCanDoIt focuses on accountability through AI insights rather than complex workflows. Most apps add more steps to your process; we simplify it. Our native desktop performance means instant startup and low resource usage, while our intelligent notifications actually help rather than distract."
  },
  {
    question: "Can I use ChiCanDoIt offline?",
    answer: "Yes! ChiCanDoIt is built as a native desktop application that works completely offline. Your tasks, insights, and all functionality remain available without an internet connection. This also ensures your data never leaves your device."
  },
  {
    question: "How much does ChiCanDoIt cost?",
    answer: "ChiCanDoIt is currently free to download and use. We believe productivity tools should be accessible to everyone. We're focused on building the best possible experience first, and any future pricing will always include a generous free tier."
  },
  {
    question: "What platforms does ChiCanDoIt support?",
    answer: "ChiCanDoIt runs natively on Windows, macOS, and Linux. Built with Tauri, it provides true native performance on all platforms while maintaining a consistent, beautiful interface."
  },
  {
    question: "How quickly can I get started?",
    answer: "You can be up and running in under 30 seconds. Download the app, open it, and start adding tasks immediately. No account creation, no complex setup, no learning curve. The AI begins providing insights after just a few days of use."
  },
  {
    question: "Can I export my data?",
    answer: "Yes, you have complete control over your data. ChiCanDoIt allows you to export all your tasks, insights, and analytics in standard formats (JSON, CSV) at any time. Your data is never locked in."
  }
]

export function FAQSection() {
  const [openItems, setOpenItems] = useState<number[]>([])
  const { ref, isInView } = useInViewAnimation()

  const toggleItem = (index: number) => {
    setOpenItems(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    )
  }

  return (
    <section 
      ref={ref as React.RefObject<HTMLElement>}
      className={`container mx-auto px-6 py-20 transition-all duration-700 ${
        isInView ? 'animate-fade-in opacity-100' : 'opacity-0'
      }`}
      aria-labelledby="faq-heading"
    >
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h2 id="faq-heading" className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-6">
            Frequently Asked Questions
          </h2>
          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Everything you need to know about ChiCanDoIt and how it can transform your productivity.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div 
              key={index}
              className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden"
            >
              <button
                className="w-full px-6 py-5 text-left flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors duration-200"
                onClick={() => toggleItem(index)}
                aria-expanded={openItems.includes(index)}
                aria-controls={`faq-answer-${index}`}
              >
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white pr-4">
                  {faq.question}
                </h3>
                <div className="flex-shrink-0">
                  {openItems.includes(index) ? (
                    <ChevronUp className="w-5 h-5 text-violet-600 dark:text-violet-400" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-slate-500 dark:text-slate-400" />
                  )}
                </div>
              </button>
              
              {openItems.includes(index) && (
                <div 
                  id={`faq-answer-${index}`}
                  className="px-6 pb-5 border-t border-slate-100 dark:border-slate-700/50"
                >
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed pt-4">
                    {faq.answer}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Contact CTA */}
        <div className="text-center mt-12 p-8 bg-gradient-to-r from-violet-50 to-purple-50 dark:from-violet-900/20 dark:to-purple-900/20 rounded-2xl">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
            Still have questions?
          </h3>
          <p className="text-slate-600 dark:text-slate-400 mb-6">
            We're here to help you get the most out of ChiCanDoIt.
          </p>
          <a
            href="mailto:support@chicandoit.app"
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white font-medium rounded-lg transition-all duration-200 hover:scale-105"
          >
            Contact Support
          </a>
        </div>
      </div>
    </section>
  )
}