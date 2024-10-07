import { z } from 'zod'

const leadSchema = z.object({
  name: z.string().min(1, 'O nome é obrigatório'),
})

type LeadFormData = z.infer<typeof leadSchema>

export { type LeadFormData, leadSchema }
