"use server";

import { revalidatePath } from "next/cache";
import { getAvaliacaoInstitucionalRepository } from "@/lms/repositories";
import type { AvaliacaoInstitucional, RespostasAvaliacao, ResultadoAvaliacao } from "@/lms/repositories/AvaliacaoInstitucionalRepository";

export async function getAvaliacoesInstitucionais(periodo?: string): Promise<AvaliacaoInstitucional[]> {
    return getAvaliacaoInstitucionalRepository().findAll(periodo);
}

export async function getAvaliacoesPendentes(alunoId: string): Promise<AvaliacaoInstitucional[]> {
    return getAvaliacaoInstitucionalRepository().findPendentes(alunoId);
}

export async function hasRespondido(avaliacaoId: string, alunoId: string): Promise<boolean> {
    return getAvaliacaoInstitucionalRepository().hasResponded(avaliacaoId, alunoId);
}

export async function responderAvaliacaoInstitucional(
    avaliacaoId: string,
    alunoId: string,
    respostas: RespostasAvaliacao[],
    anonima = true,
): Promise<{ success: true }> {
    await getAvaliacaoInstitucionalRepository().responder(avaliacaoId, alunoId, respostas, anonima);
    revalidatePath('/aluno/avaliacao-institucional');
    revalidatePath('/admin/avaliacoes');
    return { success: true };
}

export async function getResultadosAvaliacao(avaliacaoId: string): Promise<ResultadoAvaliacao[]> {
    return getAvaliacaoInstitucionalRepository().getResultados(avaliacaoId);
}
