import {
  getAllCollaboratorsByOrganization,
  ResponseCollaborator,
} from '@/actions/gt-organization-collaborator'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { formatReal } from '@/utils/format-all'

import { ButtonDeleteCollaborator } from '../button-delete-collaborator'
import { EmptyCollaborator } from '../empty-table/empty-collaborator'
import { FormCollaborator } from '../form-collaborator'
import { Button } from '../ui/button'

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
            <TableHead className='w-20'>Leads Gerados</TableHead>
            <TableHead className='w-20'>Vendas</TableHead>
            <TableHead className='w-20'>Produtos Vendidos</TableHead>
            <TableHead className='w-20'>Faturamento</TableHead>
            <TableHead className='w-20'>Editar</TableHead>
            <TableHead className='w-20'>Deletar</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {collaborators.map((current: ResponseCollaborator) => (
            <TableRow key={current.id}>
              <TableCell className='h-5 w-96 text-xs font-medium text-gray-500'>
                {current.name}
              </TableCell>
              <TableCell className='h-5 w-20 text-xs text-gray-500'>
                {current.totalLeadsGenerated}
              </TableCell>
              <TableCell className='h-5 w-20 text-xs text-gray-500'>
                {current.totalSalesCount}
              </TableCell>
              <TableCell className='h-5 w-20 text-xs text-gray-500'>
                {current.totalProductsSold}
              </TableCell>
              <TableCell className='h-5 w-20 text-xs text-gray-500'>
                {formatReal(current.totalRevenue)}
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
              <TableCell className='h-5 w-20 text-xs text-gray-500'>
                <ButtonDeleteCollaborator id={current.id} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
