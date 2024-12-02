import { getOrganizationIdFromJWT } from '@/actions/get-organization-token'
import { prisma } from '@/service/prisma-client'

interface Sale {
  id: number
  month: Date // Mantido como Date
  revenue: number
  salesCount: number
  investment: number
}

interface CollaboratorItem {
  id: number
  revenue: number
  leadsGenerated: number
  salesCount: number
  productsSold: number
  channelId: number | null // Permite null
  createdAt: Date
  investedAmount: number
  collaboratorId: number
  channel?: {
    name: string
    id: number
    organizationId: number
  } | null // Permite null
}

interface Collaborator {
  id: number
  name: string
  items: CollaboratorItem[]
}

interface Goal {
  id: number
  valorInvestido: number
  faturamento: number
  numeroVendas: number
}

interface ChartData {
  month: string
  value: number
}

interface Vendedor {
  nome: string
  faturamento: number
  qtdVendas: number
  ticketMedio: number
  taxaConversao: string
  porcentagemMeta?: string
}

interface ChannelData {
  nome: string
  faturamento: number
  valorInvestido: number
  qtdVendas: number
  ticketMedio: number
  taxaConversao: string
  roi: string
  porcentagemMeta?: string
}

export async function fetchFilteredData(year: number, month: number) {
  const organizationId = getOrganizationIdFromJWT()

  if (!organizationId) return null

  const startDate = new Date(year, month - 1, 1)
  const endDate = new Date(year, month, 0)

  const salesData: Sale[] = await prisma.sale.findMany({
    where: {
      organizationId,
      month: {
        gte: startDate,
        lt: endDate,
      },
    },
  })

  const collaborators: Collaborator[] = await prisma.collaborator.findMany({
    where: {
      organizationId,
      data: {
        gte: startDate,
        lt: endDate,
      },
    },
    include: {
      items: {
        include: {
          channel: true,
        },
      },
    },
  })

  const collaboratorItems: CollaboratorItem[] =
    await prisma.collaboratorItem.findMany({
      where: {
        collaborator: {
          organizationId,
          data: {
            gte: startDate,
            lt: endDate,
          },
        },
      },
      include: { channel: true },
    })

  const goals: Goal[] = await prisma.goal.findMany({
    where: {
      organizationId,
      mesMeta: {
        gte: startDate,
        lt: endDate,
      },
    },
  })

  return { salesData, collaborators, collaboratorItems, goals, organizationId }
}

export async function fetchData() {
  const organizationId = getOrganizationIdFromJWT()

  if (!organizationId) return null

  const salesData: Sale[] = await prisma.sale.findMany({
    where: { organizationId },
  })

  const collaborators: Collaborator[] = await prisma.collaborator.findMany({
    where: { organizationId },
    include: { items: true },
  })

  const collaboratorItems: CollaboratorItem[] =
    await prisma.collaboratorItem.findMany({
      where: { collaborator: { organizationId } },
      include: { channel: true },
    })

  const goals: Goal[] = await prisma.goal.findMany({
    where: { organizationId },
  })

  return { salesData, collaborators, collaboratorItems, goals, organizationId }
}

// Função: Total de faturamento
export function calculateTotalRevenue(salesData: Sale[]): number {
  return salesData.reduce((acc, sale) => acc + sale.revenue, 0)
}

// Função: Total de vendas
export function calculateTotalSalesCount(salesData: Sale[]): number {
  return salesData.reduce((acc, sale) => acc + sale.salesCount, 0)
}

// Função: Total investido
export function calculateTotalInvestment(salesData: Sale[]): number {
  return salesData.reduce((acc, sale) => acc + sale.investment, 0)
}

// Função: Ticket médio
export function calculateTicketMedio(
  totalRevenue: number,
  totalSalesCount: number,
): number {
  return totalSalesCount > 0 ? totalRevenue / totalSalesCount : 0
}

// Função: Atingimento de metas
export function calculateMetaAchievement(
  goals: Goal[],
  totalRevenue: number,
  totalSalesCount: number,
  totalInvestment: number,
): string {
  function calculateGoalAchievement(goal: Goal): number {
    let totalMetrics = 0
    let achievedPercentage = 0

    if (goal.valorInvestido > 0) {
      totalMetrics++
      achievedPercentage += Math.min(
        (totalInvestment / goal.valorInvestido) * 100,
        100,
      )
    }

    if (goal.faturamento > 0) {
      totalMetrics++
      achievedPercentage += Math.min(
        (totalRevenue / goal.faturamento) * 100,
        100,
      )
    }

    if (goal.numeroVendas > 0) {
      totalMetrics++
      achievedPercentage += Math.min(
        (totalSalesCount / goal.numeroVendas) * 100,
        100,
      )
    }

    // Retornar média de porcentagens para esta meta
    return totalMetrics > 0 ? achievedPercentage / totalMetrics : 0
  }

  const goalAchievements = goals.map((goal) => calculateGoalAchievement(goal))
  const averageGoalAchievement =
    goalAchievements.reduce((acc, val) => acc + val, 0) /
    (goalAchievements.length || 1)

  return `${averageGoalAchievement.toFixed(2)}%`
}

