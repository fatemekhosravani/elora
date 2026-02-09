import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { decrypt } from '@/lib/session';

export async function middleware(request: NextRequest) {
    const sessionCookie = request.cookies.get('session');
    const session = await decrypt(sessionCookie?.value);

    const { pathname } = request.nextUrl;

    // 1. Protected User Routes (Customer Dashboard)
    if (pathname.startsWith('/panel')) {
        if (!session) {
            return NextResponse.redirect(new URL('/login', request.url));
        }
        // Optional: Ensure role is CUSTOMER (or allow vendors too as they are users?)
        // Usually vendors can access customer panel too, or not.
        // Spec said: "If user is logged in as CUSTOMER but tries to access /vendor-panel/* -> 403"
    }

    // 2. Protected Vendor Routes
    if (pathname.startsWith('/vendor-panel')) {
        if (!session) {
            return NextResponse.redirect(new URL('/login', request.url));
        }
        if (session.role !== 'VENDOR_OWNER' && session.role !== 'ADMIN') {
            // Redirect to 403 or Dashboard if unauthorized
            // For now, redirect to customer panel
            return NextResponse.redirect(new URL('/panel', request.url));
        }
    }

    // 3. Protected Admin Routes
    if (pathname.startsWith('/admin')) {
        if (!session) {
            return NextResponse.redirect(new URL('/login', request.url));
        }
        if (session.role !== 'ADMIN') {
            return NextResponse.redirect(new URL('/', request.url));
        }
    }

    // 4. Auth Routes (Redirect to dashboard if already logged in)
    if (pathname === '/login') {
        if (session) {
            if (session.role === 'VENDOR_OWNER') {
                return NextResponse.redirect(new URL('/vendor-panel', request.url));
            }
            if (session.role === 'ADMIN') {
                return NextResponse.redirect(new URL('/admin/dashboard', request.url));
            }
            return NextResponse.redirect(new URL('/panel', request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - public folder files (optional logic)
         */
        '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ],
};
