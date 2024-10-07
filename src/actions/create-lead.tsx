'use server'

import { LeadFormData } from '@/lib/zod/lead-schema'
import { prisma } from '@/service/prisma-client'

export async function createLead(schema: LeadFormData) {
  // await prisma.lead.create({
  //   data: {
  //     ...schema,
  //   },
  // })
}
