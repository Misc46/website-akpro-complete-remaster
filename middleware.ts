import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

export async function middleware(req: NextRequest) {
    const path = req.nextUrl.pathname;

    // Only protect /admin/dashboard
    if (path.startsWith('/admin/dashboard')) {
        const token = req.cookies.get('admin_token')?.value;

        if (!token) {
            return NextResponse.redirect(new URL('/admin/login', req.url));
        }

        try {
            const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'fallback-secret');
            await jwtVerify(token, secret);
            return NextResponse.next();
        } catch (error) {
            console.error('JWT verification failed:', error);
            return NextResponse.redirect(new URL('/admin/login', req.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/admin/dashboard/:path*'],
};
