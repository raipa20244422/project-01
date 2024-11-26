'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { watch } from 'fs'
import { CalendarIcon, XIcon } from 'lucide-react'
import { ReactNode, useEffect, useState, useTransition } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { z } from 'zod'

import {
  createGoalAction,
  getChannels,
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
  valorInvestido: z
    .number()
    .min(0, 'O valor investido deve ser positivo')
    .default(0),
  faturamento: z.number().min(0, 'O faturamento deve ser positivo').default(0),
  ledsGerados: z
    .number()
    .min(0, 'A quantidade de LEDs deve ser positiva')
    .default(0),
  mesMeta: z.date({ required_error: 'Informe a data da meta' }),
  numeroVendas: z
    .number()
    .min(0, 'O número de vendas deve ser positivo')
    .default(0),
  produtosVendidos: z
    .number()
    .min(0, 'A quantidade de produtos vendidos deve ser positiva')
    .default(0),
  canalMeta: z
    .string({ required_error: 'Informar o canal é obrigatório' })
    .optional(),
})

export type GoalFormData = z.infer<typeof goalSchema>

interface Map {
  valorInvestido: number
  faturamento: number
  ledsGerados: number
  numeroVendas: number
  produtosVendidos: number
}
interface FormGoalProps {
  create: boolean
  id?: number
  children: ReactNode
}

const fieldOptions = [
  { label: 'Valor Investido', value: 'valorInvestido' },
  { label: 'Faturamento', value: 'faturamento' },
  { label: 'Leads Convertidos', value: 'ledsGerados' },
  { label: 'Número de Vendas', value: 'numeroVendas' },
  { label: 'Produtos Vendidos', value: 'produtosVendidos' },
]

export function FormGoal({ create, id, children }: FormGoalProps) {
  const [isPending, startTransition] = useTransition()
  const [isOpen, setOpen] = useState(false)
  const [date, setDate] = useState<Date>()
  const [goalData, setGoalData] = useState<GoalFormData | null>(null)
  const [channels, setChannels] = useState<{ id: number; name: string }[]>([])
  const [selectedFields, setSelectedFields] = useState<string[]>([])
  const [newField, setNewField] = useState<string>('')

  const {
    handleSubmit,
    formState: { errors },
    reset,
    watch,
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

  const fetchChannels = async () => {
    const responseChannel = await getChannels()
    if (responseChannel.channels) {
      setChannels(responseChannel.channels)
    }
  }

  useEffect(() => {
    setSelectedFields([])
    fetchChannels()
    if (id && isOpen) {
      startTransition(async () => {
        const response = await getGoalById(id)
        if (response.success && response.goal) {
          const goal = response.goal
          setGoalData({
            ...response.goal,
            canalMeta: String(response.goal.channelId),
          })
          reset({
            ...response.goal,
            canalMeta: String(response.goal.channelId),
          })
          setDate(new Date(response.goal.mesMeta))

          Object.keys(goal).forEach((key) => {
            if (fieldOptions.some((option) => option.value === key)) {
              if (goal[key as keyof Map] > 0) {
                setSelectedFields((prev) => [...prev, key])
                setValue(key as keyof Map, goal[key as keyof Map])
              }
            }
          })
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

  const addSelectedField = () => {
    if (newField && !selectedFields.includes(newField)) {
      setSelectedFields([...selectedFields, newField])
      setNewField('')
    }
  }

  const removeField = (field: string) => {
    setSelectedFields(
      selectedFields.filter((selectedField) => selectedField !== field),
    )
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
                        <SelectItem value='SALES'>Metas Geral</SelectItem>
                        <SelectItem value='COLLABORATOR'>
                          Metas de vendedor
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

            {watch('goalType') === 'COLLABORATOR' && (
              <>
                {/* Canal da Meta */}
                <div className='flex flex-col items-center space-x-2 space-y-1'>
                  <Label
                    htmlFor='canalMeta'
                    className='ml-2 self-start'
                  >
                    Canal da Meta
                  </Label>
                  <Controller
                    control={control}
                    name='canalMeta'
                    render={({ field: { onChange, value } }) => (
                      <Select
                        value={value}
                        onValueChange={onChange}
                      >
                        <SelectTrigger className='w-full'>
                          <SelectValue placeholder='Selecione o canal da meta' />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            {channels.map((channel) => (
                              <SelectItem
                                key={channel.id}
                                value={String(channel.id)}
                              >
                                {channel.name}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.canalMeta && (
                    <MessageError>{errors.canalMeta.message}</MessageError>
                  )}
                </div>
              </>
            )}

            {/* Mês da Meta */}
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

            {/* Adicionar Campos Dinâmicos */}
            <div className='flex flex-row items-center space-x-2'>
              <Select
                value={newField}
                onValueChange={setNewField}
              >
                <SelectTrigger className='w-full'>
                  <SelectValue placeholder='Selecione um campo para adicionar' />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {fieldOptions.map((field) => (
                      <SelectItem
                        key={field.value}
                        value={field.value}
                        className={
                          selectedFields.includes(field.value)
                            ? 'opacity-50'
                            : ''
                        }
                      >
                        {field.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
              <Button
                type='button'
                onClick={addSelectedField}
              >
                Adicionar
              </Button>
            </div>

            {/* Renderizar Campos Selecionados */}
            {selectedFields.map((field) => (
              <div
                key={field}
                className='flex flex-row items-center space-x-2 space-y-1'
              >
                <div className='flex flex-grow flex-col'>
                  <Label
                    htmlFor={field}
                    className='ml-2 self-start'
                  >
                    {
                      fieldOptions.find((option) => option.value === field)
                        ?.label
                    }
                  </Label>
                  <Controller
                    control={control}
                    name={field as keyof Map}
                    render={({ field: { onChange, value } }) => (
                      <CurrencyInput
                        id={field}
                        value={value}
                        onValueChange={onChange}
                        placeholder='0,00'
                      />
                    )}
                  />
                  {errors[field as keyof GoalFormData] && (
                    <MessageError>
                      {errors[field as keyof GoalFormData]?.message}
                    </MessageError>
                  )}
                </div>
                <Button
                  type='button'
                  variant='ghost'
                  onClick={() => removeField(field)}
                >
                  <XIcon className='h-4 w-4 text-red-500' />
                </Button>
              </div>
            ))}
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
