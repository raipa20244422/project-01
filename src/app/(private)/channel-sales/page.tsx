import { Suspense } from 'react'

import { SearchSales } from '@/components/search/search-sales'
import { SkeletonTableSales } from '@/components/skeleton/table-sales'
import { TableSales } from '@/components/table/table-sales'

export default function Sales() {
  return (
    <main className='flex w-full flex-col space-y-4 p-4'>
      <Suspense>
        <SearchSales />
      </Suspense>

      <Suspense fallback={<SkeletonTableSales />}>
        <TableSales />
      </Suspense>
    </main>
  )
}
