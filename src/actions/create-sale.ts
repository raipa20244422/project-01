'use server'

import { revalidatePath } from 'next/cache'

import { prisma } from '@/service/prisma-client'

import { getOrganizationIdFromJWT } from './get-organization-token'

interface SaleFormData {
  amount: number
  saleDate: Date
  leadId: string
  collaboratorId: string
}

export async function createSaleAction(data: SaleFormData) {
  try {
    const organizationId = getOrganizationIdFromJWT()

    if (!organizationId) {
      return {
        success: false,
        message: 'Organização não encontrada no token JWT.',
      }
    }

    const sale = await prisma.sale.create({
      data: {
        amount: data.amount,
        saleDate: new Date(data.saleDate),
        leadId: parseInt(data.leadId),
        organizationId: organizationId,
        collaboratorId: parseInt(data.collaboratorId),
      },
    })

    revalidatePath('vendas')

    return { success: true, sale }
  } catch (error) {
    return { success: false, message: 'Erro ao criar venda.' }
  }
}
