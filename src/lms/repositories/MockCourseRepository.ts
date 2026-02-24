import { ICourseRepository, Course, Module, Material } from './CourseRepository';

export class MockCourseRepository implements ICourseRepository {
    private courses: Course[] = [
        {
            id: 'course-1',
            title: 'Curso de Especialização Sandbox',
            description: 'Aprenda como utilizar todas as funcionalidades do nosso ambiente de testes CIELO.',
            price: 19999, // R$ 199,99
            modules: [
                {
                    id: 'module-1',
                    title: 'Introdução ao Sistema',
                    materials: [
                        { id: 'mat-1', title: 'Boas-vindas (Video)', type: 'VIDEO', url: 'https://vimeo.com/123456' },
                        { id: 'mat-2', title: 'Apostila Completa (PDF)', type: 'PDF', url: 'https://example.com/apostila.pdf' }
                    ]
                }
            ]
        }
    ];

    async findAll(): Promise<Course[]> {
        return this.courses;
    }

    async findById(id: string): Promise<Course | null> {
        return this.courses.find(c => c.id === id) || null;
    }

    async create(course: Omit<Course, 'id' | 'modules'>): Promise<Course> {
        const newCourse: Course = {
            ...course,
            id: `course-${Math.random().toString(36).substring(7)}`,
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
