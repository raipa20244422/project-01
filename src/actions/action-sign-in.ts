'use server'

import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { cookies } from 'next/headers'

import { SignInSchema } from '@/lib/zod/sign-in-schema'
import { prisma } from '@/service/prisma-client'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

export async function signInWithCredentials(schema: SignInSchema) {
  try {
    const { email, password } = schema

    const organization = await prisma.organization.findUnique({
      where: {
        email,
      },
    })

    if (!organization) {
      return { code: 401, error: 'Invalid credentials' }
    }

    const isPasswordValid = await bcrypt.compare(
      password,
      organization.password,
    )
    if (!isPasswordValid) {
      return { code: 401, error: 'Invalid credentials' }
    }

    const token = jwt.sign(
      { organizationId: organization.id, email: organization.email },
      JWT_SECRET,
      { expiresIn: '6h' },
    )

    cookies().set('token', token, {
      httpOnly: false,
      expires: new Date(Date.now() + 6 * 60 * 60 * 1000),
    })

    return { code: 200, message: 'Sign-in successful' }
  } catch (error: any) {
    console.log(error)
    return {
      code: 500,
      error: 'Internal error occurred during sign-in',
    }
  }
}
