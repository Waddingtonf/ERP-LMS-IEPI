"use server";

import { CsvImportService, ImportResult } from "@/shared/services/CsvImportService";
import { AuditService } from "@/shared/services/AuditService";
import { isMockMode } from "@/lms/repositories";

async function resolveActorId(): Promise<string> {
    if (isMockMode) return 'admin-1';
    const { createClient } = await import('@/lib/supabase/server');
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Não autenticado');
    return user.id;
}

export async function importAlunosCsvAction(
    csvText: string,
): Promise<ImportResult> {
    const actorId = await resolveActorId();
    const service = new CsvImportService();
    const result = await service.importAlunos(csvText);

    const audit = new AuditService();
    await audit.log('CSV_IMPORT', {
        actorId,
        targetType: 'Aluno',
        payload: {
            importados: result.importados,
            total: result.total,
            erros: result.erros.length,
        },
    });

    return result;
}
