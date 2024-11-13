'use server'

import { revalidatePath } from 'next/cache'

import { prisma } from '@/service/prisma-client'

import { getOrganizationIdFromJWT } from './get-organization-token'

export async function deleteChannelAction(id: number) {
  try {
    const organizationId = getOrganizationIdFromJWT()
    if (!organizationId) {
      return {
        success: false,
        message: 'Organização não encontrada no token JWT.',
      }
    }

    const existingChannel = await prisma.channel.findFirst({
      where: { id, organizationId },
    })

    if (!existingChannel) {
      return {
        success: false,
        message: 'Canal não encontrado ou não pertence à sua organização.',
      }
    }

    await prisma.channel.delete({
      where: { id },
    })

    revalidatePath('/channels')
    return { success: true, message: 'Canal deletado com sucesso.' }
  } catch (error) {
    console.error('Erro ao deletar canal:', error)
    return { success: false, message: 'Erro ao deletar canal.' }
  }
}

export async function deleteCollaboratorAction(id: number) {
  try {
    const organizationId = getOrganizationIdFromJWT()
    if (!organizationId) {
      return {
        success: false,
        message: 'Organização não encontrada no token JWT.',
      }
    }

    const existingCollaborator = await prisma.collaborator.findFirst({
      where: { id, organizationId },
    })

    if (!existingCollaborator) {
      return {
        success: false,
        message:
          'Colaborador não encontrado ou não pertence à sua organização.',
      }
    }

    await prisma.collaborator.delete({
      where: { id },
    })

    revalidatePath('/colaboradores')
    return { success: true, message: 'Colaborador deletado com sucesso.' }
  } catch (error) {
    console.error('Erro ao deletar colaborador:', error)
    return { success: false, message: 'Erro ao deletar colaborador.' }
  }
}

export async function deleteGoalAction(id: number) {
  try {
    const organizationId = getOrganizationIdFromJWT()
    if (!organizationId) {
      return {
        success: false,
        message: 'Organização não encontrada no token JWT.',
      }
    }

    const existingGoal = await prisma.goal.findFirst({
      where: { id, organizationId },
    })

    if (!existingGoal) {
      return {
        success: false,
        message: 'Meta não encontrada ou não pertence à sua organização.',
      }
    }

    await prisma.goal.delete({
      where: { id },
    })

    revalidatePath('/goal')
    return { success: true, message: 'Meta deletada com sucesso.' }
  } catch (error) {
    console.error('Erro ao deletar meta:', error)
    return { success: false, message: 'Erro ao deletar meta.' }
  }
}

export async function deleteSaleAction(id: number) {
  try {
    const organizationId = getOrganizationIdFromJWT()
    if (!organizationId) {
      return {
        success: false,
        message: 'Organização não encontrada no token JWT.',
      }
    }

    const existingSale = await prisma.sale.findFirst({
      where: { id, organizationId },
    })

    if (!existingSale) {
      return {
        success: false,
        message: 'Venda não encontrada ou não pertence à sua organização.',
      }
    }

    await prisma.sale.delete({
      where: { id },
    })

    revalidatePath('/channel-sales')
    return { success: true, message: 'Venda deletada com sucesso.' }
  } catch (error) {
    console.error('Erro ao deletar venda:', error)
    return { success: false, message: 'Erro ao deletar venda.' }
  }
}

// export async function deleteLeadAction(id: number) {
//   try {
//     const organizationId = getOrganizationIdFromJWT()
//     if (!organizationId) {
//       return {
//         success: false,
//         message: 'Organização não encontrada no token JWT.',
//       }
//     }

//     // Verifica se o modelo 'Lead' existe
//     const existingLead = await prisma.lead.findFirst({
//       where: { id, organizationId },
//     })

//     if (!existingLead) {
//       return {
//         success: false,
//         message: 'Lead não encontrado ou não pertence à sua organização.',
//       }
//     }

//     await prisma.lead.delete({
//       where: { id },
//     })

//     revalidatePath('/leads')
//     return { success: true, message: 'Lead deletado com sucesso.' }
//   } catch (error) {
//     console.error('Erro ao deletar lead:', error)
//     return { success: false, message: 'Erro ao deletar lead.' }
//   }
// }
