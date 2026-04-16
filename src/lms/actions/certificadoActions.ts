"use server";

import { getCertificadoRepository, isMockMode } from "@/lms/repositories";
import type { Certificado, CertificadoStatus } from "@/lms/repositories/CertificadoRepository";

import { requireAuth } from "@/lib/auth/session";

export async function getCertificadosAluno(): Promise<Certificado[]> {
    const alunoId = await requireAuth('STUDENT');
    return getCertificadoRepository().findByAluno(alunoId);
}

export async function verificarElegibilidade(turmaId: string): Promise<{ elegivel: boolean; motivo: string | null }> {
    const alunoId = await requireAuth('STUDENT');
    return getCertificadoRepository().verificarElegibilidade(alunoId, turmaId);
}

export async function solicitarCertificado(turmaId: string): Promise<Certificado> {
    const alunoId = await requireAuth('STUDENT');
    return getCertificadoRepository().solicitar(alunoId, turmaId);
}

export async function getStatusCertificado(turmaId: string): Promise<CertificadoStatus | null> {
    const alunoId = await requireAuth('STUDENT');
    return getCertificadoRepository().getStatus(alunoId, turmaId);
}

/** Admin: emite certificado manualmente */
export async function emitirCertificado(id: string): Promise<Certificado> {
    return getCertificadoRepository().emitir(id);
}
