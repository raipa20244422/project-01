import { ChartInvestmentsChannels } from '@/components/chart-investiment-channel'
import { FaturamentoMensal } from '@/components/faturamento-mensal'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  calculateDashboardData,
  fetchData,
  prepareChartData,
} from '@/utils/dashboardData'
import { formatReal } from '@/utils/format-all'

export default async function Home() {
  const data = await fetchData()

  if (!data) return null

  const { salesData, collaborators, collaboratorItems, goals, organizationId } =
    data

  const dashboardData = calculateDashboardData({
    salesData,
    collaborators,
    collaboratorItems,
    goals,
  })

  const {
    totalRevenue,
    totalSalesCount,
    totalInvestment,
    ticketMedio,
    atingimentoMetas,
    vendedores,
    vendasPorCanal,
    topVendedores,
  } = dashboardData

  const chartInfo = prepareChartData(salesData)
  const { chartData, trendValue, trend } = chartInfo

  return (
    <main className='flex min-h-screen w-full flex-col space-y-10 p-4'>
      <div className='grid w-full grid-cols-1 gap-4 md:grid-cols-5'>
        <Card>
          <CardHeader>
            <CardTitle>Faturamento</CardTitle>
            <CardDescription>Faturamento das vendas</CardDescription>
          </CardHeader>
          <CardContent>
            <p className='text-2xl font-bold'>{formatReal(totalRevenue)}</p>
            <p className='text-sm text-green-500'>
              {trend === 'up' ? '+' : '-'}
              {trendValue}% em relação ao mês anterior
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quantidade de Vendas</CardTitle>
            <CardDescription>QTD Vendas</CardDescription>
          </CardHeader>
          <CardContent>
            <p className='text-2xl font-bold'>{totalSalesCount} vendas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Ticket Médio</CardTitle>
            <CardDescription>Média de vendas (todos os canais)</CardDescription>
          </CardHeader>
          <CardContent>
            <p className='text-2xl font-bold'>{formatReal(ticketMedio)}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Valor Investido</CardTitle>
            <CardDescription>Valor investido em cada canal</CardDescription>
          </CardHeader>
          <CardContent>
            <p className='text-2xl font-bold'>{formatReal(totalInvestment)}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Atingimento de Metas</CardTitle>
            <CardDescription>
              Porcentagem do total a ser atingido
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className='text-2xl font-bold'>{atingimentoMetas}</p>
          </CardContent>
        </Card>
      </div>

      {/* Gráficos */}
      <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
        <FaturamentoMensal
          data={chartData}
          title='Faturamento Mensal'
          description='Últimos 6 meses'
          trend={trend}
          trendValue={trendValue}
        />
        <ChartInvestmentsChannels data={vendasPorCanal} />
      </div>

      {/* Tabelas em Grid */}
      <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
        {/* Tabela de Vendedores */}
        <Card>
          <CardHeader>
            <CardTitle>Vendedores</CardTitle>
            <CardDescription>
              Desempenho individual dos vendedores
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Faturamento</TableHead>
                  <TableHead>Qtde de Vendas</TableHead>
                  <TableHead>Ticket Médio</TableHead>
                  <TableHead>Taxa de Conversão</TableHead>
                  <TableHead>Porcentagem de Meta</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {vendedores.map((vendedor, index) => (
                  <TableRow key={index}>
                    <TableCell>{vendedor.nome}</TableCell>
                    <TableCell>{formatReal(vendedor.faturamento)}</TableCell>
                    <TableCell>{vendedor.qtdVendas}</TableCell>
                    <TableCell>{formatReal(vendedor.ticketMedio)}</TableCell>
                    <TableCell>{vendedor.taxaConversao}</TableCell>
                    <TableCell>{vendedor.porcentagemMeta}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Tabela de Vendas por Canal */}
        <Card>
          <CardHeader>
            <CardTitle>Vendas por Canal</CardTitle>
            <CardDescription>Desempenho por canal de venda</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Faturamento</TableHead>
                  <TableHead>Valor Investido</TableHead>
                  <TableHead>Qtde de Vendas</TableHead>
                  <TableHead>Ticket Médio</TableHead>
                  <TableHead>Taxa de Conversão</TableHead>
                  <TableHead>ROI</TableHead>
                  <TableHead>Porcentagem de Meta</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {vendasPorCanal.map((canal, index) => (
                  <TableRow key={index}>
                    <TableCell>{canal.nome}</TableCell>
                    <TableCell>{formatReal(canal.faturamento)}</TableCell>
                    <TableCell>{formatReal(canal.valorInvestido)}</TableCell>
                    <TableCell>{canal.qtdVendas}</TableCell>
                    <TableCell>{formatReal(canal.ticketMedio)}</TableCell>
                    <TableCell>{canal.taxaConversao}</TableCell>
                    <TableCell>{canal.roi}</TableCell>
                    <TableCell>{canal.porcentagemMeta}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Tabela de Top Vendedores */}
        <Card>
          <CardHeader>
            <CardTitle>Top Vendedores</CardTitle>
            <CardDescription>Vendedores com melhor desempenho</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Faturamento</TableHead>
                  <TableHead>Qtde de Vendas</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {topVendedores.map((vendedor, index) => (
                  <TableRow key={index}>
                    <TableCell>{vendedor.nome}</TableCell>
                    <TableCell>{formatReal(vendedor.faturamento)}</TableCell>
                    <TableCell>{vendedor.qtdVendas}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
