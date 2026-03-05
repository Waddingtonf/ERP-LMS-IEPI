"use server";

import { revalidatePath } from "next/cache";
import { getAvaliacaoRepository } from "@/lms/repositories";
import type { Avaliacao, NotaAvaliacao } from "@/lms/repositories/AvaliacaoRepository";

export async function getAvaliacoesByTurma(turmaId: string): Promise<Avaliacao[]> {
    return getAvaliacaoRepository().findByTurma(turmaId);
}

export async function getAvaliacaoById(id: string): Promise<Avaliacao | null> {
    return getAvaliacaoRepository().findById(id);
}

export async function criarAvaliacao(data: Omit<Avaliacao, 'id'>): Promise<Avaliacao> {
    const av = await getAvaliacaoRepository().create(data);
    revalidatePath('/docente/avaliacoes');
    revalidatePath(`/docente/turmas/${data.turmaId}`);
    return av;
}

export async function criarAvaliacaoAction(formData: FormData): Promise<Avaliacao> {
    const av = await getAvaliacaoRepository().create({
        turmaId:       formData.get('turmaId')       as string,
        turmaNome:     formData.get('turmaNome')     as string,
        titulo:        formData.get('titulo')        as string,
        tipo:          formData.get('tipo')          as Avaliacao['tipo'],
        peso:          Number(formData.get('peso') ?? 3),
        dataAplicacao: formData.get('dataAplicacao') as string,
        dataEntrega:   formData.get('dataEntrega') as string | null,
        descricao:     formData.get('descricao')     as string,
        status:        'Rascunho',
        notaMaxima:    Number(formData.get('notaMaxima') ?? 10),
    });
    revalidatePath('/docente/avaliacoes');
    return av;
}

export async function publicarAvaliacao(id: string): Promise<Avaliacao> {
    const av = await getAvaliacaoRepository().update(id, { status: 'Publicada' });
    revalidatePath('/docente/avaliacoes');
    return av;
}

export async function encerrarAvaliacao(id: string): Promise<Avaliacao> {
    const av = await getAvaliacaoRepository().update(id, { status: 'Encerrada' });
    revalidatePath('/docente/avaliacoes');
    return av;
}

export async function deleteAvaliacaoAction(id: string): Promise<void> {
    await getAvaliacaoRepository().delete(id);
    revalidatePath('/docente/avaliacoes');
}

export async function getNotasByAvaliacao(avaliacaoId: string): Promise<NotaAvaliacao[]> {
    return getAvaliacaoRepository().getNotasByAvaliacao(avaliacaoId);
}

export async function lancarNotaAvaliacaoAction(avaliacaoId: string, alunoId: string, nota: number, obs?: string): Promise<NotaAvaliacao> {
    const result = await getAvaliacaoRepository().lancarNotaAvaliacao(avaliacaoId, alunoId, nota, obs);
    revalidatePath('/docente/avaliacoes');
    revalidatePath('/aluno/notas');
    return result;
}

export type { Avaliacao, NotaAvaliacao };
