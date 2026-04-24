import { NextResponse, type NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';

export async function proxy(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll()     { return request.cookies.getAll(); },
        setAll(vals) {
          vals.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          vals.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
        },
      },
    }
  );

  // Refresh session if expired
  const { data: { user } } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;

  // Protect /app/* routes
  if (pathname.startsWith('/app') && !user) {
    return NextResponse.redirect(new URL('/signin', request.url));
  }

  // Redirect logged-in users away from auth pages
  if ((pathname === '/signin' || pathname === '/signup') && user) {
    return NextResponse.redirect(new URL('/app/leads', request.url));
  }

  return response;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|hero-bg.png|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
