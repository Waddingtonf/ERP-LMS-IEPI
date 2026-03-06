// -------------------------------------------------------------------
// AvaliacaoInstitucionalRepository — Student evaluates institution/teachers
// -------------------------------------------------------------------

export interface QuestaoAvaliacao {
    id: string;
    categoria: 'Docente' | 'Disciplina' | 'Infraestrutura' | 'Coordenacao' | 'Geral';
    texto: string;
    tipo: 'escala' | 'texto' | 'multipla_escolha';
    opcoes?: string[]; // for multipla_escolha
    obrigatoria: boolean;
}

export interface RespostasAvaliacao {
    questaoId: string;
    valor: string | number; // numeric for escala (1-5), string for text/multipla_escolha
}

export interface AvaliacaoInstitucional {
    id: string;
    titulo: string;
    periodo: string;          // "1/2026"
    dataInicio: string;       // ISO
    dataFim: string;          // ISO
    status: 'Aguardando' | 'Ativa' | 'Encerrada';
    questoes: QuestaoAvaliacao[];
    alvoTipo: 'Turma' | 'Curso' | 'Geral';
    alvoId: string | null;    // turmaId or cursoId, null for Geral
    alvoNome: string | null;
    totalRespondentes: number;
    totalConvidados: number;
}

export interface RespostaAvaliacaoInstitucional {
    id: string;
    avaliacaoId: string;
    alunoId: string;
    respostas: RespostasAvaliacao[];
    respondidoEm: string; // ISO
    anonima: boolean;
}

export interface ResultadoAvaliacao {
    avaliacaoId: string;
    questaoId: string;
    questaoTexto: string;
    categoria: QuestaoAvaliacao['categoria'];
    mediaNotas: number | null;    // for escala
    distribuicao: Record<string, number>; // for multipla_escolha
    comentarios: string[];     // text answers (anonymised)
}

export interface IAvaliacaoInstitucionalRepository {
    findAll(periodo?: string): Promise<AvaliacaoInstitucional[]>;
    findById(id: string): Promise<AvaliacaoInstitucional | null>;
    findPendentes(alunoId: string): Promise<AvaliacaoInstitucional[]>;
    hasResponded(avaliacaoId: string, alunoId: string): Promise<boolean>;
    responder(avaliacaoId: string, alunoId: string, respostas: RespostasAvaliacao[], anonima?: boolean): Promise<void>;
    getResultados(avaliacaoId: string): Promise<ResultadoAvaliacao[]>;
    create(avaliacao: Omit<AvaliacaoInstitucional, 'id' | 'totalRespondentes'>): Promise<AvaliacaoInstitucional>;
    update(id: string, data: Partial<Omit<AvaliacaoInstitucional, 'id'>>): Promise<AvaliacaoInstitucional>;
}
