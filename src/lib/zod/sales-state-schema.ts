import { z } from 'zod'

const SalesStateSchema = z.object({
  customerId: z.string().optional(),
  selectedItems: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      price: z.number(),
      quantity: z.number().min(1),
      total: z.number(),
      stock: z.number(),
      type: z.enum(['product', 'service']),
    }),
  ),
  subtotal: z.number().min(0),
  discount: z.number().min(0),
  total: z.number().min(0),
})

type SalesState = z.infer<typeof SalesStateSchema>

export { type SalesState, SalesStateSchema }
