"use server";

import { revalidatePath } from "next/cache";
import { getLeadRepository } from "@/crm/repositories";
import type { Lead, LeadStatus, LeadOrigem, MetricasFunil } from "@/crm/repositories/LeadRepository";

export async function getLeads(filtros?: { status?: LeadStatus; origem?: LeadOrigem }): Promise<Lead[]> {
    return getLeadRepository().findAll(filtros);
}

export async function getLeadsByFunil(): Promise<Record<LeadStatus, Lead[]>> {
    return getLeadRepository().findByFunil();
}

export async function getLeadById(id: string): Promise<Lead | null> {
    return getLeadRepository().findById(id);
}

export async function getMetricasFunil(): Promise<MetricasFunil> {
    return getLeadRepository().getMetricasFunil();
}

export async function createLeadAction(formData: FormData): Promise<Lead> {
    const lead = await getLeadRepository().create({
        nome:           formData.get('nome')           as string,
        email:          formData.get('email')          as string,
        telefone:       formData.get('telefone')       as string,
        cursoInteresse: formData.get('cursoInteresse') as string,
        cursoId:        formData.get('cursoId')        as string | null,
        origem:         (formData.get('origem') as LeadOrigem) ?? 'Site',
        status:         'Novo',
        observacoes:    formData.get('observacoes')    as string ?? '',
        responsavelId:  null,
        responsavelNome: null,
        ultimoContato:  null,
        proximoContato: null,
        utmSource:      formData.get('utmSource')      as string | null,
        utmCampaign:    formData.get('utmCampaign')    as string | null,
    });
    revalidatePath('/admin/crm');
    revalidatePath('/admin/crm/leads');
    return lead;
}

export async function updateLeadStatusAction(id: string, status: LeadStatus, obs?: string): Promise<Lead> {
    const lead = await getLeadRepository().updateStatus(id, status, obs);
    revalidatePath('/admin/crm');
    revalidatePath('/admin/crm/leads');
    return lead;
}

export async function converterLeadAction(leadId: string): Promise<{ alunoId: string }> {
    const result = await getLeadRepository().converter(leadId);
    revalidatePath('/admin/crm');
    revalidatePath('/admin/alunos');
    return result;
}

export async function updateLeadAction(id: string, data: Partial<Omit<Lead, 'id' | 'criadoEm'>>): Promise<Lead> {
    const lead = await getLeadRepository().update(id, data);
    revalidatePath('/admin/crm/leads');
    return lead;
}

export type { Lead, LeadStatus, LeadOrigem, MetricasFunil };
