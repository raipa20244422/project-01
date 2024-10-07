'use server'

import { SalesState } from '@/lib/zod/sales-state-schema'
import { api } from '@/service/api-client'

export async function createSale(schema: SalesState) {
  try {
    // Preparando os dados para o envio
    const { selectedItems, total } = schema

    const payload: any = {
      items: selectedItems.map((item) => ({
        id: item.id,
        type: item.type,
        quantity: item.quantity,
        unitPrice: Number(item.price), // Garante que o unitPrice seja um número
        totalPrice: Number(item.total), // Garante que o totalPrice seja um número
      })),
      totalAmount: total, // Certifique-se de que o total seja um número
    }

    // Omitindo customerId se for null ou indefinido
    if (schema.customerId) {
      payload.customerId = schema.customerId
    }

    const response = await api.post<{ saleId: string }>(
      '/organization/sales/create',
      payload,
    )

    console.log(response.status)
    // Verifica se a venda foi criada com sucesso
    if (response.status !== 201) {
      return {
        success: false,
        error: `Erro ao criar a venda. Status: ${response.status}`,
      }
    }

    return { success: true, saleId: response.data.saleId }
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data?.message || error.message,
    }
  }
}
