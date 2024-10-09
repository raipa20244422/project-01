'use server'

import { prisma } from '@/service/prisma-client'

import { getOrganizationIdFromJWT } from './get-organization-token'

export async function getAllLeadsByOrganization() {
  try {
    const organizationId = getOrganizationIdFromJWT()

    if (!organizationId) {
      return {
        success: false,
        message: 'Organização não encontrada no token JWT.',
      }
    }

    const leads = await prisma.lead.findMany({
      where: {
        organizationId,
      },
      select: {
        id: true,
        name: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return { success: true, leads }
  } catch (error) {
    return { success: false, message: 'Erro ao buscar leads.' }
  }
}
