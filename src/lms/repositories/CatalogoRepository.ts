// -------------------------------------------------------------------
// CatalogoRepository — Interface + shared types
// -------------------------------------------------------------------

export type ModalidadeCurso = 'Presencial' | 'Online' | 'Hibrido' | 'EAD';
export type NivelCurso = 'Tecnico' | 'Especializacao' | 'MBA' | 'Aperfeicoamento' | 'Extensao';
export type AreaCurso = 'Enfermagem' | 'Oncologia' | 'Gestao em Saude' | 'UTI e Cuidados Intensivos' | 'Estomaterapia' | 'Centro Cirurgico' | 'Saude Mental';

export interface CatalogoCurso {
    id: string;
    titulo: string;
    slugUrl: string;
    descricaoCurta: string;
    descricaoCompleta: string;
    area: AreaCurso;
    nivel: NivelCurso;
    modalidade: ModalidadeCurso;
    cargaHoraria: number;
    duracao: string; // "6 meses", "320h"
    preco: number;
    precoOriginal: number | null;
    parcelamento: number;
    imageUrl: string;
    destaque: boolean;
    ativo: boolean;
    inscricoesAbertas: boolean;
    proximaTurma: string | null;
    totalAlunos: number;
    avaliacao: number; // 0-5
    totalAvaliacoes: number;
    tags: string[];
    instrutores: string[];
    ementa: string[];
    certificado: boolean;
    reconhecido: boolean; // CFT/COREN reconhecido
}

export interface ICatalogoRepository {
    findAll(filtros?: { area?: AreaCurso; modalidade?: ModalidadeCurso; nivel?: NivelCurso; inscricoesAbertas?: boolean }): Promise<CatalogoCurso[]>;
    findById(id: string): Promise<CatalogoCurso | null>;
    findBySlug(slug: string): Promise<CatalogoCurso | null>;
    findDestaques(): Promise<CatalogoCurso[]>;
    findRelacionados(cursoId: string): Promise<CatalogoCurso[]>;
}
