'use server'

import { revalidatePath } from 'next/cache'

import { ChannelFormData } from '@/components/form-channel'
import { prisma } from '@/service/prisma-client'

import { getOrganizationIdFromJWT } from './get-organization-token'

// Cria um novo canal
export async function createChannelAction(data: ChannelFormData) {
  try {
    const organizationId = getOrganizationIdFromJWT()
    if (!organizationId)
      return {
        success: false,
        message: 'Organização não encontrada no token JWT.',
      }

    const channel = await prisma.channel.create({
      data: {
        name: data.name,
        organizationId,
      },
    })

    revalidatePath('/canais')
    return { success: true, channel }
  } catch (error) {
    console.error('Erro ao criar canal:', error)
    return { success: false, message: 'Erro ao criar canal' }
  }
}

// Atualiza um canal existente
export async function updateChannelAction(id: number, data: ChannelFormData) {
  try {
    const organizationId = getOrganizationIdFromJWT()
    if (!organizationId)
      return {
        success: false,
        message: 'Organização não encontrada no token JWT.',
      }

    const existingChannel = await prisma.channel.findFirst({
      where: { id, organizationId },
    })

    if (!existingChannel)
      return {
        success: false,
        message: 'Canal não encontrado ou não pertence à sua organização.',
      }

    const updatedChannel = await prisma.channel.update({
      where: { id },
      data: { name: data.name },
    })

    revalidatePath('/canais')
    return { success: true, channel: updatedChannel }
  } catch (error) {
    console.error('Erro ao atualizar canal:', error)
    return { success: false, message: 'Erro ao atualizar canal.' }
  }
}

// Busca um canal por ID
export async function getChannelById(id: number) {
  try {
    const organizationId = getOrganizationIdFromJWT()
    if (!organizationId)
      return {
        success: false,
        message: 'Organização não encontrada no token JWT.',
      }

    const channel = await prisma.channel.findFirst({
      where: { id, organizationId },
    })

    if (!channel)
      return {
        success: false,
        message: 'Canal não encontrado ou não pertence à sua organização.',
      }

    return { success: true, channel }
  } catch (error) {
    console.error('Erro ao buscar canal por ID:', error)
    return { success: false, message: 'Erro ao buscar canal.' }
  }
}

// Busca todos os canais de uma organização
export async function getAllChannels() {
  try {
    const organizationId = getOrganizationIdFromJWT()
    if (!organizationId)
      return {
        success: false,
        message: 'Organização não encontrada no token JWT.',
        channels: [],
      }

    const channels = await prisma.channel.findMany({
      where: { organizationId },
      select: { id: true, name: true },
      orderBy: { name: 'asc' },
    })

    return { success: true, channels }
  } catch (error) {
    console.error('Erro ao buscar canais:', error)
    return { success: false, message: 'Erro ao buscar canais.', channels: [] }
  }
}

// Busca paginada de canais
export async function getPaginatedChannels(page: number = 1) {
  try {
    const channelsPerPage = 20

    // Conta o total de canais para calcular as páginas
    const organizationId = getOrganizationIdFromJWT()
    if (!organizationId)
      return {
        success: false,
        message: 'Organização não encontrada no token JWT.',
        channels: [],
        totalChannels: 0,
        currentPage: 1,
        totalPages: 1,
      }

    const totalChannels = await prisma.channel.count({
      where: { organizationId },
    })
    const totalPages = Math.ceil(totalChannels / channelsPerPage)
    const currentPage = Math.min(Math.max(page, 1), totalPages)

    const channels = await prisma.channel.findMany({
      where: { organizationId },
      select: {
        id: true,
        name: true,
      },
      skip: (currentPage - 1) * channelsPerPage,
      take: channelsPerPage,
    })

    return {
      success: true,
      channels,
      totalChannels,
      currentPage,
      totalPages,
    }
  } catch (error) {
    console.error('Erro ao buscar canais paginados:', error)
    return {
      success: false,
      message: 'Erro ao buscar canais paginados.',
      channels: [],
      totalChannels: 0,
      currentPage: 1,
      totalPages: 1,
    }
  }
}
