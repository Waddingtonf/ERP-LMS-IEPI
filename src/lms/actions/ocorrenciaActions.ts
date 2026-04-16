'use server';

import { revalidatePath } from 'next/cache';
import { requireAuth, getAuthContext } from '@/lib/auth/session';
import { ROLES } from '@/lib/auth/roles';
import { getOcorrenciaRepository } from '@/lms/repositories';
import { toErrorMessage } from '@/lib/errors';
import {
    criarOcorrenciaSchema,
    resolverOcorrenciaSchema,
    type CriarOcorrenciaInput,
    type OcorrenciaStatus,
} from '@/lib/schemas/ocorrencia.schemas';
import type { Ocorrencia } from '@/lms/repositories/OcorrenciaRepository';

// â”€â”€â”€ Read operations â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

/** Admin/Secretaria: lista todas as ocorrÃªncias */
export async function getOcorrenciasAdmin(): Promise<Ocorrencia[]> {
    await requireAuth(ROLES.ADMIN);
    return (await getOcorrenciaRepository()).findAll();
}

/** Admin: lista apenas as ocorrÃªncias abertas */
export async function getOcorrenciasAbertas(): Promise<Ocorrencia[]> {
    await requireAuth(ROLES.ADMIN);
    return (await getOcorrenciaRepository()).findByStatus('ABERTA');
}

/** Aluno: lista suas prÃ³prias ocorrÃªncias */
export async function getMinhasOcorrencias(): Promise<Ocorrencia[]> {
    const userId = await requireAuth();
    return (await getOcorrenciaRepository()).findByAluno(userId);
}

// â”€â”€â”€ Write operations â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

type OcorrenciaActionResult = { success: true; ocorrencia: Ocorrencia } | { success: false; error: string };

/** Qualquer usuÃ¡rio autenticado pode abrir uma ocorrÃªncia */
export async function criarOcorrencia(data: CriarOcorrenciaInput): Promise<OcorrenciaActionResult> {
    try {
        const { userId, role } = await getAuthContext();
        const parsed = criarOcorrenciaSchema.parse(data);

        const ocorrencia = await (await getOcorrenciaRepository()).create({
            ...parsed,
            criadoPorId: userId,
            criadoPorNome: role,
        });

        revalidatePath('/admin/secretaria');
        revalidatePath('/aluno/requerimentos');
        return { success: true, ocorrencia };
    } catch (err) {
        return { success: false, error: toErrorMessage(err) };
    }
}

/** Admin/Secretaria: resolve ou cancela uma ocorrÃªncia */
export async function resolverOcorrencia(
    id: string,
    resolucao: string,
    status: OcorrenciaStatus = 'RESOLVIDA'
): Promise<OcorrenciaActionResult> {
    try {
        await requireAuth(ROLES.ADMIN);
        const parsed = resolverOcorrenciaSchema.parse({ id, resolucao });
        const ocorrencia = await (await getOcorrenciaRepository()).updateStatus(parsed.id, status, parsed.resolucao);
        revalidatePath('/admin/secretaria');
        return { success: true, ocorrencia };
    } catch (err) {
        return { success: false, error: toErrorMessage(err) };
    }
}

/** Admin/Secretaria: atribui uma ocorrÃªncia para anÃ¡lise */
export async function atribuirOcorrencia(id: string, userId: string, userName: string): Promise<OcorrenciaActionResult> {
    try {
        await requireAuth(ROLES.ADMIN);
        const ocorrencia = await (await getOcorrenciaRepository()).atribuir(id, userId, userName);
        revalidatePath('/admin/secretaria');
        return { success: true, ocorrencia };
    } catch (err) {
        return { success: false, error: toErrorMessage(err) };
    }
}
