import { Suspense } from 'react'

import { SearchInvestments } from '@/components/search/search-investments'
import { SkeletonTableInvestments } from '@/components/skeleton/table-investments'
import { TableInvestments } from '@/components/table/table-investments'

interface SearchParams {
  search?: string
  page?: number
}

export default function investments({
  searchParams,
}: {
  searchParams: SearchParams
}) {
  console.log(searchParams.search)
  return (
    <main className='flex w-full flex-col space-y-4 p-4'>
      <Suspense>
        <SearchInvestments />
      </Suspense>

      <Suspense fallback={<SkeletonTableInvestments />}>
        <TableInvestments />
      </Suspense>
    </main>
  )
}
