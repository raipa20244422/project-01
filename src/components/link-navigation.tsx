'use client'

import clsx from 'clsx'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { cn } from '@/lib/utils'

type LinkProps = {
  name: string
  path: string
  label: string
  icon: JSX.Element
}

export function LinkNavigation(route: LinkProps) {
  const pathname = usePathname()
  const currentRoute = pathname.split('/')[1] || '/'
  const isActive = currentRoute === route.path

  return (
    <Link
      key={route.name}
      href={route.path}
      className={cn(
        'flex w-44 items-center space-x-1 rounded-lg p-3 text-xs hover:bg-gray-100',
        clsx({
          'bg-blue-50 hover:bg-blue-50': isActive,
        }),
      )}
    >
      <span className='flex h-4 w-4 items-center'>{route.icon}</span>
      <span className='flex items-center text-sm'>{route.label}</span>
    </Link>
  )
}
