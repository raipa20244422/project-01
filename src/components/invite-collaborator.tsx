'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

import { createInviteCollaborator } from '@/actions/invite-collaborator'
import { toast } from '@/hooks/use-toast'
import { schema, SchemaInviteCollaborator } from '@/lib/zod/invite-collaborator'

import { Button } from './ui/button'
import { Input } from './ui/input'

interface Props {
  handleClose: () => void
}

export function InviteCollaborator({ handleClose }: Props) {
  const { register, handleSubmit } = useForm<SchemaInviteCollaborator>({
    resolver: zodResolver(schema),
  })

  const onSubmit = async (data: SchemaInviteCollaborator) => {
    const { code } = await createInviteCollaborator(data)

    if (code === 404) {
      toast({
        title: 'Colaborador não encontrado.',
        description: 'e-mail do colaborador não encontrado.',
      })
    }
    if (code === 400) {
      toast({
        title: 'Pedido já enviado.',
        description: 'Aguarde até colaborador aceitar.',
      })
    }

    if (code === 201) {
      handleClose()
      toast({
        title: 'Pedido enviado.',
        description: 'Aguarde até colaborador aceitar.',
      })
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className='flex flex-col space-y-2'
    >
      <Input
        type='email'
        {...register('email')}
        className='w-full focus-visible:ring-0'
        placeholder='E-mail do colaborador'
      />
      <Button type='submit'>Enviar convite</Button>
    </form>
  )
}
