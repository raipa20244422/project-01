import { getPaginatedInvestments } from '@/actions/investment-actions'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { formatDate, formatReal } from '@/utils/format-all'

import { EmptyInvestments } from '../empty-table/empty-investments'
import { FormInvestment } from '../form-investments'
import { Button } from '../ui/button'

export async function TableInvestments() {
  const { currentPage, investments, totalInvestments, totalPages } =
    await getPaginatedInvestments()

  if (!investments || investments.length === 0) {
    return <EmptyInvestments />
  }

  return (
    <div className='rounded-lg bg-white'>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className='w-96'>Investimento ID</TableHead>
            <TableHead className='w-96'>Valor</TableHead>
            <TableHead className='w-96'>Lucro</TableHead>
            <TableHead className='w-96'>Data</TableHead>
            <TableHead className='w-96'>Opções</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {investments.map((current, index) => (
            <TableRow key={index}>
              <TableCell className='h-5 w-96 text-xs font-medium text-gray-500'>
                {current.id}
              </TableCell>
              <TableCell className='h-5 w-96 text-xs font-medium text-gray-500'>
                {formatReal(current.amount)}
              </TableCell>
              <TableCell className='h-5 w-96 text-xs font-medium text-gray-500'>
                {formatReal(current.profit)}
              </TableCell>
              <TableCell className='h-5 w-96 text-xs font-medium text-gray-500'>
                {formatDate(current.month)}
              </TableCell>
              <TableCell className='h-5 w-20 text-xs text-gray-500'>
                <FormInvestment
                  create
                  id={current.id}
                >
                  <Button
                    className='flex h-7 items-center justify-center'
                    variant={'outline'}
                  >
                    ...
                  </Button>
                </FormInvestment>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
