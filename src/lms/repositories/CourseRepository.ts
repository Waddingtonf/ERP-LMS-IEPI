export interface Material {
    id: string;
    title: string;
    type: 'PDF' | 'VIDEO' | 'LINK' | 'SLIDE';
    url: string;
    sortOrder?: number;
}

export interface Module {
    id: string;
    title: string;
    /** Price in centavos. 0 means not individually priced. */
    price: number;
    /** Whether this module can be bought standalone (modular graduation). */
    isSellableStandalone: boolean;
    sortOrder: number;
    materials: Material[];
}

export type CourseMode = 'CursoLivre' | 'GraduacaoModular' | 'PosGraduacao' | 'MBA';

export interface Course {
    id: string;
    title: string;
    description: string;
    price: number;               // em centavos — preco do curso completo / bundle
    bundlePrice?: number;        // preco bundle com desconto (centavos); se undefined = price
    courseMode: CourseMode;      // determina logica de vendas
    type: string;                // "Curso Livre" | "Pos-Graduacao" | etc
    instructor: string;          // publico-alvo profissional
    hours: string;               // "360h"
    startDate: string;           // "DD/MM/YYYY"
    endDate: string;
    schedule: string;            // "Matutino ou Vespertino"
    corenRequired: boolean;
    maxInstallments: number;
    imageUrl?: string;
    isPublished: boolean;
    modules: Module[];
}

/** Subset accepted by create(): only the 3 base fields are required; extras default to empty/false. */
export type CourseInput =
    Pick<Course, 'title' | 'description' | 'price'> &
    Partial<Omit<Course, 'id' | 'modules' | 'title' | 'description' | 'price'>>;

export type CourseUpdateInput = Partial<Omit<Course, 'id' | 'modules'>>;

export interface ICourseRepository {
    findAll(): Promise<Course[]>;
    findById(id: string): Promise<Course | null>;
    create(course: CourseInput): Promise<Course>;
    update(id: string, data: CourseUpdateInput): Promise<Course>;
    addModule(courseId: string, module: Omit<Module, 'id' | 'materials'>): Promise<Module>;
    updateModule(courseId: string, moduleId: string, data: Partial<Omit<Module, 'id' | 'materials'>>): Promise<Module>;
    deleteModule(courseId: string, moduleId: string): Promise<void>;
    addMaterial(courseId: string, moduleId: string, material: Omit<Material, 'id'>): Promise<Material>;
    deleteMaterial(courseId: string, moduleId: string, materialId: string): Promise<void>;
}
