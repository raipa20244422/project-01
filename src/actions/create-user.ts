'use server'

import bcrypt from 'bcrypt'

import { prisma } from '@/service/prisma-client'

interface UserFormData {
  name: string
  email: string
  password: string
}

export async function createUser(data: UserFormData) {
  try {
    const hashedPassword = await bcrypt.hash(data.password, 10)

    const newUser = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: hashedPassword,
      },
    })

    return { success: true, user: newUser }
  } catch (error) {
    console.error('Error creating user:', error)
    return { success: false, error: 'Error creating user' }
  }
}
