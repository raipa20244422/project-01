'use server'

import { prisma } from '@/service/prisma-client'

import { getOrganizationIdFromJWT } from './get-organization-token'

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
      select: {
        id: true,
        name: true,
        createdAt: true,
        leadsAttended: true,
        salesCount: true,
        productsSold: true,
        revenue: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return { success: true, collaborators }
  } catch (error) {
    console.error('Erro ao buscar colaboradores:', error)
    return { success: false, message: 'Erro ao buscar colaboradores.' }
  }
}
