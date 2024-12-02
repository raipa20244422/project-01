import { FaturamentoMensal } from '@/components/faturamento-mensal'
import { FilterSearch } from '@/components/filter-date'
import { QtdeSalesofMoth } from '@/components/QtdeSalesofMoth'
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
  calculateMetaAchievement,
  calculateTicketMedio,
  calculateTopVendedores,
  calculateTotalInvestment,
  calculateTotalRevenue,
  calculateTotalSalesCount,
  calculateTrendValue,
  calculateVendasMensais,
  calculateVendasPorCanal,
  calculateVendedores,
  fetchData,
  fetchFilteredData,
  prepareChartData,
} from '@/utils/dashboardData'
import { formatReal } from '@/utils/format-all'

export default async function Home({
  searchParams,
}: {
  searchParams: { year?: string; month?: string }
}) {
  const year = parseInt(searchParams.year || `${new Date().getFullYear()}`, 10)
  const month = parseInt(
    searchParams.month || `${new Date().getMonth() + 1}`,
    10,
  )

  const filteredData = await fetchFilteredData(year, month)
  const completeData = await fetchData()

  if (!filteredData || !completeData) return null

  const { salesData: filteredSalesData, goals } = filteredData
  const {
    salesData: completeSalesData,
    collaborators,
    collaboratorItems,
  } = completeData

  // Cálculos principais
  const totalRevenue = calculateTotalRevenue(filteredSalesData)
  const totalSalesCount = calculateTotalSalesCount(filteredSalesData)
  const totalInvestment = calculateTotalInvestment(filteredSalesData)
  const ticketMedio = calculateTicketMedio(totalRevenue, totalSalesCount)
  const atingimentoMetas = calculateMetaAchievement(
    goals,
    totalRevenue,
    totalSalesCount,
    totalInvestment,
  )

  const totalRevenueCurrentMonth = calculateTotalRevenue(
    completeSalesData.filter(
      (sale) =>
        new Date(sale.month).getFullYear() === year &&
        new Date(sale.month).getMonth() === month - 1,
    ),
  )

  const totalRevenuePreviousMonth = calculateTotalRevenue(
    completeSalesData.filter((sale) => {
      const saleDate = new Date(sale.month)
      const previousMonthDate = new Date(year, month - 2)

      return (
        saleDate.getFullYear() === previousMonthDate.getFullYear() &&
        saleDate.getMonth() === previousMonthDate.getMonth()
      )
    }),
  )

  const trendValue = calculateTrendValue(
    totalRevenueCurrentMonth,
    totalRevenuePreviousMonth,
  )

  const trend = trendValue > 0 ? 'up' : trendValue < 0 ? 'down' : 'neutral'

  // Dados para gráficos e tabelas
  const vendasMensais = calculateVendasMensais(completeSalesData)
  const chartInfo = prepareChartData(completeSalesData)
  const { chartData } = chartInfo
  const vendedores = calculateVendedores(collaborators, goals)
  const vendasPorCanal = calculateVendasPorCanal(collaboratorItems, goals)
  const topVendedores = calculateTopVendedores(vendedores)

  return (
    <main className='flex min-h-screen w-full flex-col space-y-3 p-4'>
      <div className='flex w-full items-center justify-end'>
        <FilterSearch />
      </div>

      {/* Cards */}
      <div className='grid w-full grid-cols-1 gap-4 md:grid-cols-5'>
        <Card>
          <CardHeader>
            <CardTitle>Faturamento</CardTitle>
            <CardDescription>Faturamento das vendas</CardDescription>
          </CardHeader>
          <CardContent>
            <p className='text-2xl font-bold'>{formatReal(totalRevenue)}</p>
            <p
              className={`text-sm ${
                trend === 'up'
                  ? 'text-green-500'
                  : trend === 'down'
                    ? 'text-red-500'
                    : 'text-gray-500'
              }`}
            >
              {trend === 'neutral' ? '' : trend === 'up' ? '+' : '-'}
              {Math.abs(trendValue)}% em relação ao mês anterior
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
          description='Ultimo ano'
        />
        <QtdeSalesofMoth
          salesData={completeSalesData}
          title='Quantidade de Vendas Mensais'
        />
      </div>

      {/* Tabelas */}
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
