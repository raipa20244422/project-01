'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useState, useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { createChannelAction } from '@/actions/create-channel-action'
import { updateChannelAction } from '@/actions/update-channel-action'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'

// Definindo o schema de validação com Zod
const channelSchema = z.object({
  name: z.string().min(1, 'O nome é obrigatório'),
})

type ChannelFormData = z.infer<typeof channelSchema>

interface FormChannelProps {
  create: boolean
  id?: number
}

export function FormChannel({ create, id }: FormChannelProps) {
  const [isPending, startTransition] = useTransition()
  const [isOpen, setOpen] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ChannelFormData>({
    resolver: zodResolver(channelSchema),
  })

  const onSubmit = async (data: ChannelFormData) => {
    if (create) {
      startTransition(async () => {
        const response = await createChannelAction(data)
        setOpen(false)
        reset()
      })
    } else if (id) {
      startTransition(async () => {
        const response = await updateChannelAction(id, data)
        setOpen(false)
        reset()
      })
    }
  }

  return (
    <Dialog
      onOpenChange={setOpen}
      open={isOpen}
    >
      <DialogTrigger asChild>
        <Button
          type='button'
          className='text-white'
        >
          {create ? 'Adicionar Canal' : `Editar Canal ${id}`}
        </Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>
            {create ? 'Adicionar Novo Canal' : `Editar Canal ${id}`}
          </DialogTitle>
          <DialogDescription>
            {create
              ? 'Preencha as informações do novo canal. Clique em salvar para adicionar.'
              : 'Edite as informações do canal. Clique em salvar para atualizar.'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className='grid gap-4 py-4'>
            <div className='grid grid-cols-4 items-center gap-4'>
              <Label
                htmlFor='name'
                className='text-right'
              >
                Nome
              </Label>
              <Input
                id='name'
                className='col-span-3'
                {...register('name')}
              />
              {errors.name && (
                <span className='col-span-4 text-red-500'>
                  {errors.name?.message}
                </span>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button
              type='submit'
              disabled={isPending}
            >
              {isPending
                ? 'Salvando...'
                : create
                  ? 'Salvar Canal'
                  : 'Atualizar Canal'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
