'use client'
import { format, parse } from 'date-fns'
import dayjs from 'dayjs'
import { useQueryStates } from 'nuqs'

interface MonthData {
  month: string
  days: number[]
}

function generateYearData(year: number): MonthData[] {
  const months: MonthData[] = Array.from({ length: 12 }, (_, monthIndex) => {
    const daysInMonth = dayjs(`${year}-${monthIndex + 1}-01`).daysInMonth()
    return {
      month: dayjs(`${year}-${monthIndex + 1}-01`).format('MMMM'),
      days: Array.from({ length: daysInMonth }, (_, dayIndex) => dayIndex + 1),
    }
  })
  return months
}

export default function ListAppointments() {
  const [query, setQuery] = useQueryStates({
    date: {
      type: 'string',
      parse: (value) => {
        const parsedDate = parse(value, 'dd-MM-yyyy', new Date())
        return isNaN(parsedDate.getTime()) ? new Date() : parsedDate
      },
      serialize: (date) => format(date, 'dd-MM-yyyy'),
    },
  })

  const selectedDate = query.date ? dayjs(query.date) : dayjs()

  const year = selectedDate.year()
  const months: MonthData[] = generateYearData(year)

  return (
    <div className='flex gap-2 overflow-scroll scrollbar-hide'>
      {months.map((current, index) => (
        <div
          key={index}
          className='flex h-20 w-20 flex-col items-center rounded-lg border p-4'
        >
          <span>{index}</span>
        </div>
      ))}
    </div>
  )
}
