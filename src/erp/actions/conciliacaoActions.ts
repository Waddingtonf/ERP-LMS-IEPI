"use server";

import { revalidatePath } from "next/cache";
import { getConciliacaoRepository } from "@/erp/repositories";
import type { TransacaoExtrato, ItemConciliacao } from "@/erp/repositories/ConciliacaoRepository";

export async function getConciliacoesPendentes(): Promise<TransacaoExtrato[]> {
    return (await getConciliacaoRepository()).getPendentes();
}

export async function getHistoricoConciliacao(mes = 3, ano = 2026): Promise<ItemConciliacao[]> {
    return (await getConciliacaoRepository()).getHistorico(mes, ano);
}

export async function conciliarTransacaoAction(
    transacaoId: string, pagamentoId: string, userId = 'admin-1'
): Promise<ItemConciliacao> {
    const result = await (await getConciliacaoRepository()).conciliar(transacaoId, pagamentoId, userId);
    revalidatePath('/admin/conciliacao');
    return result;
}

export async function ignorarTransacaoAction(transacaoId: string): Promise<void> {
    await (await getConciliacaoRepository()).ignorar(transacaoId);
    revalidatePath('/admin/conciliacao');
}

export async function marcarDivergente(transacaoId: string, observacao: string): Promise<void> {
    await (await getConciliacaoRepository()).marcarDivergente(transacaoId, observacao);
    revalidatePath('/admin/conciliacao');
}

export async function importarExtratoAction(
    transacoes: Omit<TransacaoExtrato, 'id' | 'status' | 'pagamentoId'>[]
): Promise<{ importadas: number; duplicadas: number }> {
    const result = await (await getConciliacaoRepository()).importarExtrato(transacoes);
    revalidatePath('/admin/conciliacao');
    return result;
}

export type { TransacaoExtrato, ItemConciliacao };
