import Image from 'next/image'

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <main className='grid min-h-screen w-full grid-cols-1 md:grid-cols-[1fr_560px]'>
      <div className='m-4 flex rounded-lg bg-primary max-md:hidden'></div>
      <div className='flex flex-col space-y-3 p-4 md:p-20'>
        <div className='flex items-center space-x-1'>
          <Image
            src={'/marca.PNG'}
            alt='logo'
            width={1920}
            height={1080}
            className='h-[167px] w-96 object-cover object-top'
          />
        </div>
        {children}
      </div>
    </main>
  )
}
