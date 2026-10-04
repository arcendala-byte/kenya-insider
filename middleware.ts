import { NextResponse, type NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const segment = request.nextUrl.pathname.split('/').filter(Boolean)[0];
  const publicRoots = new Set(['about', 'admin', 'api', 'cancellation', 'concierge', 'contact', 'dashboard', 'destinations', 'experiences', 'faq', 'journal', 'plan-your-trip', 'privacy-policy', 'register', 'services', 'sign-in', 'terms-and-conditions']);
  if (segment && !publicRoots.has(segment) && !['en', 'fr'].includes(segment)) {
    return new NextResponse(null, { status: 404 });
  }
  return NextResponse.next();
}

export const config = { matcher: ['/((?!_next|.*\\..*).*)'] };
