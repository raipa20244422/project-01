//import { getAllLeadsByOrganization } from '@/actions/get-organization-lead'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

import { EmptyLead } from '../empty-table/empty-lead'
import { Button } from '../ui/button'

export type ResponseLead = {
  id: string
  name: string
}

export async function TableLead() {
  //const { leads } = await getAllLeadsByOrganization()

  // if (!leads || leads.length === 0) {
  //   return <EmptyLead />
  // }

  return (
    <div className='rounded-lg bg-white'>
      {/* <Table>
        <TableHeader>
          <TableRow>
            <TableHead className='w-96'>Nome</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {leads.map((current, index) => (
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
      </Table> */}
    </div>
  )
}
