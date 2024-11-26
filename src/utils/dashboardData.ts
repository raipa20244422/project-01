// utils/dashboardData.ts

import { PrismaClient } from '@prisma/client'

import { getOrganizationIdFromJWT } from '@/actions/get-organization-token'

const prisma = new PrismaClient()

// Função para buscar dados do banco de dados
export async function fetchData() {
  // Obter o ID da organização atual
  const organizationId = getOrganizationIdFromJWT()

  if (!organizationId) return null

  // Buscar dados de vendas
  const salesData = await prisma.sale.findMany({
    where: {
      organizationId,
    },
  })

  // Buscar colaboradores
  const collaborators = await prisma.collaborator.findMany({
    where: {
      organizationId,
    },
    include: {
      items: true,
    },
  })

  // Buscar itens dos colaboradores
  const collaboratorItems = await prisma.collaboratorItem.findMany({
    where: {
      collaborator: {
        organizationId,
      },
    },
    include: {
      channel: true,
    },
  })

  // Buscar metas
  const goals = await prisma.goal.findMany({
    where: {
      organizationId,
    },
  })

  return {
    salesData,
    collaborators,
    collaboratorItems,
    goals,
    organizationId,
  }
}

// Função para calcular os dados do dashboard
export function calculateDashboardData({
  salesData,
  collaborators,
  collaboratorItems,
  goals,
}: {
  salesData: any[]
  collaborators: any[]
  collaboratorItems: any[]
  goals: any[]
}) {
  // Cálculos necessários

  // Faturamento total
  const totalRevenue = salesData.reduce((acc, sale) => acc + sale.revenue, 0)

  // Quantidade total de vendas
  const totalSalesCount = salesData.reduce(
    (acc, sale) => acc + sale.salesCount,
    0,
  )

  // Valor investido total
  const totalInvestment = salesData.reduce(
    (acc, sale) => acc + sale.investment,
    0,
  )

  // Ticket Médio = Faturamento / Número de Vendas
  const ticketMedio = totalSalesCount > 0 ? totalRevenue / totalSalesCount : 0

  // Cálculo do Atingimento de Metas (comparando com as metas de vendas)
  const currentDate = new Date()
  const currentMonth = currentDate.getMonth()
  const currentYear = currentDate.getFullYear()

  const salesGoal = goals.find(
    (goal) =>
      goal.goalType === 'SALES' &&
      goal.mesMeta.getMonth() === currentMonth &&
      goal.mesMeta.getFullYear() === currentYear,
  )

  let atingimentoMetas = 'N/A'

  if (salesGoal) {
    const revenueAchievement = (
      (totalRevenue / salesGoal.faturamento) *
      100
    ).toFixed(2)
    const salesCountAchievement = (
      (totalSalesCount / salesGoal.numeroVendas) *
      100
    ).toFixed(2)
    const investmentAchievement = (
      (totalInvestment / salesGoal.valorInvestido) *
      100
    ).toFixed(2)

    // Você pode decidir como combinar esses valores. Aqui, calculamos a média
    const totalAchievement = (
      (parseFloat(revenueAchievement) +
        parseFloat(salesCountAchievement) +
        parseFloat(investmentAchievement)) /
      3
    ).toFixed(2)

    atingimentoMetas = `${totalAchievement}%`
  }

  // Função para calcular o atingimento de meta para colaboradores
  function calculateCollaboratorGoalAchievement(
    collaboratorId: number,
    collaboratorData: { faturamento: number },
  ) {
    const collaboratorGoal = goals.find(
      (goal) =>
        goal.goalType === 'COLLABORATOR' &&
        goal.collaboratorId === collaboratorId &&
        goal.mesMeta.getMonth() === currentMonth &&
        goal.mesMeta.getFullYear() === currentYear,
    )

    if (collaboratorGoal) {
      const revenueAchievement = (
        (collaboratorData.faturamento / collaboratorGoal.faturamento) *
        100
      ).toFixed(2)

      return `${revenueAchievement}%`
    } else {
      return 'N/A'
    }
  }

  // Top Vendedores
  const topVendedores = collaborators
    .map((collaborator) => {
      const totalRevenue = collaborator.items.reduce(
        (acc: number, item: any) => acc + item.revenue,
        0,
      )
      const totalSalesCount = collaborator.items.reduce(
        (acc: number, item: any) => acc + item.salesCount,
        0,
      )
      return {
        nome: collaborator.name,
        faturamento: totalRevenue,
        qtdVendas: totalSalesCount,
      }
    })
    .sort((a, b) => b.faturamento - a.faturamento)
    .slice(0, 5) // Top 5 vendedores

  // Dados dos vendedores para a tabela
  const vendedores = collaborators.map((collaborator) => {
    const totalRevenue = collaborator.items.reduce(
      (acc: number, item: any) => acc + item.revenue,
      0,
    )
    const totalSalesCount = collaborator.items.reduce(
      (acc: number, item: any) => acc + item.salesCount,
      0,
    )
    const totalLeadsGenerated = collaborator.items.reduce(
      (acc: number, item: any) => acc + item.leadsGenerated,
      0,
    )

    const ticketMedio = totalSalesCount > 0 ? totalRevenue / totalSalesCount : 0
    const taxaConversao =
      totalLeadsGenerated > 0
        ? ((totalSalesCount / totalLeadsGenerated) * 100).toFixed(2) + '%'
        : '0%'

    // Calcular porcentagem de meta
    const porcentagemMeta = calculateCollaboratorGoalAchievement(
      collaborator.id,
      {
        faturamento: totalRevenue,
      },
    )

    return {
      nome: collaborator.name,
      faturamento: totalRevenue,
      qtdVendas: totalSalesCount,
      ticketMedio,
      taxaConversao,
      porcentagemMeta,
    }
  })

  // Dados de vendas por canal para a tabela
  // Agrupar os itens dos colaboradores por canal
  const channelDataMap = new Map<
    number,
    {
      channelName: string
      totalRevenue: number
      totalInvestment: number
      totalSalesCount: number
      totalLeadsGenerated: number
    }
  >()

  collaboratorItems.forEach((item) => {
    if (item.channel && item.channelId !== null) {
      const channelId = item.channelId!
      const channelName = item.channel.name

      if (!channelDataMap.has(channelId)) {
        channelDataMap.set(channelId, {
          channelName: channelName,
          totalRevenue: 0,
          totalInvestment: 0,
          totalSalesCount: 0,
          totalLeadsGenerated: 0,
        })
      }

      const channelData = channelDataMap.get(channelId)!
      channelData.totalRevenue += item.revenue
      channelData.totalInvestment += item.investedAmount
      channelData.totalSalesCount += item.salesCount
      channelData.totalLeadsGenerated += item.leadsGenerated
    }
  })

  const vendasPorCanal = Array.from(channelDataMap.values()).map(
    (channelData) => {
      const {
        channelName,
        totalRevenue,
        totalInvestment,
        totalSalesCount,
        totalLeadsGenerated,
      } = channelData

      const ticketMedio =
        totalSalesCount > 0 ? totalRevenue / totalSalesCount : 0
      const taxaConversao =
        totalLeadsGenerated > 0
          ? ((totalSalesCount / totalLeadsGenerated) * 100).toFixed(2) + '%'
          : '0%'

      const roi =
        totalInvestment > 0
          ? (
              ((totalRevenue - totalInvestment) / totalInvestment) *
              100
            ).toFixed(2) + '%'
          : '0%'

      const porcentagemMeta = 'N/A' // Implementar se houver metas por canal

      return {
        nome: channelName,
        faturamento: totalRevenue,
        valorInvestido: totalInvestment,
        qtdVendas: totalSalesCount,
        ticketMedio,
        taxaConversao,
        roi,
        porcentagemMeta,
      }
    },
  )

  const sortedSalesData = salesData.sort(
    (a, b) => a.month.getTime() - b.month.getTime(),
  )

  // Calcular vendas mensais com crescimento
  const vendasMensais = sortedSalesData.map((sale, index) => {
    const mesAnterior = index > 0 ? sortedSalesData[index - 1] : null

    let crescimentoFaturamento = 'N/A'
    let crescimentoVendas = 'N/A'
    let crescimentoInvestimento = 'N/A'

    if (mesAnterior) {
      crescimentoFaturamento =
        mesAnterior.revenue > 0
          ? (
              ((sale.revenue - mesAnterior.revenue) / mesAnterior.revenue) *
              100
            ).toFixed(2) + '%'
          : 'N/A'

      crescimentoVendas =
        mesAnterior.salesCount > 0
          ? (
              ((sale.salesCount - mesAnterior.salesCount) /
                mesAnterior.salesCount) *
              100
            ).toFixed(2) + '%'
          : 'N/A'

      crescimentoInvestimento =
        mesAnterior.investment > 0
          ? (
              ((sale.investment - mesAnterior.investment) /
                mesAnterior.investment) *
              100
            ).toFixed(2) + '%'
          : 'N/A'
    }

    return {
      mes: sale.month,
      faturamento: sale.revenue,
      qtdVendas: sale.salesCount,
      valorInvestido: sale.investment,
      crescimentoFaturamento,
      crescimentoVendas,
      crescimentoInvestimento,
    }
  })

  return {
    totalRevenue,
    totalSalesCount,
    totalInvestment,
    ticketMedio,
    atingimentoMetas,
    vendedores,
    vendasPorCanal,
    topVendedores,
    salesData,
    vendasMensais,
  }
}

