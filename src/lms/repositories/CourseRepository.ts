export interface Material {
    id: string;
    title: string;
    type: 'PDF' | 'VIDEO' | 'LINK';
    url: string;
}

export interface Module {
    id: string;
    title: string;
    materials: Material[];
}

export interface Course {
    id: string;
    title: string;
    description: string;
    price: number;           // em centavos
    type: string;            // "Curso Livre" | "Pós-Graduação" | etc
    instructor: string;      // público-alvo profissional
    hours: string;           // "360h"
    startDate: string;       // "DD/MM/YYYY"
    endDate: string;
    schedule: string;        // "Matutino ou Vespertino"
    corenRequired: boolean;
    maxInstallments: number;
    imageUrl?: string;
    modules: Module[];
}

/** Subset accepted by create(): only the 3 base fields are required; extras default to empty/false. */
export type CourseInput =
    Pick<Course, 'title' | 'description' | 'price'> &
    Partial<Omit<Course, 'id' | 'modules' | 'title' | 'description' | 'price'>>;

export interface ICourseRepository {
    findAll(): Promise<Course[]>;
    findById(id: string): Promise<Course | null>;
    create(course: CourseInput): Promise<Course>;
    addModule(courseId: string, module: Omit<Module, 'id' | 'materials'>): Promise<Module>;
    addMaterial(courseId: string, moduleId: string, material: Omit<Material, 'id'>): Promise<Material>;
}
