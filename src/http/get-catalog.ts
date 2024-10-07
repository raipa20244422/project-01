import { api } from '@/service/api-client'

export async function getCatalog(
  order?: string | null,
  search?: string | null,
  situation?: string | null,
) {
  const response = await api.get('get-catalog', {
    params: { order, search, situation },
  })

  return response.data
}
