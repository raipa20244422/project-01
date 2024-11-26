'use client'

import { TrendingDown, TrendingUp } from 'lucide-react'
import { CartesianGrid, LabelList, Line, LineChart, XAxis } from 'recharts'

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'

interface QtdeSalesofMothProps {
  salesData: {
    month: Date
    salesCount: number
  }[]
  title: string
}

const chartConfig = {
  value: {
    label: 'Vendas',
    color: 'hsl(var(--chart-1))',
  },
} satisfies ChartConfig

export function QtdeSalesofMoth({ salesData, title }: QtdeSalesofMothProps) {
  // Agrupar dados por mês, somando salesCount
  const groupedSalesData = salesData.reduce(
    (acc, current) => {
      const monthKey = current.month.toLocaleString('pt-BR', {
        month: 'long',
        year: 'numeric',
      })

      if (!acc[monthKey]) {
        acc[monthKey] = {
          month: current.month,
          salesCount: current.salesCount,
        }
      } else {
        acc[monthKey].salesCount += current.salesCount
      }

      return acc
    },
    {} as Record<string, { month: Date; salesCount: number }>,
  )

  // Converter objeto agrupado para array e ordenar
  const sortedSalesData = Object.values(groupedSalesData).sort(
    (a, b) => a.month.getTime() - b.month.getTime(),
  )

  // Transformar os dados para o formato esperado pelo gráfico
  const chartData = sortedSalesData.map((item) => ({
    month: item.month.toLocaleString('pt-BR', { month: 'long' }),
    value: item.salesCount,
  }))

  // Calcular crescimento em relação ao mês anterior
  let crescimento = 'N/A'
  let isPositive = false

  if (sortedSalesData.length > 1) {
    const ultimoMes = sortedSalesData[sortedSalesData.length - 1]
    const penultimoMes = sortedSalesData[sortedSalesData.length - 2]

    if (penultimoMes.salesCount > 0) {
      const crescimentoValor =
        ((ultimoMes.salesCount - penultimoMes.salesCount) /
          penultimoMes.salesCount) *
        100
      crescimento = crescimentoValor.toFixed(2) + '%'
      isPositive = crescimentoValor >= 0
    }
  }

  // Remover o símbolo de % e converter para número
  const trendValue =
    crescimento !== 'N/A' ? parseFloat(crescimento.replace('%', '')) : 0

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>
          Exibindo dados de vendas mensais de todo o ano
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <LineChart
            accessibilityLayer
            data={chartData}
            margin={{
              top: 20,
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey='month'
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator='line' />}
            />
            <Line
              dataKey='value'
              type='natural'
              stroke='var(--color-value)'
              strokeWidth={2}
              dot={{
                fill: 'var(--color-value)',
              }}
              activeDot={{
                r: 6,
              }}
            >
              <LabelList
                position='top'
                offset={12}
                className='fill-foreground'
                fontSize={12}
              />
            </Line>
          </LineChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className='flex-col items-start gap-2 text-sm'>
        {crescimento !== 'N/A' && (
          <>
            <div className='flex gap-2 font-medium leading-none'>
              {isPositive ? 'Crescimento' : 'Queda'} de vendas{' '}
              {isPositive ? (
                <TrendingUp className='h-4 w-4 text-green-500' />
              ) : (
                <TrendingDown className='h-4 w-4 text-red-500' />
              )}
            </div>
            <div className='leading-none text-muted-foreground'>
              {`A variação foi de ${Math.abs(trendValue)}%`}
            </div>
          </>
        )}
        {crescimento === 'N/A' && (
          <div className='text-muted-foreground'>
            Dados de crescimento indisponíveis
          </div>
        )}
      </CardFooter>
    </Card>
  )
}
