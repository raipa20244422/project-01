'use client'

import { useSearchParams } from 'next/navigation'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { formatDate, formatReal } from '@/utils/format-all'

import { EmptySales } from '../empty-table/empty-sales'
import { Button } from '../ui/button'

export type ResponseSales = {
  saleId: string
  date: Date
  totalAmount: number
  customerName: string
}

export function TableCollaborator() {
  const searchParams = useSearchParams()

  const order = searchParams.get('order')
  const situation = searchParams.get('situation')
  const search = searchParams.get('search')

  let sales: ResponseSales[] = []

  if (!sales || sales.length === 0) {
    return <EmptySales />
  }

  return (
    <div className='rounded-lg bg-white'>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className='w-96'>Cliente</TableHead>
            <TableHead className='w-20'>Valor</TableHead>
            <TableHead className='w-20'>Data</TableHead>
            <TableHead className='w-20'>Status</TableHead>
            <TableHead className='w-20'>Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sales.map((current, index) => (
            <TableRow key={index}>
              <TableCell className='h-5 w-96 text-xs font-medium text-gray-500'>
                {current.customerName}
              </TableCell>
              <TableCell className='h-5 w-20 text-xs text-gray-500'>
                {formatReal(Number(current.totalAmount))}
              </TableCell>
              <TableCell className='h-5 w-20 text-nowrap text-xs text-gray-500'>
                {formatDate(current.date)}
              </TableCell>
              <TableCell className='h-5 w-20 text-xs text-gray-500'>
                Fechada
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
