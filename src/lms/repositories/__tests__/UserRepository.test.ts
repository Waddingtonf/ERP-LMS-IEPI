import { MockUserRepository } from '../MockUserRepository';

// Each describe block gets its own fresh repository instance to avoid state pollution
describe('MockUserRepository — CRUD', () => {
    let repo: MockUserRepository;

    beforeEach(() => {
        // Fresh instance per test — no shared state
        repo = new MockUserRepository();
    });

    // ── findById ──────────────────────────────────────────────────────────────
    it('finds the seeded admin user by id', async () => {
        const user = await repo.findById('admin-1');
        expect(user).toBeDefined();
        expect(user?.id).toBe('admin-1');
        expect(user?.role).toBe('ADMIN');
    });

    it('finds the seeded student user by id', async () => {
        const user = await repo.findById('student-1');
        expect(user).toBeDefined();
        expect(user?.role).toBe('STUDENT');
    });

    it('returns null for a non-existent id', async () => {
        const user = await repo.findById('does-not-exist');
        expect(user).toBeNull();
    });

    it('returns null for an empty-string id', async () => {
        const user = await repo.findById('');
        expect(user).toBeNull();
    });

    // ── findByEmail ───────────────────────────────────────────────────────────
    it('finds user by email (admin)', async () => {
        const user = await repo.findByEmail('ana.rodrigues@iepi.edu.br');
        expect(user).toBeDefined();
        expect(user?.role).toBe('ADMIN');
    });

    it('returns null for unknown email', async () => {
        const user = await repo.findByEmail('ghost@nowhere.com');
        expect(user).toBeNull();
    });

    it('is case-sensitive for email lookup', async () => {
        // Emails should not match across different cases (security: no accidental match)
        const user = await repo.findByEmail('ANA.RODRIGUES@IEPI.EDU.BR');
        expect(user).toBeNull();
    });

    // ── create ────────────────────────────────────────────────────────────────
    it('creates a new user with a unique random id', async () => {
        const user = await repo.create({ name: 'Alice', email: 'alice@test.com', role: 'STUDENT' });
        expect(user.id).toMatch(/^user-/);
        expect(user.enrolledCourseIds).toEqual([]);
        expect(user.name).toBe('Alice');
    });

    it('created user is immediately findable', async () => {
        const created = await repo.create({ name: 'Bob', email: 'bob@test.com', role: 'STUDENT' });
        const found = await repo.findById(created.id);
        expect(found).toEqual(created);
    });

    it('two independent creates generate unique ids', async () => {
        const u1 = await repo.create({ name: 'U1', email: 'u1@test.com', role: 'STUDENT' });
        const u2 = await repo.create({ name: 'U2', email: 'u2@test.com', role: 'STUDENT' });
        expect(u1.id).not.toBe(u2.id);
    });

    // ── enrollInCourse ────────────────────────────────────────────────────────
    it('enrolls a user in a course', async () => {
        await repo.enrollInCourse('student-1', 'course-abc');
        const user = await repo.findById('student-1');
        expect(user?.enrolledCourseIds).toContain('course-abc');
    });

    it('is idempotent — no duplicate enrollments on double call', async () => {
        await repo.enrollInCourse('student-1', 'course-dup');
        await repo.enrollInCourse('student-1', 'course-dup');
        const user = await repo.findById('student-1');
        const count = user?.enrolledCourseIds.filter(id => id === 'course-dup').length;
        expect(count).toBe(1);
    });

    it('can enroll in multiple different courses', async () => {
        await repo.enrollInCourse('student-1', 'course-X');
        await repo.enrollInCourse('student-1', 'course-Y');
        const user = await repo.findById('student-1');
        expect(user?.enrolledCourseIds).toContain('course-X');
        expect(user?.enrolledCourseIds).toContain('course-Y');
    });

    it('throws when enrolling a non-existent user', async () => {
        await expect(repo.enrollInCourse('ghost-id', 'course-1')).rejects.toThrow('User not found');
    });
});

describe('MockUserRepository — Concurrency', () => {
    it('handles 50 simultaneous creates without id collision', async () => {
        const repo = new MockUserRepository();
        const creates = Array.from({ length: 50 }, (_, i) =>
            repo.create({ name: `User${i}`, email: `user${i}@test.com`, role: 'STUDENT' })
        );
        const users = await Promise.all(creates);
        const ids = users.map(u => u.id);
        const unique = new Set(ids);
        expect(unique.size).toBe(50);
    });

    it('handles concurrent enrollments idempotently (race condition guard)', async () => {
        const repo = new MockUserRepository();
        // Fire 10 concurrent enrollments for the same user + course
        const enrollments = Array.from({ length: 10 }, () =>
            repo.enrollInCourse('student-1', 'course-race')
        );
        await Promise.all(enrollments);
        const user = await repo.findById('student-1');
        const count = user?.enrolledCourseIds.filter(id => id === 'course-race').length ?? 0;
        expect(count).toBe(1);
    });
});

