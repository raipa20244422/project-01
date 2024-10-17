'use client'

import { Search } from 'lucide-react'
import { useQueryState } from 'nuqs'

import { Input } from '@/components/ui/input'

import { FormSale } from '../form-sales'
import { Button } from '../ui/button'

export function SearchSales() {
  const [query, setQuery] = useQueryState('search', {
    defaultValue: '',
  })

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value)
  }

  return (
    <div className='flex h-9 items-center justify-between space-x-2'>
      <form className='flex w-full space-x-2'>
        <div className='flex w-full items-center space-x-1 rounded-lg border px-2 md:max-w-md'>
          <Search className='h-5 w-5' />
          <Input
            value={query}
            onChange={handleSearch}
            className='w-full border-none p-0 focus-visible:ring-0'
            placeholder='Busque pelo nome'
          />
        </div>

        <FormSale create>
          <Button
            type='button'
            className='text-white'
          >
            Adicionar Venda
          </Button>
        </FormSale>
      </form>
    </div>
  )
}
