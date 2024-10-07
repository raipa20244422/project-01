'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { Plus, Search } from 'lucide-react'
import { useForm } from 'react-hook-form'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  SearchSalesSchema,
  searchSalesSchema,
} from '@/lib/zod/search/search-sales'

export function SearchMetas() {
  const { register, handleSubmit } = useForm<SearchSalesSchema>({
    resolver: zodResolver(searchSalesSchema),
  })

  const handleOrderChange = (value: string) => {
    //setQuery({ order: value })
  }

  const handleStatusChange = (value: string) => {
    // setQuery({ situation: value })
  }

  const onSubmit = (data: SearchSalesSchema) => {
    //setQuery({ search: data.search })
  }

  return (
    <div className='flex h-9 items-center justify-between space-x-2'>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className='flex w-full space-x-2'
      >
        <div className='flex w-full items-center space-x-1 rounded-lg border px-2 md:max-w-md'>
          <Search className='h-5 w-5' />
          <Input
            {...register('search')}
            className='w-full border-none p-0 focus-visible:ring-0'
            placeholder='Busque pelo nome'
          />
        </div>
        <Button
          type='submit'
          className='text-white'
        >
          Pesquisar
        </Button>
        <Button
          type='button'
          className='text-white'
        >
          Adicionar
        </Button>
      </form>

      <div className='flex items-center space-x-2'>
        <Select onValueChange={handleOrderChange}>
          <SelectTrigger className='w-[180px]'>
            <SelectValue placeholder='Ordem' />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value='service'>Serviço</SelectItem>
              <SelectItem value='product'>Produto</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>

        <Select onValueChange={handleStatusChange}>
          <SelectTrigger className='w-[180px]'>
            <SelectValue placeholder='Situação' />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value='true'>Ativo</SelectItem>
              <SelectItem value='false'>Inativo</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
