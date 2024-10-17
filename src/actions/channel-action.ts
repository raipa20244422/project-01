'use server'

import { revalidatePath } from 'next/cache'

import { ChannelFormData } from '@/components/form-channel'
import { prisma } from '@/service/prisma-client'
import { replaceNumeric } from '@/utils/cast-all'

import { getOrganizationIdFromJWT } from './get-organization-token'

export async function createChannelAction(data: ChannelFormData) {
  try {
    const organizationId = getOrganizationIdFromJWT()

    if (!organizationId) {
      return { success: false, message: 'Organização não encontrada.' }
    }

    const channel = await prisma.channel.create({
      data: {
        name: data.name,
        generateLeads: Number(replaceNumeric(data.generateLeads)),
        channelDate: data.channelDate,
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

export async function updateChannelAction(id: number, data: ChannelFormData) {
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
        generateLeads: Number(replaceNumeric(data.generateLeads)),
        channelDate: data.channelDate,
      },
    })

    revalidatePath('canais')

    return { success: true, channel: updatedChannel }
  } catch (error) {
    console.error('Erro ao atualizar canal:', error)
    return { success: false, message: 'Erro ao atualizar canal.' }
  }
}

export async function getChannelById(id: number) {
  try {
    const organizationId = getOrganizationIdFromJWT()

    if (!organizationId) {
      return { success: false, message: 'Organização não encontrada.' }
    }

    const channel = await prisma.channel.findFirst({
      select: {
        generateLeads: true,
        name: true,
        channelDate: true,
      },
      where: {
        id: id,
        organizationId: organizationId,
      },
    })

    if (!channel) {
      return {
        success: false,
        message: 'Canal não encontrado ou não pertence à sua organização.',
      }
    }

    return { success: true, channel }
  } catch (error) {
    console.error('Erro ao buscar canal:', error)
    return { success: false, message: 'Erro ao buscar canal.' }
  }
}
