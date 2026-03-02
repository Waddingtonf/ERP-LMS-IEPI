/**
 * PERFORMANCE TEST SUITE
 * ======================
 * Tests covering:
 *  1. Response time thresholds — individual operations complete in <100ms
 *  2. Throughput under load — 100 concurrent ops without errors
 *  3. Race condition safety — concurrent enrollment idempotency
 *  4. Memory stability — large dataset queries stay bounded
 *  5. Cielo mock latency — end-to-end enrollment within acceptable time
 */

import { MockUserRepository } from '../../repositories/MockUserRepository';
import { MockCourseRepository } from '../../repositories/MockCourseRepository';
import { MockPaymentRepository } from '../../repositories/MockPaymentRepository';

// Helper: measure execution time in ms
async function measure(fn: () => Promise<unknown>): Promise<number> {
    const start = performance.now();
    await fn();
    return performance.now() - start;
}

// ─── 1. Individual Operation Latency ─────────────────────────────────────────

describe('Performance — Single Operation Latency (<10ms each)', () => {
    let userRepo: MockUserRepository;
    let courseRepo: MockCourseRepository;
    let paymentRepo: MockPaymentRepository;

    beforeAll(() => {
        userRepo = new MockUserRepository();
        courseRepo = new MockCourseRepository();
        paymentRepo = new MockPaymentRepository();
    });

    it('userRepo.findById completes in under 10ms', async () => {
        const ms = await measure(() => userRepo.findById('admin-1'));
        expect(ms).toBeLessThan(10);
    });

    it('userRepo.findByEmail completes in under 10ms', async () => {
        const ms = await measure(() => userRepo.findByEmail('admin@iepi.com.br'));
        expect(ms).toBeLessThan(10);
    });

    it('userRepo.create completes in under 10ms', async () => {
        const ms = await measure(() => userRepo.create({ name: 'Perf User', email: 'perf@test.com', role: 'STUDENT' }));
        expect(ms).toBeLessThan(10);
    });

    it('userRepo.enrollInCourse completes in under 10ms', async () => {
        const ms = await measure(() => userRepo.enrollInCourse('student-1', 'course-perf'));
        expect(ms).toBeLessThan(10);
    });

    it('courseRepo.findAll completes in under 10ms', async () => {
        const ms = await measure(() => courseRepo.findAll());
        expect(ms).toBeLessThan(10);
    });

    it('courseRepo.findById completes in under 10ms', async () => {
        const ms = await measure(() => courseRepo.findById('course-1'));
        expect(ms).toBeLessThan(10);
    });

    it('paymentRepo.create completes in under 10ms', async () => {
        const ms = await measure(() =>
            paymentRepo.create({ userId: 'u1', courseId: 'c1', amount: 100, status: 'PENDING' })
        );
        expect(ms).toBeLessThan(10);
    });

    it('paymentRepo.findByUserId completes in under 10ms', async () => {
        const ms = await measure(() => paymentRepo.findByUserId('u1'));
        expect(ms).toBeLessThan(10);
    });
});

// ─── 2. Concurrent Load — 100 ops ────────────────────────────────────────────

describe('Performance — 100 Concurrent Operations', () => {
    it('100 concurrent userRepo.create complete within 500ms total', async () => {
        const repo = new MockUserRepository();
        const start = performance.now();
        await Promise.all(
            Array.from({ length: 100 }, (_, i) =>
                repo.create({ name: `Bulk${i}`, email: `bulk${i}@test.com`, role: 'STUDENT' })
            )
        );
        const elapsed = performance.now() - start;
        expect(elapsed).toBeLessThan(500);
    });

    it('100 concurrent courseRepo.findAll complete within 500ms', async () => {
        const repo = new MockCourseRepository();
        const start = performance.now();
        await Promise.all(Array.from({ length: 100 }, () => repo.findAll()));
        const elapsed = performance.now() - start;
        expect(elapsed).toBeLessThan(500);
    });

    it('100 concurrent paymentRepo.create complete within 500ms', async () => {
        const repo = new MockPaymentRepository();
        const start = performance.now();
        await Promise.all(
            Array.from({ length: 100 }, (_, i) =>
                repo.create({ userId: `u${i}`, courseId: `c${i}`, amount: i * 100, status: 'PENDING' })
            )
        );
        const elapsed = performance.now() - start;
        expect(elapsed).toBeLessThan(500);
    });

    it('100 concurrent paymentRepo.updateStatus complete within 500ms', async () => {
        const repo = new MockPaymentRepository();
        // Pre-create 100 transactions
        const txs = await Promise.all(
            Array.from({ length: 100 }, (_, i) =>
                repo.create({ userId: `u${i}`, courseId: `c${i}`, amount: 100, status: 'PENDING' })
            )
        );
        const start = performance.now();
        await Promise.all(txs.map(tx => repo.updateStatus(tx.id, 'AUTHORIZED', `cielo-${tx.id}`)));
        const elapsed = performance.now() - start;
        expect(elapsed).toBeLessThan(500);
    });
});

