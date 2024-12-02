'use client'

import { TrendingUp } from 'lucide-react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  ResponsiveContainer,
  XAxis,
} from 'recharts'

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

export const description = 'Gráfico de faturamento mensal'

interface FaturamentoMensalProps {
  data: { month: string; value: number }[]
  title?: string
  description?: string
  trend?: string
  trendValue?: number
}

const chartConfig = {
  value: {
    label: 'Faturamento',
    color: 'hsl(var(--chart-1))',
  },
} satisfies ChartConfig

export function FaturamentoMensal({
  data,
  title = 'Faturamento Mensal',
  description = 'Dados do ano corrente',
  trend = 'up',
  trendValue = 0,
}: FaturamentoMensalProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <ResponsiveContainer
            width='100%'
            height={400}
          >
            <BarChart
              data={data}
              margin={{
                top: 20,
                right: 20,
                left: 20,
              }}
            >
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey='month'
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                tickFormatter={(value) => value.slice(0, 3)}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Bar
                dataKey='value'
                fill='var(--color-value)'
                radius={8}
              ></Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
      <CardFooter className='flex-col items-start gap-2 text-sm'>
        <div className='flex gap-2 font-medium leading-none'>
          {trend === 'up' ? (
            <>
              Aumentou {trendValue}% em relação ao ano anterior{' '}
              <TrendingUp className='h-4 w-4' />
            </>
          ) : (
            <>
              Diminuiu {trendValue}% em relação ao ano anterior
              {/* Você pode adicionar um ícone de tendência para baixo aqui */}
            </>
          )}
        </div>
        <div className='leading-none text-muted-foreground'>
          Mostrando o total de faturamento dos últimos 12 meses
        </div>
      </CardFooter>
    </Card>
  )
}
