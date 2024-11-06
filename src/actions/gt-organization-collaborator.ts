'use server'

import { prisma } from '@/service/prisma-client'

import { getOrganizationIdFromJWT } from './get-organization-token'

export interface ResponseCollaborator {
  id: number
  name: string
  totalLeadsGenerated: number
  totalSalesCount: number
  totalProductsSold: number
  totalRevenue: number
}

export async function getAllCollaboratorsByOrganization() {
  try {
    const organizationId = getOrganizationIdFromJWT()

    if (!organizationId) {
      return {
        success: false,
        message: 'Organização não encontrada no token JWT.',
      }
    }

    const collaborators = await prisma.collaborator.findMany({
      where: {
        organizationId,
      },
      include: {
        items: true, // Inclui os itens associados
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    // Calcula os totais agregados para cada colaborador
    const collaboratorsWithTotals: ResponseCollaborator[] = collaborators.map(
      (collaborator) => {
        const totalLeadsGenerated = collaborator.items.reduce(
          (sum, item) => sum + (item.leadsGenerated || 0),
          0,
        )
        const totalSalesCount = collaborator.items.reduce(
          (sum, item) => sum + (item.salesCount || 0),
          0,
        )
        const totalProductsSold = collaborator.items.reduce(
          (sum, item) => sum + (item.productsSold || 0),
          0,
        )
        const totalRevenue = collaborator.items.reduce(
          (sum, item) => sum + (item.revenue || 0),
          0,
        )

        return {
          id: collaborator.id,
          name: collaborator.name,
          totalLeadsGenerated,
          totalSalesCount,
          totalProductsSold,
          totalRevenue,
        }
      },
    )

    return { success: true, collaborators: collaboratorsWithTotals }
  } catch (error) {
    console.error('Erro ao buscar colaboradores:', error)
    return { success: false, message: 'Erro ao buscar colaboradores.' }
  }
}
