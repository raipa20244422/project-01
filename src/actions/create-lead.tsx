'use server'

import { revalidatePath } from 'next/cache'

import { LeadFormData } from '@/lib/zod/lead-schema'
import { prisma } from '@/service/prisma-client'

import { getOrganizationIdFromJWT } from './get-organization-token'

export async function createLeadAction(data: LeadFormData) {
  try {
    const organizationId = getOrganizationIdFromJWT()

    if (!organizationId) {
      return {
        success: false,
        message: 'Organização não encontrada no token JWT.',
      }
    }

    const lead = await prisma.lead.create({
      data: {
        name: data.name,
        organizationId,
      },
    })

    revalidatePath('leads')
    return { success: true, lead }
  } catch (error) {
    return { success: false, message: 'Erro ao criar lead' }
  }
}
