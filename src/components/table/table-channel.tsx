import { getPaginatedChannels } from '@/actions/channel-actions'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

import { EmptyChannel } from '../empty-table/empty-channel'
import { FormChannel } from '../form-channel'
import { Button } from '../ui/button'

export async function TableChannels() {
  const { currentPage, channels, totalChannels, totalPages } =
    await getPaginatedChannels()

  if (!channels || channels.length === 0) {
    return <EmptyChannel />
  }

  return (
    <div className='rounded-lg bg-white'>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className='w-96'>Canal ID</TableHead>
            <TableHead className='w-96'>Nome</TableHead>
            <TableHead className='w-96'>Opções</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {channels.map((channel, index) => (
            <TableRow key={index}>
              <TableCell className='h-5 w-96 text-xs font-medium text-gray-500'>
                {channel.id}
              </TableCell>
              <TableCell className='h-5 w-96 text-xs font-medium text-gray-500'>
                {channel.name}
              </TableCell>
              <TableCell className='h-5 w-20 text-xs text-gray-500'>
                <FormChannel
                  create={false}
                  id={channel.id}
                >
                  <Button
                    className='flex h-7 items-center justify-center'
                    variant={'outline'}
                  >
                    ...
                  </Button>
                </FormChannel>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
