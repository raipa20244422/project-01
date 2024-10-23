'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { CalendarIcon } from 'lucide-react'
import { ReactNode, useEffect, useMemo, useState, useTransition } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { z } from 'zod'

import {
  createSaleAction,
  getSaleById,
  updateSaleAction,
} from '@/actions/create-sale'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

import { CurrencyInput } from './currency-input'
import { MessageError } from './message-erro'
import { Calendar } from './ui/calendar'
import { Input } from './ui/input'
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover'

const saleSchema = z.object({
  amount: z
    .number({ required_error: 'O valor da venda é obrigatório' })
    .min(0.01, 'O valor da venda é obrigatório'),
  productsSold: z
    .number({
      required_error: 'A quantidade de produtos vendidos é obrigatória',
    })
    .min(1, 'Deve haver pelo menos 1 produto vendido'),
  salesCount: z
    .number({ required_error: 'A quantidade de vendas é obrigatória' })
    .min(1, 'Deve haver pelo menos 1 venda'),
  saleDate: z.date({ required_error: 'A data da venda é obrigatória' }),
  channelName: z.string().min(1, 'O nome é obrigatório'),
  generateLeads: z
    .number({ required_error: 'A quantidade de leads gerados é obrigatória' })
    .min(1, 'Leads gerados devem ser maiores que 0'),
})

export type SaleFormData = z.infer<typeof saleSchema>

interface FormSaleProps {
  create: boolean
  id?: number
  children: ReactNode
}

export function FormSale({ create, id, children }: FormSaleProps) {
  const [isPending, startTransition] = useTransition()
  const [isOpen, setOpen] = useState(false)
  const [date, setDate] = useState<Date>()

  const {
    handleSubmit,
    register,
    formState: { errors },
    reset,
    setValue,
    control,
    watch,
  } = useForm<SaleFormData>({
    resolver: zodResolver(saleSchema),
    defaultValues: {
      amount: 0,
      productsSold: 0,
      salesCount: 0,
      generateLeads: 0,
      channelName: '',
    },
  })

  useMemo(async () => {
    if (id && isOpen) {
      const { sale } = await getSaleById(id)
      if (sale) {
        const {
          saleDate,
          productsSold,
          salesCount,
          amount,
          channelName,
          generateLeads,
        } = sale
        setDate(saleDate)
        reset({
          saleDate,
          productsSold,
          salesCount,
          amount,
          channelName,
          generateLeads,
        })
      }
    }
  }, [isOpen])

  const leadsGenerated = watch('generateLeads')
  const salesCount = watch('salesCount')
  const conversionRate = useMemo(() => {
    if (salesCount > 0) {
      return (leadsGenerated / salesCount).toFixed(2)
    }
    return '0.00'
  }, [leadsGenerated, salesCount])

  const onSubmit = async (data: SaleFormData) => {
    startTransition(async () => {
      if (create) {
        await createSaleAction(data)
      } else if (id) {
        await updateSaleAction(id, data)
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
            {create ? 'Adicionar Nova Venda' : 'Editar Venda'}
          </DialogTitle>
          <DialogDescription>
            {create
              ? 'Preencha as informações da nova venda. Clique em salvar para adicionar.'
              : 'Edite as informações da venda. Clique em salvar para atualizar.'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className='grid gap-4 py-4'>
            {/* Inputs de canal */}
            <div className='flex flex-col items-center space-x-2 space-y-1'>
              <Label
                htmlFor='channelName'
                className='ml-2 self-start'
              >
                Nome do Canal
              </Label>
              <Input
                id='channelName'
                className='col-span-3'
                {...register('channelName')}
              />
              {errors.channelName && (
                <MessageError>{errors.channelName.message}</MessageError>
              )}
            </div>

            <div className='flex flex-col items-center space-x-2 space-y-1'>
              <Label
                htmlFor='generateLeads'
                className='ml-2 self-start'
              >
                Leads Gerados
              </Label>
              <Controller
                control={control}
                name='generateLeads'
                render={({ field: { value } }) => (
                  <CurrencyInput
                    id='generateLeads'
                    className='col-span-3'
                    placeholder='0,00'
                    value={value?.toString() || ''}
                    onValueChange={(value) => setValue('generateLeads', value)}
                  />
                )}
              />
              {errors.generateLeads && (
                <MessageError>{errors.generateLeads.message}</MessageError>
              )}
            </div>

            <div className='flex flex-col items-center space-x-2 space-y-1'>
              <Label
                htmlFor='salesCount'
                className='ml-2 self-start'
              >
                Numero de Vendas
              </Label>
              <Controller
                control={control}
                name='salesCount'
                render={({ field: { value } }) => (
                  <CurrencyInput
                    id='salesCount'
                    className='col-span-3'
                    placeholder='0,00'
                    value={value?.toString() || ''}
                    onValueChange={(value) => setValue('salesCount', value)}
                  />
                )}
              />
              {errors.salesCount && (
                <MessageError>{errors.salesCount.message}</MessageError>
              )}
            </div>

            <div className='flex flex-col items-center space-x-2 space-y-1'>
              <Label
                htmlFor='conversionRate'
                className='ml-2 self-start'
              >
                Taxa de Conversão (Leads/Vendas)
              </Label>
              <CurrencyInput
                id='conversionRate'
                className='col-span-3'
                value={conversionRate}
                disabled
              />
            </div>

            {/* Inputs de venda */}
            <div className='flex flex-col items-center space-x-2 space-y-1'>
              <Label
                htmlFor='amount'
                className='ml-2 self-start'
              >
                Faturamento
              </Label>
              <Controller
                control={control}
                name='amount'
                render={({ field: { value } }) => (
                  <CurrencyInput
                    id='amount'
                    className='col-span-3'
                    placeholder='0,00'
                    value={value?.toString() || ''}
                    onValueChange={(value) => setValue('amount', value)}
                  />
                )}
              />
              {errors.amount && (
                <MessageError>{errors.amount.message}</MessageError>
              )}
            </div>

            <div className='flex flex-col items-center space-x-2 space-y-1'>
              <Label
                htmlFor='productsSold'
                className='ml-2 self-start'
              >
                Produtos Vendidos
              </Label>
              <Controller
                control={control}
                name='productsSold'
                render={({ field: { value } }) => (
                  <CurrencyInput
                    id='productsSold'
                    className='col-span-3'
                    placeholder='0,00'
                    value={value?.toString() || ''}
                    onValueChange={(value) => setValue('productsSold', value)}
                  />
                )}
              />
              {errors.productsSold && (
                <MessageError>{errors.productsSold.message}</MessageError>
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
                      if (e) setValue('saleDate', e)
                      setDate(e)
                    }}
                    locale={ptBR}
                  />
                </PopoverContent>
              </Popover>
              {errors.saleDate && (
                <MessageError>{errors.saleDate.message}</MessageError>
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
                  ? 'Salvar Venda'
                  : 'Atualizar Venda'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
