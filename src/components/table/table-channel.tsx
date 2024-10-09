import { getPaginatedChannels } from '@/actions/get-channels'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

import { EmptyChannel } from '../empty-table/empty-channel'
import { Button } from '../ui/button'

export async function TableChannel() {
  const { channels, currentPage, totalChannels, totalPages } =
    await getPaginatedChannels()

  if (!channels || channels.length === 0) {
    return <EmptyChannel />
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
          {channels.map((current, index) => (
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
