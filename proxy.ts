import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { validateSessionToken } from '@/server/db/auth/validateSessionToken';

export const config = { matcher: ['/calls', '/dashboard', '/settings'] };

/**
 * Middleware function to handle authentication and security checks.
 */
export async function proxy(request: NextRequest): Promise<NextResponse> {
  if (request.method === 'GET') {
    return await handleAuth(request);
  }

  return validateRequestOrigin(request);
}

/**
 * Handles authentication for protected routes.
 */
async function handleAuth(request: NextRequest): Promise<NextResponse> {
  const token = request.cookies.get('auth_session')?.value;

  if (!token || !(await validateSessionToken(token))) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  const response = NextResponse.next();
  response.cookies.set('auth_session', token, {
    path: '/',
    maxAge: 60 * 60, // 1 hour
    sameSite: 'lax',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
  });

  return response;
}

/**
 * Validates request origin to prevent CSRF attacks.
 */
function validateRequestOrigin(request: NextRequest): NextResponse {
  const originHeader = request.headers.get('Origin');
  const hostHeader = request.headers.get('Host');

  if (!originHeader || !hostHeader) {
    return new NextResponse(null, { status: 403 });
  }

  try {
    const origin = new URL(originHeader);
    if (origin.host !== hostHeader) {
      return new NextResponse(null, { status: 403 });
    }
  } catch {
    return new NextResponse(null, { status: 403 });
  }

  return NextResponse.next();
}
