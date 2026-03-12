/**
 * LeadService — CRM pipeline operations.
 */
import { getLeadRepository } from '@/crm/repositories';
import type { LeadStatus } from '@/crm/repositories/LeadRepository';
import { AuditService } from '@/shared/services/AuditService';

export type { LeadStatus as FunilEtapa };

export interface LeadFunilResult {
    atualizados: number;
    erros: number;
}

export class LeadService {
    private audit: AuditService;

    constructor(audit?: AuditService) {
        this.audit = audit ?? new AuditService();
    }

    /** Advance multiple leads to a new funnel stage. */
    async batchAvancarFunil(ids: string[], novaEtapa: LeadStatus, actorId: string): Promise<LeadFunilResult> {
        const repo = await getLeadRepository();
        let atualizados = 0;
        let erros = 0;

        await Promise.allSettled(
            ids.map(async (id) => {
                try {
                    await repo.updateStatus(id, novaEtapa);
                    atualizados++;
                } catch {
                    erros++;
                }
            }),
        );

        await this.audit.log('BATCH_STATUS_UPDATE', {
            actorId,
            targetType: 'Lead',
            payload: { ids, novaEtapa, atualizados, erros },
        });

        return { atualizados, erros };
    }
}
