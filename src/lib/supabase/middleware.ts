import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
    let supabaseResponse = NextResponse.next({
        request,
    })

    // MOCK MODE: Bypass auth for visual presentation without a real Supabase DB
    const isMockMode = process.env.NEXT_PUBLIC_SUPABASE_URL?.includes('dummy')

    if (isMockMode) {
        // Just redirect to login if no auth is present (mocking the behavior)
        // But since we want to allow viewing the dashboards, we will let them pass
        // if they are coming FROM the login page, or we just allow everything in Mock mode.
        return supabaseResponse
    }

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll()
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
                    supabaseResponse = NextResponse.next({
                        request,
                    })
                    cookiesToSet.forEach(({ name, value, options }) =>
                        supabaseResponse.cookies.set(name, value, options)
                    )
                },
            },
        }
    )

    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (
        !user &&
        (request.nextUrl.pathname.startsWith('/aluno') ||
            request.nextUrl.pathname.startsWith('/admin') ||
            request.nextUrl.pathname.startsWith('/docente') ||
            request.nextUrl.pathname.startsWith('/financeiro') ||
            request.nextUrl.pathname.startsWith('/pedagogico'))
    ) {
        const url = request.nextUrl.clone()
        if (request.nextUrl.pathname.startsWith('/admin')) {
            url.pathname = '/admin/login'
        } else {
            url.pathname = '/login'
        }
        return NextResponse.redirect(url)
    }

    return supabaseResponse
}

