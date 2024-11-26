import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

import { Skeleton } from '../ui/skeleton'

export function SkeletonTableGoals() {
  return (
    <div className='h-full overflow-hidden rounded-lg border bg-white'>
      <Table className='border-none'>
        <TableHeader>
          <TableRow>
            <TableHead className='w-36'>Meta ID</TableHead>
            <TableHead className='w-36'>Tipo de Meta</TableHead>
            <TableHead className='w-36'>Valor Investido</TableHead>
            <TableHead className='w-36'>Faturamento</TableHead>
            <TableHead className='w-36'>Leads Convertidos</TableHead>
            <TableHead className='w-36'>Número de Vendas</TableHead>
            <TableHead className='w-36'>Produtos Vendidos</TableHead>
            <TableHead className='w-36'>Data</TableHead>
            <TableHead className='w-24'>Opções</TableHead>
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
              <TableCell className='w-20'>
                <Skeleton className='h-7' />
              </TableCell>
              <TableCell className='w-96'>
                <Skeleton className='h-7' />
              </TableCell>
              <TableCell className='w-20'>
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
