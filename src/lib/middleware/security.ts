/**
 * security.ts — apply HTTP security headers to every response.
 *
 * Called as the first step in the middleware chain.
 * Compatible with Next.js Edge runtime.
 */
import { NextResponse } from 'next/server';

const CSP = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://js.cielo.com.br",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: blob: https:",
    "font-src 'self' data:",
    "connect-src 'self' https://*.supabase.co wss://*.supabase.co https://apiquerysandbox.cieloecommerce.cielo.com.br https://apisandbox.cieloecommerce.cielo.com.br",
    "frame-src 'self' https://www.youtube.com https://player.vimeo.com",
    "media-src 'self' blob: https://*.supabase.co",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    "upgrade-insecure-requests",
].join('; ');

export function applySecurityHeaders(response: NextResponse): NextResponse {
    response.headers.set('Content-Security-Policy', CSP);
    response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
    response.headers.set('X-Frame-Options', 'DENY');
    response.headers.set('X-Content-Type-Options', 'nosniff');
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
    response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
    return response;
}
