import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

import { Skeleton } from '../ui/skeleton'

export function SkeletonTableCollaborator() {
  return (
    <div className='h-full overflow-hidden rounded-lg border bg-white'>
      <Table className='border-none'>
        <TableHeader>
          <TableRow>
            <TableHead className='w-96'>Nome</TableHead>
            <TableHead className='w-20'>Leads Gerados</TableHead>
            <TableHead className='w-20'>Vendas</TableHead>
            <TableHead className='w-20'>Produtos Vendidos</TableHead>
            <TableHead className='w-20'>Faturamento</TableHead>
            <TableHead className='w-20'>Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: 20 }).map((_, index) => (
            <TableRow key={index}>
              <TableCell className='w-96'>
                <Skeleton className='h-7' />
              </TableCell>
              <TableCell className='w-96'>
                <Skeleton className='h-7' />
              </TableCell>
              <TableCell className='w-20'>
                <Skeleton className='h-7' />
              </TableCell>
              <TableCell className='w-96'>
                <Skeleton className='h-7' />
              </TableCell>
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
