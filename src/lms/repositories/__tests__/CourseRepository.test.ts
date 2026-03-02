import { MockCourseRepository } from '../MockCourseRepository';

describe('MockCourseRepository — CRUD', () => {
    let repo: MockCourseRepository;

    beforeEach(() => {
        repo = new MockCourseRepository();
    });

    // ── findAll ──────────────────────────────────────────────────────────────
    it('returns the seeded courses', async () => {
        const courses = await repo.findAll();
        expect(courses.length).toBeGreaterThanOrEqual(1);
    });

    it('seeded course-1 has the expected price in cents', async () => {
        const courses = await repo.findAll();
        const course = courses.find(c => c.id === 'course-1');
        expect(course?.price).toBe(19999); // R$ 199,99
    });

    // ── findById ─────────────────────────────────────────────────────────────
    it('finds seeded course-1 by id', async () => {
        const course = await repo.findById('course-1');
        expect(course).toBeDefined();
        expect(course?.id).toBe('course-1');
    });

    it('returns null for unknown course id', async () => {
        const course = await repo.findById('no-such-course');
        expect(course).toBeNull();
    });

    it('returns null for empty string id', async () => {
        const course = await repo.findById('');
        expect(course).toBeNull();
    });

    // ── create ───────────────────────────────────────────────────────────────
    it('creates a new course and persists it', async () => {
        const created = await repo.create({
            title: 'Gestão de TI',
            description: 'Curso de gestão de tecnologia',
            price: 49900,
        });

        expect(created.id).toMatch(/^course-/);
        expect(created.modules).toEqual([]);
        expect(created.price).toBe(49900);

        const found = await repo.findById(created.id);
        expect(found).toEqual(created);
    });

    it('increments findAll count after create', async () => {
        const before = (await repo.findAll()).length;
        await repo.create({ title: 'X', description: 'Y', price: 100 });
        const after = (await repo.findAll()).length;
        expect(after).toBe(before + 1);
    });

    it('two creates produce different ids', async () => {
        const c1 = await repo.create({ title: 'A', description: '', price: 0 });
        const c2 = await repo.create({ title: 'B', description: '', price: 0 });
        expect(c1.id).not.toBe(c2.id);
    });

    // ── addModule ─────────────────────────────────────────────────────────────
    it('adds a module to an existing course', async () => {
        const module = await repo.addModule('course-1', { title: 'Módulo Extra' });
        expect(module.id).toMatch(/^module-/);
        expect(module.materials).toEqual([]);

        const course = await repo.findById('course-1');
        const found = course?.modules.find(m => m.id === module.id);
        expect(found).toBeDefined();
    });

    it('throws when adding a module to nonexistent course', async () => {
        await expect(repo.addModule('ghost', { title: 'X' })).rejects.toThrow('Course not found');
    });

    // ── addMaterial ───────────────────────────────────────────────────────────
    it('adds a PDF material to a module', async () => {
        const course = await repo.findById('course-1');
        const moduleId = course!.modules[0].id;

        const material = await repo.addMaterial('course-1', moduleId, {
            title: 'Apostila Avançada',
            type: 'PDF',
            url: 'https://example.com/apostila.pdf',
        });

        expect(material.id).toMatch(/^mat-/);
        expect(material.type).toBe('PDF');

        const updated = await repo.findById('course-1');
        const mod = updated?.modules.find(m => m.id === moduleId);
        expect(mod?.materials.some(m => m.id === material.id)).toBe(true);
    });

    it('adds a VIDEO material', async () => {
        const module = await repo.addModule('course-1', { title: 'Vídeo Module' });
        const mat = await repo.addMaterial('course-1', module.id, {
            title: 'Intro Vídeo',
            type: 'VIDEO',
            url: 'https://vimeo.com/test',
        });
        expect(mat.type).toBe('VIDEO');
    });

    it('throws when adding material to nonexistent course', async () => {
        await expect(
            repo.addMaterial('ghost-course', 'module-1', { title: 'X', type: 'LINK', url: '#' })
        ).rejects.toThrow('Course not found');
    });

    it('throws when adding material to nonexistent module', async () => {
        await expect(
            repo.addMaterial('course-1', 'ghost-module', { title: 'X', type: 'LINK', url: '#' })
        ).rejects.toThrow('Module not found');
    });
});

describe('MockCourseRepository — Scale', () => {
    it('handles creating 100 courses without error', async () => {
        const repo = new MockCourseRepository();
        const tasks = Array.from({ length: 100 }, (_, i) =>
            repo.create({ title: `Curso ${i}`, description: `Desc ${i}`, price: i * 1000 })
        );
        const courses = await Promise.all(tasks);
        expect(courses).toHaveLength(100);
        const ids = new Set(courses.map(c => c.id));
        expect(ids.size).toBe(100);
    });
});
