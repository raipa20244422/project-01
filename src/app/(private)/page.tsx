import { BarChartHome } from '@/components/bar-chart'
import { ChartNumberSales } from '@/components/chart-number-sales'
import { LineChart1 } from '@/components/line-chart'
import { PieVisitors } from '@/components/pie-visitors'

export default function Home() {
  return (
    <main className='flex w-full flex-col space-y-10 p-4'>
      <div className='grid max-h-96 w-full grid-cols-1 gap-4 md:grid-cols-[1fr_350px]'>
        <BarChartHome />
        <PieVisitors />
      </div>
      <div className='grid max-h-96 w-full grid-cols-1 gap-4 md:grid-cols-[1fr_350px]'>
        <BarChartHome />
        <ChartNumberSales />
      </div>
    </main>
  )
}
