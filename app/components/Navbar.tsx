'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X, Home, LayoutDashboard, Settings, User, LogOut } from 'lucide-react'
import Logo from './Logo'

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const pathname = usePathname()

  const navigation = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  ]

  const isActive = (path: string) => pathname === path

  return (
    <nav className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm shadow-sm border-b border-slate-200 dark:border-slate-700">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            {/* Logo */}
            <Link href="/" className="flex items-center">
              <Logo size="sm" />
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:ml-10 md:flex md:space-x-8">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`inline-flex items-center px-1 pt-1 text-sm font-medium transition-all duration-200 ${
                    isActive(item.href)
                      ? 'text-violet-600 dark:text-violet-400 border-b-2 border-violet-600 dark:border-violet-400'
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 hover:translate-y-[-1px]'
                  }`}
                >
                  <item.icon className="w-4 h-4 mr-2" />
                  {item.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Right side */}
          <div className="flex items-center">
            <div className="hidden md:flex md:items-center md:space-x-4">
              <button className="p-2 text-slate-500 dark:text-slate-400 hover:text-violet-600 dark:hover:text-violet-400 rounded-lg hover:bg-violet-50 dark:hover:bg-violet-900/20 transition-all duration-200">
                <Settings className="w-5 h-5" />
              </button>
              <div className="relative">
                <button className="flex items-center p-2 text-slate-500 dark:text-slate-400 hover:text-violet-600 dark:hover:text-violet-400 rounded-lg hover:bg-violet-50 dark:hover:bg-violet-900/20 transition-all duration-200">
                  <User className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-md text-slate-500 dark:text-slate-400 hover:text-violet-600 dark:hover:text-violet-400 hover:bg-violet-50 dark:hover:bg-violet-900/20 transition-all duration-200"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm border-t border-slate-200 dark:border-slate-700">
          <div className="pt-2 pb-3 space-y-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setIsMenuOpen(false)}
                className={`block pl-3 pr-4 py-2 text-base font-medium transition-colors ${
                  isActive(item.href)
                    ? 'text-violet-600 dark:text-violet-400 bg-violet-50 dark:bg-violet-900/20 border-l-4 border-violet-600 dark:border-violet-400'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700'
                }`}
              >
                <div className="flex items-center">
                  <item.icon className="w-5 h-5 mr-3" />
                  {item.name}
                </div>
              </Link>
            ))}
          </div>
          <div className="pt-4 pb-3 border-t border-slate-200 dark:border-slate-700">
            <div className="space-y-1">
              <button className="block w-full text-left pl-3 pr-4 py-2 text-base font-medium text-slate-500 dark:text-slate-400 hover:text-violet-600 dark:hover:text-violet-400 hover:bg-violet-50 dark:hover:bg-violet-900/20 transition-all duration-200">
                <div className="flex items-center">
                  <Settings className="w-5 h-5 mr-3" />
                  Settings
                </div>
              </button>
              <button className="block w-full text-left pl-3 pr-4 py-2 text-base font-medium text-slate-500 dark:text-slate-400 hover:text-violet-600 dark:hover:text-violet-400 hover:bg-violet-50 dark:hover:bg-violet-900/20 transition-all duration-200">
                <div className="flex items-center">
                  <User className="w-5 h-5 mr-3" />
                  Profile
                </div>
              </button>
              <button className="block w-full text-left pl-3 pr-4 py-2 text-base font-medium text-slate-500 dark:text-slate-400 hover:text-violet-600 dark:hover:text-violet-400 hover:bg-violet-50 dark:hover:bg-violet-900/20 transition-all duration-200">
                <div className="flex items-center">
                  <LogOut className="w-5 h-5 mr-3" />
                  Sign Out
                </div>
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}