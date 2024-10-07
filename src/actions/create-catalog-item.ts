'use server'

import { revalidateTag } from 'next/cache'

import { CatalogSchema } from '@/lib/zod/catalog-schema'
import { api } from '@/service/api-client'
import { replaceNumeric } from '@/utils/cast-all'

export async function createCatalogItem(schema: CatalogSchema) {
  try {
    const { price, discount_price, ...content } = schema

    const { data, status } = await api.post<CatalogSchema>(
      '/create-item-catalog',
      {
        ...content,
        price: replaceNumeric(price),
        discount_price: replaceNumeric(discount_price),
      },
    )

    if (status !== 201) {
      return {
        success: false,
        error: `Erro ao criar o item. Status: ${status}`,
      }
    }

    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}
