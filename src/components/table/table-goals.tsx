import { getPaginatedGoals } from '@/actions/goals-actions'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { formatDate, formatReal } from '@/utils/format-all'

import { ButtonDeleteGoals } from '../button-delete-goals'
import { EmptyGoals } from '../empty-table/empty-goals'
import { FormGoal } from '../form-goals'
import { Button } from '../ui/button'

export async function TableGoals() {
  const { goals, currentPage, totalGoals, totalPages } =
    await getPaginatedGoals()

  if (!goals || goals.length === 0) {
    return <EmptyGoals />
  }

  return (
    <div className='rounded-lg bg-white'>
      <Table>
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
            <TableHead className='w-24'>Editar</TableHead>
            <TableHead className='w-24'>Deletar</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {goals.map((goal, index) => (
            <TableRow key={index}>
              <TableCell className='h-5 w-36 text-xs font-medium text-gray-500'>
                {goal.id}
              </TableCell>
              <TableCell className='h-5 w-36 text-xs font-medium text-gray-500'>
                {goal.goalType}
              </TableCell>
              <TableCell className='h-5 w-36 text-xs font-medium text-gray-500'>
                {formatReal(goal.valorInvestido)}
              </TableCell>
              <TableCell className='h-5 w-36 text-xs font-medium text-gray-500'>
                {formatReal(goal.faturamento)}
              </TableCell>
              <TableCell className='h-5 w-36 text-xs font-medium text-gray-500'>
                {goal.ledsGerados}
              </TableCell>
              <TableCell className='h-5 w-36 text-xs font-medium text-gray-500'>
                {goal.numeroVendas}
              </TableCell>
              <TableCell className='h-5 w-36 text-xs font-medium text-gray-500'>
                {goal.produtosVendidos}
              </TableCell>
              <TableCell className='h-5 w-36 text-xs font-medium text-gray-500'>
                {formatDate(goal.createdAt)}
              </TableCell>
              <TableCell className='h-5 w-24 text-xs text-gray-500'>
                <FormGoal
                  create={false}
                  id={goal.id}
                >
                  <Button
                    className='flex h-7 items-center justify-center'
                    variant={'outline'}
                  >
                    ...
                  </Button>
                </FormGoal>
              </TableCell>
              <TableCell className='h-5 w-36 text-xs font-medium text-gray-500'>
                <ButtonDeleteGoals id={goal.id} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
