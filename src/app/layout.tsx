import './globals.css'

import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

import { Toaster } from '@/components/ui/toaster'
import { Providers } from '@/provide'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Nome da empresa',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang='pt-br'
      suppressHydrationWarning
    >
      <Providers>
        <body className={`${inter.className} flex h-screen`}>
          {children}
          <Toaster />
        </body>
      </Providers>
    </html>
  )
}
