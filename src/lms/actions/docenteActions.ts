"use server";

/**
 * Docente Actions
 * Em produção: consulta turmas, alunos e materiais do professor via Supabase.
 * Em sandbox: retorna dados mockados para apresentação.
 */

export interface Turma {
    id: string;
    nome: string;
    curso: string;
    totalAlunos: number;
    horario: string;
    diasSemana: string;
    sala: string;
    semestre: string;
}

export interface Aluno {
    id: string;
    nome: string;
    email: string;
    mediaGeral: number;
    frequencia: number; // percentual 0-100
    status: 'Regular' | 'Em risco' | 'Reprovado';
}

export interface AvaliacaoAluno {
    alunoId: string;
    nome: string;
    av1: number | null;
    av2: number | null;
    trabalho: number | null;
    media: number | null;
    frequencia: number;
}

export interface Material {
    id: string;
    titulo: string;
    tipo: 'PDF' | 'VIDEO' | 'LINK' | 'SLIDE';
    url: string;
    turmaId: string;
    uploadedAt: string;
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const MOCK_TURMAS: Turma[] = [
    { id: 't1', nome: 'RH-2024-1', curso: 'Gestão Estratégica em RH', totalAlunos: 32, horario: '19:00 - 22:00', diasSemana: 'Seg / Qua', sala: 'Lab 03', semestre: '2024.1' },
    { id: 't2', nome: 'ADM-2024-1', curso: 'Administração de Empresas', totalAlunos: 45, horario: '19:00 - 22:00', diasSemana: 'Ter / Qui', sala: 'Sala 12', semestre: '2024.1' },
    { id: 't3', nome: 'ATN-2024-2', curso: 'Excelência em Atendimento', totalAlunos: 28, horario: '08:00 - 12:00', diasSemana: 'Sábado', sala: 'EaD', semestre: '2024.2' },
    { id: 't4', nome: 'RH-2024-2', curso: 'Gestão Estratégica em RH', totalAlunos: 38, horario: '19:00 - 22:00', diasSemana: 'Seg / Qua', sala: 'Lab 03', semestre: '2024.2' },
];

const MOCK_ALUNOS_BY_TURMA: Record<string, Aluno[]> = {
    t1: [
        { id: 'a1', nome: 'Ana Paula Ferreira', email: 'ana@email.com', mediaGeral: 8.5, frequencia: 92, status: 'Regular' },
        { id: 'a2', nome: 'Bruno Carvalho', email: 'bruno@email.com', mediaGeral: 5.2, frequencia: 68, status: 'Em risco' },
        { id: 'a3', nome: 'Carla Menezes', email: 'carla@email.com', mediaGeral: 7.8, frequencia: 88, status: 'Regular' },
        { id: 'a4', nome: 'Diego Santos', email: 'diego@email.com', mediaGeral: 3.9, frequencia: 55, status: 'Reprovado' },
    ],
    t2: [
        { id: 'a5', nome: 'Eduardo Lima', email: 'edu@email.com', mediaGeral: 9.1, frequencia: 97, status: 'Regular' },
        { id: 'a6', nome: 'Fernanda Costa', email: 'fer@email.com', mediaGeral: 6.7, frequencia: 80, status: 'Regular' },
    ],
    t3: [],
    t4: [],
};

const MOCK_AVALIACOES: Record<string, AvaliacaoAluno[]> = {
    t1: [
        { alunoId: 'a1', nome: 'Ana Paula Ferreira', av1: 8.5, av2: 9.0, trabalho: 8.0, media: 8.5, frequencia: 92 },
        { alunoId: 'a2', nome: 'Bruno Carvalho', av1: 5.0, av2: 5.5, trabalho: 5.0, media: 5.2, frequencia: 68 },
        { alunoId: 'a3', nome: 'Carla Menezes', av1: 7.5, av2: 8.0, trabalho: 8.0, media: 7.8, frequencia: 88 },
        { alunoId: 'a4', nome: 'Diego Santos', av1: null, av2: 3.9, trabalho: null, media: null, frequencia: 55 },
    ],
};

const MOCK_MATERIAIS: Material[] = [
    { id: 'm1', titulo: 'Slides Aula 01 - Introdução', tipo: 'SLIDE', url: '#', turmaId: 't1', uploadedAt: '2024-02-01' },
    { id: 'm2', titulo: 'Apostila Módulo 1', tipo: 'PDF', url: '#', turmaId: 't1', uploadedAt: '2024-02-05' },
    { id: 'm3', titulo: 'Vídeo-aula: Planejamento Estratégico', tipo: 'VIDEO', url: '#', turmaId: 't1', uploadedAt: '2024-02-10' },
];

// ─── Actions ──────────────────────────────────────────────────────────────────

export async function getDocenteTurmas(): Promise<Turma[]> {
    return MOCK_TURMAS;
}

export async function getAlunosByTurma(turmaId: string): Promise<Aluno[]> {
    return MOCK_ALUNOS_BY_TURMA[turmaId] ?? [];
}

export async function getAvaliacoesByTurma(turmaId: string): Promise<AvaliacaoAluno[]> {
    return MOCK_AVALIACOES[turmaId] ?? [];
}

export async function getMateriaisByTurma(turmaId: string): Promise<Material[]> {
    return MOCK_MATERIAIS.filter(m => m.turmaId === turmaId);
}

export async function getAllMateriais(): Promise<Material[]> {
    return MOCK_MATERIAIS;
}
