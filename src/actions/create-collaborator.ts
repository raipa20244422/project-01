'use server'

import { revalidatePath } from 'next/cache'

import { prisma } from '@/service/prisma-client'

import { getOrganizationIdFromJWT } from './get-organization-token'

interface CollaboratorFormData {
  name: string
}

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
        name: data.name,
        organizationId,
      },
    })

    revalidatePath('colaboradores')

    return { success: true, collaborator }
  } catch (error) {
    console.error('Erro ao criar colaborador:', error)
    return { success: false, message: 'Erro ao criar colaborador' }
  }
}
