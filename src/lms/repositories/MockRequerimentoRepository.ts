import type {
    Requerimento,
    RequerimentoStatus,
    RequerimentoTipo,
    IRequerimentoRepository,
} from './RequerimentoRepository';

const NOW = () => new Date().toISOString();

const MOCK: Requerimento[] = [
    {
        id: 'req-1',
        alunoId: 'student-1',
        alunoNome: 'Maria Clara Souza',
        matricula: '2024001',
        tipo: 'Revisao de Nota',
        status: 'Em Analise',
        assunto: 'Revisão de nota — Prova Final Enfermagem Oncológica',
        descricao: 'Acredito que houve erro na correção da questão 4 da prova final. Solicito revisão formal conforme regulamento.',
        anexos: ['gabarito-questao4.pdf'],
        referenciaId: 'aval-1',
        referenciaNome: 'Prova Final — ENF-ONC-2026A',
        parecerInstrutor: null,
        parecerAdmin: null,
        criadoEm: '2026-02-28T10:00:00Z',
        atualizadoEm: '2026-03-01T09:00:00Z',
        prazoResposta: '2026-03-10T23:59:00Z',
    },
    {
        id: 'req-2',
        alunoId: 'student-1',
        alunoNome: 'Maria Clara Souza',
        matricula: '2024001',
        tipo: 'Declaracao de Matricula',
        status: 'Deferido',
        assunto: 'Declaração de matrícula para comprovação no COREN',
        descricao: 'Necessito de declaração atualizada de matrícula para renovação do registro no COREN-SP.',
        anexos: [],
        referenciaId: null,
        referenciaNome: null,
        parecerAdmin: 'Documento emitido e disponível para download no portal.',
        parecerInstrutor: null,
        criadoEm: '2026-02-10T14:30:00Z',
        atualizadoEm: '2026-02-12T11:00:00Z',
        prazoResposta: '2026-02-15T23:59:00Z',
    },
    {
        id: 'req-3',
        alunoId: 'student-2',
        alunoNome: 'João Pedro Lima',
        matricula: '2024002',
        tipo: 'Segunda Chamada',
        status: 'Enviado',
        assunto: 'Solicitação de segunda chamada — Prova Teórica Abordagens Intravenosas',
        descricao: 'Estive de atestado médico no dia da avaliação. Segue documentação comprobatória em anexo.',
        anexos: ['atestado-medico.pdf', 'cid-10.pdf'],
        referenciaId: 'aval-3',
        referenciaNome: 'Prova Teórica — Abordagens Intravenosas',
        parecerInstrutor: null,
        parecerAdmin: null,
        criadoEm: '2026-03-05T08:00:00Z',
        atualizadoEm: '2026-03-05T08:00:00Z',
        prazoResposta: '2026-03-12T23:59:00Z',
    },
    {
        id: 'req-4',
        alunoId: 'student-3',
        alunoNome: 'Ana Beatriz Ferreira',
        matricula: '2024003',
        tipo: 'Trancamento de Matricula',
        status: 'Em Analise',
        assunto: 'Trancamento temporário por motivos de saúde',
        descricao: 'Solicito trancamento da matrícula para o segundo semestre de 2026 em decorrência de tratamento médico. Documentação médica anexa.',
        anexos: ['laudo-medico.pdf'],
        referenciaId: null,
        referenciaNome: null,
        parecerInstrutor: null,
        parecerAdmin: null,
        criadoEm: '2026-03-01T16:00:00Z',
        atualizadoEm: '2026-03-02T10:00:00Z',
        prazoResposta: '2026-03-15T23:59:00Z',
    },
    {
        id: 'req-5',
        alunoId: 'student-4',
        alunoNome: 'Carlos Eduardo Mendes',
        matricula: '2023045',
        tipo: 'Aproveitamento de Estudos',
        status: 'Indeferido',
        assunto: 'Aproveitamento de disciplina — Anatomia e Fisiologia',
        descricao: 'Cursei componente equivalente em instituição anterior. Solicito análise para aproveitamento de estudos.',
        anexos: ['historico-anterior.pdf', 'ementa-disciplina.pdf'],
        referenciaId: null,
        referenciaNome: null,
        parecerInstrutor: 'Após análise da ementa, o conteúdo não apresenta equivalência suficiente (menos de 75%) com nossa grade.',
        parecerAdmin: 'Indeferido conforme parecer do docente responsável.',
        criadoEm: '2026-01-15T09:00:00Z',
        atualizadoEm: '2026-01-28T14:00:00Z',
        prazoResposta: '2026-01-30T23:59:00Z',
    },
];

export class MockRequerimentoRepository implements IRequerimentoRepository {
    private data = JSON.parse(JSON.stringify(MOCK)) as Requerimento[];

    async findByAluno(alunoId: string) {
        return this.data.filter(r => r.alunoId === alunoId).sort((a, b) => b.criadoEm.localeCompare(a.criadoEm));
    }

    async findById(id: string) {
        return this.data.find(r => r.id === id) ?? null;
    }

    async findAll(filters?: { status?: RequerimentoStatus; tipo?: RequerimentoTipo; search?: string }) {
        let result = [...this.data];
        if (filters?.status) result = result.filter(r => r.status === filters.status);
        if (filters?.tipo)   result = result.filter(r => r.tipo === filters.tipo);
        if (filters?.search) {
            const q = filters.search.toLowerCase();
            result = result.filter(r =>
                r.alunoNome.toLowerCase().includes(q) ||
                r.assunto.toLowerCase().includes(q) ||
                r.matricula.includes(q)
            );
        }
        return result.sort((a, b) => b.criadoEm.localeCompare(a.criadoEm));
    }

    async create(req: Omit<Requerimento, 'id' | 'criadoEm' | 'atualizadoEm'>) {
        const n: Requerimento = { ...req, id: `req-${Date.now()}`, criadoEm: NOW(), atualizadoEm: NOW() };
        this.data.unshift(n);
        return n;
    }

    async updateStatus(id: string, status: RequerimentoStatus, parecer?: string) {
        const r = this.data.find(r => r.id === id);
        if (!r) throw new Error('Requerimento não encontrado');
        r.status = status;
        if (parecer) r.parecerAdmin = parecer;
        r.atualizadoEm = NOW();
        return r;
    }

    async update(id: string, data: Partial<Omit<Requerimento, 'id' | 'criadoEm'>>) {
        const r = this.data.find(r => r.id === id);
        if (!r) throw new Error('Requerimento não encontrado');
        Object.assign(r, data, { atualizadoEm: NOW() });
        return r;
    }

    async delete(id: string) {
        this.data = this.data.filter(r => r.id !== id);
    }

    async countByStatus() {
        const counts: Record<string, number> = {};
        for (const r of this.data) {
            counts[r.status] = (counts[r.status] ?? 0) + 1;
        }
        return counts as Record<RequerimentoStatus, number>;
    }
}
