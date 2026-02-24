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
    price: number;
    modules: Module[];
}

export interface ICourseRepository {
    findAll(): Promise<Course[]>;
    findById(id: string): Promise<Course | null>;
    create(course: Omit<Course, 'id' | 'modules'>): Promise<Course>;
    addModule(courseId: string, module: Omit<Module, 'id' | 'materials'>): Promise<Module>;
    addMaterial(courseId: string, moduleId: string, material: Omit<Material, 'id'>): Promise<Material>;
}
