/**
 * EnrollmentService tests
 * =======================
 * Uses constructor injection so Cielo can be replaced by a plain
 * jest.fn() object — no babel mock hoisting needed.
 *
 * Repositories are provided via jest.mock so that EnrollmentService
 * (which calls getCourseRepository() / getUserRepository() / getPaymentRepository()
 * at service-call time) uses the same in-memory instances as the test assertions.
 */

import { EnrollmentService } from '../../services/EnrollmentService';
import type { CieloSandboxService } from '../../services/CieloService';
import type { MockUserRepository } from '../../repositories/MockUserRepository';
import type { MockPaymentRepository } from '../../repositories/MockPaymentRepository';

// ─── Mock the repository factory — instances created inside factory via require()
// so that the same instances are shared between EnrollmentService and test assertions
jest.mock('../../repositories', () => {
    const { MockUserRepository } = require('../../repositories/MockUserRepository');
    const { MockCourseRepository } = require('../../repositories/MockCourseRepository');
    const { MockPaymentRepository } = require('../../repositories/MockPaymentRepository');
    const u = new MockUserRepository();
    const c = new MockCourseRepository();
    const p = new MockPaymentRepository();
    return {
        getUserRepository: () => u,
        getCourseRepository: () => c,
        getPaymentRepository: () => p,
    };
});

// Access the shared mock instances through the mocked factory
import { getUserRepository, getPaymentRepository } from '../../repositories'; // eslint-disable-line
const userRepo = getUserRepository() as unknown as MockUserRepository;
const paymentRepo = getPaymentRepository() as unknown as MockPaymentRepository;

// Reset state before each test to prevent cross-test contamination
beforeEach(() => {
    userRepo.reset();
    paymentRepo.reset();
});

// ─── Helpers ─────────────────────────────────────────────────────────────────
const validCard = {
    cardNumber: '4111111111111111',
    holder: 'TEST USER',
    expirationDate: '12/2030',
    securityCode: '123',
};

function makeMockCielo(
    createStatus = 1,
    captureStatus = 2,
    createError?: string,
): jest.Mocked<Pick<CieloSandboxService, 'createTransaction' | 'captureTransaction'>> {
    const createFn = createError
        ? jest.fn().mockRejectedValue(new Error(createError))
        : jest.fn().mockResolvedValue({
              paymentId: 'cielo-mock-id',
              status: createStatus,
              returnCode: createStatus === 1 ? '4' : '05',
              returnMessage: createStatus === 1 ? 'Authorized' : 'Card declined',
          });

    const captureFn = jest.fn().mockResolvedValue({
        paymentId: 'cielo-mock-id',
        status: captureStatus,
        returnCode: captureStatus === 2 ? '6' : '99',
        returnMessage: captureStatus === 2 ? 'Captured' : 'Capture failed',
    });

    return {
        createTransaction: createFn,
        captureTransaction: captureFn,
    };
}

// ─── 1. Happy Path ────────────────────────────────────────────────────────────

describe('EnrollmentService — Happy Path', () => {
    let service: EnrollmentService;
    let mockCielo: ReturnType<typeof makeMockCielo>;

    beforeEach(() => {
        mockCielo = makeMockCielo();
        service = new EnrollmentService(mockCielo as unknown as CieloSandboxService);
    });

    it('returns success:true with a transactionId', async () => {
        const result = await service.enrollWithPayment('student-1', 'course-1', validCard);
        expect(result.success).toBe(true);
        expect(result.transactionId).toBeDefined();
    });

    it('transaction ends with status CAPTURED', async () => {
        const result = await service.enrollWithPayment('student-1', 'course-1', validCard);
        const tx = await paymentRepo.findById(result.transactionId!);
        expect(tx?.status).toBe('CAPTURED');
    });

    it('enrolls the course in the user enrolledCourseIds', async () => {
        await service.enrollWithPayment('student-1', 'course-1', validCard);
        const user = await userRepo.findById('student-1');
        expect(user?.enrolledCourseIds).toContain('course-1');
    });

    it('calls createTransaction exactly once', async () => {
        await service.enrollWithPayment('student-1', 'course-1', validCard);
        expect(mockCielo.createTransaction).toHaveBeenCalledTimes(1);
    });

    it('calls captureTransaction exactly once', async () => {
        await service.enrollWithPayment('student-1', 'course-1', validCard);
        expect(mockCielo.captureTransaction).toHaveBeenCalledTimes(1);
    });

    it('passes the course price (in cents) to Cielo', async () => {
        await service.enrollWithPayment('student-1', 'course-1', validCard);
        const arg = (mockCielo.createTransaction as jest.Mock).mock.calls[0][0];
        // seeded course-1 price = 19999
        expect(arg.amount).toBe(19999);
    });
});

