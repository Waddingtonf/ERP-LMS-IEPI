import { ICourseRepository, Course, CourseInput, Module, Material } from './CourseRepository';
import { CATALOG } from '../data/catalog';

export class MockCourseRepository implements ICourseRepository {
    private courses: Course[] = CATALOG.map(c => ({
        ...c,
        modules: [
            {
                id: `${c.id}-mod-1`,
                title: 'Módulo Introdutório',
                materials: [
                    { id: `${c.id}-mat-1`, title: 'Boas-vindas', type: 'VIDEO' as const, url: 'https://vimeo.com/123456' },
                    { id: `${c.id}-mat-2`, title: 'Apostila Completa', type: 'PDF' as const, url: 'https://example.com/apostila.pdf' },
                ],
            },
        ],
    }));

    async findAll(): Promise<Course[]> {
        return this.courses;
    }

    async findById(id: string): Promise<Course | null> {
        return this.courses.find(c => c.id === id) || null;
    }

    async create(course: CourseInput): Promise<Course> {
        const newCourse: Course = {
            type:            '',
            instructor:      '',
            hours:           '',
            startDate:       '',
            endDate:         '',
            schedule:        '',
            corenRequired:   false,
            maxInstallments: 1,
            ...course,
            id:      `course-${Math.random().toString(36).substring(7)}`,
            modules: [],
        };
        this.courses.push(newCourse);
        return newCourse;
    }

    async addModule(courseId: string, module: Omit<Module, 'id' | 'materials'>): Promise<Module> {
        const course = await this.findById(courseId);
        if (!course) throw new Error('Course not found');

        const newModule: Module = {
            ...module,
            id: `module-${Math.random().toString(36).substring(7)}`,
            materials: [],
        };
        course.modules.push(newModule);
        return newModule;
    }

    async addMaterial(courseId: string, moduleId: string, material: Omit<Material, 'id'>): Promise<Material> {
        const course = await this.findById(courseId);
        if (!course) throw new Error('Course not found');

        const module = course.modules.find(m => m.id === moduleId);
        if (!module) throw new Error('Module not found');

        const newMaterial: Material = {
            ...material,
            id: `mat-${Math.random().toString(36).substring(7)}`
        };
        module.materials.push(newMaterial);
        return newMaterial;
    }
}

export const courseRepository = new MockCourseRepository();
