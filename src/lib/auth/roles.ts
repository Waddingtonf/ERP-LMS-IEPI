/**
 * Role constants and route-protection map.
 * Single source of truth for RBAC across middleware, layouts, and actions.
 */

export const ROLES = {
    ADMIN:       'ADMIN',
    STUDENT:     'STUDENT',
    DOCENTE:     'DOCENTE',
    FINANCEIRO:  'FINANCEIRO',
    PEDAGOGICO:  'PEDAGOGICO',
} as const;

export type Role = typeof ROLES[keyof typeof ROLES];

/** Cookie name used in mock/sandbox mode to carry the active role */
export const MOCK_ROLE_COOKIE = 'iepi_mock_role';

/**
 * Maps route prefixes to the roles that are authorised to access them.
 * Order matters — more specific prefixes should come first if needed.
 */
export const ROUTE_ROLES: Record<string, Role[]> = {
    '/admin':       [ROLES.ADMIN],
    '/docente':     [ROLES.DOCENTE, ROLES.ADMIN],
    '/financeiro':  [ROLES.FINANCEIRO, ROLES.ADMIN],
    '/pedagogico':  [ROLES.PEDAGOGICO, ROLES.ADMIN],
    '/aluno':       [ROLES.STUDENT, ROLES.ADMIN],
};

/** Login page each portal redirects to when unauthenticated */
export const ROLE_LOGIN_PAGE: Record<string, string> = {
    '/admin':      '/admin/login',
    '/docente':    '/login',
    '/financeiro': '/login',
    '/pedagogico': '/login',
    '/aluno':      '/login',
};
