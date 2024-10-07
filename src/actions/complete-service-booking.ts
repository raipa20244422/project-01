'use server'

import { AxiosError } from 'axios'

import { api } from '@/service/api-client'

export async function completeServiceBooking(id: string) {
  try {
    const { data } = await api.post(`organization/bookings/${id}/complete`, {})

    return { success: true }
  } catch (error) {
    if (error instanceof AxiosError) {
      const statusCode = error.response?.status
      const message = error.response?.data
    }
    return { success: false }
  }
}
