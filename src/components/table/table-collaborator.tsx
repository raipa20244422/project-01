import { getAllCollaboratorsByOrganization } from '@/actions/gt-organization-collaborator'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

import { EmptyCollaborator } from '../empty-table/empty-collaborator'
import { Button } from '../ui/button'

export type ResponseCollaborator = {
  id: string
  name: string
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
                <Button
                  className='flex h-7 items-center justify-center'
                  variant={'outline'}
                >
                  ...
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
