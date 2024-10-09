'use server'

import { prisma } from '@/service/prisma-client'

import { getOrganizationIdFromJWT } from './get-organization-token'

export async function getChannels() {
  try {
    const channelsPerPage = 20

    const organizationId = getOrganizationIdFromJWT()

    if (!organizationId) {
      return {
        success: false,
        channels: [],
      }
    }

    const channels = await prisma.channel.findMany({
      select: {
        id: true,
        name: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return {
      success: true,
      channels,
    }
  } catch (error) {
    console.error('Erro ao buscar canais paginados:', error)
    return {
      channels: [],
      totalChannels: 0,
      currentPage: 1,
      totalPages: 1,
    }
  }
}
