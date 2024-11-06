import { Suspense } from 'react'

import { SearchGoals } from '@/components/search/search-goals'
import { SkeletonTableGoals } from '@/components/skeleton/table-goals'
import { TableGoals } from '@/components/table/table-goals'

interface SearchParams {
  search?: string
  page?: number
}

export default function gols({ searchParams }: { searchParams: SearchParams }) {
  return (
    <main className='flex w-full flex-col space-y-4 p-4'>
      <Suspense>
        <SearchGoals />
      </Suspense>

      <Suspense fallback={<SkeletonTableGoals />}>
        <TableGoals />
      </Suspense>
    </main>
  )
}
