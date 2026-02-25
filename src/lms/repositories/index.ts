/**
 * Repository Factory
 *
 * Seleciona automaticamente entre implementações Mock (desenvolvimento/sandbox)
 * e Supabase (produção) com base na variável de ambiente NEXT_PUBLIC_SUPABASE_URL.
 *
 * Para usar MockRepositories: defina NEXT_PUBLIC_SUPABASE_URL contendo "dummy"
 * Para usar SupabaseRepositories: configure a URL real do Supabase
 */

import { IUserRepository } from './UserRepository';
import { ICourseRepository } from './CourseRepository';
import { IPaymentRepository } from './PaymentRepository';

// Lazy imports para evitar carregar código desnecessário no bundle
function isMockMode(): boolean {
    return (
        !process.env.NEXT_PUBLIC_SUPABASE_URL ||
        process.env.NEXT_PUBLIC_SUPABASE_URL.includes('dummy')
    );
}

// ─── User Repository ──────────────────────────────────────────────────────────

let _userRepo: IUserRepository | null = null;

export function getUserRepository(): IUserRepository {
    if (_userRepo) return _userRepo;

    if (isMockMode()) {
        const { MockUserRepository } = require('./MockUserRepository');
        _userRepo = new MockUserRepository();
    } else {
        const { SupabaseUserRepository } = require('./SupabaseUserRepository');
        _userRepo = new SupabaseUserRepository();
    }

    return _userRepo!;
}

// ─── Course Repository ────────────────────────────────────────────────────────

let _courseRepo: ICourseRepository | null = null;

export function getCourseRepository(): ICourseRepository {
    if (_courseRepo) return _courseRepo;

    if (isMockMode()) {
        const { MockCourseRepository } = require('./MockCourseRepository');
        _courseRepo = new MockCourseRepository();
    } else {
        const { SupabaseCourseRepository } = require('./SupabaseCourseRepository');
        _courseRepo = new SupabaseCourseRepository();
    }

    return _courseRepo!;
}

// ─── Payment Repository ───────────────────────────────────────────────────────

let _paymentRepo: IPaymentRepository | null = null;

export function getPaymentRepository(): IPaymentRepository {
    if (_paymentRepo) return _paymentRepo;

    if (isMockMode()) {
        const { MockPaymentRepository } = require('./MockPaymentRepository');
        _paymentRepo = new MockPaymentRepository();
    } else {
        const { SupabasePaymentRepository } = require('./SupabasePaymentRepository');
        _paymentRepo = new SupabasePaymentRepository();
    }

    return _paymentRepo!;
}
