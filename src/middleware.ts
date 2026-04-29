import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  // Evitamos que _next / assets pasen por la lógica de Supabase (Bug Next.js local)
  const isAsset = request.nextUrl.pathname.startsWith('/_next') || request.nextUrl.pathname.includes('.');
  if (isAsset) {
    return response;
  }

  // Evitamos problemas si las variables de entorno aún no están.
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return response;
  }

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({ name, value, ...options })
          response = NextResponse.next({
            request: { headers: request.headers },
          })
          response.cookies.set({ name, value, ...options })
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({ name, value: '', ...options })
          response = NextResponse.next({
            request: { headers: request.headers },
          })
          response.cookies.set({ name, value: '', ...options })
        },
      },
    }
  )

  const { data: { session } } = await supabase.auth.getSession()

  // Definimos rutas públicas
  const isPublic = request.nextUrl.pathname.startsWith('/vehiculos') || 
                   request.nextUrl.pathname.startsWith('/login') || 
                   request.nextUrl.pathname.startsWith('/api');

  // Si no hay sesión y la ruta no es pública, redirigimos a login
  if (!session && !isPublic) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  // Si hay sesión activa e intentan entrar al login, los mandamos al dashboard
  if (session && request.nextUrl.pathname.startsWith('/login')) {
      const url = request.nextUrl.clone()
      url.pathname = '/'
      return NextResponse.redirect(url)
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Only run middleware on page navigation routes.
     * Excludes: _next, static files, api, favicon
     */
    '/',
    '/inbox/:path*',
    '/kanban/:path*',
    '/vehiculos/:path*',
    '/login',
  ],
}
