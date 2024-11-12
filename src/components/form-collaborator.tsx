'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { ReactNode, useEffect, useState, useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { getAllChannels } from '@/actions/channel-actions'
import {
  createCollaboratorAction,
  getCollaboratorById,
  updateCollaboratorAction,
} from '@/actions/create-collaborator'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

import { CurrencyInput } from './currency-input'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'

// Schema do formulário
const collaboratorSchema = z.object({
  name: z.string().min(1, 'O nome é obrigatório'),
})

export type CollaboratorFormData = z.infer<typeof collaboratorSchema>

export interface ItemData {
  id?: number
  channelId: number | null
  leadsGenerated: number
  salesCount: number
  productsSold: number
  revenue: number
  investedAmount: number
}

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
  const [items, setItems] = useState<ItemData[]>([])
  const [channels, setChannels] = useState<{ id: number; name: string }[]>([])

  useEffect(() => {
    const fetchChannels = async () => {
      const response = await getAllChannels()
      if (response.success) {
        setChannels(response.channels)
      }
    }
    fetchChannels()
  }, [])

  const {
    handleSubmit,
    formState: { errors },
    reset,
    register,
    setValue,
  } = useForm<CollaboratorFormData>({
    resolver: zodResolver(collaboratorSchema),
    defaultValues: {
      name: '',
    },
  })

  const onSubmit = async (data: CollaboratorFormData) => {
    startTransition(async () => {
      const finalData = {
        ...data,
        items,
      }

      console.log(finalData)
      if (create) {
        await createCollaboratorAction(finalData)
      } else if (id) {
        await updateCollaboratorAction(id, finalData)
      }
      setOpen(false)
      reset()
      setItems([])
    })
  }

  useEffect(() => {
    if (!create && id) {
      const fetchCollaborator = async () => {
        const response = await getCollaboratorById(id)
        if (response.success) {
          const collaborator = response.collaborator
          if (collaborator) {
            setValue('name', collaborator.name)
            setItems(collaborator.items)
          }
        }
      }
      fetchCollaborator()
    }
  }, [create, id, setValue])

  const addNewItem = () => {
    setItems((prevItems) => [
      ...prevItems,
      {
        id: undefined,
        channelId: null,
        leadsGenerated: 0,
        salesCount: 0,
        productsSold: 0,
        revenue: 0,
        investedAmount: 0,
      },
    ])
  }

  const removeItem = (index: number) => {
    setItems((prevItems) => prevItems.filter((_, i) => i !== index))
  }

  const updateItem = (index: number, field: keyof ItemData, value: number) => {
    setItems((prevItems) =>
      prevItems.map((item, i) =>
        i === index ? { ...item, [field]: value } : item,
      ),
    )
  }

  return (
    <Dialog
      onOpenChange={() => setOpen(!isOpen)}
      open={isOpen}
    >
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className='max-w-4xl sm:w-[900px]'>
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

        <div className='grid grid-cols-1 gap-4 overflow-hidden'>
          <div className='flex flex-col space-y-2 p-2'>
            <div className='flex flex-col space-y-1'>
              <Label>Colaborador</Label>
              <Input
                {...register('name')}
                placeholder='Colaborador'
              />
              {errors.name && (
                <p className='text-sm text-red-500'>{errors.name.message}</p>
              )}
            </div>
            <Button onClick={addNewItem}>Adicionar Item</Button>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Canal</TableHead>
                  <TableHead>Leads Atendidos</TableHead>
                  <TableHead>Vendas Realizadas</TableHead>
                  <TableHead>Produtos Vendidos</TableHead>
                  <TableHead>Faturamento</TableHead>
                  <TableHead>Valor Investido</TableHead>
                  <TableHead>Ticket Médio</TableHead>
                  <TableHead>PA</TableHead>
                  <TableHead>ROI</TableHead>
                  <TableHead>CAC</TableHead>
                  <TableHead>CPL</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((item, index) => {
                  const {
                    leadsGenerated,
                    salesCount,
                    productsSold,
                    revenue,
                    investedAmount,
                  } = item

                  const ticketMedio = salesCount > 0 ? revenue / salesCount : 0
                  const pa = salesCount > 0 ? productsSold / salesCount : 0
                  const roi = revenue - investedAmount
                  const cac = salesCount > 0 ? investedAmount / salesCount : 0
                  const cpl =
                    leadsGenerated > 0 ? investedAmount / leadsGenerated : 0

                  return (
                    <TableRow key={index}>
                      <TableCell>
                        <Select
                          value={item.channelId?.toString() || ''}
                          onValueChange={(value) =>
                            updateItem(index, 'channelId', parseInt(value))
                          }
                        >
                          <SelectTrigger className='w-[180px]'>
                            <SelectValue placeholder='Selecione um canal' />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              {channels.map((channel) => (
                                <SelectItem
                                  key={channel.id}
                                  value={channel.id.toString()}
                                >
                                  {channel.name}
                                </SelectItem>
                              ))}
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        <CurrencyInput
                          className='min-w-32'
                          value={leadsGenerated}
                          onValueChange={(value) =>
                            updateItem(index, 'leadsGenerated', value || 0)
                          }
                        />
                      </TableCell>
                      <TableCell>
                        <CurrencyInput
                          className='min-w-32'
                          value={salesCount}
                          onValueChange={(value) =>
                            updateItem(index, 'salesCount', value || 0)
                          }
                        />
                      </TableCell>
                      <TableCell>
                        <CurrencyInput
                          className='min-w-32'
                          value={productsSold}
                          onValueChange={(value) =>
                            updateItem(index, 'productsSold', value || 0)
                          }
                        />
                      </TableCell>
                      <TableCell>
                        <CurrencyInput
                          className='min-w-32'
                          value={revenue}
                          onValueChange={(value) =>
                            updateItem(index, 'revenue', value || 0)
                          }
                        />
                      </TableCell>
                      <TableCell>
                        <CurrencyInput
                          className='min-w-32'
                          value={investedAmount}
                          onValueChange={(value) =>
                            updateItem(index, 'investedAmount', value || 0)
                          }
                        />
                      </TableCell>
                      <TableCell>
                        <CurrencyInput
                          className='min-w-32'
                          value={ticketMedio}
                          disabled
                        />
                      </TableCell>
                      <TableCell>
                        <CurrencyInput
                          className='min-w-32'
                          value={pa}
                          disabled
                        />
                      </TableCell>
                      <TableCell>
                        <CurrencyInput
                          className='min-w-32'
                          value={roi}
                          disabled
                        />
                      </TableCell>
                      <TableCell>
                        <CurrencyInput
                          className='min-w-32'
                          value={cac}
                          disabled
                        />
                      </TableCell>
                      <TableCell>
                        <CurrencyInput
                          className='min-w-32'
                          value={cpl}
                          disabled
                        />
                      </TableCell>
                      <TableCell>
                        <Button
                          type='button'
                          onClick={() => removeItem(index)}
                        >
                          Remover
                        </Button>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>

            <div className='mt-4 flex justify-end space-x-2'>
              <Button
                onClick={handleSubmit(onSubmit)}
                disabled={isPending}
              >
                {isPending ? 'Salvando...' : 'Salvar'}
              </Button>
              <Button
                variant='outline'
                onClick={() => setOpen(false)}
              >
                Cancelar
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
