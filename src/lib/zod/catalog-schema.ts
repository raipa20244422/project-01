import * as z from 'zod'

export const catalogSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  price: z.string().min(1, 'Preço é obrigatório'),
  discount_price: z.string().optional().default('0'),
  description: z.string().min(1, 'Descrição é obrigatória'),
  type: z
    .enum(['product', 'service'], {
      required_error: 'Selecione um tipo válido',
    })
    .default('product'),
  situation: z
    .enum(['true', 'false'], {
      required_error: 'Selecione uma situação válida',
    })
    .default('true'),
  images: z
    .array(z.string().url('Imagem deve ser um link válido'), {
      required_error: 'Adicione pelo menos uma imagem',
    })
    .nonempty('Adicione pelo menos uma imagem'),
  cover_image: z
    .string({ required_error: 'Adicione pelo menos uma imagem' })
    .url({ message: 'Adicione pelo menos uma imagem' }),
  days: z
    .array(z.string(), {
      required_error: 'Selecione pelo menos um dia de disponibilidade',
    })
    .optional(),
  categories: z
    .array(z.string(), {
      required_error: 'Selecione pelo menos uma categoria',
    })
    .nonempty('Selecione pelo menos uma categoria'),
  collaborator: z.array(z.string()).optional(),
})

export type CatalogSchema = z.infer<typeof catalogSchema>
