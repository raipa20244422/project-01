import { z } from 'zod'

export const signUpSchema = z
  .object({
    name: z
      .string({
        required_error: 'O nome da loja é obrigatório.',
      })
      .min(1, { message: 'O nome da loja deve ser preenchido.' }),
    email: z
      .string({
        required_error: 'O email é obrigatório.',
      })
      .email({ message: 'Por favor, insira um email válido.' }),
    password: z
      .string({
        required_error: 'A senha é obrigatória.',
      })
      .min(6, { message: 'A senha deve ter no mínimo 6 caracteres.' })
      .max(100, { message: 'A senha deve ter no máximo 100 caracteres.' }),
    confirmPassword: z
      .string({
        required_error: 'A confirmação de senha é obrigatória.',
      })
      .min(6, {
        message: 'A confirmação de senha deve ter no mínimo 6 caracteres.',
      })
      .max(100, {
        message: 'A confirmação de senha deve ter no máximo 100 caracteres.',
      }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    message:
      'As senhas não correspondem. Por favor, verifique e tente novamente.',
  })

export type SignUpSchema = z.infer<typeof signUpSchema>
