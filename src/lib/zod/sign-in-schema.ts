import { z } from 'zod'

export const signInSchema = z.object({
  email: z
    .string({
      required_error: 'O email é obrigatório.',
    })
    .email({ message: 'Por favor, insira um email válido.' }),
  password: z
    .string({
      required_error: 'A senha é obrigatória.',
    })
    .min(6, { message: 'A senha deve ter no mínimo 6 caracteres.' }),
})

export type SignInSchema = z.infer<typeof signInSchema>
