import { getPaginatedSales } from '@/actions/get-paginated-sales'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { formatDate, formatReal } from '@/utils/format-all'

import { ButtonDeleteSales } from '../button-delete-sales'
import { EmptySales } from '../empty-table/empty-sales'
import { FormSale } from '../form-sales'
import { Button } from '../ui/button'

export async function TableSales() {
  const { currentPage, sales, totalPages, totalSales } =
    await getPaginatedSales()

  if (!sales || sales.length === 0) {
    return <EmptySales />
  }

  return (
    <div className='rounded-lg bg-white'>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className='w-96'>Venda ID</TableHead>
            <TableHead className='w-20'>Nome</TableHead>
            <TableHead className='w-20'>Faturamento</TableHead>
            <TableHead className='w-20'>Numero de Vendas</TableHead>
            <TableHead className='w-20'>Total de Produtos</TableHead>
            <TableHead className='w-20'>Taxa de Conversão</TableHead>
            <TableHead className='w-20'>Data</TableHead>
            <TableHead className='w-20'>Editar</TableHead>
            <TableHead className='w-20'>Deletar</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sales.map((current, index) => (
            <TableRow key={index}>
              <TableCell className='h-5 w-96 text-xs font-medium text-gray-500'>
                {current.id}
              </TableCell>
              <TableCell className='h-5 w-96 text-xs font-medium text-gray-500'>
                {current.name}
              </TableCell>
              <TableCell className='h-5 w-20 text-xs text-gray-500'>
                {formatReal(current.amount)}
              </TableCell>
              <TableCell className='h-5 w-20 text-xs text-gray-500'>
                {current.salesCount}
              </TableCell>
              <TableCell className='h-5 w-20 text-xs text-gray-500'>
                {current.productsSold}
              </TableCell>
              <TableCell className='h-5 w-20 text-xs text-gray-500'>
                {current.conversionRate.toFixed(2)}%
              </TableCell>
              <TableCell className='h-5 w-20 text-nowrap text-xs text-gray-500'>
                {formatDate(current.saleDate)}
              </TableCell>
              <TableCell className='h-5 w-20 text-xs text-gray-500'>
                <FormSale
                  create={false}
                  id={current.id}
                >
                  <Button
                    className='flex h-7 items-center justify-center'
                    variant={'outline'}
                  >
                    ...
                  </Button>
                </FormSale>
              </TableCell>
              <TableCell className='h-5 w-20 text-nowrap text-xs text-gray-500'>
                <ButtonDeleteSales id={current.id} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