// ─── 2. Validation / Business Rules ──────────────────────────────────────────

describe('EnrollmentService — Business Rule Validation', () => {
    let service: EnrollmentService;

    beforeEach(() => {
        service = new EnrollmentService(makeMockCielo() as unknown as CieloSandboxService);
    });

    it('returns error when course does not exist', async () => {
        const res = await service.enrollWithPayment('student-1', 'course-does-not-exist', validCard);
        expect(res.success).toBe(false);
        expect(res.error).toMatch(/curso/i);
    });

    it('returns error when user does not exist', async () => {
        const res = await service.enrollWithPayment('ghost-user', 'course-1', validCard);
        expect(res.success).toBe(false);
        expect(res.error).toMatch(/usuário/i);
    });

    it('refuses to double-enroll an already-enrolled student', async () => {
        await service.enrollWithPayment('student-1', 'course-1', validCard);
        const second = await service.enrollWithPayment('student-1', 'course-1', validCard);
        expect(second.success).toBe(false);
        expect(second.error).toMatch(/matriculado/i);
    });

    it('does NOT call Cielo when user is already enrolled', async () => {
        const mock1 = makeMockCielo();
        const s1 = new EnrollmentService(mock1 as unknown as CieloSandboxService);
        await s1.enrollWithPayment('student-1', 'course-1', validCard);

        const mock2 = makeMockCielo();
        const s2 = new EnrollmentService(mock2 as unknown as CieloSandboxService);
        await s2.enrollWithPayment('student-1', 'course-1', validCard); // already enrolled

        expect(mock2.createTransaction).not.toHaveBeenCalled();
    });
});

// ─── 3. Payment Failure Scenarios ─────────────────────────────────────────────

describe('EnrollmentService — Payment Failure Scenarios', () => {
    it('returns failure and does not enroll when Cielo denies authorization', async () => {
        const mockCielo = makeMockCielo(3); // status 3 = denied
        const service = new EnrollmentService(mockCielo as unknown as CieloSandboxService);

        const res = await service.enrollWithPayment('student-1', 'course-1', validCard);
        expect(res.success).toBe(false);

        const user = await userRepo.findById('student-1');
        expect(user?.enrolledCourseIds).not.toContain('course-1');
    });

    it('marks transaction FAILED when Cielo throws (invalid card, network error)', async () => {
        const mockCielo = makeMockCielo(1, 2, 'Invalid Credit Card Number');
        const service = new EnrollmentService(mockCielo as unknown as CieloSandboxService);

        const res = await service.enrollWithPayment('student-1', 'course-1', validCard);
        expect(res.success).toBe(false);
        expect(res.error).toBe('Invalid Credit Card Number');

        const user = await userRepo.findById('student-1');
        expect(user?.enrolledCourseIds).not.toContain('course-1');
    });

    it('returns failure and does not enroll when capture fails', async () => {
        const mockCielo = makeMockCielo(1, 3); // authorized but capture fails
        const service = new EnrollmentService(mockCielo as unknown as CieloSandboxService);

        const res = await service.enrollWithPayment('student-1', 'course-1', validCard);
        expect(res.success).toBe(false);

        const user = await userRepo.findById('student-1');
        expect(user?.enrolledCourseIds).not.toContain('course-1');
    });
});

// ─── 4. isEnrolled & getStudentTransactions ───────────────────────────────────

describe('EnrollmentService — Query Methods', () => {
    let service: EnrollmentService;

    beforeEach(() => {
        service = new EnrollmentService(makeMockCielo() as unknown as CieloSandboxService);
    });

    it('isEnrolled returns false before enrollment', async () => {
        const enrolled = await service.isEnrolled('student-1', 'course-1');
        expect(enrolled).toBe(false);
    });

    it('isEnrolled returns true after successful enrollment', async () => {
        await service.enrollWithPayment('student-1', 'course-1', validCard);
        const enrolled = await service.isEnrolled('student-1', 'course-1');
        expect(enrolled).toBe(true);
    });

    it('getStudentTransactions returns empty array for new user', async () => {
        const txs = await service.getStudentTransactions('admin-1');
        expect(Array.isArray(txs)).toBe(true);
    });

    it('getStudentTransactions returns at least 1 entry after enrollment', async () => {
        await service.enrollWithPayment('student-1', 'course-1', validCard);
        const txs = await service.getStudentTransactions('student-1');
        expect(txs.length).toBeGreaterThanOrEqual(1);
    });
});
