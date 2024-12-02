'use client'

import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { CalendarIcon } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'

import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { cn } from '@/lib/utils'

export function FilterSearch() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [date, setDate] = useState<Date | undefined>()

  useEffect(() => {
    // Obtém parâmetros da URL
    const yearParam = searchParams.get('year')
    const monthParam = searchParams.get('month')

    if (!yearParam || !monthParam) {
      // Se não houver parâmetros, define o mês e ano atuais na URL
      const now = new Date()
      const year = now.getFullYear()
      const month = now.getMonth() + 1
      router.push(`?year=${year}&month=${month}`)
      setDate(now)
    } else {
      // Se os parâmetros existem, atualiza o estado
      const selectedDate = new Date(
        parseInt(yearParam),
        parseInt(monthParam) - 1,
      )
      setDate(selectedDate)
    }
  }, [router, searchParams])

  const handleDateChange = (selectedDate: Date | undefined) => {
    if (selectedDate) {
      setDate(selectedDate)
      const year = selectedDate.getFullYear()
      const month = selectedDate.getMonth() + 1
      router.push(`?year=${year}&month=${month}`)
    }
  }

  return (
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
            format(date, 'MMM yyyy', { locale: ptBR })
          ) : (
            <span>Selecione uma data</span>
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
          onSelect={handleDateChange}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  )
}
