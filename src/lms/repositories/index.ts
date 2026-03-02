/**
 * Repository Factory
 *
 * Resolves the correct repository implementation based on the environment:
 * - Mock     → when NEXT_PUBLIC_SUPABASE_URL is absent or contains "dummy"
 * - Supabase → when a real Supabase URL is configured (implementation pending)
 */

import { IUserRepository } from './UserRepository';
import { ICourseRepository } from './CourseRepository';
import { IPaymentRepository } from './PaymentRepository';

import { MockUserRepository } from './MockUserRepository';
import { MockCourseRepository } from './MockCourseRepository';
import { MockPaymentRepository } from './MockPaymentRepository';

let _user:    IUserRepository    | null = null;
let _course:  ICourseRepository  | null = null;
let _payment: IPaymentRepository | null = null;

export function getUserRepository(): IUserRepository {
    return (_user ??= new MockUserRepository());
}

export function getCourseRepository(): ICourseRepository {
    return (_course ??= new MockCourseRepository());
}

export function getPaymentRepository(): IPaymentRepository {
    return (_payment ??= new MockPaymentRepository());
}

