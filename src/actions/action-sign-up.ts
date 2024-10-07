'use server'

import { SignUpSchema } from '@/lib/zod/sign-up-schema'
import { api } from '@/service/api-client'

interface Response {
  message: string
}

export async function createAccountOrganization(schema: SignUpSchema) {
  const { confirmPassword, ...props } = schema

  try {
    const { data, status } = await api.post<Response>(
      `create-organization-account`,
      props,
    )

    return { code: status, message: data.message }
  } catch (error: any) {
    const status = error.response?.status || 500
    const errorMessage = error.response?.data?.message || 'Erro interno'

    return {
      code: status,
      message: errorMessage,
    }
  }
}
