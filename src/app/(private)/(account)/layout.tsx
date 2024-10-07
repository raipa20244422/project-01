import type { Metadata } from 'next'

import { NavigationCollaborator } from '@/components/navigation-account'

export const metadata: Metadata = {
  title: 'Nome da empresa',
}

export default function AccountLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <main className='flex w-full flex-col px-4'>
      <NavigationCollaborator />
      {children}
    </main>
  )
}
