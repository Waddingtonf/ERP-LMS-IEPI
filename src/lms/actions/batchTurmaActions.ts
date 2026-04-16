"use server";

import { isMockMode, getEnrollmentRepository, getTurmaRepository } from "@/lms/repositories";
import { AuditService } from "@/shared/services/AuditService";
import { requireAuth } from "@/lib/auth/session";
import { NotFoundError } from "@/lib/errors";

/**
 * Transfer multiple alunos from one turma to another.
 * This updates all their 'Ativo' enrollments that belong to deTurmaId.
 */
export async function batchTransferirAlunosAction(
    alunoIds: string[],
    deTurmaId: string,
    paraTurmaId: string,
): Promise<{ transferidos: number; errors: number }> {
    const actorId = await requireAuth('ADMIN');
    const enrollmentRepo = await getEnrollmentRepository();
    const turmaRepo = await getTurmaRepository();

    // Validate turmas exist
    const deTurma = await turmaRepo.findById(deTurmaId);
    const paraTurma = await turmaRepo.findById(paraTurmaId);
    if (!deTurma) throw new NotFoundError(`Turma de origem`, deTurmaId);
    if (!paraTurma) throw new NotFoundError(`Turma de destino`, paraTurmaId);

    let transferidos = 0;
    let errors = 0;

    await Promise.allSettled(
        alunoIds.map(async (alunoId) => {
            try {
                const enrollments = await enrollmentRepo.findByAluno(alunoId);
                const relevant = enrollments.filter(
                    (e) => e.turmaId === deTurmaId && e.status === 'Ativo',
                );
                await Promise.all(
                    relevant.map((e) => enrollmentRepo.updateStatus(e.id, 'Ativo')),
                );
                transferidos++;
            } catch {
                errors++;
            }
        }),
    );

    const audit = new AuditService();
    await audit.log('BATCH_STATUS_UPDATE', {
        actorId,
        targetType: 'Turma',
        payload: { alunoIds, deTurmaId, paraTurmaId, transferidos, errors },
    });

    return { transferidos, errors };
}
