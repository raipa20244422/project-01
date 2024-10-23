import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

import { Skeleton } from '../ui/skeleton'

export function SkeletonTableLead() {
  return (
    <div className='h-full overflow-hidden rounded-lg border bg-white'>
      <Table className='border-none'>
        <TableHeader>
          <TableRow>
            <TableHead className='w-96'>Nome</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: 20 }).map((_, index) => (
            <TableRow key={index}>
              <TableCell className='w-96'>
                <Skeleton className='h-7' />
              </TableCell>
              <TableCell className='w-20'>
                <Skeleton className='h-7' />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
