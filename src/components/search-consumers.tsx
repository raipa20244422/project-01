import { Plus, Search } from 'lucide-react'

import { Button } from './ui/button'
import { Input } from './ui/input'

export function SearchConsumers() {
  return (
    <div className='flex h-9 items-center justify-between'>
      <div className='flex w-full items-center space-x-1 rounded-lg border px-2 md:max-w-96'>
        <Search className='h-5 w-5' />
        <Input
          className='w-full border-none p-0 focus-visible:ring-0'
          placeholder='Busque pelo nome'
        />
      </div>
    </div>
  )
}
