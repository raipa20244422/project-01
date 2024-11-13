'use client'

import { Trash2 } from 'lucide-react'

import { deleteGoalAction } from '@/actions/delete-actions'

import { Button } from './ui/button'

interface Props {
  id: number
}
export function ButtonDeleteGoals({ id }: Props) {
  return (
    <Button
      variant={'outline'}
      onClick={() => deleteGoalAction(id)}
    >
      <Trash2 strokeWidth={1.5} />
    </Button>
  )
}
