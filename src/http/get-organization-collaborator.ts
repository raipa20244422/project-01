import { AxiosError } from 'axios'

import { api } from '@/service/api-client'
import { OrganizationCollaborator } from '@/types/organization-collaborator'

export async function getOrganizationCollaborator() {
  try {
    const { data } = await api.get<OrganizationCollaborator[]>(
      'organization/collaborators',
    )
    return data
  } catch (error) {
    if (error instanceof AxiosError) {
      const statusCode = error.response?.status
      return []
    }
    return []
  }
}
