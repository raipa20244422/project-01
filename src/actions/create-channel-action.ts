'use server'

import { revalidatePath } from 'next/cache'

import { prisma } from '@/service/prisma-client'

import { getOrganizationIdFromJWT } from './get-organization-token' // Função para obter o organizationId do JWT

interface CreateChannelData {
  name: string
}

export async function createChannelAction(data: CreateChannelData) {
  try {
    const organizationId = getOrganizationIdFromJWT()

    if (!organizationId) {
      return { success: false, message: 'Organização não encontrada.' }
    }

    const channel = await prisma.channel.create({
      data: {
        name: data.name,
        organizationId: organizationId,
      },
    })

    revalidatePath('canais')

    return { success: true, channel }
  } catch (error) {
    console.error('Erro ao criar canal:', error)
    return { success: false, message: 'Erro ao criar canal.' }
  }
}
