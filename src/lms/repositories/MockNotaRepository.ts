import { INotaRepository, Nota, Boletim, SituacaoAluno } from './NotaRepository';

function calcularMedia(av1: number | null, av2: number | null, trabalho: number | null): number | null {
    const vals = [av1, av2, trabalho].filter((v): v is number => v !== null);
    if (vals.length === 0) return null;
    return Math.round((vals.reduce((a, b) => a + b, 0) / vals.length) * 10) / 10;
}

function calcularSituacao(media: number | null, frequencia: number): SituacaoAluno {
    if (media === null) return 'Em Andamento';
    if (frequencia < 75) return 'Reprovado';
    if (media >= 7) return 'Aprovado';
    if (media >= 5) return 'Recuperacao';
    return 'Reprovado';
}

const SEED_NOTAS: Nota[] = [
    { id: 'nota-1', alunoId: 'student-1', alunoNome: 'João Silva', turmaId: 'turma-1', disciplina: 'Biologia do Câncer', av1: 8.5, av2: 7.0, trabalho: 9.0, media: 8.2, situacao: 'Aprovado', updatedAt: '2026-03-01' },
    { id: 'nota-2', alunoId: 'student-1', alunoNome: 'João Silva', turmaId: 'turma-1', disciplina: 'Estadiamento TNM', av1: 6.0, av2: null, trabalho: null, media: null, situacao: 'Em Andamento', updatedAt: '2026-03-03' },
    { id: 'nota-3', alunoId: 'student-1', alunoNome: 'João Silva', turmaId: 'turma-1', disciplina: 'Quimioterapia', av1: null, av2: null, trabalho: null, media: null, situacao: 'Em Andamento', updatedAt: '2026-03-01' },
    { id: 'nota-4', alunoId: 'student-2', alunoNome: 'Maria Fernanda Costa', turmaId: 'turma-1', disciplina: 'Biologia do Câncer', av1: 9.5, av2: 9.0, trabalho: 10.0, media: 9.5, situacao: 'Aprovado', updatedAt: '2026-03-01' },
    { id: 'nota-5', alunoId: 'student-3', alunoNome: 'Carlos Eduardo Lima', turmaId: 'turma-1', disciplina: 'Biologia do Câncer', av1: 4.0, av2: 5.5, trabalho: 6.0, media: 5.2, situacao: 'Recuperacao', updatedAt: '2026-03-01' },
    { id: 'nota-6', alunoId: 'student-1', alunoNome: 'João Silva', turmaId: 'turma-2', disciplina: 'Anatomia da Pele', av1: 7.5, av2: 8.0, trabalho: 8.5, media: 8.0, situacao: 'Aprovado', updatedAt: '2026-03-03' },
];

export class MockNotaRepository implements INotaRepository {
    private notas: Nota[] = JSON.parse(JSON.stringify(SEED_NOTAS));

    async findByAluno(alunoId: string): Promise<Nota[]> {
        return this.notas.filter(n => n.alunoId === alunoId);
    }

    async findByTurma(turmaId: string): Promise<Nota[]> {
        return this.notas.filter(n => n.turmaId === turmaId);
    }

    async getBoletim(alunoId: string, turmaId: string): Promise<Boletim | null> {
        const notas = this.notas.filter(n => n.alunoId === alunoId && n.turmaId === turmaId);
        if (notas.length === 0) return null;
        const mediasValidas = notas.map(n => n.media).filter((m): m is number => m !== null);
        const mediaGeral = mediasValidas.length > 0
            ? Math.round((mediasValidas.reduce((a, b) => a + b, 0) / mediasValidas.length) * 10) / 10
            : null;
        return {
            alunoId,
            alunoNome: notas[0].alunoNome,
            turmaId,
            turmaNome: 'Turma ' + turmaId,
            notas,
            mediaGeral,
            situacaoGeral: calcularSituacao(mediaGeral, 85),
            frequenciaPercentual: 85,
        };
    }

    async lancarNota(alunoId: string, turmaId: string, campo: 'av1' | 'av2' | 'trabalho', valor: number): Promise<Nota> {
        const idx = this.notas.findIndex(n => n.alunoId === alunoId && n.turmaId === turmaId);
        if (idx === -1) throw new Error('Registro de nota não encontrado');
        this.notas[idx][campo] = valor;
        const { av1, av2, trabalho } = this.notas[idx];
        const media = calcularMedia(av1, av2, trabalho);
        this.notas[idx].media = media;
        this.notas[idx].situacao = calcularSituacao(media, 85);
        this.notas[idx].updatedAt = new Date().toISOString().split('T')[0];
        return this.notas[idx];
    }

    async upsert(nota: Omit<Nota, 'id' | 'media' | 'situacao' | 'updatedAt'>): Promise<Nota> {
        const existing = this.notas.findIndex(n => n.alunoId === nota.alunoId && n.turmaId === nota.turmaId && n.disciplina === nota.disciplina);
        const media = calcularMedia(nota.av1, nota.av2, nota.trabalho);
        const full: Nota = {
            ...nota,
            id: existing >= 0 ? this.notas[existing].id : `nota-${Date.now()}`,
            media,
            situacao: calcularSituacao(media, 85),
            updatedAt: new Date().toISOString().split('T')[0],
        };
        if (existing >= 0) { this.notas[existing] = full; } else { this.notas.push(full); }
        return full;
    }
}
