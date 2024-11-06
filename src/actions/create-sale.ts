'use server'

import { revalidatePath } from 'next/cache'

import { SaleFormData } from '@/components/form-sales'
import { prisma } from '@/service/prisma-client'

import { getOrganizationIdFromJWT } from './get-organization-token'

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
        month: new Date(data.month),
        investment: data.investment,
        revenue: data.revenue,
        leadsGenerated: data.leadsGenerated,
        salesCount: data.salesCount,
        productsSold: data.productsSold,
        organizationId: organizationId,
      },
    })

    revalidatePath('vendas')

    return { success: true, sale }
  } catch (error) {
    return { success: false, message: 'Erro ao criar venda.' }
  }
}

export async function updateSaleAction(id: number, data: SaleFormData) {
  try {
    const organizationId = getOrganizationIdFromJWT()

    if (!organizationId) {
      return {
        success: false,
        message: 'Organização não encontrada no token JWT.',
      }
    }

    const existingSale = await prisma.sale.findFirst({
      where: {
        id: id,
        organizationId: organizationId,
      },
    })

    if (!existingSale) {
      return {
        success: false,
        message: 'Venda não encontrada ou não pertence à sua organização.',
      }
    }

    const updatedSale = await prisma.sale.update({
      where: {
        id: id,
      },
      data: {
        month: new Date(data.month),
        investment: data.investment,
        revenue: data.revenue,
        leadsGenerated: data.leadsGenerated,
        salesCount: data.salesCount,
        productsSold: data.productsSold,
      },
    })

    revalidatePath('vendas')

    return { success: true, sale: updatedSale }
  } catch (error) {
    return { success: false, message: 'Erro ao atualizar venda.' }
  }
}

export async function getSaleById(id: number) {
  try {
    const organizationId = getOrganizationIdFromJWT()

    if (!organizationId) {
      return {
        success: false,
        message: 'Organização não encontrada no token JWT.',
      }
    }

    const sale = await prisma.sale.findFirst({
      where: {
        id: id,
        organizationId: organizationId,
      },
    })

    if (!sale) {
      return {
        success: false,
        message: 'Venda não encontrada ou não pertence à sua organização.',
      }
    }

    return { success: true, sale }
  } catch (error) {
    return { success: false, message: 'Erro ao buscar venda.' }
  }
}
