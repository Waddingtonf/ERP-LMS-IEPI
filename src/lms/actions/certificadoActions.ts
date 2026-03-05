"use server";

import { getCertificadoRepository, isMockMode } from "@/lms/repositories";
import type { Certificado, CertificadoStatus } from "@/lms/repositories/CertificadoRepository";

async function resolveStudentId(): Promise<string> {
    if (isMockMode) return 'student-1';
    const { createClient } = await import('@/lib/supabase/server');
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Não autenticado');
    return user.id;
}

export async function getCertificadosAluno(): Promise<Certificado[]> {
    const alunoId = await resolveStudentId();
    return getCertificadoRepository().findByAluno(alunoId);
}

export async function verificarElegibilidade(turmaId: string): Promise<{ elegivel: boolean; motivo: string | null }> {
    const alunoId = await resolveStudentId();
    return getCertificadoRepository().verificarElegibilidade(alunoId, turmaId);
}

export async function solicitarCertificado(turmaId: string): Promise<Certificado> {
    const alunoId = await resolveStudentId();
    return getCertificadoRepository().solicitar(alunoId, turmaId);
}

export async function getStatusCertificado(turmaId: string): Promise<CertificadoStatus | null> {
    const alunoId = await resolveStudentId();
    return getCertificadoRepository().getStatus(alunoId, turmaId);
}

/** Admin: emite certificado manualmente */
export async function emitirCertificado(id: string): Promise<Certificado> {
    return getCertificadoRepository().emitir(id);
}

export type { Certificado, CertificadoStatus };
