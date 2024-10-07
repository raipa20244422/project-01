import { Suspense } from 'react'

import { SearchBilling } from '@/components/search/search-billing'
import { SkeletonTableSales } from '@/components/skeleton/table-sales'
import { TableSales } from '@/components/table/table-sales'

export default function Invoicing() {
  return (
    <main className='flex w-full flex-col space-y-4 p-4'>
      <SearchBilling />
      <Suspense fallback={<SkeletonTableSales />}>
        <TableSales />
      </Suspense>
    </main>
  )
}
