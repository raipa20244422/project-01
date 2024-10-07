import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { LeadFormData, leadSchema } from '@/lib/zod/lead-schema'

import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'

interface FormLeadsProps {
  create: boolean
  id?: string
}

export function FormLeads({ create, id }: FormLeadsProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<LeadFormData>({
    resolver: zodResolver(leadSchema),
  })

  const onSubmit = (data: LeadFormData) => {
    if (create) {
      console.log('Lead criado:', data)
    } else {
      console.log('Lead atualizado:', data)
    }
    reset()
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          type='button'
          className='text-white'
        >
          {create ? 'Adicionar Lead' : 'Editar Lead'}
        </Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>
            {create ? 'Adicionar Novo Lead' : `Editar Lead ${id}`}
          </DialogTitle>
          <DialogDescription>
            {create
              ? 'Preencha as informações do novo lead. Clique em salvar para adicionar.'
              : 'Edite as informações do lead. Clique em salvar para atualizar.'}
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
                  {errors.name.message}
                </span>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button type='submit'>
              {create ? 'Salvar Lead' : 'Atualizar Lead'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
