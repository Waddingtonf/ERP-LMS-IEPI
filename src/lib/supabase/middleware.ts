import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import {
    MOCK_ROLE_COOKIE,
    ROUTE_ROLES,
    ROLE_LOGIN_PAGE,
    type Role,
} from '@/lib/auth/roles'

/** Returns the first ROUTE_ROLES key whose prefix matches the request path, or null. */
function matchedRoute(pathname: string): string | null {
    return Object.keys(ROUTE_ROLES).find(prefix => pathname.startsWith(prefix)) ?? null;
}

/** Redirects to the correct login page for the given route, preserving the original URL as `next`. */
function redirectToLogin(request: NextRequest, route: string): NextResponse {
    const loginPath = ROLE_LOGIN_PAGE[route] ?? '/login';
    const url = request.nextUrl.clone();
    url.pathname = loginPath;
    url.searchParams.set('next', request.nextUrl.pathname);
    return NextResponse.redirect(url);
}

export async function updateSession(request: NextRequest): Promise<NextResponse> {
    const isMockMode =
        !process.env.NEXT_PUBLIC_SUPABASE_URL ||
        process.env.NEXT_PUBLIC_SUPABASE_URL.includes('dummy');

    const route = matchedRoute(request.nextUrl.pathname);

    // ── Mock / Sandbox mode ────────────────────────────────────────────────────
    if (isMockMode) {
        if (!route) return NextResponse.next({ request });

        const mockRole = request.cookies.get(MOCK_ROLE_COOKIE)?.value as Role | undefined;

        if (!mockRole) return redirectToLogin(request, route);

        const allowed = ROUTE_ROLES[route];
        if (!allowed.includes(mockRole)) {
            // Authenticated but wrong role → 403 page
            const url = request.nextUrl.clone();
            url.pathname = '/403';
            return NextResponse.redirect(url);
        }

        return NextResponse.next({ request });
    }

    // ── Production / Supabase mode ─────────────────────────────────────────────
    let supabaseResponse = NextResponse.next({ request });

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll();
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
                    supabaseResponse = NextResponse.next({ request });
                    cookiesToSet.forEach(({ name, value, options }) =>
                        supabaseResponse.cookies.set(name, value, options)
                    );
                },
            },
        }
    );

    const { data: { user } } = await supabase.auth.getUser();

    if (!route) return supabaseResponse;

    if (!user) return redirectToLogin(request, route);

    // Role claim comes from the user's JWT app_metadata.role (set via Supabase RLS policy)
    const userRole = (user.app_metadata?.role ?? user.user_metadata?.role) as Role | undefined;
    if (userRole) {
        const allowed = ROUTE_ROLES[route];
        if (!allowed.includes(userRole)) {
            const url = request.nextUrl.clone();
            url.pathname = '/403';
            return NextResponse.redirect(url);
        }
    }

    return supabaseResponse;
}
