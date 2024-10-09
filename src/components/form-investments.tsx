'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { CalendarIcon } from 'lucide-react'
import { useEffect, useState, useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { getChannels } from '@/actions/get-channels-all'
import { createInvestmentAction } from '@/actions/investment-actions'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'

import { CurrencyInput } from './currency-input'
import { MessageError } from './message-erro'
import { Button } from './ui/button'
import { Calendar } from './ui/calendar'
import { Label } from './ui/label'
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover'

const investmentSchema = z.object({
  amount: z.number().min(0.01, 'O valor do investimento é obrigatório'),
  profit: z.number().min(0.01, 'O lucro é obrigatório'),
  month: z.date({ required_error: 'O mês do investimento é obrigatório' }),
  channelId: z.string().nonempty('É necessário selecionar um canal'),
})

type InvestmentFormData = z.infer<typeof investmentSchema>

interface FormInvestmentProps {
  create: boolean
  id?: string
}

export function FormInvestment({ create, id }: FormInvestmentProps) {
  const [isPending, startTransition] = useTransition()
  const [isOpen, setOpen] = useState(false)
  const [channels, setChannels] = useState<{ id: number; name: string }[]>([])
  const [date, setDate] = useState<Date>()

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<InvestmentFormData>({
    resolver: zodResolver(investmentSchema),
  })

  useEffect(() => {
    async function fetchChannels() {
      const response = await getChannels()
      if (response.success) setChannels(response.channels)
    }
    fetchChannels()
  }, [])

  const onSubmit = async (data: InvestmentFormData) => {
    startTransition(async () => {
      const response = await createInvestmentAction({
        ...data,
      })
      setOpen(false)
      reset()
    })
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
          {create ? 'Adicionar Investimento' : `Editar Investimento ${id}`}
        </Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>
            {create
              ? 'Adicionar Novo Investimento'
              : `Editar Investimento ${id}`}
          </DialogTitle>
          <DialogDescription>
            {create
              ? 'Preencha as informações do novo investimento. Clique em salvar para adicionar.'
              : 'Edite as informações do investimento. Clique em salvar para atualizar.'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className='grid gap-4 py-4'>
            <div className='flex flex-col items-center space-x-2 space-y-1'>
              <Label
                htmlFor='amount'
                className='ml-2 self-start'
              >
                Valor
              </Label>
              <CurrencyInput
                id='amount'
                className='col-span-3'
                onValueChange={(value) => setValue('amount', value)}
              />
              {errors.amount && (
                <MessageError>{errors.amount.message}</MessageError>
              )}
            </div>

            <div className='flex flex-col items-center space-x-2 space-y-1'>
              <Label
                htmlFor='profit'
                className='ml-2 self-start'
              >
                Lucro
              </Label>
              <CurrencyInput
                id='profit'
                className='col-span-3'
                onValueChange={(value) => setValue('profit', value)}
              />
              {errors.profit && (
                <MessageError> {errors.profit.message}</MessageError>
              )}
            </div>

            <div className='flex flex-col items-center space-x-2 space-y-1'>
              <Label
                htmlFor='month'
                className='ml-2 self-start'
              >
                Mês
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
                      setDate(e)
                      if (e) setValue('month', e)
                    }}
                    locale={ptBR}
                  />
                </PopoverContent>
              </Popover>
              {errors.month && (
                <MessageError>{errors.month.message}</MessageError>
              )}
            </div>

            <div className='flex flex-col items-center space-x-2 space-y-1'>
              <Label
                htmlFor='channel'
                className='ml-2 self-start'
              >
                Canal
              </Label>
              <Select onValueChange={(value) => setValue('channelId', value)}>
                <SelectTrigger>
                  <SelectValue placeholder='Selecione o canal' />
                </SelectTrigger>
                <SelectContent>
                  {channels.map((channel) => (
                    <SelectItem
                      key={channel.id}
                      value={String(channel.id)}
                    >
                      {channel.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.channelId && (
                <MessageError>{errors.channelId.message}</MessageError>
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
                  ? 'Salvar Investimento'
                  : 'Atualizar Investimento'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
