'use client'

import { LogOut } from 'lucide-react'

import { SignOut } from '@/actions/remove-auth'

import { DropdownMenuItem } from './ui/dropdown-menu'

export function ButtonSignOut() {
  const handleClick = async () => {
    await SignOut()
  }
  return (
    <DropdownMenuItem
      onClick={handleClick}
      className='space-x-2'
    >
      <LogOut className='h-5 w-5 text-zinc-600' />
      <span>Sair</span>
    </DropdownMenuItem>
  )
}
