'use client'

import { Trash2 } from 'lucide-react'

import { deleteSaleAction } from '@/actions/delete-actions'

import { Button } from './ui/button'

interface Props {
  id: number
}
export function ButtonDeleteSales({ id }: Props) {
  return (
    <Button
      variant={'outline'}
      onClick={() => deleteSaleAction(id)}
    >
      <Trash2 strokeWidth={1.5} />
    </Button>
  )
}
