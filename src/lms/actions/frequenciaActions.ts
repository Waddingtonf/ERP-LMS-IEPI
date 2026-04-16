"use server";

import { revalidatePath } from "next/cache";
import { getFrequenciaRepository } from "@/lms/repositories";
import { Frequencia, FrequenciaResumo } from "@/lms/repositories/FrequenciaRepository";
import { requireAuth } from "@/lib/auth/session";

export async function getFrequenciaAula(aulaId: string): Promise<Frequencia[]> {
    return (await getFrequenciaRepository()).findByAula(aulaId);
}

export async function getMinhasFrequencias(turmaId: string): Promise<{
    total: number;
    presentes: number;
    percentual: number;
    registros: Frequencia[];
}> {
    const alunoId = await requireAuth('STUDENT');
    const registros = await (await getFrequenciaRepository()).findByAlunoTurma(alunoId, turmaId);
    const presentes = registros.filter(r => r.presente).length;
    return {
        total: registros.length,
        presentes,
        percentual: registros.length === 0 ? 0 : Math.round((presentes / registros.length) * 100),
        registros,
    };
}

export async function getResumoTurma(turmaId: string): Promise<FrequenciaResumo[]> {
    return (await getFrequenciaRepository()).getResumoTurma(turmaId);
}

/** Called by docente to save attendance for an entire aula at once. */
export async function salvarFrequenciaAction(
    aulaId: string,
    presencas: { alunoId: string; alunoName: string; presente: boolean; observacao?: string }[],
) {
    const result = await (await getFrequenciaRepository()).bulkUpsert(aulaId, presencas);
    revalidatePath('/docente');
    revalidatePath('/docente/frequencia');
    revalidatePath('/aluno/historico');
    return { saved: result.length };
}
