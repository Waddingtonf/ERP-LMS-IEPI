"use server";

import { isMockMode, getLeadRepository } from "@/crm/repositories";
import { AuditService } from "@/shared/services/AuditService";
import type { LeadStatus } from "@/crm/repositories/LeadRepository";

async function resolveActorId(): Promise<string> {
    if (isMockMode) return 'admin-crm-1';
    const { createClient } = await import('@/lib/supabase/server');
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Não autenticado');
    return user.id;
}

/**
 * Advance multiple leads to a new funnel stage.
 */
export async function batchAvancarFunilAction(
    leadIds: string[],
    novaEtapa: LeadStatus,
    observacao?: string,
): Promise<{ atualizados: number; errors: number }> {
    const actorId = await resolveActorId();
    const repo = await getLeadRepository();

    let atualizados = 0;
    let errors = 0;

    await Promise.allSettled(
        leadIds.map(async (id) => {
            try {
                await repo.updateStatus(id, novaEtapa, observacao);
                atualizados++;
            } catch {
                errors++;
            }
        }),
    );

    const audit = new AuditService();
    await audit.log('BATCH_STATUS_UPDATE', {
        actorId,
        targetType: 'Lead',
        payload: { leadIds, novaEtapa, atualizados, errors },
    });

    return { atualizados, errors };
}

/**
 * Batch-convert leads to enrolled students.
 */
export async function batchConverterLeadsAction(
    leadIds: string[],
): Promise<{ convertidos: number; errors: number; alunoIds: string[] }> {
    const actorId = await resolveActorId();
    const repo = await getLeadRepository();

    const alunoIds: string[] = [];
    let convertidos = 0;
    let errors = 0;

    await Promise.allSettled(
        leadIds.map(async (id) => {
            try {
                const result = await repo.converter(id);
                alunoIds.push(result.alunoId);
                convertidos++;
            } catch {
                errors++;
            }
        }),
    );

    const audit = new AuditService();
    await audit.log('BATCH_STATUS_UPDATE', {
        actorId,
        targetType: 'Lead',
        payload: { leadIds, action: 'converter', convertidos, errors, alunoIds },
    });

    return { convertidos, errors, alunoIds };
}
