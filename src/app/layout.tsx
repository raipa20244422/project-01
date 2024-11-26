import './globals.css'

import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import localFont from 'next/font/local'

import { Toaster } from '@/components/ui/toaster'

const inter = Inter({ subsets: ['latin'] })

const fontNome1 = localFont({
  src: [
    {
      path: './fontfont.ttf',
      weight: '700',
      style: 'normal',
    },
  ],
  variable: '--font-name',
})

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
      <body
        className={`${inter.className} ${fontNome1.variable} flex h-screen`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  )
}
