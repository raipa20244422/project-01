'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { ReactNode, useState, useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { createCollaboratorAction } from '@/actions/create-collaborator'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'

const collaboratorSchema = z.object({
  name: z.string().min(1, 'O nome é obrigatório'),
})

type CollaboratorFormData = z.infer<typeof collaboratorSchema>

interface FormCollaboratorProps {
  create: boolean
  id?: string
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
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CollaboratorFormData>({
    resolver: zodResolver(collaboratorSchema),
  })

  const onSubmit = async (data: CollaboratorFormData) => {
    if (create) {
      startTransition(async () => {
        const response = await createCollaboratorAction(data)
        setOpen(false)
        reset()
      })
    } else {
      setOpen(false)
      reset()
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
            <div className='grid grid-cols-4 items-center gap-4'>
              <Label
                htmlFor='name'
                className='text-right'
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
