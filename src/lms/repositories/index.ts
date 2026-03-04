/**
 * Repository Factory
 *
 * - Mock mode:     when NEXT_PUBLIC_SUPABASE_URL is absent or contains "dummy"
 * - Supabase mode: when a real Supabase URL is configured
 */

import { IUserRepository }        from './UserRepository';
import { ICourseRepository }      from './CourseRepository';
import { IPaymentRepository }     from './PaymentRepository';
import { ITurmaRepository }       from './TurmaRepository';
import { IFrequenciaRepository }  from './FrequenciaRepository';
import { IEnrollmentRepository }  from './EnrollmentRepository';

import { MockUserRepository }       from './MockUserRepository';
import { MockCourseRepository }     from './MockCourseRepository';
import { MockPaymentRepository }    from './MockPaymentRepository';
import { MockTurmaRepository }      from './MockTurmaRepository';
import { MockFrequenciaRepository } from './MockFrequenciaRepository';
import { MockEnrollmentRepository } from './MockEnrollmentRepository';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
export const isMockMode = !supabaseUrl || supabaseUrl.includes('dummy') || supabaseUrl.includes('placeholder');

let _user:       IUserRepository       | null = null;
let _course:     ICourseRepository     | null = null;
let _payment:    IPaymentRepository    | null = null;
let _turma:      ITurmaRepository      | null = null;
let _frequencia: IFrequenciaRepository | null = null;
let _enrollment: IEnrollmentRepository | null = null;

// Async factories (Supabase-capable)
export async function getUserRepository(): Promise<IUserRepository> {
    if (_user) return _user;
    if (isMockMode) { return (_user = new MockUserRepository()); }
    const { SupabaseUserRepository } = await import('./SupabaseUserRepository');
    return (_user = new SupabaseUserRepository());
}

export async function getCourseRepository(): Promise<ICourseRepository> {
    if (_course) return _course;
    if (isMockMode) { return (_course = new MockCourseRepository()); }
    const { SupabaseCourseRepository } = await import('./SupabaseCourseRepository');
    return (_course = new SupabaseCourseRepository());
}

export async function getPaymentRepository(): Promise<IPaymentRepository> {
    if (_payment) return _payment;
    if (isMockMode) { return (_payment = new MockPaymentRepository()); }
    const { SupabasePaymentRepository } = await import('./SupabasePaymentRepository');
    return (_payment = new SupabasePaymentRepository());
}

// Sync factories (mock-only, used in server components)
export function getTurmaRepository():      ITurmaRepository      { return (_turma      ??= new MockTurmaRepository()); }
export function getFrequenciaRepository(): IFrequenciaRepository { return (_frequencia ??= new MockFrequenciaRepository()); }
export function getEnrollmentRepository(): IEnrollmentRepository { return (_enrollment ??= new MockEnrollmentRepository()); }

// Sync convenience aliases for server components (always mock in dev)
export function getUserRepositorySync():    IUserRepository    { return (_user    ??= new MockUserRepository()); }
export function getCourseRepositorySync():  ICourseRepository  { return (_course  ??= new MockCourseRepository()); }
export function getPaymentRepositorySync(): IPaymentRepository { return (_payment ??= new MockPaymentRepository()); }

