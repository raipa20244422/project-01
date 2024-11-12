'use server'

import { revalidatePath } from 'next/cache'

import { GoalFormData } from '@/components/form-goals'
import { prisma } from '@/service/prisma-client'

import { getOrganizationIdFromJWT } from './get-organization-token'

export async function createGoalAction(data: GoalFormData) {
  try {
    const organizationId = getOrganizationIdFromJWT()
    if (!organizationId) {
      return { success: false, message: 'Organização não encontrada.' }
    }

    const goal = await prisma.goal.create({
      data: {
        goalType: data.goalType,
        mesMeta: data.mesMeta,
        valorInvestido: data.valorInvestido,
        faturamento: data.faturamento,
        ledsGerados: data.ledsGerados,
        numeroVendas: data.numeroVendas,
        produtosVendidos: data.produtosVendidos,
        channelId: Number(data.canalMeta),
        organizationId,
      },
    })

    revalidatePath('goal')
    return { success: true, goal }
  } catch (error) {
    console.error('Erro ao criar meta:', error)
    return { success: false, message: 'Erro ao criar meta.' }
  }
}

export async function updateGoalAction(id: number, data: GoalFormData) {
  try {
    const organizationId = getOrganizationIdFromJWT()
    if (!organizationId) {
      return { success: false, message: 'Organização não encontrada.' }
    }

    const goal = await prisma.goal.updateMany({
      where: { id, organizationId },
      data: {
        goalType: data.goalType,
        mesMeta: data.mesMeta,
        valorInvestido: data.valorInvestido,
        faturamento: data.faturamento,
        ledsGerados: data.ledsGerados,
        numeroVendas: data.numeroVendas,
        produtosVendidos: data.produtosVendidos,
        channelId: Number(data.canalMeta),
      },
    })

    if (goal.count === 0) {
      return {
        success: false,
        message: 'Meta não encontrada ou não pertence à sua organização.',
      }
    }

    revalidatePath('goal')
    return { success: true, goal }
  } catch (error) {
    console.error('Erro ao atualizar meta:', error)
    return { success: false, message: 'Erro ao atualizar meta.' }
  }
}

export async function getGoalById(id: number) {
  try {
    const organizationId = getOrganizationIdFromJWT()
    if (!organizationId) {
      return {
        success: false,
        message: 'Organização não encontrada no token JWT.',
      }
    }

    const goal = await prisma.goal.findFirst({
      where: { id, organizationId },
    })

    if (!goal) {
      return { success: false, message: 'Meta não encontrada.' }
    }

    return { success: true, goal }
  } catch (error) {
    console.error('Erro ao buscar meta:', error)
    return { success: false, message: 'Erro ao buscar meta.' }
  }
}

export async function getPaginatedGoals(page: number = 1) {
  try {
    const goalsPerPage = 20

    // Obtém o ID da organização a partir do token JWT
    const organizationId = getOrganizationIdFromJWT()
    if (!organizationId) {
      return {
        success: false,
        message: 'Organização não encontrada no token JWT.',
        goals: [],
        totalGoals: 0,
        currentPage: 1,
        totalPages: 1,
      }
    }

    // Conta o total de metas para calcular o número de páginas
    const totalGoals = await prisma.goal.count({
      where: { organizationId },
    })
    const totalPages = Math.ceil(totalGoals / goalsPerPage)
    const currentPage = Math.min(Math.max(page, 1), totalPages)

    // Busca as metas da organização com paginação
    const goals = await prisma.goal.findMany({
      where: { organizationId },
      select: {
        id: true,
        goalType: true,
        valorInvestido: true,
        faturamento: true,
        ledsGerados: true,
        numeroVendas: true,
        produtosVendidos: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
      skip: (currentPage - 1) * goalsPerPage,
      take: goalsPerPage,
    })

    return {
      success: true,
      goals,
      totalGoals,
      currentPage,
      totalPages,
    }
  } catch (error) {
    console.error('Erro ao buscar metas paginadas:', error)
    return {
      success: false,
      message: 'Erro ao buscar metas paginadas.',
      goals: [],
      totalGoals: 0,
      currentPage: 1,
      totalPages: 1,
    }
  }
}

export async function getChannels() {
  try {
    const organizationId = getOrganizationIdFromJWT()
    if (!organizationId) {
      return { success: false, message: 'Organização não encontrada.' }
    }

    const channels = await prisma.channel.findMany({
      where: { organizationId },
      select: { id: true, name: true },
    })

    return { success: true, channels }
  } catch (error) {
    console.error('Erro ao buscar canais:', error)
    return { success: false, message: 'Erro ao buscar canais.' }
  }
}
