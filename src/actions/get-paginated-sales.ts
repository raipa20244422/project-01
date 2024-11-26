'use server'

import { prisma } from '@/service/prisma-client'

import { getOrganizationIdFromJWT } from './get-organization-token'

interface PaginatedSalesResponse {
  sales: {
    id: number
    saleDate: Date
    amount: number
    productsSold: number
    salesCount: number
    name: string
    conversionRate: number
  }[]
  totalSales: number
  currentPage: number
  totalPages: number
}

export async function getPaginatedSales(
  page: number = 1,
): Promise<PaginatedSalesResponse> {
  try {
    const salesPerPage = 20
    const organizationId = getOrganizationIdFromJWT()

    if (!organizationId) {
      return {
        sales: [],
        totalSales: 0,
        currentPage: 1,
        totalPages: 1,
      }
    }

    const totalSales = await prisma.sale.count({
      where: {
        organizationId,
      },
    })

    if (totalSales === 0) {
      return {
        sales: [],
        totalSales: 0,
        currentPage: 1,
        totalPages: 1,
      }
    }

    const totalPages = Math.ceil(totalSales / salesPerPage)
    const currentPage = Math.min(Math.max(page, 1), totalPages)

    const sales = await prisma.sale.findMany({
      where: {
        organizationId,
      },
      select: {
        id: true,
        createdAt: true,
        revenue: true,
        month: true,
        productsSold: true,
        salesCount: true,
        organization: {
          select: {
            name: true,
          },
        },
        leadsGenerated: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
      skip: (currentPage - 1) * salesPerPage,
      take: salesPerPage,
    })

    const salesData = sales.map((sale) => ({
      id: sale.id,
      saleDate: sale.createdAt,
      amount: sale.revenue,
      productsSold: sale.productsSold,
      salesCount: sale.salesCount,
      name: sale.organization.name,
      conversionRate:
        sale.salesCount > 0 ? sale.leadsGenerated / sale.salesCount : 0,
    }))

    return {
      sales: salesData,
      totalSales,
      currentPage,
      totalPages,
    }
  } catch (error) {
    console.error('Erro ao buscar vendas paginadas:', error)
    return {
      sales: [],
      totalSales: 0,
      currentPage: 1,
      totalPages: 1,
    }
  }
}
