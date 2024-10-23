import { Suspense } from 'react'

import { SearchCollaborator } from '@/components/search/search-collaborator'
import { SkeletonTableCollaborator } from '@/components/skeleton/table-collaborator'
import { TableCollaborator } from '@/components/table/table-collaborator'

export default function Collaborator() {
  return (
    <main className='flex w-full flex-col space-y-4 p-4'>
      <Suspense>
        <SearchCollaborator />
      </Suspense>

      <Suspense fallback={<SkeletonTableCollaborator />}>
        <TableCollaborator />
      </Suspense>
    </main>
  )
}
