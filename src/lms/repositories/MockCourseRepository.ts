import { ICourseRepository, Course, CourseInput, CourseUpdateInput, Module, Material } from './CourseRepository';
import { CATALOG } from '../data/catalog';

function buildModules(courseId: string, count: number, price: number, sellable: boolean): Module[] {
    return Array.from({ length: count }, (_, i) => ({
        id: `${courseId}-mod-${i + 1}`,
        title: i === 0 ? 'Modulo 1 \u2014 Introducao e Fundamentos' : `Modulo ${i + 1} \u2014 Topico ${i + 1}`,
        price: sellable ? Math.round(price / count) : 0,
        isSellableStandalone: sellable,
        sortOrder: i,
        materials: [
            { id: `${courseId}-m${i + 1}-mat-1`, title: 'Apoio ao Aluno', type: 'VIDEO' as const, url: 'https://vimeo.com/123456', sortOrder: 0 },
            { id: `${courseId}-m${i + 1}-mat-2`, title: 'Apostila Completa', type: 'PDF' as const, url: 'https://example.com/apostila.pdf', sortOrder: 1 },
        ],
    }));
}

export class MockCourseRepository implements ICourseRepository {
    private courses: Course[] = CATALOG.map(c => {
        const isModular = c.type === 'Pós-Graduação' || c.type === 'Especialização' || c.type === 'Graduação';
        const numModules = isModular ? 4 : 2;
        return {
            ...c,
            courseMode: (isModular ? 'PosGraduacao' : 'CursoLivre') as Course['courseMode'],
            bundlePrice: isModular ? Math.round(c.price * 0.85) : undefined,
            isPublished: true,
            modules: buildModules(c.id, numModules, c.price, isModular),
        };
    });

    async findAll(): Promise<Course[]> { return this.courses; }

    async findById(id: string): Promise<Course | null> {
        return this.courses.find(c => c.id === id) ?? null;
    }

    async create(course: CourseInput): Promise<Course> {
        const newCourse: Course = {
            courseMode:      'CursoLivre',
            type:            '',
            instructor:      '',
            hours:           '',
            startDate:       '',
            endDate:         '',
            schedule:        '',
            corenRequired:   false,
            maxInstallments: 1,
            isPublished:     false,
            ...course,
            id:      `course-${Math.random().toString(36).substring(7)}`,
            modules: [],
        };
        this.courses.push(newCourse);
        return newCourse;
    }

    async update(id: string, data: CourseUpdateInput): Promise<Course> {
        const idx = this.courses.findIndex(c => c.id === id);
        if (idx === -1) throw new Error('Course not found');
        this.courses[idx] = { ...this.courses[idx], ...data };
        return this.courses[idx];
    }

    async addModule(courseId: string, module: Omit<Module, 'id' | 'materials'>): Promise<Module> {
        const course = await this.findById(courseId);
        if (!course) throw new Error('Course not found');
        const newModule: Module = { ...module, id: `module-${Math.random().toString(36).substring(7)}`, materials: [] };
        course.modules.push(newModule);
        return newModule;
    }

    async updateModule(courseId: string, moduleId: string, data: Partial<Omit<Module, 'id' | 'materials'>>): Promise<Module> {
        const course = await this.findById(courseId);
        if (!course) throw new Error('Course not found');
        const idx = course.modules.findIndex(m => m.id === moduleId);
        if (idx === -1) throw new Error('Module not found');
        course.modules[idx] = { ...course.modules[idx], ...data };
        return course.modules[idx];
    }

    async deleteModule(courseId: string, moduleId: string): Promise<void> {
        const course = await this.findById(courseId);
        if (!course) throw new Error('Course not found');
        course.modules = course.modules.filter(m => m.id !== moduleId);
    }

    async addMaterial(courseId: string, moduleId: string, material: Omit<Material, 'id'>): Promise<Material> {
        const course = await this.findById(courseId);
        if (!course) throw new Error('Course not found');
        const mod = course.modules.find(m => m.id === moduleId);
        if (!mod) throw new Error('Module not found');
        const newMaterial: Material = { ...material, id: `mat-${Math.random().toString(36).substring(7)}` };
        mod.materials.push(newMaterial);
        return newMaterial;
    }

    async deleteMaterial(courseId: string, moduleId: string, materialId: string): Promise<void> {
        const course = await this.findById(courseId);
        if (!course) throw new Error('Course not found');
        const mod = course.modules.find(m => m.id === moduleId);
        if (!mod) throw new Error('Module not found');
        mod.materials = mod.materials.filter(m => m.id !== materialId);
    }
}

export const courseRepository = new MockCourseRepository();
