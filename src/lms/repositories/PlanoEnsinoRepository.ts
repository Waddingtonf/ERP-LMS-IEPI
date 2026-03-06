// -------------------------------------------------------------------
// PlanoEnsinoRepository — SIGAA-inspired teaching plan (syllabus)
// -------------------------------------------------------------------

export interface ObjetivoEspecifico {
    ordem: number;
    descricao: string;
}

export interface ConteudoProgramatico {
    semana: number;
    topico: string;
    subtopicos: string[];
    cargaHoraria: number; // hours
}

export interface BibliografiaItem {
    tipo: 'basica' | 'complementar';
    autores: string;
    titulo: string;
    editora: string;
    ano: number;
    isbn?: string;
}

export interface PlanoEnsino {
    id: string;
    turmaId: string;
    turmaNome: string;
    cursoNome: string;
    instructorId: string;
    instructorNome: string;
    /** Ementa — component description */
    ementa: string;
    objetivoGeral: string;
    objetivosEspecificos: ObjetivoEspecifico[];
    conteudoProgramatico: ConteudoProgramatico[];
    metodologias: string[];       // ["Aula expositiva", "Laboratório prático", ...]
    /** Evaluation criteria with weights */
    criteriosAvaliacao: Array<{ descricao: string; peso: number }>;
    bibliografiaBasica: BibliografiaItem[];
    bibliografiaComplementar: BibliografiaItem[];
    recursosNecessarios: string[];
    observacoes: string;
    status: 'Rascunho' | 'Publicado' | 'Revisado' | 'Homologado';
    criadoEm: string;
    atualizadoEm: string;
}

export interface IPlanoEnsinoRepository {
    findByTurma(turmaId: string): Promise<PlanoEnsino | null>;
    findByInstructor(instructorId: string): Promise<PlanoEnsino[]>;
    findAll(): Promise<PlanoEnsino[]>;
    create(plano: Omit<PlanoEnsino, 'id' | 'criadoEm' | 'atualizadoEm'>): Promise<PlanoEnsino>;
    update(id: string, data: Partial<Omit<PlanoEnsino, 'id' | 'criadoEm'>>): Promise<PlanoEnsino>;
    publicar(id: string): Promise<PlanoEnsino>;
}
