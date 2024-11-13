'use client'

import { Trash2 } from 'lucide-react'

import { deleteCollaboratorAction } from '@/actions/delete-actions'

import { Button } from './ui/button'

interface Props {
  id: number
}
export function ButtonDeleteCollaborator({ id }: Props) {
  return (
    <Button
      variant={'outline'}
      onClick={() => deleteCollaboratorAction(id)}
    >
      <Trash2 strokeWidth={1.5} />
    </Button>
  )
}