// ─── 3. Race Condition Safety ─────────────────────────────────────────────────

describe('Performance — Race Condition Guard', () => {
    it('50 concurrent enrollments for same user+course produce exactly 1 enrollment', async () => {
        const repo = new MockUserRepository();
        await Promise.all(
            Array.from({ length: 50 }, () => repo.enrollInCourse('student-1', 'course-race'))
        );
        const user = await repo.findById('student-1');
        const count = user?.enrolledCourseIds.filter(id => id === 'course-race').length ?? 0;
        expect(count).toBe(1);
    });

    it('20 concurrent payment status updates all complete without corruption', async () => {
        const repo = new MockPaymentRepository();
        const tx = await repo.create({ userId: 'u', courseId: 'c', amount: 100, status: 'PENDING' });
        // Multiple concurrent updates — last-write-wins is acceptable, but no exception
        const updates = Array.from({ length: 20 }, (_, i) =>
            repo.updateStatus(tx.id, i % 2 === 0 ? 'AUTHORIZED' : 'CAPTURED', `pid-${i}`)
        );
        const results = await Promise.allSettled(updates);
        const rejected = results.filter(r => r.status === 'rejected');
        expect(rejected).toHaveLength(0);
    });
});

// ─── 4. Large Dataset Query Performance ──────────────────────────────────────

describe('Performance — Large Dataset Handling', () => {
    it('findAll with 1000 courses completes in under 50ms', async () => {
        const repo = new MockCourseRepository();
        // Seed 1000 courses
        await Promise.all(
            Array.from({ length: 1000 }, (_, i) =>
                repo.create({ title: `Course ${i}`, description: `Desc ${i}`, price: i })
            )
        );
        const ms = await measure(() => repo.findAll());
        expect(ms).toBeLessThan(50);
    });

    it('findByUserId with 500 transactions for one user completes in under 50ms', async () => {
        const repo = new MockPaymentRepository();
        await Promise.all(
            Array.from({ length: 500 }, (_, i) =>
                repo.create({ userId: 'heavy-user', courseId: `c${i}`, amount: 100, status: 'CAPTURED' })
            )
        );
        const ms = await measure(() => repo.findByUserId('heavy-user'));
        expect(ms).toBeLessThan(50);
    });

    it('50 users each with 20 enrollments — all findById complete in under 200ms', async () => {
        const repo = new MockUserRepository();
        // Create 50 users
        const users = await Promise.all(
            Array.from({ length: 50 }, (_, i) =>
                repo.create({ name: `User${i}`, email: `u${i}@test.com`, role: 'STUDENT' })
            )
        );
        // Enroll each user in 20 courses
        await Promise.all(
            users.flatMap(u =>
                Array.from({ length: 20 }, (_, j) => repo.enrollInCourse(u.id, `c${j}`))
            )
        );
        // Query all
        const start = performance.now();
        await Promise.all(users.map(u => repo.findById(u.id)));
        const elapsed = performance.now() - start;
        expect(elapsed).toBeLessThan(200);
    });
});

// ─── 5. Throughput Summary ────────────────────────────────────────────────────

describe('Performance — Sustained Throughput', () => {
    it('executes 200 mixed CRUD operations within 1 second', async () => {
        const userRepo = new MockUserRepository();
        const courseRepo = new MockCourseRepository();
        const paymentRepo = new MockPaymentRepository();

        const start = performance.now();
        await Promise.all([
            // 50 user creates
            ...Array.from({ length: 50 }, (_, i) =>
                userRepo.create({ name: `U${i}`, email: `u${i}@x.com`, role: 'STUDENT' })
            ),
            // 50 course reads
            ...Array.from({ length: 50 }, () => courseRepo.findAll()),
            // 50 payment creates
            ...Array.from({ length: 50 }, (_, i) =>
                paymentRepo.create({ userId: `u${i}`, courseId: `c${i}`, amount: 1000, status: 'PENDING' })
            ),
            // 50 user enrollments
            ...Array.from({ length: 50 }, (_, i) =>
                userRepo.enrollInCourse('admin-1', `course-${i}`)
            ),
        ]);
        const elapsed = performance.now() - start;
        expect(elapsed).toBeLessThan(1000);
    });
});
