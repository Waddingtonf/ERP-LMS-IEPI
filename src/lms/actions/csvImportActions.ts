"use server";

import { CsvImportService, ImportResult } from "@/shared/services/CsvImportService";
import { AuditService } from "@/shared/services/AuditService";
import { requireAuth } from "@/lib/auth/session";

export async function importAlunosCsvAction(
    csvText: string,
): Promise<ImportResult> {
    const actorId = await requireAuth('ADMIN');
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
