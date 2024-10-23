'use server'

import { revalidatePath } from 'next/cache'

import { CollaboratorFormData } from '@/components/form-collaborator'
import { prisma } from '@/service/prisma-client'

import { getOrganizationIdFromJWT } from './get-organization-token'

export async function createCollaboratorAction(data: CollaboratorFormData) {
  try {
    const organizationId = getOrganizationIdFromJWT()

    if (!organizationId) {
      return {
        success: false,
        message: 'Organização não encontrada no token JWT.',
      }
    }

    const collaborator = await prisma.collaborator.create({
      data: {
        organizationId,
        ...data,
      },
    })

    revalidatePath('colaboradores')

    return { success: true, collaborator }
  } catch (error) {
    console.error('Erro ao criar colaborador:', error)
    return { success: false, message: 'Erro ao criar colaborador' }
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
        id: id,
        organizationId: organizationId,
      },
      select: {
        id: true,
        name: true,
        leadsAttended: true,
        salesCount: true,
        productsSold: true,
        revenue: true,
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

export async function updateCollaboratorAction(
  id: number,
  data: CollaboratorFormData,
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
    })

    if (!existingCollaborator) {
      return {
        success: false,
        message:
          'Colaborador não encontrado ou não pertence à sua organização.',
      }
    }

    const updatedCollaborator = await prisma.collaborator.update({
      where: {
        id,
      },
      data: {
        ...data,
      },
    })

    revalidatePath('colaboradores')

    return { success: true, collaborator: updatedCollaborator }
  } catch (error) {
    console.error('Erro ao atualizar colaborador:', error)
    return { success: false, message: 'Erro ao atualizar colaborador.' }
  }
}
