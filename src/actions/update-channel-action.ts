'use server'

import { revalidatePath } from 'next/cache'

import { prisma } from '@/service/prisma-client'

import { getOrganizationIdFromJWT } from './get-organization-token'

interface UpdateChannelData {
  name: string
}

export async function updateChannelAction(id: number, data: UpdateChannelData) {
  try {
    const organizationId = getOrganizationIdFromJWT()

    if (!organizationId) {
      return { success: false, message: 'Organização não encontrada.' }
    }

    const existingChannel = await prisma.channel.findFirst({
      where: {
        id: id,
        organizationId: organizationId,
      },
    })

    if (!existingChannel) {
      return {
        success: false,
        message: 'Canal não encontrado ou não pertence à sua organização.',
      }
    }

    const updatedChannel = await prisma.channel.update({
      where: {
        id: id,
      },
      data: {
        name: data.name,
      },
    })

    revalidatePath('canais')

    return { success: true, channel: updatedChannel }
  } catch (error) {
    console.error('Erro ao atualizar canal:', error)
    return { success: false, message: 'Erro ao atualizar canal.' }
  }
}
