/**
 * MockOcorrenciaRepository — in-memory implementation for MVP/sandbox mode.
 * Includes realistic seed data covering all tipos.
 */

import type { IOcorrenciaRepository, Ocorrencia, CreateOcorrenciaData, OcorrenciaStatus, OcorrenciaTipo } from './OcorrenciaRepository';

const now = new Date();
const dt = (offsetDays: number) => new Date(now.getTime() - offsetDays * 86400000).toISOString();

const SEED: Ocorrencia[] = [
    {
        id: 'oc-1',
        tipo: 'TRIAGEM',
        prioridade: 'ALTA',
        status: 'ABERTA',
        titulo: 'Documentação incompleta — João Silva',
        descricao: 'Aluno não enviou RG e comprovante de endereço. Matrícula pendente de aprovação.',
        alunoId: 'student-1',
        alunoNome: 'João Silva',
        turmaId: 'turma-1',
        criadoPorNome: 'Secretaria',
        criadoEm: dt(2),
        atualizadoEm: dt(2),
    },
    {
        id: 'oc-2',
        tipo: 'TRIAGEM',
        prioridade: 'MEDIA',
        status: 'EM_ANALISE',
        titulo: 'Validação de diploma — Maria Almeida',
        descricao: 'Diploma de ensino médio enviado em baixa resolução. Solicitada nova foto.',
        alunoId: 'student-2',
        alunoNome: 'Maria Almeida',
        atribuidoParaNome: 'Ana Secretaria',
        criadoPorNome: 'Sistema',
        criadoEm: dt(3),
        atualizadoEm: dt(1),
    },
    {
        id: 'oc-3',
        tipo: 'ACADEMICA',
        prioridade: 'ALTA',
        status: 'ABERTA',
        titulo: 'Baixa frequência — Pedro Alves (turma-2)',
        descricao: 'Frequência do aluno caiu para 62%, abaixo do mínimo de 75%. Risco de reprovação.',
        alunoId: 'student-3',
        alunoNome: 'Pedro Alves',
        turmaId: 'turma-2',
        criadoPorNome: 'Sistema',
        criadoEm: dt(1),
        atualizadoEm: dt(1),
    },
    {
        id: 'oc-4',
        tipo: 'ACADEMICA',
        prioridade: 'MEDIA',
        status: 'RESOLVIDA',
        titulo: 'Revisão de nota AV1 — Ana Costa',
        descricao: 'Aluna solicitou revisão da nota da AV1. Docente confirmou erro de digitação.',
        alunoId: 'student-4',
        alunoNome: 'Ana Costa',
        resolucao: 'Nota corrigida de 5.5 para 7.0 pelo docente responsável. Via diário de classe.',
        criadoPorNome: 'Aluno',
        criadoEm: dt(5),
        atualizadoEm: dt(4),
        resolvidoEm: dt(4),
    },
    {
        id: 'oc-5',
        tipo: 'SISTEMA',
        prioridade: 'BAIXA',
        status: 'RESOLVIDA',
        titulo: 'Falha ao carregar material PDF — Módulo 2',
        descricao: '3 alunos reportaram erro 404 ao acessar apostila do Módulo 2.',
        resolucao: 'Link do material atualizado pelo coordenador pedagógico.',
        criadoPorNome: 'Suporte',
        criadoEm: dt(7),
        atualizadoEm: dt(6),
        resolvidoEm: dt(6),
    },
    {
        id: 'oc-6',
        tipo: 'REQUERIMENTO',
        prioridade: 'MEDIA',
        status: 'EM_ANALISE',
        titulo: 'Solicitação de declaração de matrícula — Carlos Melo',
        descricao: 'Aluno solicitou declaração de matrícula para envio a empresa empregadora.',
        alunoId: 'student-5',
        alunoNome: 'Carlos Melo',
        atribuidoParaNome: 'Secretaria',
        criadoPorNome: 'Aluno',
        criadoEm: dt(1),
        atualizadoEm: dt(0),
    },
];

export class MockOcorrenciaRepository implements IOcorrenciaRepository {
    private store: Ocorrencia[] = JSON.parse(JSON.stringify(SEED));
    private counter = SEED.length + 1;

    async findAll(): Promise<Ocorrencia[]> {
        return [...this.store];
    }

    async findById(id: string): Promise<Ocorrencia | null> {
        return this.store.find(o => o.id === id) ?? null;
    }

    async findByStatus(status: OcorrenciaStatus): Promise<Ocorrencia[]> {
        return this.store.filter(o => o.status === status);
    }

    async findByTipo(tipo: OcorrenciaTipo): Promise<Ocorrencia[]> {
        return this.store.filter(o => o.tipo === tipo);
    }

    async findByAluno(alunoId: string): Promise<Ocorrencia[]> {
        return this.store.filter(o => o.alunoId === alunoId);
    }

    async create(data: CreateOcorrenciaData): Promise<Ocorrencia> {
        const now = new Date().toISOString();
        const ocorrencia: Ocorrencia = {
            id: `oc-${this.counter++}`,
            status: 'ABERTA',
            resolucao: undefined,
            resolvidoEm: undefined,
            criadoEm: now,
            atualizadoEm: now,
            ...data,
        };
        this.store.push(ocorrencia);
        return ocorrencia;
    }

    async updateStatus(id: string, status: OcorrenciaStatus, resolucao?: string): Promise<Ocorrencia> {
        const idx = this.store.findIndex(o => o.id === id);
        if (idx < 0) throw new Error(`Ocorrência ${id} não encontrada.`);

        const now = new Date().toISOString();
        const updated: Ocorrencia = {
            ...this.store[idx],
            status,
            atualizadoEm: now,
            ...(resolucao ? { resolucao } : {}),
            ...(status === 'RESOLVIDA' || status === 'CANCELADA' ? { resolvidoEm: now } : {}),
        };
        this.store[idx] = updated;
        return updated;
    }

    async atribuir(id: string, userId: string, userName: string): Promise<Ocorrencia> {
        const idx = this.store.findIndex(o => o.id === id);
        if (idx < 0) throw new Error(`Ocorrência ${id} não encontrada.`);

        const now = new Date().toISOString();
        const updated: Ocorrencia = {
            ...this.store[idx],
            atribuidoParaId: userId,
            atribuidoParaNome: userName,
            status: 'EM_ANALISE',
            atualizadoEm: now,
        };
        this.store[idx] = updated;
        return updated;
    }
}
