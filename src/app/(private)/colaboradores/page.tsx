import { Suspense } from 'react'

import { SearchCollaborator } from '@/components/search/search-collaborator'
import { SkeletonTableSales } from '@/components/skeleton/table-sales'
import { TableCollaborator } from '@/components/table/table-collaborator'

export default function Collaborator() {
  return (
    <main className='flex w-full flex-col space-y-4 p-4'>
      <SearchCollaborator />
      <Suspense fallback={<SkeletonTableSales />}>
        <TableCollaborator />
      </Suspense>
    </main>
  )
}
