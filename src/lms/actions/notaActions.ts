"use server";

import { revalidatePath } from "next/cache";
import { getNotaRepository, getFrequenciaRepository, isMockMode } from "@/lms/repositories";
import type { Nota, Boletim } from "@/lms/repositories/NotaRepository";

import { requireAuth } from "@/lib/auth/session";

export async function getBoletimAluno(turmaId: string): Promise<Boletim | null> {
    const alunoId = await requireAuth('STUDENT');
    return (await getNotaRepository()).getBoletim(alunoId, turmaId);
}

export async function getNotasByAluno(): Promise<Nota[]> {
    const alunoId = await requireAuth('STUDENT');
    return (await getNotaRepository()).findByAluno(alunoId);
}

export async function getHistoricoAcademico(): Promise<{ turmaId: string; notas: Nota[]; frequenciaPercentual: number }[]> {
    const alunoId = await requireAuth('STUDENT');
    const notas = await (await getNotaRepository()).findByAluno(alunoId);
    const turmaIds = [...new Set(notas.map(n => n.turmaId))];
    return Promise.all(
        turmaIds.map(async turmaId => {
            const freq = await (await getFrequenciaRepository()).findByAlunoTurma(alunoId, turmaId);
            const presentes = freq.filter(f => f.presente).length;
            const percentual = freq.length === 0 ? 0 : Math.round((presentes / freq.length) * 100);
            return { turmaId, notas: notas.filter(n => n.turmaId === turmaId), frequenciaPercentual: percentual };
        })
    );
}

/** Admin/Docente: lanÃ§a nota de um aluno */
export async function lancarNota(alunoId: string, turmaId: string, campo: 'av1' | 'av2' | 'trabalho', valor: number): Promise<Nota> {
    const nota = await (await getNotaRepository()).lancarNota(alunoId, turmaId, campo, valor);
    revalidatePath('/docente');
    revalidatePath('/admin/alunos');
    return nota;
}

/** Admin/Docente: obtÃ©m notas de toda a turma */
export async function getNotasByTurma(turmaId: string): Promise<Nota[]> {
    return (await getNotaRepository()).findByTurma(turmaId);
}
