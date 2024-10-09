import { Suspense } from 'react'

import { SearchChannel } from '@/components/search/search-chanel'
import { SkeletonTableChannel } from '@/components/skeleton/table-channel'
import { TableChannel } from '@/components/table/table-channel'

interface SearchParams {
  search?: string
  page?: number
}

export default function Channel({
  searchParams,
}: {
  searchParams: SearchParams
}) {
  return (
    <main className='flex w-full flex-col space-y-4 p-4'>
      <Suspense>
        <SearchChannel />
      </Suspense>

      <Suspense fallback={<SkeletonTableChannel />}>
        <TableChannel />
      </Suspense>
    </main>
  )
}
