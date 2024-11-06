'use client'
import { zodResolver } from '@hookform/resolvers/zod'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { CalendarIcon } from 'lucide-react'
import { ReactNode, useEffect, useState, useTransition } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { z } from 'zod'

import {
  createGoalAction,
  getGoalById,
  updateGoalAction,
} from '@/actions/goals-actions'
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
  SelectGroup,
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

const goalSchema = z.object({
  goalType: z.enum(['SALES', 'COLLABORATOR'], {
    errorMap: () => ({ message: 'Tipo de meta é obrigatório' }),
  }),
  valorInvestido: z.number().min(0, 'O valor investido deve ser positivo'),
  faturamento: z.number().min(0, 'O faturamento deve ser positivo'),
  ledsGerados: z.number().min(0, 'A quantidade de LEDs deve ser positiva'),
  mesMeta: z.date({ required_error: 'Informe a data da meta' }),
  numeroVendas: z.number().min(0, 'O número de vendas deve ser positivo'),
  produtosVendidos: z
    .number()
    .min(0, 'A quantidade de produtos vendidos deve ser positiva'),
})

export type GoalFormData = z.infer<typeof goalSchema>

interface FormGoalProps {
  create: boolean
  id?: number
  children: ReactNode
}

export function FormGoal({ create, id, children }: FormGoalProps) {
  const [isPending, startTransition] = useTransition()
  const [isOpen, setOpen] = useState(false)
  const [date, setDate] = useState<Date>()
  const [goalData, setGoalData] = useState<GoalFormData | null>(null)

  const {
    handleSubmit,
    formState: { errors },
    reset,
    control,
    setValue,
  } = useForm<GoalFormData>({
    resolver: zodResolver(goalSchema),
    defaultValues: goalData || {
      goalType: 'SALES',
      valorInvestido: 0,
      faturamento: 0,
      ledsGerados: 0,
      numeroVendas: 0,
      produtosVendidos: 0,
    },
  })

  useEffect(() => {
    if (id && isOpen) {
      startTransition(async () => {
        const response = await getGoalById(id)
        if (response.success && response.goal) {
          setGoalData(response.goal)
          reset(response.goal)
          setDate(new Date(response.goal.mesMeta))
        }
      })
    }
  }, [id, isOpen, reset])

  const onSubmit = async (data: GoalFormData) => {
    startTransition(async () => {
      let response
      if (create) {
        response = await createGoalAction(data)
      } else if (id) {
        response = await updateGoalAction(id, data)
      }

      if (response && response.success) {
        setOpen(false)
        reset()
      } else {
        console.error(response?.message || 'Erro ao salvar meta.')
      }
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
            {create ? 'Adicionar Nova Meta' : `Editar Meta ${id}`}
          </DialogTitle>
          <DialogDescription>
            {create
              ? 'Preencha as informações da nova meta. Clique em salvar para adicionar.'
              : 'Edite as informações da meta. Clique em salvar para atualizar.'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className='grid gap-4 py-4'>
            {/* Tipo de Meta */}
            <div className='flex flex-col items-center space-x-2 space-y-1'>
              <Label
                htmlFor='goalType'
                className='ml-2 self-start'
              >
                Tipo de Meta
              </Label>
              <Controller
                control={control}
                name='goalType'
                render={({ field: { onChange, value } }) => (
                  <Select
                    value={value}
                    onValueChange={onChange}
                  >
                    <SelectTrigger className='w-full'>
                      <SelectValue placeholder='Selecione o tipo de meta' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value='SALES'>Metas de Vendas</SelectItem>
                        <SelectItem value='COLLABORATOR'>
                          Metas de Colaborador
                        </SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.goalType && (
                <MessageError>{errors.goalType.message}</MessageError>
              )}
            </div>

            {/* DataPicker para Mês da Meta */}
            <div className='flex flex-col items-center space-x-2 space-y-1'>
              <Label
                htmlFor='mesMeta'
                className='ml-2 self-start'
              >
                Mês da Meta
              </Label>
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
                      if (e) setValue('mesMeta', e)
                      setDate(e)
                    }}
                    locale={ptBR}
                  />
                </PopoverContent>
              </Popover>
              {errors.mesMeta && (
                <MessageError>{errors.mesMeta.message}</MessageError>
              )}
            </div>

            {/* Campos CurrencyInput Controlados */}
            <div className='flex flex-col items-center space-x-2 space-y-1'>
              <Label
                htmlFor='valorInvestido'
                className='ml-2 self-start'
              >
                Valor Investido
              </Label>
              <Controller
                control={control}
                name='valorInvestido'
                render={({ field: { onChange, value } }) => (
                  <CurrencyInput
                    id='valorInvestido'
                    value={value}
                    onValueChange={onChange}
                    placeholder='0,00'
                  />
                )}
              />
              {errors.valorInvestido && (
                <MessageError>{errors.valorInvestido.message}</MessageError>
              )}
            </div>

            <div className='flex flex-col items-center space-x-2 space-y-1'>
              <Label
                htmlFor='faturamento'
                className='ml-2 self-start'
              >
                Faturamento
              </Label>
              <Controller
                control={control}
                name='faturamento'
                render={({ field: { onChange, value } }) => (
                  <CurrencyInput
                    id='faturamento'
                    value={value}
                    onValueChange={onChange}
                    placeholder='0,00'
                  />
                )}
              />
              {errors.faturamento && (
                <MessageError>{errors.faturamento.message}</MessageError>
              )}
            </div>

            <div className='flex flex-col items-center space-x-2 space-y-1'>
              <Label
                htmlFor='ledsGerados'
                className='ml-2 self-start'
              >
                LEDs Gerados (Quantidade)
              </Label>
              <Controller
                control={control}
                name='ledsGerados'
                render={({ field: { onChange, value } }) => (
                  <CurrencyInput
                    id='ledsGerados'
                    value={value}
                    onValueChange={onChange}
                    placeholder='0'
                  />
                )}
              />
              {errors.ledsGerados && (
                <MessageError>{errors.ledsGerados.message}</MessageError>
              )}
            </div>

            <div className='flex flex-col items-center space-x-2 space-y-1'>
              <Label
                htmlFor='numeroVendas'
                className='ml-2 self-start'
              >
                Número de Vendas (Quantidade)
              </Label>
              <Controller
                control={control}
                name='numeroVendas'
                render={({ field: { onChange, value } }) => (
                  <CurrencyInput
                    id='numeroVendas'
                    value={value}
                    onValueChange={onChange}
                    placeholder='0'
                  />
                )}
              />
              {errors.numeroVendas && (
                <MessageError>{errors.numeroVendas.message}</MessageError>
              )}
            </div>

            <div className='flex flex-col items-center space-x-2 space-y-1'>
              <Label
                htmlFor='produtosVendidos'
                className='ml-2 self-start'
              >
                Produtos Vendidos (Quantidade)
              </Label>
              <Controller
                control={control}
                name='produtosVendidos'
                render={({ field: { onChange, value } }) => (
                  <CurrencyInput
                    id='produtosVendidos'
                    value={value}
                    onValueChange={onChange}
                    placeholder='0'
                  />
                )}
              />
              {errors.produtosVendidos && (
                <MessageError>{errors.produtosVendidos.message}</MessageError>
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
                  ? 'Salvar Meta'
                  : 'Atualizar Meta'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
