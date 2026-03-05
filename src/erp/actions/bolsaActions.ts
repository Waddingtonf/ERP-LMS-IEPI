"use server";

import { revalidatePath } from "next/cache";
import { getBolsaRepository } from "@/erp/repositories";
import type { Bolsa, BolsaAluno } from "@/erp/repositories/BolsaRepository";

export async function getBolsas(): Promise<Bolsa[]> {
    return getBolsaRepository().findAll();
}

export async function getBolsaById(id: string): Promise<Bolsa | null> {
    return getBolsaRepository().findById(id);
}

export async function getBolsaByAluno(alunoId: string): Promise<BolsaAluno[]> {
    return getBolsaRepository().findByAluno(alunoId);
}

export async function criarBolsaAction(formData: FormData): Promise<Bolsa> {
    const bolsa = await getBolsaRepository().create({
        nome:               formData.get('nome')               as string,
        tipo:               formData.get('tipo')               as Bolsa['tipo'],
        percentualDesconto: Number(formData.get('percentualDesconto') ?? 0),
        valorMaximo:        formData.get('valorMaximo') ? Number(formData.get('valorMaximo')) : null,
        descricao:          formData.get('descricao')          as string ?? '',
        requisitos:         formData.get('requisitos')         as string ?? '',
        status:             'Ativa',
        vagasTotal:         Number(formData.get('vagasTotal') ?? 999),
        dataInicio:         formData.get('dataInicio')         as string,
        dataFim:            formData.get('dataFim')            as string | null,
        cursoIds:           [],
    });
    revalidatePath('/financeiro/bolsas');
    return bolsa;
}

export async function aplicarBolsaAction(
    bolsaId: string, alunoId: string, turmaId: string, valorOriginal: number, aprovadoPor: string
): Promise<BolsaAluno> {
    const result = await getBolsaRepository().aplicar(bolsaId, alunoId, turmaId, valorOriginal, aprovadoPor);
    revalidatePath('/financeiro/bolsas');
    revalidatePath('/admin/alunos');
    return result;
}

export async function revogarBolsaAction(bolsaAlunoId: string, motivo: string): Promise<void> {
    await getBolsaRepository().revogar(bolsaAlunoId, motivo);
    revalidatePath('/financeiro/bolsas');
}

export type { Bolsa, BolsaAluno };
