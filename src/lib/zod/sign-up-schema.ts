import { z } from 'zod'

export const signUpSchema = z
  .object({
    name: z
      .string({
        required_error: 'O nome da loja é obrigatório.',
      })
      .min(1, { message: 'O nome da loja deve ser preenchido.' }),
    slug: z
      .string({
        required_error: 'O slug da loja é obrigatório.',
      })
      .min(1, { message: 'O slug da loja deve ser preenchido.' })
      .regex(/^[a-z0-9]+$/, {
        message:
          'O slug deve conter apenas letras minúsculas e números, sem espaços, barras ou acentos.',
      }),
    email: z
      .string({
        required_error: 'O email é obrigatório.',
      })
      .email({ message: 'Por favor, insira um email válido.' }),
    cpforcnpj: z
      .string({
        required_error: 'O CPF ou CNPJ é obrigatório.',
      })
      .refine(
        (value) => {
          const onlyNumbers = value.replace(/\D/g, '')
          return onlyNumbers.length === 11 || onlyNumbers.length === 14
        },
        {
          message:
            'O CPF deve ter exatamente 11 dígitos ou o CNPJ deve ter exatamente 14 dígitos.',
        },
      ),
    street: z
      .string({
        required_error: 'A rua é obrigatória.',
      })
      .min(1, { message: 'A rua deve ser preenchida.' })
      .max(255, { message: 'A rua deve ter no máximo 255 caracteres.' }),
    neighborhood: z
      .string({
        required_error: 'O bairro é obrigatório.',
      })
      .min(1, { message: 'O bairro deve ser preenchido.' })
      .max(255, { message: 'O bairro deve ter no máximo 255 caracteres.' }),
    number: z
      .string({
        required_error: 'O número é obrigatório.',
      })
      .min(1, { message: 'O número deve ser preenchido.' })
      .max(10, { message: 'O número deve ter no máximo 10 caracteres.' }),
    city: z
      .string({
        required_error: 'A cidade é obrigatória.',
      })
      .min(1, { message: 'A cidade deve ser preenchida.' })
      .max(100, { message: 'A cidade deve ter no máximo 100 caracteres.' }),
    state: z
      .string({
        required_error: 'O estado é obrigatório.',
      })
      .min(2, { message: 'O estado deve ter exatamente 2 caracteres.' })
      .max(2, { message: 'O estado deve ter exatamente 2 caracteres.' }),
    zipCode: z
      .string({
        required_error: 'O CEP é obrigatório.',
      })
      .min(8, { message: 'O CEP deve ter exatamente 8 caracteres.' })
      .max(8, { message: 'O CEP deve ter exatamente 8 caracteres.' })
      .regex(/^\d+$/, { message: 'O CEP deve conter apenas números.' }),
    phone: z
      .string()
      .max(15, { message: 'O telefone deve ter no máximo 15 caracteres.' }),
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
