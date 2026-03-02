/**
 * Repository Factory
 *
 * Resolves the correct repository implementation based on the environment:
 * - Mock     → when NEXT_PUBLIC_SUPABASE_URL is absent or contains "dummy"
 * - Supabase → when a real Supabase URL is configured
 */

import { IUserRepository } from './UserRepository';
import { ICourseRepository } from './CourseRepository';
import { IPaymentRepository } from './PaymentRepository';

function isMockMode(): boolean {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    return !url || url.includes('dummy');
}

function loadRepository<T>(
    mockModule: string,    mockClass: string,
    supabaseModule: string, supabaseClass: string,
): T {
    const [modulePath, className] = isMockMode()
        ? [mockModule, mockClass]
        : [supabaseModule, supabaseClass];

    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const mod = require(modulePath);
    return new mod[className]() as T;
}

let _user:    IUserRepository    | null = null;
let _course:  ICourseRepository  | null = null;
let _payment: IPaymentRepository | null = null;

export function getUserRepository(): IUserRepository {
    return (_user ??= loadRepository<IUserRepository>(
        './MockUserRepository',     'MockUserRepository',
        './SupabaseUserRepository', 'SupabaseUserRepository',
    ));
}

export function getCourseRepository(): ICourseRepository {
    return (_course ??= loadRepository<ICourseRepository>(
        './MockCourseRepository',     'MockCourseRepository',
        './SupabaseCourseRepository', 'SupabaseCourseRepository',
    ));
}

export function getPaymentRepository(): IPaymentRepository {
    return (_payment ??= loadRepository<IPaymentRepository>(
        './MockPaymentRepository',     'MockPaymentRepository',
        './SupabasePaymentRepository', 'SupabasePaymentRepository',
    ));
}
