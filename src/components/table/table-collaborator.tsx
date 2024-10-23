import { getAllCollaboratorsByOrganization } from '@/actions/gt-organization-collaborator'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { formatReal } from '@/utils/format-all'

import { EmptyCollaborator } from '../empty-table/empty-collaborator'
import { FormCollaborator } from '../form-collaborator'
import { Button } from '../ui/button'

export type ResponseCollaborator = {
  id: string
  name: string
  leadsAttended: number
  salesCount: number
  productsSold: number
  revenue: number
}

export async function TableCollaborator() {
  const { collaborators } = await getAllCollaboratorsByOrganization()

  if (!collaborators || collaborators.length === 0) {
    return <EmptyCollaborator />
  }

  return (
    <div className='rounded-lg bg-white'>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className='w-96'>Nome</TableHead>
            <TableHead className='w-20'>Leads Atendidos</TableHead>
            <TableHead className='w-20'>Vendas</TableHead>
            <TableHead className='w-20'>Produtos Vendidos</TableHead>
            <TableHead className='w-20'>Faturamento</TableHead>
            <TableHead className='w-20'>Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {collaborators.map((current, index) => (
            <TableRow key={index}>
              <TableCell className='h-5 w-96 text-xs font-medium text-gray-500'>
                {current.name}
              </TableCell>
              <TableCell className='h-5 w-20 text-xs text-gray-500'>
                {current.leadsAttended}
              </TableCell>
              <TableCell className='h-5 w-20 text-xs text-gray-500'>
                {current.salesCount}
              </TableCell>
              <TableCell className='h-5 w-20 text-xs text-gray-500'>
                {current.productsSold}
              </TableCell>
              <TableCell className='h-5 w-20 text-xs text-gray-500'>
                {formatReal(current.revenue)}
              </TableCell>
              <TableCell className='h-5 w-20 text-xs text-gray-500'>
                <FormCollaborator
                  create={false}
                  id={current.id}
                >
                  <Button
                    className='flex h-7 items-center justify-center'
                    variant={'outline'}
                  >
                    ...
                  </Button>
                </FormCollaborator>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
