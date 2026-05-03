import type { Metadata, Viewport } from 'next'
import './globals.css'
import BottomNav from '@/components/BottomNav'

export const metadata: Metadata = {
  title: 'Arabic Learning',
  description: 'Master Arabic using the 6 meta-learning rules',
  manifest: '/manifest.json',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,        // prevent zoom — feels native on mobile
  themeColor: '#ffffff',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="flex flex-col min-h-dvh max-w-lg mx-auto bg-white">
        {/* Each page owns its own top bar */}
        <main className="flex flex-col flex-1 overflow-hidden">
          {children}
        </main>
        <BottomNav />
      </body>
    </html>
  )
}
