'use client'

import { TrendingUp } from 'lucide-react'
import { Bar, BarChart, CartesianGrid, LabelList, XAxis, YAxis } from 'recharts'

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

export const description =
  'Gráfico de investimentos por canal com rótulos personalizados'

const chartConfig = {
  desktop: {
    label: 'Faturamento',
    color: 'hsl(var(--chart-1))',
  },
  mobile: {
    label: 'Investimento',
    color: 'hsl(var(--chart-2))',
  },
  label: {
    color: 'hsl(var(--background))',
  },
} satisfies ChartConfig

interface ChartInvestmentsChannelsProps {
  data: {
    nome: string
    faturamento: number
    valorInvestido: number
  }[]
}

export function ChartInvestmentsChannels({
  data,
}: ChartInvestmentsChannelsProps) {
  // Preparar os dados para o gráfico
  const chartData = data.map((item) => ({
    channel: item.nome,
    faturamento: item.faturamento,
    investimento: item.valorInvestido,
  }))

  // Como o gráfico original usa 'desktop' e 'mobile', vamos mapear nossos dados para essas chaves
  const mappedChartData = chartData.map((item) => ({
    month: item.channel, // Usamos 'channel' como 'month' no gráfico
    desktop: item.faturamento,
    mobile: item.investimento,
  }))

  return (
    <Card>
      <CardHeader>
        <CardTitle>Vendas por mês</CardTitle>
        <CardDescription>Vendas</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart
            accessibilityLayer
            data={mappedChartData}
            layout='vertical'
            margin={{
              right: 16,
            }}
          >
            <CartesianGrid horizontal={false} />
            <YAxis
              dataKey='month'
              type='category'
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
              hide
            />
            <XAxis
              type='number'
              hide
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator='line' />}
            />
            <Bar
              dataKey='desktop'
              layout='vertical'
              fill='var(--color-desktop)'
              radius={4}
            >
              <LabelList
                dataKey='month'
                position='insideLeft'
                offset={8}
                className='fill-[--color-label]'
                fontSize={12}
              />
              <LabelList
                dataKey='desktop'
                position='right'
                offset={8}
                className='fill-foreground'
                fontSize={12}
                formatter={(value: number) =>
                  value.toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL',
                  })
                }
              />
            </Bar>
            {/* Adicionar uma segunda barra para o valor investido */}
            <Bar
              dataKey='mobile'
              layout='vertical'
              fill='var(--color-mobile)'
              radius={4}
            >
              <LabelList
                dataKey='mobile'
                position='right'
                offset={8}
                className='fill-foreground'
                fontSize={12}
                formatter={(value: number) =>
                  value.toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL',
                  })
                }
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className='flex-col items-start gap-2 text-sm'>
        <div className='flex gap-2 font-medium leading-none'>
          Aumento de 5.2% este mês <TrendingUp className='h-4 w-4' />
        </div>
        <div className='leading-none text-muted-foreground'>
          Mostrando investimentos e faturamento por canal
        </div>
      </CardFooter>
    </Card>
  )
}
