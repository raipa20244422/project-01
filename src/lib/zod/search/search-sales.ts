import { z } from 'zod'

const searchSalesSchema = z.object({
  search: z.string(),
})

type SearchSalesSchema = z.infer<typeof searchSalesSchema>

export { type SearchSalesSchema, searchSalesSchema }
