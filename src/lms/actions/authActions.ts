'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { MOCK_ROLE_COOKIE, Role, ROLES } from '@/lib/auth/roles';
import { createServerClient } from '@supabase/ssr';

const ONE_DAY_SECONDS = 60 * 60 * 24;

const isMockMode =
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    process.env.NEXT_PUBLIC_SUPABASE_URL.includes('dummy');

function roleToPath(role: Role): string {
    switch (role) {
        case ROLES.ADMIN:       return '/admin';
        case ROLES.DOCENTE:     return '/docente';
        case ROLES.FINANCEIRO:  return '/financeiro';
        case ROLES.PEDAGOGICO:  return '/pedagogico';
        default:                return '/aluno';
    }
}

/** Shared result type returned to the client when there is an error */
export type LoginResult = { error: string } | undefined;

/**
 * Unified login action — works in both sandbox and production Supabase modes.
 *
 * In MOCK mode  → sets iepi_mock_role cookie and redirects by role.
 * In PROD mode  → calls supabase.auth.signInWithPassword, reads the user's
 *                  profile.role, then redirects to the correct portal.
 *
 * @param requireRole  Optional role to enforce (e.g. 'ADMIN' on the backoffice login).
 */
export async function loginAction(
    _prev: LoginResult,
    formData: FormData,
    requireRole?: Role
): Promise<LoginResult> {
    const email    = (formData.get('email') as string | null) ?? '';
    const password = (formData.get('password') as string | null) ?? '';

    // ── Mock / Sandbox mode ────────────────────────────────────────────────────
    if (isMockMode) {
        const roleParam = formData.get('role') as Role | null;
        const role: Role = roleParam && Object.values(ROLES).includes(roleParam)
            ? roleParam
            : ROLES.STUDENT;

        if (requireRole && role !== requireRole) {
            return { error: 'Acesso não autorizado para este portal.' };
        }

        const jar = await cookies();
        jar.set(MOCK_ROLE_COOKIE, role, {
            httpOnly: true,
            sameSite: 'lax',
            secure: process.env.NODE_ENV === 'production',
            maxAge: ONE_DAY_SECONDS,
            path: '/',
        });

        redirect(roleToPath(role));
    }

    // ── Production / Supabase mode ─────────────────────────────────────────────
    if (!email || !password) {
        return { error: 'E-mail e senha são obrigatórios.' };
    }

    const jar = await cookies();
    const cookieStore = jar;

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll: () => cookieStore.getAll(),
                setAll: (toSet) =>
                    toSet.forEach(({ name, value, options }) =>
                        cookieStore.set(name, value, options)
                    ),
            },
        }
    );

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error || !data.user) {
        return { error: error?.message ?? 'Credenciais inválidas.' };
    }

    // Read role from profiles table (set on user creation via trigger)
    const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', data.user.id)
        .single();

    const role = (
        (profile?.role as string | undefined)?.toUpperCase() ??
        (data.user.app_metadata?.role as string | undefined)?.toUpperCase() ??
        'STUDENT'
    ) as Role;

    if (requireRole && role !== requireRole) {
        // Sign them out — wrong portal
        await supabase.auth.signOut();
        return { error: 'Acesso não autorizado para este portal.' };
    }

    redirect(roleToPath(role));
}

/**
 * Convenience wrapper bound to the ADMIN portal.
 * Ensures only users with role=ADMIN can proceed.
 */
export async function adminLoginAction(
    prev: LoginResult,
    formData: FormData
): Promise<LoginResult> {
    return loginAction(prev, formData, ROLES.ADMIN);
}

/**
 * Mock login kept for direct form usage (sandbox quick-select buttons).
 * @deprecated Use loginAction instead.
 */
export async function mockLoginAction(formData: FormData) {
    const roleParam = formData.get('role') as Role | null;
    const role: Role = roleParam && Object.values(ROLES).includes(roleParam)
        ? roleParam
        : ROLES.STUDENT;

    const jar = await cookies();
    jar.set(MOCK_ROLE_COOKIE, role, {
        httpOnly: true,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
        maxAge: ONE_DAY_SECONDS,
        path: '/',
    });

    redirect(roleToPath(role));
}

/**
 * Logs the user out — clears mock cookie and Supabase session.
 */
export async function logoutAction() {
    const jar = await cookies();
    jar.delete(MOCK_ROLE_COOKIE);

    if (!isMockMode) {
        const supabase = createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            {
                cookies: {
                    getAll: () => jar.getAll(),
                    setAll: (toSet) =>
                        toSet.forEach(({ name, value, options }) =>
                            jar.set(name, value, options)
                        ),
                },
            }
        );
        await supabase.auth.signOut();
    }

    redirect('/login');
}
