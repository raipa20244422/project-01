'use client'

import { Trash2 } from 'lucide-react'

import { deleteChannelAction } from '@/actions/delete-actions'

import { Button } from './ui/button'

interface Props {
  id: number
}
export function ButtonDeleteChannel({ id }: Props) {
  return (
    <Button
      variant={'outline'}
      onClick={() => deleteChannelAction(id)}
    >
      <Trash2 strokeWidth={1.5} />
    </Button>
  )
}
