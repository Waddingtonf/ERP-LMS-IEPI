"use server";

import { revalidatePath } from "next/cache";
import { getCampanhaRepository } from "@/crm/repositories";
import type { Campanha, MetricasCampanha, CampanhaStatus } from "@/crm/repositories/CampanhaRepository";

export async function getCampanhas(status?: CampanhaStatus): Promise<Campanha[]> {
    return (await getCampanhaRepository()).findAll(status);
}

export async function getCampanhaById(id: string): Promise<Campanha | null> {
    return (await getCampanhaRepository()).findById(id);
}

export async function getMetricasCampanha(campanhaId: string): Promise<MetricasCampanha> {
    return (await getCampanhaRepository()).getMetricas(campanhaId);
}

export async function criarCampanhaAction(formData: FormData): Promise<Campanha> {
    const campanha = await (await getCampanhaRepository()).create({
        nome:        formData.get('nome')        as string,
        tipo:        formData.get('tipo')        as Campanha['tipo'],
        status:      'Rascunho',
        objetivo:    formData.get('objetivo')    as string,
        cursoAlvo:   formData.get('cursoAlvo')   as string | null,
        orcamento:   Number(formData.get('orcamento') ?? 0),
        dataInicio:  formData.get('dataInicio')  as string,
        dataFim:     formData.get('dataFim')     as string | null,
        criadoPor:   formData.get('criadoPor')   as string ?? 'Admin',
        descricao:   formData.get('descricao')   as string ?? '',
        publicoAlvo: formData.get('publicoAlvo') as string ?? '',
    });
    revalidatePath('/admin/crm/campanhas');
    return campanha;
}

export async function ativarCampanhaAction(id: string): Promise<Campanha> {
    const camp = await (await getCampanhaRepository()).update(id, { status: 'Ativa' });
    revalidatePath('/admin/crm/campanhas');
    return camp;
}

export async function encerrarCampanhaAction(id: string): Promise<void> {
    await (await getCampanhaRepository()).encerrar(id);
    revalidatePath('/admin/crm/campanhas');
}

export async function getCampanhasComMetricas(): Promise<(Campanha & { metricas: MetricasCampanha })[]> {
    const repo = await getCampanhaRepository();
    const campanhas = await repo.findAll();
    return Promise.all(
        campanhas.map(async c => ({
            ...c,
            metricas: await repo.getMetricas(c.id),
        }))
    );
}

export type { Campanha, MetricasCampanha, CampanhaStatus };
