/**
 * OcorrenciaRepository — Interface + shared types
 * Central event tracking entity for ERP operations.
 */

import type { OcorrenciaTipo, OcorrenciaPrioridade, OcorrenciaStatus } from '@/lib/schemas/ocorrencia.schemas';

export type { OcorrenciaTipo, OcorrenciaPrioridade, OcorrenciaStatus };

export interface Ocorrencia {
    id: string;
    tipo: OcorrenciaTipo;
    prioridade: OcorrenciaPrioridade;
    status: OcorrenciaStatus;
    titulo: string;
    descricao: string;
    alunoId?: string;
    alunoNome?: string;
    turmaId?: string;
    cursoId?: string;
    criadoPorId?: string;
    criadoPorNome?: string;
    atribuidoParaId?: string;
    atribuidoParaNome?: string;
    resolucao?: string;
    criadoEm: string;      // ISO date string
    atualizadoEm: string;  // ISO date string
    resolvidoEm?: string;  // ISO date string
}

export type CreateOcorrenciaData = Omit<
    Ocorrencia,
    'id' | 'status' | 'criadoEm' | 'atualizadoEm' | 'resolvidoEm' | 'resolucao'
>;

export interface IOcorrenciaRepository {
    findAll(): Promise<Ocorrencia[]>;
    findById(id: string): Promise<Ocorrencia | null>;
    findByStatus(status: OcorrenciaStatus): Promise<Ocorrencia[]>;
    findByTipo(tipo: OcorrenciaTipo): Promise<Ocorrencia[]>;
    findByAluno(alunoId: string): Promise<Ocorrencia[]>;
    create(data: CreateOcorrenciaData): Promise<Ocorrencia>;
    updateStatus(id: string, status: OcorrenciaStatus, resolucao?: string): Promise<Ocorrencia>;
    atribuir(id: string, userId: string, userName: string): Promise<Ocorrencia>;
}
