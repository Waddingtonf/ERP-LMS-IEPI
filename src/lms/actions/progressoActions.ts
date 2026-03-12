"use server";

import { isMockMode, getProgressoRepository } from "@/lms/repositories";
import { revalidatePath } from "next/cache";

async function resolveUserId(): Promise<string> {
    if (isMockMode) return 'student-1';
    const { createClient } = await import('@/lib/supabase/server');
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Não autenticado');
    return user.id;
}

/**
 * Fetch progress records for the current student in a specific course.
 */
export async function getProgressoCurso(cursoId: string) {
    const alunoId = await resolveUserId();
    const repo = getProgressoRepository();
    const records = await repo.findByCurso(alunoId, cursoId);
    const percentual = await repo.getPercentual(alunoId, cursoId);
    return { records, percentual };
}

/**
 * Mark a specific lesson (aulaId) as completed for the current student.
 */
export async function marcarAulaConcluidaAction(cursoId: string, aulaId: string): Promise<{
    success: boolean;
    percentual?: number;
    error?: string;
}> {
    try {
        const alunoId = await resolveUserId();
        const repo = getProgressoRepository();
        await repo.marcarConcluida(alunoId, cursoId, aulaId);
        const percentual = await repo.getPercentual(alunoId, cursoId);

        revalidatePath(`/aluno/aulas/${aulaId}`);
        revalidatePath('/aluno');

        return { success: true, percentual };
    } catch (err) {
        console.error('[marcarAulaConcluidaAction]', err);
        return { success: false, error: 'Não foi possível registrar a conclusão.' };
    }
}
