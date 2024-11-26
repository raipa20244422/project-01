import { Bell, CircleHelp, CircleUserRound, LogOut } from 'lucide-react'
import { cookies } from 'next/headers'
import Image from 'next/image'
import Link from 'next/link'

import { getCurrentOrganization } from '@/actions/get-organization'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

import Logo from '../assets/logoo.png'
import Name from '../assets/name.png'
import { ButtonSignOut } from './button-sign-ou'

export async function Sidebar() {
  const data = await getCurrentOrganization()

  if (!data) {
    return
  }

  return (
    <nav className='flex items-center justify-between border-b px-6 py-3'>
      <div className='flex items-center space-x-1'>
        <Image
          src={'/imagee.PNG'}
          alt='name'
          width={300}
          height={300}
          className='h-8 w-8 object-cover'
          priority
        />
      </div>
      <div className='flex items-center space-x-4'>
        <Bell className='h-5 w-5 text-zinc-600' />
        <CircleHelp className='h-5 w-5 text-zinc-600' />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <CircleUserRound className='h-5 w-5 text-zinc-600' />
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end'>
            <div className='flex flex-col space-y-2 p-2'>
              <p className='line-clamp-1 max-w-48 text-sm text-zinc-500'>
                {data.organization.name}
              </p>
              <p className='line-clamp-1 max-w-48 text-xs'>
                {data.organization.email}
              </p>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Link
                href='/account'
                className='flex space-x-2'
              >
                <CircleUserRound className='h-5 w-5 text-zinc-600' />
                <span>Informações da conta</span>
              </Link>
            </DropdownMenuItem>
            <ButtonSignOut />
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
  )
}