export function prepareChartData(salesData: any[]) {
  const currentYear = new Date().getFullYear()

  // Gerar array para todos os 12 meses do ano
  const chartDataMap = new Map<string, { month: string; value: number }>()

  for (let i = 0; i < 12; i++) {
    const date = new Date(currentYear, i, 1)
    const monthName = date.toLocaleString('pt-BR', { month: 'short' })
    const monthKey = `${currentYear}-${i}`
    chartDataMap.set(monthKey, {
      month: monthName.charAt(0).toUpperCase() + monthName.slice(1),
      value: 0,
    })
  }

  // Somar o faturamento por mês
  salesData.forEach((sale) => {
    const date = new Date(sale.date || sale.createdAt || sale.saleDate)
    if (isNaN(date.getTime())) return // Pula se a data for inválida

    if (date.getFullYear() === currentYear) {
      const monthKey = `${date.getFullYear()}-${date.getMonth()}`
      if (chartDataMap.has(monthKey)) {
        const data = chartDataMap.get(monthKey)!
        data.value += sale.revenue
      }
    }
  })

  // Converter o Map em array
  const chartData = Array.from(chartDataMap.values())

  // Calcular a tendência anual
  const previousYear = currentYear - 1
  let currentYearRevenue = 0
  let previousYearRevenue = 0

  salesData.forEach((sale) => {
    const date = new Date(sale.date || sale.createdAt || sale.saleDate)
    if (isNaN(date.getTime())) return // Pula se a data for inválida

    const saleYear = date.getFullYear()
    if (saleYear === currentYear) {
      currentYearRevenue += sale.revenue
    } else if (saleYear === previousYear) {
      previousYearRevenue += sale.revenue
    }
  })

  let trendValue = '0.00'
  let trend = 'up'

  if (previousYearRevenue > 0) {
    trendValue = (
      ((currentYearRevenue - previousYearRevenue) / previousYearRevenue) *
      100
    ).toFixed(2)
    trend = currentYearRevenue >= previousYearRevenue ? 'up' : 'down'
  }

  return {
    chartData,
    trendValue: parseFloat(trendValue),
    trend,
  }
}
