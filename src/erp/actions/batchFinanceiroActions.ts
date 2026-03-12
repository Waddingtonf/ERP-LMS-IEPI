"use server";

import { isMockMode, getConciliacaoRepository } from "@/erp/repositories";
import { AuditService } from "@/shared/services/AuditService";

async function resolveActorId(): Promise<string> {
    if (isMockMode) return 'admin-financeiro-1';
    const { createClient } = await import('@/lib/supabase/server');
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Não autenticado');
    return user.id;
}

/**
 * Batch-reconcile a set of transacao IDs against their matched pagamento IDs.
 * Each entry in the pairs array maps a transacaoId → pagamentoId.
 */
export async function batchConciliarAction(
    pairs: Array<{ transacaoId: string; pagamentoId: string }>,
): Promise<{ conciliadas: number; errors: number }> {
    const actorId = await resolveActorId();
    const repo = await getConciliacaoRepository();

    let conciliadas = 0;
    let errors = 0;

    await Promise.allSettled(
        pairs.map(async ({ transacaoId, pagamentoId }) => {
            try {
                await repo.conciliar(transacaoId, pagamentoId, actorId);
                conciliadas++;
            } catch {
                errors++;
            }
        }),
    );

    const audit = new AuditService();
    await audit.log('BATCH_CONCILIAR', {
        actorId,
        targetType: 'Conciliacao',
        payload: { pairs: pairs.map(p => p.transacaoId), conciliadas, errors },
    });

    return { conciliadas, errors };
}

/**
 * Batch-ignore a set of transacao IDs (mark as Ignorado).
 */
export async function batchIgnorarAction(
    transacaoIds: string[],
): Promise<{ ignoradas: number; errors: number }> {
    const actorId = await resolveActorId();
    const repo = await getConciliacaoRepository();

    let ignoradas = 0;
    let errors = 0;

    await Promise.allSettled(
        transacaoIds.map(async (id) => {
            try {
                await repo.ignorar(id);
                ignoradas++;
            } catch {
                errors++;
            }
        }),
    );

    const audit = new AuditService();
    await audit.log('BATCH_STATUS_UPDATE', {
        actorId,
        targetType: 'Conciliacao',
        payload: { transacaoIds, action: 'ignorar', ignoradas, errors },
    });

    return { ignoradas, errors };
}
