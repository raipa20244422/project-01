import { ListX } from 'lucide-react'

import { Table, TableHead, TableHeader, TableRow } from '@/components/ui/table'

export function EmptyInvestments() {
  return (
    <div className='h-full overflow-hidden rounded-lg border bg-white'>
      <Table className='border-none'>
        <TableHeader>
          <TableRow>
            <TableHead className='w-96'>Investimento ID</TableHead>
            <TableHead className='w-96'>Valor</TableHead>
            <TableHead className='w-96'>Lucro</TableHead>
            <TableHead className='w-96'>Data</TableHead>
            <TableHead className='w-96'>Opções</TableHead>
          </TableRow>
        </TableHeader>
      </Table>
      <div className='flex h-full items-center justify-center'>
        <div className='m-auto flex flex-col items-center space-y-1'>
          <ListX className='h-8 w-8' />
          <div className='flex flex-col'>
            <p className='text-center text-xs text-gray-500'>
              Nenhum Resultado Encontrado
            </p>
            <p className='text-center text-xs text-gray-500'>
              Ainda não há transações.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
