import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

import type { NextRequest } from 'next/server';

const publicPaths = ['/', '/api/auth', '/login', '/signin', '/register', '/forgot-password'];

export async function middleware(request: NextRequest) {
  // Get the pathname of the request
  const path = request.nextUrl.pathname;

  // Public paths that don't require authentication

  // Check if the path is public
  const isPublicPath = publicPaths.some((publicPath) => path.startsWith(publicPath));

  // Get the token
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  // Redirect unauthenticated users to login page if trying to access a protected route
  if (!token && !isPublicPath) {
    const url = new URL('/signin', request.url);
    url.searchParams.set('callbackUrl', encodeURI(request.url));
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

// Configure paths that should be subject to the middleware
export const config = {
  matcher: [
    // Match all paths except for:
    // - API routes that don't need authentication
    // - Static files
    // - Other public assets
    '/((?!api/auth|_next/static|_next/image|favicon.ico|public).*)',
  ],
};
