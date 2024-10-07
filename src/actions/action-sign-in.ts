'use server'

import { cookies } from 'next/headers'

import { SignInSchema } from '@/lib/zod/sign-in-schema'
import { api } from '@/service/api-client'

interface SignInWithPasswordResponse {
  code: number
  token: string
  refreshToken: string
}

export async function signInWithCredentials(schema: SignInSchema) {
  try {
    const response = await api.post<SignInWithPasswordResponse>(
      'organization/sessions/password',
      schema,
    )

    const { token } = response.data

    if (response.status === 201) {
      cookies().set('auth_store', token, {
        path: '/',
        maxAge: 60 * 60 * 24,
        secure: false,
      })
    }

    return { code: response.status }
  } catch (error: any) {
    // Lida com erros de requisição
    return {
      code: error.response?.status || 500,
      error: error.response?.data || 'Erro interno',
    }
  }
}
