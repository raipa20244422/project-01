'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { ReactNode, useMemo, useState, useTransition } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { z } from 'zod'

import {
  createCollaboratorAction,
  getCollaboratorById,
  updateCollaboratorAction,
} from '@/actions/create-collaborator'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

import { CurrencyInput } from './currency-input'
import { MessageError } from './message-erro'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'

const collaboratorSchema = z.object({
  name: z.string().min(1, 'O nome é obrigatório'),
  leadsAttended: z
    .number()
    .min(0, 'O número de leads atendidos deve ser maior ou igual a 0')
    .optional(),
  salesCount: z
    .number()
    .min(0, 'O número de vendas deve ser maior ou igual a 0')
    .optional(),
  productsSold: z
    .number()
    .min(0, 'A quantidade de produtos vendidos deve ser maior ou igual a 0')
    .optional(),
  revenue: z
    .number()
    .min(0, 'O faturamento deve ser maior ou igual a 0')
    .optional(),
})

export type CollaboratorFormData = z.infer<typeof collaboratorSchema>

interface FormCollaboratorProps {
  create: boolean
  id?: number
  children: ReactNode
}

export function FormCollaborator({
  create,
  id,
  children,
}: FormCollaboratorProps) {
  const [isPending, startTransition] = useTransition()
  const [isOpen, setOpen] = useState(false)

  const {
    handleSubmit,
    formState: { errors },
    reset,
    register,
    setValue,
    control,
  } = useForm<CollaboratorFormData>({
    resolver: zodResolver(collaboratorSchema),
    defaultValues: {
      leadsAttended: 0,
      salesCount: 0,
      productsSold: 0,
      revenue: 0,
    },
  })

  useMemo(async () => {
    if (id && isOpen) {
      const { collaborator } = await getCollaboratorById(id)
      if (collaborator) {
        const { name, leadsAttended, salesCount, productsSold, revenue } =
          collaborator
        reset({
          name,
          leadsAttended,
          salesCount,
          productsSold,
          revenue,
        })
      }
    }
  }, [id, isOpen, reset])

  const onSubmit = async (data: CollaboratorFormData) => {
    startTransition(async () => {
      if (create) {
        await createCollaboratorAction(data)
      } else if (id) {
        await updateCollaboratorAction(id, data)
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
            {create ? 'Adicionar Novo Colaborador' : `Editar Colaborador ${id}`}
          </DialogTitle>
          <DialogDescription>
            {create
              ? 'Preencha as informações do novo colaborador. Clique em salvar para adicionar.'
              : 'Edite as informações do colaborador. Clique em salvar para atualizar.'}
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
                <MessageError>{errors.name.message}</MessageError>
              )}
            </div>

            <div className='flex flex-col items-center space-x-2 space-y-1'>
              <Label
                htmlFor='leadsAttended'
                className='ml-2 self-start'
              >
                Leads Atendidos
              </Label>
              <Controller
                control={control}
                name='leadsAttended'
                render={({ field: { value } }) => (
                  <CurrencyInput
                    id='leadsAttended'
                    className='col-span-3'
                    placeholder='0'
                    value={value?.toString() || ''}
                    onValueChange={(value) => setValue('leadsAttended', value)}
                  />
                )}
              />
              {errors.leadsAttended && (
                <MessageError>{errors.leadsAttended.message}</MessageError>
              )}
            </div>

            <div className='flex flex-col items-center space-x-2 space-y-1'>
              <Label
                htmlFor='salesCount'
                className='ml-2 self-start'
              >
                Número de Vendas
              </Label>
              <Controller
                control={control}
                name='salesCount'
                render={({ field: { value } }) => (
                  <CurrencyInput
                    id='salesCount'
                    className='col-span-3'
                    placeholder='0'
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
                    placeholder='0'
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
                htmlFor='revenue'
                className='ml-2 self-start'
              >
                Faturamento
              </Label>
              <Controller
                control={control}
                name='revenue'
                render={({ field: { value } }) => (
                  <CurrencyInput
                    id='revenue'
                    className='col-span-3'
                    placeholder='0,00'
                    value={value?.toString() || ''}
                    onValueChange={(value) => setValue('revenue', value)}
                  />
                )}
              />
              {errors.revenue && (
                <MessageError>{errors.revenue.message}</MessageError>
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
                  ? 'Salvar Colaborador'
                  : 'Atualizar Colaborador'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
