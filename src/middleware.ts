import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

const protectedRoutes = [
  '/',
  '/consumers',
  '/appointments',
  '/requests',
  '/catalog',
  '/account',
]

export function middleware(request: NextRequest) {
  // Verifica se o token de autenticação está presente nos cookies
  const token = request.cookies.get('auth_store')?.value
  const { pathname } = request.nextUrl

  // Se o token não estiver presente e a rota estiver no array de rotas protegidas, redireciona para a página de login
  if (!token && protectedRoutes.includes(pathname)) {
    const signInUrl = new URL('/sign-in', request.url)
    return NextResponse.redirect(signInUrl)
  }

  // Se o token estiver presente e o usuário tentar acessar sign-in ou sign-up, redireciona para o dashboard
  if (token && (pathname === '/sign-in' || pathname === '/sign-up')) {
    const dashboardUrl = new URL('/', request.url)
    return NextResponse.redirect(dashboardUrl)
  }

  // Caso o token esteja presente e a rota seja permitida, continua a navegação
  return NextResponse.next()
}

// Configura as rotas onde o middleware será aplicado
export const config = {
  matcher: [
    '/',
    '/consumers/:path*',
    '/appointments/:path*',
    '/requests/:path*',
    '/catalog/:path*',
    '/collaborator',
    '/collaborator/:path*',
    '/sign-in',
    '/sign-up',
  ], // Inclui as rotas do array no matcher
}
