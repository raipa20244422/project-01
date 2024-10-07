import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

import { api } from '@/service/api-client'

export interface Organization {
  organization: {
    id: string
    name: string
    email: string
    avatarUrl: string | null
  }
}

export async function getCurrentOrganization() {
  try {
    const { status, data } = await api.get<Organization>('get-organization')

    if (!data) {
      cookies().delete('auth_store')
      redirect('/sign-in')
    }

    return { data }
  } catch {
    redirect('/sign-in')
  }
}
