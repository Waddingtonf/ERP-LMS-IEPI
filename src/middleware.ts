/**
 * src/middleware.ts — 5-layer request pipeline
 *
 * Layer 1 – Security headers    (every response)
 * Layer 2 – Rate limiting       (strict on auth/api routes)
 * Layer 3 – Session refresh     (Supabase SSR cookie handling)
 * Layer 4 – RBAC                (route-role enforcement — inside updateSession)
 * Layer 5 – Audit log           (fire-and-forget)
 */
import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { applySecurityHeaders } from '@/lib/middleware/security'
import { checkRateLimit } from '@/lib/middleware/rateLimit'
import { logRequestAudit } from '@/lib/middleware/audit'
import { updateSession } from '@/lib/supabase/middleware'

/** Routes that get a stricter rate limit (20 req/min). */
const STRICT_RATE_LIMIT_PREFIXES = ['/api/', '/admin/login', '/login', '/checkout']

function isStrictRoute(pathname: string): boolean {
    return STRICT_RATE_LIMIT_PREFIXES.some((p) => pathname.startsWith(p))
}

export async function middleware(request: NextRequest): Promise<NextResponse> {
    const { pathname } = request.nextUrl

    // ── Layer 2: Rate limiting ──────────────────────────────────────────────
    const rateLimitOptions = isStrictRoute(pathname)
        ? { limit: 20, windowMs: 60_000, prefix: 'strict' }
        : { limit: 120, windowMs: 60_000, prefix: 'default' }

    const rateLimitResponse = checkRateLimit(request, rateLimitOptions)
    if (rateLimitResponse) {
        applySecurityHeaders(rateLimitResponse)
        return rateLimitResponse
    }

    // ── Layers 3 + 4: Session refresh + RBAC ───────────────────────────────
    const response = await updateSession(request)

    // ── Layer 1: Security headers (applied to the final response) ──────────
    applySecurityHeaders(response)

    // ── Layer 5: Audit log (fire-and-forget, non-blocking) ─────────────────
    logRequestAudit(request)

    return response
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - public static assets (svg, png, jpg, jpeg, gif, webp)
         */
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
}
