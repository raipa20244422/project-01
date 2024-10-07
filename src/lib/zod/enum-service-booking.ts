import { z } from 'zod'

export const StatusEnum = z.enum(['pending', 'accepted', 'rejected'])
