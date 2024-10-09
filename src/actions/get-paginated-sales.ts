'use server'

import { prisma } from '@/service/prisma-client'

import { getOrganizationIdFromJWT } from './get-organization-token'

interface PaginatedSalesResponse {
  sales: {
    id: number
    saleDate: Date
    amount: number
    collaboratorName: string
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
        saleDate: true,
        amount: true,
        collaborator: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        saleDate: 'desc',
      },
      skip: (currentPage - 1) * salesPerPage,
      take: salesPerPage,
    })

    const salesData = sales.map((sale) => ({
      id: sale.id,
      saleDate: sale.saleDate,
      amount: sale.amount,
      collaboratorName: sale.collaborator.name,
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
