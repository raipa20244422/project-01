import { api } from '@/service/api-client'

export async function getSales(
  order?: string | null,
  search?: string | null,
  situation?: string | null,
) {
  const response = await api.get('organization/sales', {})

  return response.data
}
