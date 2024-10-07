import { Suspense } from 'react'

import { SearchLeads } from '@/components/search/search-leads'
import { SkeletonTableSales } from '@/components/skeleton/table-sales'
import { TableSales } from '@/components/table/table-sales'

export default function Requests() {
  return (
    <main className='flex w-full flex-col space-y-4 p-4'>
      <SearchLeads />
      <Suspense fallback={<SkeletonTableSales />}>
        <TableSales />
      </Suspense>
    </main>
  )
}
