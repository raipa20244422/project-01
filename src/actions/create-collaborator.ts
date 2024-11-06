'use server'

import { revalidatePath } from 'next/cache'

import { CollaboratorFormData, ItemData } from '@/components/form-collaborator'
import { prisma } from '@/service/prisma-client'

import { getOrganizationIdFromJWT } from './get-organization-token'

export async function createCollaboratorAction(
  data: CollaboratorFormData & { items: ItemData[] },
) {
  try {
    const organizationId = getOrganizationIdFromJWT()

    if (!organizationId) {
      return {
        success: false,
        message: 'Organização não encontrada no token JWT.',
      }
    }

    const { name, items } = data

    const collaborator = await prisma.collaborator.create({
      data: {
        name,
        organizationId,
        items: {
          create: items.map((item) => ({
            channelId: item.channelId || 0,
            leadsGenerated: item.leadsGenerated || 0,
            salesCount: item.salesCount || 0,
            productsSold: item.productsSold || 0,
            revenue: item.revenue || 0,
            investedAmount: item.investedAmount || 0,
          })),
        },
      },
      include: {
        items: true,
      },
    })

    revalidatePath('/colaboradores')

    return { success: true, collaborator }
  } catch (error) {
    console.error('Erro ao criar colaborador:', error)
    return { success: false, message: 'Erro ao criar colaborador' }
  }
}

export async function updateCollaboratorAction(
  id: number,
  data: CollaboratorFormData & { items: ItemData[] },
) {
  try {
    const organizationId = getOrganizationIdFromJWT()

    if (!organizationId) {
      return {
        success: false,
        message: 'Organização não encontrada no token JWT.',
      }
    }

    const existingCollaborator = await prisma.collaborator.findFirst({
      where: {
        id,
        organizationId,
      },
      include: {
        items: true,
      },
    })

    if (!existingCollaborator) {
      return {
        success: false,
        message:
          'Colaborador não encontrado ou não pertence à sua organização.',
      }
    }

    const { name, items } = data

    const existingItemIds = existingCollaborator.items.map((item) => item.id)
    const sentItems = items || []
    const sentItemIds = sentItems
      .map((item) => item.id)
      .filter((id): id is number => id !== undefined)

    const itemsToDelete = existingItemIds.filter(
      (id) => !sentItemIds.includes(id),
    )

    // Iniciando uma transação para garantir a consistência dos dados
    const updatedCollaborator = await prisma.$transaction(async (prisma) => {
      // Atualiza o nome do colaborador
      await prisma.collaborator.update({
        where: { id },
        data: { name },
      })

      // Exclui os itens que não estão na lista enviada
      await prisma.collaboratorItem.deleteMany({
        where: {
          id: { in: itemsToDelete },
        },
      })

      // Atualiza itens existentes e cria novos itens
      for (const item of sentItems) {
        if (item.id) {
          // Atualiza item existente
          await prisma.collaboratorItem.update({
            where: { id: item.id },
            data: {
              channelId: item.channelId || 0,
              leadsGenerated: item.leadsGenerated || 0,
              salesCount: item.salesCount || 0,
              productsSold: item.productsSold || 0,
              revenue: item.revenue || 0,
              investedAmount: item.investedAmount || 0,
            },
          })
        } else {
          // Cria novo item
          await prisma.collaboratorItem.create({
            data: {
              leadsGenerated: item.leadsGenerated || 0,
              salesCount: item.salesCount || 0,
              productsSold: item.productsSold || 0,
              revenue: item.revenue || 0,
              investedAmount: item.investedAmount || 0,
              collaboratorId: id,
            },
          })
        }
      }

      // Retorna o colaborador atualizado com os itens
      return prisma.collaborator.findUnique({
        where: { id },
        include: { items: true },
      })
    })

    revalidatePath('/colaboradores')

    return { success: true, collaborator: updatedCollaborator }
  } catch (error) {
    console.error('Erro ao atualizar colaborador:', error)
    return { success: false, message: 'Erro ao atualizar colaborador.' }
  }
}

export async function getCollaboratorById(id: number) {
  try {
    const organizationId = getOrganizationIdFromJWT()

    if (!organizationId) {
      return {
        success: false,
        message: 'Organização não encontrada no token JWT.',
      }
    }

    const collaborator = await prisma.collaborator.findFirst({
      where: {
        id,
        organizationId,
      },
      include: {
        items: true, // Inclui os itens associados
      },
    })

    if (!collaborator) {
      return {
        success: false,
        message:
          'Colaborador não encontrado ou não pertence à sua organização.',
      }
    }

    return { success: true, collaborator }
  } catch (error) {
    console.error('Erro ao buscar colaborador por ID:', error)
    return { success: false, message: 'Erro ao buscar colaborador.' }
  }
}
