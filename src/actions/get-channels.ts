'use server'

import { Prisma } from '@prisma/client' // Importar Prisma para usar QueryMode

import { prisma } from '@/service/prisma-client'

import { getOrganizationIdFromJWT } from './get-organization-token'

interface PaginatedChannelsResponse {
  channels: {
    id: number
    name: string
    createdAt: Date
    updatedAt: Date
  }[]
  totalChannels: number
  currentPage: number
  totalPages: number
}

export async function getPaginatedChannels(
  page: number = 1,
  search?: string,
): Promise<PaginatedChannelsResponse> {
  try {
    const channelsPerPage = 20

    const organizationId = getOrganizationIdFromJWT()

    if (!organizationId) {
      return {
        channels: [],
        totalChannels: 0,
        currentPage: 1,
        totalPages: 1,
      }
    }

    const whereClause = {
      organizationId: organizationId,
      ...(search && {
        name: {
          contains: search,
          mode: Prisma.QueryMode.insensitive,
        },
      }),
    }

    const totalChannels = await prisma.channel.count({
      where: whereClause,
    })

    const totalPages = Math.ceil(totalChannels / channelsPerPage)

    const currentPage = Math.min(Math.max(page, 1), totalPages)

    const channels = await prisma.channel.findMany({
      where: whereClause,
      select: {
        id: true,
        name: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
      skip: (currentPage - 1) * channelsPerPage,
      take: channelsPerPage,
    })

    return {
      channels,
      totalChannels,
      currentPage,
      totalPages,
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
