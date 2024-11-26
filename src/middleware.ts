import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

const protectedRoutes = [
  '/',
  '/consumers',
  '/appointments',
  '/requests',
  '/catalog',
  '/account',
  '/channel-sales',
  '/channels',
  '/colaboradores',
  '/goal',
]

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value
  const { pathname } = request.nextUrl

  if (!token && protectedRoutes.includes(pathname)) {
    const signInUrl = new URL('/sign-in', request.url)
    return NextResponse.redirect(signInUrl)
  }

  if (token && (pathname === '/sign-in' || pathname === '/sign-up')) {
    const dashboardUrl = new URL('/', request.url)
    return NextResponse.redirect(dashboardUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/',
    '/consumers/:path*',
    '/appointments/:path*',
    '/requests/:path*',
    '/catalog/:path*',
    '/account',
    '/channel-sales',
    '/channels',
    '/colaboradores',
    '/goal',
    '/collaborator',
    '/collaborator/:path*',
    '/sign-in',
    '/sign-up',
  ],
}
