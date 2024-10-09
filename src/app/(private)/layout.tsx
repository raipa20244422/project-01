import type { Metadata } from 'next'

import { Sidebar } from '@/components/navbar'
import { SideBar } from '@/components/side-bar'

export const metadata: Metadata = {
  title: 'Nome da empresa',
}

export default async function PrivateLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <main className='flex h-screen w-full flex-col overflow-hidden'>
      <Sidebar />
      <div className='flex flex-grow overflow-auto'>
        <SideBar />
        <div className='flex flex-grow overflow-auto'>{children}</div>
      </div>
    </main>
  )
}
