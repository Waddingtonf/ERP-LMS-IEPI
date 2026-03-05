// -------------------------------------------------------------------
// MaterialRepository — Interface + shared types
// -------------------------------------------------------------------

export type MaterialTipo = 'PDF' | 'VIDEO' | 'LINK' | 'SLIDE' | 'APOSTILA' | 'EXERCICIO';

export interface Material {
    id: string;
    turmaId: string;
    turmaNome: string;
    titulo: string;
    descricao: string;
    tipo: MaterialTipo;
    url: string;
    tamanhoKb: number | null;
    uploadedBy: string;
    uploadedAt: string;
    disponivel: boolean;
    ordem: number;
}

export interface IMaterialRepository {
    findByTurma(turmaId: string): Promise<Material[]>;
    findByTipo(turmaId: string, tipo: MaterialTipo): Promise<Material[]>;
    findById(id: string): Promise<Material | null>;
    create(material: Omit<Material, 'id'>): Promise<Material>;
    update(id: string, data: Partial<Omit<Material, 'id'>>): Promise<Material>;
    delete(id: string): Promise<void>;
    reordenar(turmaId: string, ids: string[]): Promise<void>;
}
