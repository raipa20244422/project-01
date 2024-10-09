import axios, { AxiosRequestConfig } from 'axios'
import { getCookie } from 'cookies-next'
import { CookiesFn } from 'cookies-next/lib/types'

const url = process.env.NEXT_PUBLIC_API_URL

export const api = axios.create({
  baseURL: url,
})

api.interceptors.request.use(
  async (config) => {
    let cookieStore: CookiesFn | undefined

    if (typeof window === 'undefined') {
      const { cookies: serverCookies } = await import('next/headers')
      cookieStore = serverCookies
    }

    const token = getCookie('token', { cookies: cookieStore })

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`
    }

    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)
