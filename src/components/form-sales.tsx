'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { CalendarIcon } from 'lucide-react'
import { useEffect, useState, useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { createSaleAction } from '@/actions/create-sale'
import { getAllLeadsByOrganization } from '@/actions/get-organization-lead'
import { getAllCollaboratorsByOrganization } from '@/actions/gt-organization-collaborator'
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
import { Calendar } from './ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover'

const saleSchema = z.object({
  amount: z
    .number({ required_error: 'O valor da venda é obrigatório' })
    .min(0.01, 'O valor da venda é obrigatório'),
  saleDate: z.date({ required_error: 'A data da venda é obrigatória' }),
  leadId: z.string({ required_error: 'O valor da venda é obrigatório' }),
  collaboratorId: z.string({
    required_error: 'O valor da venda é obrigatório',
  }),
})

type SaleFormData = z.infer<typeof saleSchema>

interface FormSaleProps {
  create: boolean
}

export function FormSale({ create }: FormSaleProps) {
  const [isPending, startTransition] = useTransition()
  const [isOpen, setOpen] = useState(false)
  const [date, setDate] = useState<Date>()
  const [leads, setLeads] = useState<
    | {
        name: string
        id: number
        createdAt: Date
      }[]
    | undefined
  >([])
  const [collaborators, setCollaborators] = useState<
    | {
        name: string
        id: number
        createdAt: Date
      }[]
    | undefined
  >([])
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date())

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<SaleFormData>({
    resolver: zodResolver(saleSchema),
  })

  useEffect(() => {
    async function fetchData() {
      const leadsResponse = await getAllLeadsByOrganization()
      const collaboratorsResponse = await getAllCollaboratorsByOrganization()
      if (leadsResponse.success) setLeads(leadsResponse.leads)
      if (collaboratorsResponse.success)
        setCollaborators(collaboratorsResponse.collaborators)
    }
    fetchData()
  }, [])

  const onSubmit = async (data: SaleFormData) => {
    console.log(data)
    startTransition(async () => {
      await createSaleAction({
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
          {create ? 'Adicionar Venda' : 'Editar Venda'}
        </Button>
      </DialogTrigger>
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
                placeholder='0,00'
                autoFocus
                onValueChange={(value) => setValue('amount', value)}
              />

              {errors.amount && (
                <MessageError>{errors.amount.message}</MessageError>
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

            <div className='flex flex-col items-center space-x-2 space-y-1'>
              <Label
                htmlFor='lead'
                className='ml-2 self-start'
              >
                Lead
              </Label>
              <Select onValueChange={(value) => setValue('leadId', value)}>
                <SelectTrigger>
                  <SelectValue placeholder='Selecione um lead' />
                </SelectTrigger>
                <SelectContent>
                  {leads?.map((lead) => (
                    <SelectItem
                      key={lead.id}
                      value={String(lead.id)}
                    >
                      {lead.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.leadId && (
                <MessageError>{errors.leadId.message}</MessageError>
              )}
            </div>

            {/* Campo para selecionar Colaborador */}
            <div className='flex flex-col items-center space-x-2 space-y-1'>
              <Label
                htmlFor='collaborator'
                className='ml-2 self-start'
              >
                Colaborador
              </Label>
              <Select
                onValueChange={(value) => setValue('collaboratorId', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder='Selecione o colaborador' />
                </SelectTrigger>
                <SelectContent>
                  {collaborators?.map((collaborator) => (
                    <SelectItem
                      key={collaborator.id}
                      value={String(collaborator.id)}
                    >
                      {collaborator.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.collaboratorId && (
                <MessageError>{errors.collaboratorId.message}</MessageError>
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
