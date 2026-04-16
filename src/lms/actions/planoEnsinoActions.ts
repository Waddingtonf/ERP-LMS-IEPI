"use server";

import { revalidatePath } from "next/cache";
import { getPlanoEnsinoRepository } from "@/lms/repositories";
import type { PlanoEnsino } from "@/lms/repositories/PlanoEnsinoRepository";

export async function getPlanoEnsinoByTurma(turmaId: string): Promise<PlanoEnsino | null> {
    return getPlanoEnsinoRepository().findByTurma(turmaId);
}

export async function getPlanosByInstructor(instructorId: string): Promise<PlanoEnsino[]> {
    return getPlanoEnsinoRepository().findByInstructor(instructorId);
}

export async function getAllPlanos(): Promise<PlanoEnsino[]> {
    return getPlanoEnsinoRepository().findAll();
}

export async function criarPlanoEnsino(data: Omit<PlanoEnsino, 'id' | 'criadoEm' | 'atualizadoEm'>): Promise<PlanoEnsino> {
    const plano = await getPlanoEnsinoRepository().create(data);
    revalidatePath('/docente/plano-ensino');
    revalidatePath('/aluno/plano-ensino');
    return plano;
}

export async function atualizarPlanoEnsino(id: string, data: Partial<Omit<PlanoEnsino, 'id' | 'criadoEm'>>): Promise<PlanoEnsino> {
    const plano = await getPlanoEnsinoRepository().update(id, data);
    revalidatePath('/docente/plano-ensino');
    revalidatePath('/aluno/plano-ensino');
    return plano;
}

export async function publicarPlanoEnsino(id: string): Promise<PlanoEnsino> {
    const plano = await getPlanoEnsinoRepository().publicar(id);
    revalidatePath('/docente/plano-ensino');
    revalidatePath('/aluno/plano-ensino');
    return plano;
}
