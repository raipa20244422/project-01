'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { CalendarIcon } from 'lucide-react'
import { ReactNode, useMemo, useState, useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import {
  createChannelAction,
  getChannelById,
  updateChannelAction,
} from '@/actions/channel-action'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { cn } from '@/lib/utils'

import { CurrencyInput } from './currency-input'
import { MessageError } from './message-error'
import { Button } from './ui/button'
import { Calendar } from './ui/calendar'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover'

const channelSchema = z.object({
  name: z.string().min(1, 'O nome é obrigatório'),
  generateLeads: z.string().min(1, 'O nome é obrigatório'),
  channelDate: z.date({ required_error: 'A data da venda é obrigatória' }),
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
  const [date, setDate] = useState<Date>()

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
  } = useForm<ChannelFormData>({
    resolver: zodResolver(channelSchema),
    defaultValues: {},
  })

  useMemo(async () => {
    if (id && isOpen) {
      const { channel } = await getChannelById(id)
      if (channel) {
        const { channelDate, generateLeads, name } = channel

        const formattedGenerateLeads = generateLeads.toString()

        setDate(channelDate)
        reset({
          channelDate,
          generateLeads: formattedGenerateLeads,
          name,
        })
      }
    }
  }, [isOpen])

  const onSubmit = async (data: ChannelFormData) => {
    if (create) {
      startTransition(async () => {
        await createChannelAction(data)
        setOpen(false)
        reset()
      })
    } else if (id) {
      startTransition(async () => {
        await updateChannelAction(id, data)
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

            <div className='flex flex-col items-center space-x-2 space-y-1'>
              <Label
                htmlFor='generateLeads'
                className='ml-2 self-start'
              >
                Leads Gerados
              </Label>
              <CurrencyInput
                id='generateLeads'
                className='col-span-3'
                {...register('generateLeads')}
              />
              {errors.generateLeads && (
                <span className='col-span-4 text-red-500'>
                  {errors.generateLeads?.message}
                </span>
              )}
            </div>
            <div className='flex flex-col items-center space-x-2 space-y-1'>
              <Label
                htmlFor='saleDate'
                className='ml-2 self-start'
              >
                Data
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={'outline'}
                    className={cn(
                      'w-[375px] justify-start text-left font-normal',
                      !date && 'text-muted-foreground',
                    )}
                  >
                    <CalendarIcon className='mr-2 h-4 w-4' />
                    {date ? (
                      format(date, 'PPP', { locale: ptBR })
                    ) : (
                      <span>Selecione uma data</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  className='w-auto p-0'
                  align='start'
                >
                  <Calendar
                    mode='single'
                    selected={date}
                    onSelect={(e) => {
                      if (e) setValue('channelDate', e)
                      setDate(e)
                    }}
                    locale={ptBR}
                  />
                </PopoverContent>
              </Popover>
              {errors.channelDate && (
                <MessageError>{errors.channelDate.message}</MessageError>
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
