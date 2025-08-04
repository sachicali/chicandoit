import Navbar from '../components/Navbar'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Dashboard - Vici | Conquer Your Day',
  description: 'Your personal victory dashboard. Track tasks, get AI insights, and conquer your daily agenda with Vici\'s intelligent productivity platform.',
  robots: {
    index: false, // Private dashboard should not be indexed
    follow: false,
  },
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <Navbar />
      {children}
    </>
  )
}