import { IAvaliacaoRepository, Avaliacao, NotaAvaliacao } from './AvaliacaoRepository';

const SEED_AVALIACOES: Avaliacao[] = [
    { id: 'av-1', turmaId: 'turma-1', turmaNome: 'ONC-TEC-2026A', titulo: 'AV1 — Biologia do Câncer', tipo: 'Prova', peso: 3, dataAplicacao: '2026-03-15', dataEntrega: null, descricao: 'Prova escrita, 20 questões objetivas + 2 discursivas. Material permitido: não.', status: 'Publicada', notaMaxima: 10 },
    { id: 'av-2', turmaId: 'turma-1', turmaNome: 'ONC-TEC-2026A', titulo: 'Trabalho — Estadiamento TNM', tipo: 'Trabalho', peso: 3, dataAplicacao: '2026-03-20', dataEntrega: '2026-03-25', descricao: 'Apresentação de caso clínico em grupo de 3 pessoas. 15 min + 5 min de arguição.', status: 'Publicada', notaMaxima: 10 },
    { id: 'av-3', turmaId: 'turma-1', turmaNome: 'ONC-TEC-2026A', titulo: 'AV2 — Quimioterapia e Protocolos', tipo: 'Prova', peso: 4, dataAplicacao: '2026-04-10', dataEntrega: null, descricao: 'Prova prática em laboratório de simulação. Avaliação de preparo de oncossegurança.', status: 'Rascunho', notaMaxima: 10 },
    { id: 'av-4', turmaId: 'turma-2', turmaNome: 'FER-ESP-2026A', titulo: 'Seminário — Classificação de Feridas', tipo: 'Seminario', peso: 4, dataAplicacao: '2026-03-22', dataEntrega: '2026-03-22', descricao: 'Apresentação de revisão integrativa. Mínimo 5 artigos a partir de 2020.', status: 'Publicada', notaMaxima: 10 },
    { id: 'av-5', turmaId: 'turma-2', turmaNome: 'FER-ESP-2026A', titulo: 'Prática — Curativo Complexo', tipo: 'Pratica', peso: 6, dataAplicacao: '2026-04-05', dataEntrega: null, descricao: 'Estação de OSCE, 3 estações de 10 min cada. Uso de check-list padronizado.', status: 'Rascunho', notaMaxima: 10 },
];

const SEED_NOTAS_AV: NotaAvaliacao[] = [
    { id: 'nav-1', avaliacaoId: 'av-1', alunoId: 'student-1', alunoNome: 'João Silva', nota: 8.5, entregueEm: '2026-03-15', observacao: '' },
    { id: 'nav-2', avaliacaoId: 'av-1', alunoId: 'student-2', alunoNome: 'Maria Fernanda Costa', nota: 9.5, entregueEm: '2026-03-15', observacao: '' },
    { id: 'nav-3', avaliacaoId: 'av-1', alunoId: 'student-3', alunoNome: 'Carlos Eduardo Lima', nota: 4.0, entregueEm: '2026-03-15', observacao: 'Recuperação agendada para 22/03' },
    { id: 'nav-4', avaliacaoId: 'av-2', alunoId: 'student-1', alunoNome: 'João Silva', nota: null, entregueEm: null, observacao: '' },
];

export class MockAvaliacaoRepository implements IAvaliacaoRepository {
    private avaliacoes: Avaliacao[] = JSON.parse(JSON.stringify(SEED_AVALIACOES));
    private notasAv: NotaAvaliacao[] = JSON.parse(JSON.stringify(SEED_NOTAS_AV));

    async findByTurma(turmaId: string): Promise<Avaliacao[]> {
        return this.avaliacoes.filter(a => a.turmaId === turmaId);
    }

    async findById(id: string): Promise<Avaliacao | null> {
        return this.avaliacoes.find(a => a.id === id) ?? null;
    }

    async create(avaliacao: Omit<Avaliacao, 'id'>): Promise<Avaliacao> {
        const nova = { ...avaliacao, id: `av-${Date.now()}` };
        this.avaliacoes.push(nova);
        return nova;
    }

    async update(id: string, data: Partial<Omit<Avaliacao, 'id'>>): Promise<Avaliacao> {
        const idx = this.avaliacoes.findIndex(a => a.id === id);
        if (idx === -1) throw new Error('Avaliação não encontrada');
        this.avaliacoes[idx] = { ...this.avaliacoes[idx], ...data };
        return this.avaliacoes[idx];
    }

    async delete(id: string): Promise<void> {
        const idx = this.avaliacoes.findIndex(a => a.id === id);
        if (idx !== -1) this.avaliacoes.splice(idx, 1);
    }

    async getNotasByAvaliacao(avaliacaoId: string): Promise<NotaAvaliacao[]> {
        return this.notasAv.filter(n => n.avaliacaoId === avaliacaoId);
    }

    async lancarNotaAvaliacao(avaliacaoId: string, alunoId: string, nota: number, obs = ''): Promise<NotaAvaliacao> {
        const idx = this.notasAv.findIndex(n => n.avaliacaoId === avaliacaoId && n.alunoId === alunoId);
        const entry: NotaAvaliacao = idx >= 0
            ? { ...this.notasAv[idx], nota, observacao: obs, entregueEm: new Date().toISOString().split('T')[0] }
            : { id: `nav-${Date.now()}`, avaliacaoId, alunoId, alunoNome: 'Aluno', nota, entregueEm: new Date().toISOString().split('T')[0], observacao: obs };
        if (idx >= 0) this.notasAv[idx] = entry; else this.notasAv.push(entry);
        return entry;
    }
}
