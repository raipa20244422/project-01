import { z } from 'zod'

export const schema = z.object({
  email: z.string().email(),
})

export type SchemaInviteCollaborator = z.infer<typeof schema>
