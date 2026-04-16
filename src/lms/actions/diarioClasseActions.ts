"use server";

import { revalidatePath } from "next/cache";
import { getDiarioClasseRepository } from "@/lms/repositories";
import type { DiarioClasse, RegistroAula } from "@/lms/repositories/DiarioClasseRepository";

export async function getDiarioByTurma(turmaId: string): Promise<DiarioClasse | null> {
    return getDiarioClasseRepository().findByTurma(turmaId);
}

export async function getDiariosByInstructor(instructorId: string): Promise<DiarioClasse[]> {
    return getDiarioClasseRepository().findByInstructor(instructorId);
}

export async function getRegistrosAula(turmaId: string): Promise<RegistroAula[]> {
    return getDiarioClasseRepository().getRegistros(turmaId);
}

export async function registrarAula(turmaId: string, aula: Omit<RegistroAula, 'id'>): Promise<RegistroAula> {
    const reg = await getDiarioClasseRepository().upsertRegistro(turmaId, aula);
    revalidatePath('/docente/diario');
    return reg;
}

export async function encerrarDiarioAction(turmaId: string): Promise<DiarioClasse> {
    const d = await getDiarioClasseRepository().encerrarDiario(turmaId);
    revalidatePath('/docente/diario');
    return d;
}
