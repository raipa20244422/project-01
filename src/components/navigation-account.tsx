'use client'
import clsx from 'clsx'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { cn } from '@/lib/utils'

const router = [
  {
    name: 'geral',
    label: 'geral',
    path: 'account',
  },
]

export function NavigationCollaborator() {
  const pathname = usePathname()
  const currentRoute = pathname.split('/')[1] || '/'
  return (
    <div className='flex space-x-1 py-1'>
      {router.map((current) => (
        <Link
          key={current.name}
          href={current.path}
          className={cn(
            'rounded-md p-2 text-sm capitalize text-gray-500 hover:font-medium',
            clsx({
              'text-gray-800': currentRoute === current.path,
            }),
          )}
        >
          {current.label}
        </Link>
      ))}
    </div>
  )
}
