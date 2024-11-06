import { Suspense } from 'react'

import { SearchChannel } from '@/components/search/search-channel'
import { SkeletonTableChannel } from '@/components/skeleton/table-channel'
import { TableChannels } from '@/components/table/table-channel'

interface SearchParams {
  search?: string
  page?: number
}

export default function channel({
  searchParams,
}: {
  searchParams: SearchParams
}) {
  console.log(searchParams.search)
  return (
    <main className='flex w-full flex-col space-y-4 p-4'>
      <Suspense>
        <SearchChannel />
      </Suspense>

      <Suspense fallback={<SkeletonTableChannel />}>
        <TableChannels />
      </Suspense>
    </main>
  )
}
