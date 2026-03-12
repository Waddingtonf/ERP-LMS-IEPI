/**
 * audit.ts — lightweight access log in the middleware pipeline.
 *
 * Runs in Edge runtime. Emits a fire-and-forget POST to the internal
 * /api/audit endpoint so the main request is not blocked.
 * In mock/dev mode it logs to console instead.
 */
import { NextRequest } from 'next/server';

const isMockMode =
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    process.env.NEXT_PUBLIC_SUPABASE_URL.includes('dummy');

export interface AuditEntry {
    pathname: string;
    method: string;
    ip: string;
    userId?: string;
    userRole?: string;
    timestamp: string;
}

export function logRequestAudit(
    request: NextRequest,
    userId?: string,
    userRole?: string,
): void {
    const entry: AuditEntry = {
        pathname: request.nextUrl.pathname,
        method: request.method,
        ip:
            request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
            request.headers.get('x-real-ip') ??
            'unknown',
        userId,
        userRole,
        timestamp: new Date().toISOString(),
    };

    if (isMockMode) {
        // Dev mode: structured console log
        console.log('[AUDIT]', JSON.stringify(entry));
        return;
    }

    // Production: fire-and-forget to internal API route
    const auditUrl = new URL('/api/audit', request.url);
    fetch(auditUrl.toString(), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(entry),
    }).catch(() => {
        // Swallow — audit failures must never break the main request
    });
}
