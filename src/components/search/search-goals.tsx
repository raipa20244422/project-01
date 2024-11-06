'use client'

import { Search } from 'lucide-react'
import { useQueryState } from 'nuqs'
import { FormEvent } from 'react'

import { Input } from '@/components/ui/input'

import { FormGoal } from '../form-goals'
import { Button } from '../ui/button'

export function SearchGoals() {
  const [query, setQuery] = useQueryState('search', {
    defaultValue: '',
  })

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    const formData = new FormData(event.currentTarget)
    const search = formData.get('search')

    if (typeof search === 'string' && search.trim() !== '') {
      setQuery(search)
    }
  }

  return (
    <div className='flex h-9 items-center justify-between space-x-2'>
      <form
        onSubmit={onSubmit}
        className='flex w-full space-x-2'
      >
        <div className='flex w-full items-center space-x-1 rounded-lg border px-2 md:max-w-md'>
          <Search className='h-5 w-5' />
          <Input
            type='text'
            name='search'
            className='w-full border-none p-0 focus-visible:ring-0'
            placeholder='Busque pelo nome do canal'
          />
        </div>
        <FormGoal create>
          <Button
            type='button'
            className='text-white'
          >
            Adicionar Meta
          </Button>
        </FormGoal>
      </form>
    </div>
  )
}
