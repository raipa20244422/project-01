'use server'

import bcrypt from 'bcrypt'

import { SignUpSchema } from '@/lib/zod/sign-up-schema'
import { prisma } from '@/service/prisma-client'

export async function createAccountOrganization(schema: SignUpSchema) {
  const { confirmPassword, ...props } = schema

  try {
    const hashedPassword = await bcrypt.hash(props.password, 10)

    const organization = await prisma.organization.create({
      data: {
        ...props,
        password: hashedPassword,
        isActive: true,
        approved: false,
        ownerId: 1,
      },
    })

    return { code: 201, message: 'Account created successfully' }
  } catch (error: any) {
    const errorMessage =
      error.message || 'Internal error occurred during sign-up'
    return {
      code: 500,
      message: errorMessage,
    }
  }
}
