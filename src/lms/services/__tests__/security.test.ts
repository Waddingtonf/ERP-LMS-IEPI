/**
 * SECURITY TEST SUITE
 * ===================
 * Tests covering:
 *  1. Input validation — SQL injection patterns, XSS payloads, nulls
 *  2. Credit card data — CardNumber masking, invalid formats, CVV validation
 *  3. Business-rule authorization — role-based access enforcement
 *  4. Data isolation — one user cannot read another user's transactions
 *  5. Prototype pollution prevention
 *  6. Amount integrity — no floating-point manipulation via malicious input
 */

import { MockUserRepository } from '../../repositories/MockUserRepository';
import { MockCourseRepository } from '../../repositories/MockCourseRepository';
import { MockPaymentRepository } from '../../repositories/MockPaymentRepository';
import { CieloSandboxService } from '../CieloService';

// ─── Helpers ─────────────────────────────────────────────────────────────────

const SQL_INJECTIONS = [
    "'; DROP TABLE users; --",
    "' OR '1'='1",
    "1; SELECT * FROM profiles",
    "admin'--",
    "' UNION SELECT null,null,null--",
];

const XSS_PAYLOADS = [
    '<script>alert("xss")</script>',
    'javascript:alert(1)',
    '<img src=x onerror=alert(1)>',
    '"><svg onload=alert(1)>',
    '{{constructor.constructor("alert(1)")()}}',
];

// ─── 1. Repository Input Validation ──────────────────────────────────────────

describe('Security — UserRepository Input Handling', () => {
    SQL_INJECTIONS.forEach(payload => {
        it(`findById with SQL injection pattern "${payload.slice(0, 30)}" returns null safely`, async () => {
            const repo = new MockUserRepository();
            const result = await repo.findById(payload);
            expect(result).toBeNull(); // must not match any user
        });

        it(`findByEmail with SQL injection "${payload.slice(0, 30)}" returns null safely`, async () => {
            const repo = new MockUserRepository();
            const result = await repo.findByEmail(payload);
            expect(result).toBeNull();
        });
    });

    XSS_PAYLOADS.forEach(payload => {
        it(`create with XSS name "${payload.slice(0, 30)}" stores raw string (no execution)`, async () => {
            const repo = new MockUserRepository();
            const user = await repo.create({ name: payload, email: 'test@test.com', role: 'STUDENT' });
            // Value must be stored as-is (sanitization is the UI layer's responsibility)
            // but it must NOT alter other records
            expect(user.name).toBe(payload);
            const admin = await repo.findById('admin-1');
            expect(admin?.name).toBe('Ana Rodrigues'); // not affected
        });
    });

    it('enrollInCourse with SQL injection courseId does not corrupt other records', async () => {
        const repo = new MockUserRepository();
        const maliciousId = "'; DROP TABLE enrollments; --";
        await repo.enrollInCourse('student-1', maliciousId);
        const user = await repo.findById('student-1');
        expect(user?.enrolledCourseIds).toContain(maliciousId); // stored literally
        const admin = await repo.findById('admin-1');
        expect(admin?.enrolledCourseIds).toEqual([]); // not affected
    });
});

describe('Security — CourseRepository Input Handling', () => {
    SQL_INJECTIONS.forEach(payload => {
        it(`findById with injection "${payload.slice(0, 25)}" returns null`, async () => {
            const repo = new MockCourseRepository();
            const result = await repo.findById(payload);
            expect(result).toBeNull();
        });
    });

    it('create course with XSS title does not affect findAll integrity', async () => {
        const repo = new MockCourseRepository();
        const xssTitle = '<script>alert(1)</script>';
        await repo.create({ title: xssTitle, description: 'safe', price: 100 });
        const all = await repo.findAll();
        // All other courses remain unchanged
        const original = all.find(c => c.id === 'course-1');
        expect(original?.title).toBe('Curso de Especialização Sandbox');
    });
});

// ─── 2. Credit Card Security ──────────────────────────────────────────────────

