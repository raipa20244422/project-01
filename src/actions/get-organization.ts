'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

import { prisma } from '@/service/prisma-client'

import { getOrganizationIdFromJWT } from './get-organization-token'

export interface Organization {
  id: string
  name: string
  email: string
}

export async function getCurrentOrganization() {
  try {
    const organizationId = getOrganizationIdFromJWT()

    if (!organizationId) {
      cookies().delete('auth_store')
      redirect('/sign-in')
      return
    }

    const organization = await prisma.organization.findUnique({
      where: { id: organizationId },
      select: {
        id: true,
        name: true,
        email: true,
      },
    })

    if (!organization) {
      redirect('/sign-in')
      return
    }

    return { success: true, organization }
  } catch (error) {
    console.error('Erro ao buscar a organização:', error)
    //redirect('/api/clear-token')
  }
}
