/**
 * rateLimit.ts — simple in-memory rate limiter.
 *
 * Edge-compatible (uses only Map + Date.now).
 * Note: In-memory rate limiting resets on cold starts / per-pod.
 * For production, replace the store with Upstash Redis / KV.
 */
import { NextRequest, NextResponse } from 'next/server';

interface Record {
    count: number;
    windowStart: number;
}

const store = new Map<string, Record>();

/** Clean up stale entries every ~1 000 requests to avoid memory growth. */
let cleanupCounter = 0;
function maybePrune(windowMs: number) {
    if (++cleanupCounter < 1000) return;
    cleanupCounter = 0;
    const now = Date.now();
    for (const [key, rec] of store) {
        if (now - rec.windowStart > windowMs) store.delete(key);
    }
}

export interface RateLimitOptions {
    /** Max requests per window. Default: 60 */
    limit?: number;
    /** Window size in ms. Default: 60_000 (1 min) */
    windowMs?: number;
    /** Key prefix to namespace different rules. Default: 'rl' */
    prefix?: string;
}

/**
 * Returns a 429 NextResponse when the client exceeds the limit, otherwise null.
 * The key is derived from the client IP (x-forwarded-for or x-real-ip).
 */
export function checkRateLimit(
    request: NextRequest,
    options: RateLimitOptions = {},
): NextResponse | null {
    const limit = options.limit ?? 60;
    const windowMs = options.windowMs ?? 60_000;
    const prefix = options.prefix ?? 'rl';

    const ip =
        request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
        request.headers.get('x-real-ip') ??
        'unknown';

    const key = `${prefix}:${ip}`;
    const now = Date.now();

    maybePrune(windowMs);

    const rec = store.get(key);
    if (!rec || now - rec.windowStart > windowMs) {
        store.set(key, { count: 1, windowStart: now });
        return null;
    }

    rec.count += 1;
    if (rec.count > limit) {
        const retryAfter = Math.ceil((rec.windowStart + windowMs - now) / 1000);
        return new NextResponse('Too Many Requests', {
            status: 429,
            headers: {
                'Retry-After': String(retryAfter),
                'X-RateLimit-Limit': String(limit),
                'X-RateLimit-Remaining': '0',
            },
        });
    }

    return null;
}
