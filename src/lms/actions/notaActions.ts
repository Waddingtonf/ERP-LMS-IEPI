"use server";

import { revalidatePath } from "next/cache";
import { getNotaRepository, getFrequenciaRepository, isMockMode } from "@/lms/repositories";
import type { Nota, Boletim } from "@/lms/repositories/NotaRepository";

async function resolveStudentId(): Promise<string> {
    if (isMockMode) return 'student-1';
    const { createClient } = await import('@/lib/supabase/server');
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Não autenticado');
    return user.id;
}

export async function getBoletimAluno(turmaId: string): Promise<Boletim | null> {
    const alunoId = await resolveStudentId();
    return getNotaRepository().getBoletim(alunoId, turmaId);
}

export async function getNotasByAluno(): Promise<Nota[]> {
    const alunoId = await resolveStudentId();
    return getNotaRepository().findByAluno(alunoId);
}

export async function getHistoricoAcademico(): Promise<{ turmaId: string; notas: Nota[]; frequenciaPercentual: number }[]> {
    const alunoId = await resolveStudentId();
    const notas = await getNotaRepository().findByAluno(alunoId);
    const turmaIds = [...new Set(notas.map(n => n.turmaId))];
    return Promise.all(
        turmaIds.map(async turmaId => {
            const freq = await getFrequenciaRepository().findByAlunoTurma(alunoId, turmaId);
            const presentes = freq.filter(f => f.presente).length;
            const percentual = freq.length === 0 ? 0 : Math.round((presentes / freq.length) * 100);
            return { turmaId, notas: notas.filter(n => n.turmaId === turmaId), frequenciaPercentual: percentual };
        })
    );
}

/** Admin/Docente: lança nota de um aluno */
export async function lancarNota(alunoId: string, turmaId: string, campo: 'av1' | 'av2' | 'trabalho', valor: number): Promise<Nota> {
    const nota = await getNotaRepository().lancarNota(alunoId, turmaId, campo, valor);
    revalidatePath('/docente');
    revalidatePath('/admin/alunos');
    return nota;
}

/** Admin/Docente: obtém notas de toda a turma */
export async function getNotasByTurma(turmaId: string): Promise<Nota[]> {
    return getNotaRepository().findByTurma(turmaId);
}

export type { Nota, Boletim };
