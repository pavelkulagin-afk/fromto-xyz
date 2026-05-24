import './globals.css'
import { Inter } from 'next/font/google'
import { Providers } from '@/components/providers'
import { Metadata, Viewport } from 'next'

const inter = Inter({ 
  subsets: ['latin', 'cyrillic'],
  display: 'swap',
  variable: '--font-sans',
})

export const metadata: Metadata = {
  title: 'FromTo — от идеи к результату',
  description: 'Визуальные трейлы: документируйте путь от идеи до результата',
  manifest: '/manifest.json',
  appleWebApp: { capable: true, statusBarStyle: 'default' },
}

export const viewport: Viewport = {
  themeColor: '#6366F1',
  colorScheme: 'light',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased min-h-screen bg-background text-foreground`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
