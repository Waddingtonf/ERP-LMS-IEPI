"use server";

import { isMockMode, getEnrollmentRepository } from "@/lms/repositories";
import { getMensagemRepository } from "@/shared/repositories";
import { NotificationService } from "@/shared/services/NotificationService";
import { AuditService } from "@/shared/services/AuditService";
import type { EnrollmentStatus } from "@/lms/repositories/EnrollmentRepository";

async function resolveActorId(): Promise<string> {
    if (isMockMode) return 'admin-1';
    const { createClient } = await import('@/lib/supabase/server');
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Não autenticado');
    return user.id;
}

/**
 * Batch-update the status of multiple enrollments.
 */
export async function batchUpdateStatusAction(
    enrollmentIds: string[],
    status: EnrollmentStatus,
): Promise<{ updated: number; errors: number }> {
    const actorId = await resolveActorId();
    const repo = getEnrollmentRepository();

    let updated = 0;
    let errors = 0;

    await Promise.allSettled(
        enrollmentIds.map(async (id) => {
            try {
                await repo.updateStatus(id, status);
                updated++;
            } catch {
                errors++;
            }
        }),
    );

    const audit = new AuditService();
    await audit.log('BATCH_STATUS_UPDATE', {
        actorId,
        targetType: 'Enrollment',
        payload: { enrollmentIds, status, updated, errors },
    });

    return { updated, errors };
}

/**
 * Send a bulk notification to a list of aluno user IDs.
 */
export async function batchNotifyAction(
    alunoIds: string[],
    titulo: string,
    mensagem: string,
): Promise<{ sent: number; errors: number }> {
    const actorId = await resolveActorId();
    const notif = new NotificationService();

    let sent = 0;
    let errors = 0;

    await Promise.allSettled(
        alunoIds.map(async (uid) => {
            try {
                await notif.notify({ usuarioId: uid, titulo, mensagem, tipo: 'info' });
                sent++;
            } catch {
                errors++;
            }
        }),
    );

    const audit = new AuditService();
    await audit.log('BATCH_NOTIFY', {
        actorId,
        targetType: 'Aluno',
        payload: { alunoIds, titulo, sent, errors },
    });

    // Also store the mensagem for inbox
    if (isMockMode) {
        const mensagemRepo = await getMensagemRepository();
        await Promise.allSettled(
            alunoIds.map((uid) =>
                mensagemRepo.enviar({
                    remetenteId:        actorId,
                    remetenteNome:      'Administração',
                    remetentePerfil:    'Admin',
                    destinatarioId:     uid,
                    destinatarioNome:   '',
                    destinatarioPerfil: 'Aluno',
                    assunto:            titulo,
                    corpo:              mensagem,
                    categoria:          'Aviso',
                    parentId:           null,
                    cc:                 [],
                    prioridade:         'Normal',
                }),
            ),
        );
    }

    return { sent, errors };
}
