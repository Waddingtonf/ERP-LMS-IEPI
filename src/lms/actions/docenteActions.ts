"use server";

import { revalidatePath } from "next/cache";
import { getTurmaRepository, getNotaRepository } from "@/lms/repositories";
import type { Turma } from "@/lms/repositories/TurmaRepository";
import { requireAuth } from "@/lib/auth/session";

// ─── Interfaces Locais (Compatibilidade com UI) ───────────────────────────────

export interface TurmaUI {
    id: string;
    nome: string;
    curso: string;
    semestre: string;
    diasSemana: string;
    horario: string;
    totalAlunos: number;
    // Arrays que a UI pode requerer condicionalmente
    alunos?: any[];
    avaliacoes?: any[];
}

// ─── Actions ──────────────────────────────────────────────────────────────────

export async function getDocenteTurmas(): Promise<TurmaUI[]> {
    const docenteId = await requireAuth('DOCENTE');
    const repo = await getTurmaRepository();
    const turmas = await repo.findByInstructor(docenteId);

    return turmas.map(t => ({
        id: t.id,
        nome: t.code || t.courseName,
        curso: t.courseName,
        semestre: t.startDate || '2026.1',
        diasSemana: '', // mock
        horario: t.schedule,
        totalAlunos: t.enrolledCount
    }));
}

// Usamos a view que criamos `v_turma_alunos_resumo`
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function getAlunosByTurma(turmaId: string): Promise<any[]> {
    await requireAuth('DOCENTE');

    const { createClient } = await import('@/lib/supabase/server');
    const supabase = await createClient();

    const { data } = await supabase
        .from('v_turma_alunos_resumo')
        .select('*')
        .eq('turma_id', turmaId);

    return (data || []).map(row => ({
        id: row.aluno_id,
        nome: row.aluno_name,
        email: row.aluno_email,
        mediaGeral: Number(row.media) || null,
        frequencia: Number(row.frequencia_percentual) || 0,
        status: row.situacao || 'Regular'
    }));
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function getAvaliacoesByTurma(turmaId: string): Promise<any[]> {
    await requireAuth('DOCENTE');
    const repo = await getNotaRepository();
    const notas = await repo.findByTurma(turmaId);

    return notas.map(n => ({
        alunoId: n.alunoId,
        nome: n.alunoNome,
        av1: n.av1,
        av2: n.av2,
        trabalho: n.trabalho,
        media: n.media,
        frequencia: 0 // O front não usa ativamente na lista de notas, só no dashboard principal
    }));
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function getMateriaisByTurma(turmaId: string): Promise<any[]> {
    await requireAuth('DOCENTE');
    return []; // Fora do escopo do request atual
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function getAllMateriais(): Promise<any[]> {
    await requireAuth('DOCENTE');
    return []; // Fora do escopo do request atual
}