// Função: Vendas mensais com crescimento
export function calculateVendasMensais(
  salesData: Sale[],
): { mes: string; faturamento: number; crescimentoFaturamento: string }[] {
  const sortedSalesData = salesData.sort(
    (a, b) => a.month.getTime() - b.month.getTime(),
  )

  return sortedSalesData.map((sale, index) => {
    const previous = sortedSalesData[index - 1]
    const crescimentoFaturamento = previous
      ? (((sale.revenue - previous.revenue) / previous.revenue) * 100).toFixed(
          2,
        )
      : 'N/A'

    return {
      mes: sale.month.toISOString().slice(0, 7), // Convertendo para string (formato ISO YYYY-MM)
      faturamento: sale.revenue,
      crescimentoFaturamento,
    }
  })
}

// Função: Dados para gráficos
export function prepareChartData(salesData: Sale[]): {
  chartData: ChartData[]
  trendValue: number
  trend: string
} {
  const currentYear = new Date().getFullYear()

  const chartData = Array.from({ length: 12 }, (_, i) => ({
    month: new Date(currentYear, i).toLocaleString('pt-BR', { month: 'short' }),
    value: salesData
      .filter((sale) => sale.month.getMonth() === i)
      .reduce((acc, sale) => acc + sale.revenue, 0),
  }))

  const trendValue =
    ((chartData[chartData.length - 1]?.value || 0) /
      (chartData[chartData.length - 2]?.value || 1) -
      1) *
    100

  const trend = trendValue >= 0 ? 'up' : 'down'

  return { chartData, trendValue, trend }
}

// Função: Dados de vendedores
export function calculateVendedores(
  collaborators: Collaborator[],
  goals: Goal[],
): Vendedor[] {
  return collaborators.map((collaborator) => {
    const totalRevenue = collaborator.items.reduce(
      (acc, item) => acc + item.revenue,
      0,
    )
    const totalSalesCount = collaborator.items.reduce(
      (acc, item) => acc + item.salesCount,
      0,
    )
    const totalLeadsGenerated = collaborator.items.reduce(
      (acc, item) => acc + item.leadsGenerated,
      0,
    )

    const ticketMedio = totalSalesCount > 0 ? totalRevenue / totalSalesCount : 0
    const taxaConversao =
      totalLeadsGenerated > 0
        ? ((totalSalesCount / totalLeadsGenerated) * 100).toFixed(2) + '%'
        : '0%'

    // Cálculo de porcentagem de meta
    const meta = goals.find(
      (goal) => goal.numeroVendas > 0 && totalSalesCount >= goal.numeroVendas,
    )

    const porcentagemMeta = meta
      ? `${((totalRevenue / meta.faturamento) * 100).toFixed(2)}%`
      : 'N/A'

    return {
      nome: collaborator.name,
      faturamento: totalRevenue,
      qtdVendas: totalSalesCount,
      ticketMedio,
      taxaConversao,
      porcentagemMeta,
    }
  })
}

// Função: Dados por canal
export function calculateVendasPorCanal(
  collaboratorItems: CollaboratorItem[],
  goals: Goal[],
): ChannelData[] {
  const channelDataMap: Record<number, ChannelData> = {}

  collaboratorItems.forEach((item) => {
    if (!item.channel || item.channelId === null) return

    const channel = channelDataMap[item.channelId] || {
      nome: item.channel.name,
      faturamento: 0,
      valorInvestido: 0,
      qtdVendas: 0,
      ticketMedio: 0,
      taxaConversao: '0%',
      roi: '0%',
      porcentagemMeta: 'N/A',
    }

    channel.faturamento += item.revenue
    channel.valorInvestido += item.investedAmount
    channel.qtdVendas += item.salesCount
    channel.ticketMedio =
      channel.qtdVendas > 0 ? channel.faturamento / channel.qtdVendas : 0

    if (channel.valorInvestido > 0) {
      channel.roi = (
        ((channel.faturamento - channel.valorInvestido) /
          channel.valorInvestido) *
        100
      ).toFixed(2)
    }

    // Cálculo de porcentagem de meta
    const meta = goals.find(
      (goal) => goal.numeroVendas > 0 && channel.qtdVendas >= goal.numeroVendas,
    )

    channel.porcentagemMeta = meta
      ? `${((channel.faturamento / meta.faturamento) * 100).toFixed(2)}%`
      : 'N/A'

    channelDataMap[item.channelId] = channel
  })

  return Object.values(channelDataMap)
}

// Função: Top vendedores
export function calculateTopVendedores(vendedores: Vendedor[]): Vendedor[] {
  return vendedores.sort((a, b) => b.faturamento - a.faturamento).slice(0, 5)
}

export function calculateTrendValue(
  currentValue: number,
  previousValue: number,
): number {
  if (previousValue === 0) {
    return currentValue > 0 ? 100 : 0
  }
  return ((currentValue - previousValue) / previousValue) * 100
}
