import { BarChartHome } from '@/components/bar-chart'

export default function Home() {
  return (
    <main className='flex w-full flex-col space-y-10 p-4'>
      <div className='grid max-h-96 w-full grid-cols-1 gap-4'>
        <BarChartHome />
        {/* <PieVisitors /> */}
      </div>
    </main>
  )
}
