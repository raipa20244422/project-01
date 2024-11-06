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
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover'

const saleSchema = z.object({
  month: z.date({
    required_error: 'Data é obrigatória.',
    invalid_type_error: 'Data inválida.',
  }),
  investment: z
    .number({
      required_error: 'Investimento obrigatório.',
      invalid_type_error: 'Investimento deve ser numérico.',
    })
    .min(0.01, 'Deve ser maior que zero.'),
  revenue: z
    .number({
      required_error: 'Faturamento obrigatório.',
      invalid_type_error: 'Faturamento deve ser numérico.',
    })
    .min(0, 'Não pode ser negativo.'),
  leadsGenerated: z
    .number({
      required_error: 'Leads gerados obrigatório.',
      invalid_type_error: 'Leads gerados deve ser numérico.',
    })
    .min(0, 'Não pode ser negativo.'),
  salesCount: z
    .number({
      required_error: 'Vendas obrigatórias.',
      invalid_type_error: 'Vendas deve ser numérico.',
    })
    .min(1, 'Deve ser pelo menos 1.'),
  productsSold: z
    .number({
      required_error: 'Produtos vendidos obrigatório.',
      invalid_type_error: 'Produtos vendidos deve ser numérico.',
    })
    .min(1, 'Deve ser pelo menos 1.'),
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
    formState: { errors },
    reset,
    setValue,
    control,
    watch,
  } = useForm<SaleFormData>({
    resolver: zodResolver(saleSchema),
    defaultValues: {
      investment: 0,
      revenue: 0,
      leadsGenerated: 0,
      salesCount: 0,
      productsSold: 0,
    },
  })

  const investment = watch('investment')
  const revenue = watch('revenue')
  const leadsGenerated = watch('leadsGenerated')
  const salesCount = watch('salesCount')
  const productsSold = watch('productsSold')

  const averageTicket = useMemo(
    () => (salesCount > 0 ? (revenue / salesCount).toFixed(2) : '0.00'),
    [revenue, salesCount],
  )
  const conversionRate = useMemo(
    () =>
      leadsGenerated > 0
        ? ((salesCount / leadsGenerated) * 100).toFixed(2) + '%'
        : '0.00%',
    [leadsGenerated, salesCount],
  )
  const pa = useMemo(
    () => (salesCount > 0 ? (productsSold / salesCount).toFixed(2) : '0.00'),
    [productsSold, salesCount],
  )
  const roi = useMemo(
    () =>
      investment > 0
        ? (((revenue - investment) / investment) * 100).toFixed(2) + '%'
        : '0.00%',
    [revenue, investment],
  )
  const cac = useMemo(
    () => (salesCount > 0 ? (investment / salesCount).toFixed(2) : '0.00'),
    [investment, salesCount],
  )
  const cpl = useMemo(
    () =>
      leadsGenerated > 0 ? (investment / leadsGenerated).toFixed(2) : '0.00',
    [investment, leadsGenerated],
  )

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

  useEffect(() => {
    if (!create && id && isOpen) {
      const fetchCollaborator = async () => {
        const result = await getSaleById(id)
        if (result.success && result.sale) {
          const sale = result.sale
          reset(sale)
          setDate(new Date(sale.month))
        }
      }
      fetchCollaborator()
    }
  }, [create, id, reset, isOpen])

  return (
    <Dialog
      onOpenChange={setOpen}
      open={isOpen}
    >
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className='sm:max-w-6xl'>
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
          <div className='grid grid-cols-4 gap-4 py-4'>
            <div className='flex flex-col items-start justify-start space-y-2 text-nowrap'>
              <Label htmlFor='month'>Mês/Ano</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={'outline'}
                    className={cn(
                      'w-full justify-start text-left font-normal',
                      !date && 'text-muted-foreground',
                    )}
                  >
                    <CalendarIcon className='mr-2 h-4 w-4' />
                    {date ? (
                      format(date, 'MM/yyyy', { locale: ptBR })
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
                      if (e) setValue('month', e)
                      setDate(e)
                    }}
                    locale={ptBR}
                  />
                </PopoverContent>
              </Popover>
              {errors.month && (
                <MessageError>{errors.month.message}</MessageError>
              )}
            </div>

            <div className='flex flex-col items-start justify-start space-y-2 text-nowrap'>
              <Label>Valor Investido</Label>
              <Controller
                control={control}
                name='investment'
                render={({ field: { value } }) => (
                  <CurrencyInput
                    placeholder='0,00'
                    className='min-w-32'
                    value={value?.toString() || ''}
                    onValueChange={(value) => setValue('investment', value)}
                  />
                )}
              />
              {errors.investment && (
                <MessageError>{errors.investment.message}</MessageError>
              )}
            </div>

            <div className='flex flex-col items-start justify-start space-y-2 text-nowrap'>
              <Label>Faturamento</Label>
              <Controller
                control={control}
                name='revenue'
                render={({ field: { value } }) => (
                  <CurrencyInput
                    placeholder='0,00'
                    className='min-w-32'
                    value={value?.toString() || ''}
                    onValueChange={(value) => setValue('revenue', value)}
                  />
                )}
              />
              {errors.revenue && (
                <MessageError>{errors.revenue.message}</MessageError>
              )}
            </div>

            <div className='flex flex-col items-start justify-start space-y-2 text-nowrap'>
              <Label>Leads Gerados</Label>
              <Controller
                control={control}
                name='leadsGenerated'
                render={({ field: { value } }) => (
                  <CurrencyInput
                    placeholder='0'
                    className='min-w-32'
                    value={value?.toString() || ''}
                    onValueChange={(value) => setValue('leadsGenerated', value)}
                  />
                )}
              />
              {errors.leadsGenerated && (
                <MessageError>{errors.leadsGenerated.message}</MessageError>
              )}
            </div>

            <div className='flex flex-col items-start justify-start space-y-2 text-nowrap'>
              <Label>Numero de Vendas</Label>
              <Controller
                control={control}
                name='salesCount'
                render={({ field: { value } }) => (
                  <CurrencyInput
                    placeholder='0'
                    className='min-w-32'
                    value={value?.toString() || ''}
                    onValueChange={(value) => setValue('salesCount', value)}
                  />
                )}
              />
              {errors.salesCount && (
                <MessageError>{errors.salesCount.message}</MessageError>
              )}
            </div>

            <div className='flex flex-col items-start justify-start space-y-2 text-nowrap'>
              <Label>Produtos Vendidos</Label>
              <Controller
                control={control}
                name='productsSold'
                render={({ field: { value } }) => (
                  <CurrencyInput
                    placeholder='0'
                    className='min-w-32'
                    value={value?.toString() || ''}
                    onValueChange={(value) => setValue('productsSold', value)}
                  />
                )}
              />
              {errors.productsSold && (
                <MessageError>{errors.productsSold.message}</MessageError>
              )}
            </div>

            <div className='flex flex-col items-start justify-start space-y-2 text-nowrap'>
              <Label>Ticket Médio</Label>
              <CurrencyInput
                value={averageTicket}
                className='min-w-32'
                disabled
              />
            </div>

            <div className='flex flex-col items-start justify-start space-y-2 text-nowrap'>
              <Label>% Taxa de Conversão</Label>
              <CurrencyInput
                value={conversionRate}
                className='min-w-32'
                disabled
              />
            </div>

            <div className='flex flex-col items-start justify-start space-y-2 text-nowrap'>
              <Label>PA (Produto por Investimento)</Label>
              <CurrencyInput
                value={pa}
                className='min-w-32'
                disabled
              />
            </div>

            <div className='flex flex-col items-start justify-start space-y-2 text-nowrap'>
              <Label>ROI</Label>
              <CurrencyInput
                value={roi}
                className='min-w-32'
                disabled
              />
            </div>

            <div className='flex flex-col items-start justify-start space-y-2 text-nowrap'>
              <Label>CAC (Custo de Aquisição de Cliente)</Label>
              <CurrencyInput
                value={cac}
                className='min-w-32'
                disabled
              />
            </div>

            <div className='flex flex-col items-start justify-start space-y-2 text-nowrap'>
              <Label>CPL (Custo por Lead)</Label>
              <CurrencyInput
                value={cpl}
                className='min-w-32'
                disabled
              />
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
