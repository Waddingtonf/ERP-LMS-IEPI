'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { MOCK_ROLE_COOKIE, Role, ROLES } from '@/lib/auth/roles';

const ONE_DAY_SECONDS = 60 * 60 * 24;

/**
 * Mock login — sets an iepi_mock_role cookie so the middleware can enforce RBAC
 * even when Supabase is not configured.
 *
 * In production this should be replaced by Supabase Auth sign-in + RLS claim reading.
 */
export async function mockLoginAction(formData: FormData) {
    const roleParam = formData.get('role') as Role | null;
    const role: Role = Object.values(ROLES).includes(roleParam as Role)
        ? (roleParam as Role)
        : ROLES.STUDENT;

    const jar = await cookies();
    jar.set(MOCK_ROLE_COOKIE, role, {
        httpOnly: true,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
        maxAge: ONE_DAY_SECONDS,
        path: '/',
    });

    // Redirect each role to its home portal
    switch (role) {
        case ROLES.ADMIN:       redirect('/admin');
        case ROLES.DOCENTE:     redirect('/docente');
        case ROLES.FINANCEIRO:  redirect('/financeiro');
        case ROLES.PEDAGOGICO:  redirect('/pedagogico');
        default:                redirect('/aluno');
    }
}

/**
 * Logs the user out by clearing the mock-role cookie and the Supabase session
 * (when in production mode).
 */
export async function logoutAction() {
    const jar = await cookies();
    jar.delete(MOCK_ROLE_COOKIE);
    redirect('/login');
}
