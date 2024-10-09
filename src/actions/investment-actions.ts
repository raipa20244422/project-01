'use server'

import { prisma } from '@/service/prisma-client'

import { getOrganizationIdFromJWT } from './get-organization-token'

interface InvestmentFormData {
  amount: number
  profit: number
  month: Date
  channelId: string
}

export async function createInvestmentAction(data: InvestmentFormData) {
  try {
    const organizationId = getOrganizationIdFromJWT()

    if (!organizationId) {
      return { success: false, message: 'Organização não encontrada.' }
    }

    const investment = await prisma.investment.create({
      data: {
        amount: data.amount,
        profit: data.profit,
        month: new Date(data.month),
        channelId: parseInt(data.channelId),
        organizationId: organizationId,
      },
    })

    return { success: true, investment }
  } catch (error) {
    console.error('Erro ao criar investimento:', error)
    return { success: false, message: 'Erro ao criar investimento.' }
  }
}

interface UpdateInvestmentData {
  amount: number
  profit: number
  month: Date
  channelId: string
}

export async function updateInvestmentAction(
  id: string,
  data: UpdateInvestmentData,
) {
  try {
    const organizationId = getOrganizationIdFromJWT()

    if (!organizationId) {
      return { success: false, message: 'Organização não encontrada.' }
    }

    const investment = await prisma.investment.updateMany({
      where: { id: parseInt(id), organizationId: organizationId },
      data: {
        amount: data.amount,
        profit: data.profit,
        month: new Date(data.month),
        channelId: parseInt(data.channelId),
      },
    })

    if (investment.count === 0) {
      return {
        success: false,
        message:
          'Investimento não encontrado ou não pertence à sua organização.',
      }
    }

    return { success: true, investment }
  } catch (error) {
    console.error('Erro ao atualizar investimento:', error)
    return { success: false, message: 'Erro ao atualizar investimento.' }
  }
}

export async function deleteInvestmentAction(id: string) {
  try {
    const organizationId = getOrganizationIdFromJWT()

    if (!organizationId) {
      return { success: false, message: 'Organização não encontrada.' }
    }

    const investment = await prisma.investment.deleteMany({
      where: { id: parseInt(id), organizationId: organizationId },
    })

    if (investment.count === 0) {
      return {
        success: false,
        message:
          'Investimento não encontrado ou não pertence à sua organização.',
      }
    }

    return { success: true }
  } catch (error) {
    console.error('Erro ao apagar investimento:', error)
    return { success: false, message: 'Erro ao apagar investimento.' }
  }
}

interface PaginatedInvestmentsResponse {
  investments: {
    id: number
    amount: number
    profit: number
    month: Date
    channel: {
      name: string
    }
    createdAt: Date
    updatedAt: Date
  }[]
  totalInvestments: number
  currentPage: number
  totalPages: number
}

export async function getPaginatedInvestments(
  page: number = 1,
): Promise<PaginatedInvestmentsResponse> {
  try {
    const investmentsPerPage = 20

    const totalInvestments = await prisma.investment.count()

    const totalPages = Math.ceil(totalInvestments / investmentsPerPage)

    const currentPage = Math.min(Math.max(page, 1), totalPages)

    const investments = await prisma.investment.findMany({
      select: {
        id: true,
        amount: true,
        profit: true,
        month: true,
        channel: {
          select: {
            name: true,
          },
        },
        createdAt: true,
        updatedAt: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
      skip: (currentPage - 1) * investmentsPerPage,
      take: investmentsPerPage,
    })

    return {
      investments,
      totalInvestments,
      currentPage,
      totalPages,
    }
  } catch (error) {
    console.error('Erro ao buscar investimentos paginados:', error)
    return {
      investments: [],
      totalInvestments: 0,
      currentPage: 1,
      totalPages: 1,
    }
  }
}
