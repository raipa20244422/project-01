import { Suspense } from 'react'

import { SearchLeads } from '@/components/search/search-leads'
import { SkeletonTableLead } from '@/components/skeleton/table-lead'
import { TableLead } from '@/components/table/table-lead'

export default function Requests() {
  return (
    <main className='flex w-full flex-col space-y-4 p-4'>
      <Suspense>
        <SearchLeads />
      </Suspense>

      <Suspense fallback={<SkeletonTableLead />}>
        <TableLead />
      </Suspense>
    </main>
  )
}
