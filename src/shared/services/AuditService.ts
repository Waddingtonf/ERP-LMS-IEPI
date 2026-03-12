/**
 * AuditService — structured audit log writer.
 *
 * Server-side usage only (Node runtime). The Edge middleware uses the
 * lightweight logRequestAudit() helper in src/lib/middleware/audit.ts.
 *
 * In mock mode, entries are written to an in-memory ring buffer.
 * In production, entries should be persisted to a Supabase audit_log table.
 */
export type AuditAction =
    | 'LOGIN' | 'LOGOUT'
    | 'ENROLL' | 'ENROLL_FREE' | 'UNENROLL'
    | 'PAYMENT_CREATED' | 'PAYMENT_CAPTURED' | 'PAYMENT_FAILED'
    | 'COURSE_CREATED' | 'COURSE_UPDATED' | 'COURSE_DELETED'
    | 'USER_CREATED' | 'USER_UPDATED'
    | 'BATCH_STATUS_UPDATE' | 'BATCH_NOTIFY' | 'BATCH_CONCILIAR'
    | 'CSV_IMPORT'
    | 'REQUEST'; // from middleware

export interface AuditEntry {
    id: string;
    action: AuditAction | string;
    actorId?: string;
    targetId?: string;
    targetType?: string;
    payload?: Record<string, unknown>;
    ip?: string;
    createdAt: string;
}

const MAX_IN_MEMORY = 1000;
const _buffer: AuditEntry[] = [];

export class AuditService {
    async log(
        action: AuditAction | string,
        opts: Omit<AuditEntry, 'id' | 'action' | 'createdAt'> = {},
    ): Promise<void> {
        const entry: AuditEntry = {
            id: `audit-${Date.now()}-${Math.random().toString(36).substring(7)}`,
            action,
            ...opts,
            createdAt: new Date().toISOString(),
        };

        const isMock =
            !process.env.NEXT_PUBLIC_SUPABASE_URL ||
            process.env.NEXT_PUBLIC_SUPABASE_URL.includes('dummy');

        if (isMock) {
            _buffer.push(entry);
            if (_buffer.length > MAX_IN_MEMORY) _buffer.shift();
            return;
        }

        // Production: insert into Supabase audit_log table
        // TODO: implement SupabaseAuditRepository and call it here
        console.info('[AUDIT]', JSON.stringify(entry));
    }

    /** Read recent audit entries (mock mode only). */
    recent(limit = 50): AuditEntry[] {
        return _buffer.slice(-limit).reverse();
    }
}