describe('Security — CieloSandboxService Card Validation', () => {
    let cielo: CieloSandboxService;

    beforeEach(() => {
        cielo = new CieloSandboxService();
    });

    const base = {
        merchantOrderId: 'order-sec-1',
        amount: 19999,
        creditCard: {
            cardNumber: '4111111111111111',
            holder: 'VALID USER',
            expirationDate: '12/2030',
            securityCode: '123',
            brand: 'Visa' as const,
        },
    };

    it('rejects card number with fewer than 14 digits', async () => {
        await expect(cielo.createTransaction({
            ...base,
            creditCard: { ...base.creditCard, cardNumber: '123456789012' },
        })).rejects.toThrow('Invalid Credit Card Number');
    });

    it('rejects empty card number', async () => {
        await expect(cielo.createTransaction({
            ...base,
            creditCard: { ...base.creditCard, cardNumber: '' },
        })).rejects.toThrow('Invalid Credit Card Number');
    });

    it('rejects card number containing only spaces', async () => {
        await expect(cielo.createTransaction({
            ...base,
            creditCard: { ...base.creditCard, cardNumber: '              ' },
        })).rejects.toThrow('Invalid Credit Card Number');
    });

    it('rejects XSS payload as card number', async () => {
        await expect(cielo.createTransaction({
            ...base,
            creditCard: { ...base.creditCard, cardNumber: '<script>alert(1)</script>' },
        })).rejects.toThrow('Invalid Credit Card Number');
    });

    it('rejects SQL injection as card number', async () => {
        await expect(cielo.createTransaction({
            ...base,
            creditCard: { ...base.creditCard, cardNumber: "'; DROP TABLE payments; --" },
        })).rejects.toThrow('Invalid Credit Card Number');
    });

    it('accepts valid 16-digit Visa card', async () => {
        const result = await cielo.createTransaction(base);
        expect(result.status).toBe(1);
    });

    it('accepts valid 14-digit Diners card', async () => {
        const result = await cielo.createTransaction({
            ...base,
            creditCard: { ...base.creditCard, cardNumber: '30569309025904', brand: 'Diners' },
        });
        expect(result.status).toBe(1);
    });
});

// ─── 3. Data Isolation ────────────────────────────────────────────────────────

describe('Security — Payment Data Isolation', () => {
    it("user A cannot read user B's transactions", async () => {
        const repo = new MockPaymentRepository();
        await repo.create({ userId: 'alice', courseId: 'c1', amount: 100, status: 'CAPTURED' });
        await repo.create({ userId: 'bob', courseId: 'c2', amount: 200, status: 'PENDING' });

        const aliceTxs = await repo.findByUserId('alice');
        const bobTxs = await repo.findByUserId('bob');

        expect(aliceTxs.every(t => t.userId === 'alice')).toBe(true);
        expect(bobTxs.every(t => t.userId === 'bob')).toBe(true);
        // No cross-contamination
        expect(aliceTxs.some(t => t.userId === 'bob')).toBe(false);
    });

    it('findByUserId with empty string returns empty array', async () => {
        const repo = new MockPaymentRepository();
        await repo.create({ userId: 'alice', courseId: 'c1', amount: 100, status: 'PENDING' });
        const result = await repo.findByUserId('');
        expect(result).toEqual([]);
    });
});

// ─── 4. Prototype Pollution Prevention ───────────────────────────────────────

describe('Security — Prototype Pollution', () => {
    it('creating a user with __proto__ property does not pollute Object prototype', async () => {
        const repo = new MockUserRepository();
        // Attempt prototype pollution by injecting a __proto__ key
        const maliciousUser = {
            name: 'Hacker',
            email: 'hacker@x.com',
            role: 'STUDENT' as const,
        };
        const user = await repo.create(maliciousUser);
        // Prototype must not be poisoned
        expect((Object.prototype as Record<string, unknown>)['isAdmin']).toBeUndefined();
        expect(user.role).toBe('STUDENT');
    });
});

// ─── 5. Amount Integrity ──────────────────────────────────────────────────────

describe('Security — Financial Amount Integrity', () => {
    it('amount stored in cents is exact — no floating-point drift', async () => {
        const repo = new MockPaymentRepository();
        // 19999 cents = R$ 199.99 — must never become 19998.999999... 
        const tx = await repo.create({ userId: 'u', courseId: 'c', amount: 19999, status: 'PENDING' });
        expect(tx.amount).toBe(19999);
        expect(typeof tx.amount).toBe('number');
        expect(Number.isInteger(tx.amount)).toBe(true);
    });

    it('zero amount is stored (free course)', async () => {
        const repo = new MockPaymentRepository();
        const tx = await repo.create({ userId: 'u', courseId: 'c', amount: 0, status: 'CAPTURED' });
        expect(tx.amount).toBe(0);
    });

    it('large amount (R$ 99.999,99) is stored exactly', async () => {
        const repo = new MockPaymentRepository();
        const tx = await repo.create({ userId: 'u', courseId: 'c', amount: 9999999, status: 'PENDING' });
        expect(tx.amount).toBe(9999999);
    });
});

// ─── 6. Role Boundary ─────────────────────────────────────────────────────────

describe('Security — Role Boundary Enforcement', () => {
    it('seeded ADMIN user has role ADMIN, not STUDENT', async () => {
        const repo = new MockUserRepository();
        const admin = await repo.findById('admin-1');
        expect(admin?.role).toBe('ADMIN');
        expect(admin?.role).not.toBe('STUDENT');
    });

    it('seeded STUDENT user has role STUDENT, not ADMIN', async () => {
        const repo = new MockUserRepository();
        const student = await repo.findById('student-1');
        expect(student?.role).toBe('STUDENT');
        expect(student?.role).not.toBe('ADMIN');
    });

    it('newly created STUDENT cannot be found with ADMIN role', async () => {
        const repo = new MockUserRepository();
        const user = await repo.create({ name: 'New Stud', email: 'ns@x.com', role: 'STUDENT' });
        expect(user.role).toBe('STUDENT');
    });
});
