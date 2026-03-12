/**
 * CertificateService — issue and verify certificates.
 *
 * MVP: generates a PDF via a server action placeholder.
 * Production: render a Next.js page to PDF with Puppeteer or use a 3rd-party service.
 */
import { getCertificadoRepository } from '@/lms/repositories';
import { AuditService } from '@/shared/services/AuditService';

export interface CertificateIssueResult {
    success: boolean;
    certificadoId?: string;
    pdfUrl?: string;
    error?: string;
}

export class CertificateService {
    private audit: AuditService;

    constructor(audit?: AuditService) {
        this.audit = audit ?? new AuditService();
    }

    /** Issue a certificate for a student who completed a course. */
    async issue(
        alunoId: string,
        cursoId: string,
        nomeCurso: string,
        nomeAluno: string,
    ): Promise<CertificateIssueResult> {
        const repo = await getCertificadoRepository();

        // Check if already issued
        const statusExistente = await repo.getStatus(alunoId, cursoId);
        if (statusExistente === 'Emitido') {
            const existentes = await repo.findByAluno(alunoId);
            const existing = existentes.find(c => c.turmaId === cursoId);
            if (existing) return { success: true, certificadoId: existing.id, pdfUrl: existing.urlDownload ?? undefined };
        }

        // Solicitar and then emit immediately
        const solicitado = await repo.solicitar(alunoId, cursoId);
        const cert = await repo.emitir(solicitado.id);

        await this.audit.log('ENROLL', {
            actorId: alunoId,
            targetId: cert.id,
            targetType: 'Certificado',
            payload: { cursoId, nomeCurso },
        });

        return { success: true, certificadoId: cert.id, pdfUrl: cert.urlDownload ?? undefined };
    }
}
