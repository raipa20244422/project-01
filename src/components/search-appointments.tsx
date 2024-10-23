'use client'

import { format, parse } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { CalendarIcon, Plus } from 'lucide-react'
import { useQueryStates } from 'nuqs'
import { useState } from 'react'

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'

import { Button } from './ui/button'
import { Calendar } from './ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover'

export function SearchAppointments() {
  const [query, setQuery] = useQueryStates({
    date: {
      type: 'string',
      parse: (value) => {
        const parsedDate = parse(value, 'dd-MM-yyyy', new Date()) // Corrige o formato
        return isNaN(parsedDate.getTime()) ? undefined : parsedDate
      },
      serialize: (date) => format(date, 'dd-MM-yyyy'),
    },
  })

  const [date, setDate] = useState<Date>(query.date || new Date())

  const setParamsUrl = (param: Date | undefined) => {
    if (!param) {
      return null
    }

    setQuery({ date: param })
    setDate(param)
  }

  return (
    <div className='flex h-9 items-center justify-end space-x-2'>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant={'outline'}
            className={cn(
              'w-[240px] justify-start text-left font-normal',
              !date && 'text-muted-foreground',
            )}
          >
            <CalendarIcon className='mr-2 h-4 w-4' />
            {date ? (
              format(date, 'PPP', { locale: ptBR })
            ) : (
              <span>Selecione a data</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className='w-auto p-0'
          align='start'
        >
          <Calendar
            mode='single'
            selected={date}
            onSelect={setParamsUrl}
            initialFocus
          />
        </PopoverContent>
      </Popover>
      <Select>
        <SelectTrigger className='w-[180px]'>
          <SelectValue placeholder='Ordem' />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem value='latest'>Mais recentes</SelectItem>
            <SelectItem value='latest'>Mais recentes</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
      <Select>
        <SelectTrigger className='w-[180px]'>
          <SelectValue placeholder='Situação' />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem value='pending'>Pendentes</SelectItem>
            <SelectItem value='completed'>Concluídos</SelectItem>
            <SelectItem value='refused'>Recusados</SelectItem>
            <SelectItem value='cancelled'>Cancelados</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
      <Button
        className='p-2'
        variant={'outline'}
      >
        <Plus strokeWidth={1.5} />
      </Button>
    </div>
  )
}
