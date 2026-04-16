/**
 * Centralised auth helper for Server Actions and Server Components.
 *
 * Usage:
 *   const userId = await requireAuth();           // any authenticated user
 *   const userId = await requireAuth('ADMIN');     // only ADMIN role
 */

'use server';

import { cookies } from 'next/headers';
import { MOCK_ROLE_COOKIE, ROLES, type Role } from '@/lib/auth/roles';
import { UnauthorizedError, ForbiddenError } from '@/lib/errors';

const isMockMode =
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    process.env.NEXT_PUBLIC_SUPABASE_URL.includes('dummy') ||
    process.env.NEXT_PUBLIC_SUPABASE_URL.includes('placeholder');

/**
 * Returns the authenticated user's ID (or mock role in sandbox mode).
 * Throws UnauthorizedError if unauthenticated.
 * Throws ForbiddenError if authenticated but wrong role.
 */
export async function requireAuth(requiredRole?: Role): Promise<string> {
    if (isMockMode) {
        const jar = await cookies();
        const role = (jar.get(MOCK_ROLE_COOKIE)?.value ?? ROLES.STUDENT) as Role;

        if (requiredRole && role !== requiredRole && role !== ROLES.ADMIN) {
            throw new ForbiddenError(
                `Esta ação requer o perfil ${requiredRole}. Perfil atual: ${role}.`
            );
        }

        // Return mock user IDs per role
        const mockIds: Record<string, string> = {
            [ROLES.ADMIN]: 'admin-1',
            [ROLES.STUDENT]: 'student-1',
            [ROLES.DOCENTE]: 'docente-1',
            [ROLES.FINANCEIRO]: 'financeiro-1',
            [ROLES.PEDAGOGICO]: 'pedagogico-1',
        };
        return mockIds[role] ?? 'student-1';
    }

    // Production Supabase mode
    const { createClient } = await import('@/lib/supabase/server');
    const supabase = await createClient();
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error || !user) {
        throw new UnauthorizedError('Sessão expirada. Faça login novamente.');
    }

    if (requiredRole) {
        const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', user.id)
            .single();

        const role = (profile?.role as string | undefined)?.toUpperCase() as Role | undefined;

        if (role !== requiredRole && role !== ROLES.ADMIN) {
            throw new ForbiddenError(
                `Esta ação requer o perfil ${requiredRole}.`
            );
        }
    }

    return user.id;
}

/**
 * Returns { userId, role } — useful when you need the role for conditional logic.
 */
export async function getAuthContext(): Promise<{ userId: string; role: Role }> {
    if (isMockMode) {
        const jar = await cookies();
        const role = (jar.get(MOCK_ROLE_COOKIE)?.value ?? ROLES.STUDENT) as Role;
        const mockIds: Record<string, string> = {
            [ROLES.ADMIN]: 'admin-1',
            [ROLES.STUDENT]: 'student-1',
            [ROLES.DOCENTE]: 'docente-1',
            [ROLES.FINANCEIRO]: 'financeiro-1',
            [ROLES.PEDAGOGICO]: 'pedagogico-1',
        };
        return { userId: mockIds[role] ?? 'student-1', role };
    }

    const { createClient } = await import('@/lib/supabase/server');
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) throw new UnauthorizedError();

    const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

    const role = ((profile?.role as string | undefined)?.toUpperCase() ?? ROLES.STUDENT) as Role;
    return { userId: user.id, role };
}
