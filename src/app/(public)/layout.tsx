import Image from 'next/image'

import Logo from '../../assets/logoo.png'
import Name from '../../assets/name.png'

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <main className='grid min-h-screen w-full grid-cols-1 md:grid-cols-[1fr_560px]'>
      <div className='m-4 flex rounded-lg bg-[#B29A76] max-md:hidden'></div>
      <div className='flex flex-col space-y-3 p-4 md:p-20'>
        <div className='flex items-center space-x-1'>
          <Image
            src={Logo}
            alt='logo'
            className='h-12 w-12'
          />
          <Image
            src={Name}
            alt='Name'
            className='h-5 w-40'
          />
        </div>
        {children}
      </div>
    </main>
  )
}
