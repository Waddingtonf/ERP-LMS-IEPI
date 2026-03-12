/**
 * FinanceiroService — financial reconciliation & reporting helpers.
 *
 * Provides business logic on top of ERP repositories.
 */
import { getConciliacaoRepository, getBolsaRepository } from '@/erp/repositories';
import { AuditService } from '@/shared/services/AuditService';

export interface ConciliacaoResult {
    conciliadas: number;
    erros: number;
}

export class FinanceiroService {
    private audit: AuditService;

    constructor(audit?: AuditService) {
        this.audit = audit ?? new AuditService();
    }

    /** Bulk-conciliate a set of transacao ids (self-matched). */
    async batchConciliar(ids: string[], actorId: string): Promise<ConciliacaoResult> {
        const repo = await getConciliacaoRepository();
        let conciliadas = 0;
        let erros = 0;

        await Promise.allSettled(
            ids.map(async (id) => {
                try {
                    await repo.conciliar(id, id, actorId);
                    conciliadas++;
                } catch {
                    erros++;
                }
            }),
        );

        await this.audit.log('BATCH_CONCILIAR', {
            actorId,
            payload: { ids, conciliadas, erros },
        });

        return { conciliadas, erros };
    }

    /** Batch-mark a set of bolsas as paid. */
    async batchMarcarBolsaPaga(ids: string[], actorId: string): Promise<{ atualizadas: number }> {
        const repo = await getBolsaRepository();
        let atualizadas = 0;

        await Promise.allSettled(
            ids.map(async (id) => {
                try {
                    await repo.update(id, { status: 'Encerrada' as const });
                    atualizadas++;
                } catch {
                    // swallow individual errors
                }
            }),
        );

        await this.audit.log('BATCH_STATUS_UPDATE', {
            actorId,
            targetType: 'Bolsa',
            payload: { ids, atualizadas },
        });

        return { atualizadas };
    }
}
