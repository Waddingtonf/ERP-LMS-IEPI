// -------------------------------------------------------------------
// RequerimentoRepository — SIGAA-inspired academic requests
// -------------------------------------------------------------------

export type RequerimentoTipo =
    | 'Revisao de Nota'
    | 'Trancamento de Matricula'
    | 'Declaracao de Matricula'
    | 'Historico Escolar'
    | 'Aproveitamento de Estudos'
    | 'Dispensa de Componente'
    | 'Alteracao de Turma'
    | 'Segunda Chamada'
    | 'Encerramento de Periodo'
    | 'Outros';

export type RequerimentoStatus =
    | 'Rascunho'
    | 'Enviado'
    | 'Em Analise'
    | 'Aguardando Documentos'
    | 'Deferido'
    | 'Indeferido'
    | 'Cancelado';

export interface Requerimento {
    id: string;
    alunoId: string;
    alunoNome: string;
    matricula: string;
    tipo: RequerimentoTipo;
    status: RequerimentoStatus;
    assunto: string;
    descricao: string;
    /** JSON-serialised list of attachment names */
    anexos: string[];
    /** turmaId or avaliacaoId if relevant */
    referenciaId: string | null;
    referenciaNome: string | null;
    parecerInstrutor: string | null;
    parecerAdmin: string | null;
    criadoEm: string;     // ISO
    atualizadoEm: string; // ISO
    prazoResposta: string | null; // ISO — SLA target
}

export interface IRequerimentoRepository {
    findByAluno(alunoId: string): Promise<Requerimento[]>;
    findById(id: string): Promise<Requerimento | null>;
    findAll(filters?: {
        status?: RequerimentoStatus;
        tipo?: RequerimentoTipo;
        search?: string;
    }): Promise<Requerimento[]>;
    create(req: Omit<Requerimento, 'id' | 'criadoEm' | 'atualizadoEm'>): Promise<Requerimento>;
    updateStatus(id: string, status: RequerimentoStatus, parecer?: string): Promise<Requerimento>;
    update(id: string, data: Partial<Omit<Requerimento, 'id' | 'criadoEm'>>): Promise<Requerimento>;
    delete(id: string): Promise<void>;
    countByStatus(): Promise<Record<RequerimentoStatus, number>>;
}
