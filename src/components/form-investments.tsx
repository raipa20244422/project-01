'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { CalendarIcon } from 'lucide-react'
import { ReactNode, useEffect, useState, useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import {
  createInvestmentAction,
  getInvestmentById,
  updateInvestmentAction,
} from '@/actions/investment-actions'
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
import { MessageError } from './message-erro'
import { Button } from './ui/button'
import { Calendar } from './ui/calendar'
import { Label } from './ui/label'
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover'
import { Textarea } from './ui/textarea' // Importando Textarea

const investmentSchema = z.object({
  amount: z.number().min(0.01, 'O valor do investimento é obrigatório'),
  profit: z.number().min(0.01, 'O lucro é obrigatório'),
  month: z.date({ required_error: 'O mês do investimento é obrigatório' }),
  description: z
    .string()
    .max(250, 'A descrição deve ter no máximo 250 caracteres'),
})

export type InvestmentFormData = z.infer<typeof investmentSchema>

interface FormInvestmentProps {
  create: boolean
  id?: number
  children: ReactNode
}

export function FormInvestment({ create, id, children }: FormInvestmentProps) {
  const [isPending, startTransition] = useTransition()
  const [isOpen, setOpen] = useState(false)
  const [date, setDate] = useState<Date>()
  const [investmentData, setInvestmentData] =
    useState<InvestmentFormData | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<InvestmentFormData>({
    resolver: zodResolver(investmentSchema),
    defaultValues: investmentData || {
      amount: 0,
      profit: 0,
      month: new Date(),
      description: '',
    },
  })

  useEffect(() => {
    if (id && isOpen) {
      // Busca os dados de investimento ao abrir o formulário no modo de edição
      startTransition(async () => {
        const response = await getInvestmentById(id)
        if (response.success && response.investment) {
          const { amount, profit, month, description } = response.investment
          setInvestmentData({
            amount,
            profit,
            month: new Date(month),
            description,
          })
          setDate(new Date(month))
          reset({ amount, profit, month: new Date(month), description })
        }
      })
    }
  }, [id, isOpen])

  const onSubmit = async (data: InvestmentFormData) => {
    startTransition(async () => {
      if (create) {
        await createInvestmentAction(data)
      } else if (id) {
        await updateInvestmentAction(id, data)
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
                value={investmentData?.amount}
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
                value={investmentData?.profit}
                onValueChange={(value) => setValue('profit', value)}
              />
              {errors.profit && (
                <MessageError>{errors.profit.message}</MessageError>
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
                htmlFor='description'
                className='ml-2 self-start'
              >
                Descrição
              </Label>
              <Textarea
                id='description'
                className='col-span-3'
                {...register('description')}
                defaultValue={investmentData?.description || ''}
                placeholder='Digite uma descrição'
              />
              {errors.description && (
                <MessageError>{errors.description.message}</MessageError>
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
