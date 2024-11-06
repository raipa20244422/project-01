'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { ReactNode, useEffect, useState, useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import {
  createChannelAction,
  getChannelById,
  updateChannelAction,
} from '@/actions/channel-actions'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

import { MessageError } from './message-erro'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'

const channelSchema = z.object({
  name: z.string().min(1, 'O nome do canal é obrigatório'),
})

export type ChannelFormData = z.infer<typeof channelSchema>

interface FormChannelProps {
  create: boolean
  id?: number
  children: ReactNode
}

export function FormChannel({ create, id, children }: FormChannelProps) {
  const [isPending, startTransition] = useTransition()
  const [isOpen, setOpen] = useState(false)
  const [channelData, setChannelData] = useState<ChannelFormData | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<ChannelFormData>({
    resolver: zodResolver(channelSchema),
    defaultValues: channelData || {
      name: '',
    },
  })

  useEffect(() => {
    if (id && isOpen) {
      startTransition(async () => {
        const response = await getChannelById(id)
        if (response.success && response.channel) {
          const { name } = response.channel
          setChannelData({
            name,
          })
          reset({ name })
        }
      })
    }
  }, [id, isOpen, reset])

  const onSubmit = async (data: ChannelFormData) => {
    startTransition(async () => {
      if (create) {
        await createChannelAction(data)
      } else if (id) {
        await updateChannelAction(id, data)
      }
      setOpen(false)
      reset()
    })
  }

  return (
    <Dialog
      onOpenChange={setOpen}
      open={isOpen}
    >
      <DialogTrigger asChild>{children}</DialogTrigger>
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
            <div className='flex flex-col items-center space-x-2 space-y-1'>
              <Label
                htmlFor='name'
                className='ml-2 self-start'
              >
                Nome do Canal
              </Label>
              <Input
                id='name'
                className='col-span-3'
                {...register('name')}
                defaultValue={channelData?.name || ''}
                placeholder='Digite o nome do canal'
              />
              {errors.name && (
                <MessageError>{errors.name.message}</MessageError>
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
