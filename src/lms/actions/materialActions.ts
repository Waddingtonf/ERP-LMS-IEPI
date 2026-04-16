"use server";

import { revalidatePath } from "next/cache";
import { getMaterialRepository, isMockMode } from "@/lms/repositories";
import type { Material, MaterialTipo } from "@/lms/repositories/MaterialRepository";

async function resolveUserId(): Promise<string> {
    if (isMockMode) return 'docente-1';
    const { createClient } = await import('@/lib/supabase/server');
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    return user?.id ?? 'docente-1';
}

export async function getMaterialByTurma(turmaId: string): Promise<Material[]> {
    return getMaterialRepository().findByTurma(turmaId);
}

export async function getMaterialByTipo(turmaId: string, tipo: MaterialTipo): Promise<Material[]> {
    return getMaterialRepository().findByTipo(turmaId, tipo);
}

export async function getMaterialById(id: string): Promise<Material | null> {
    return getMaterialRepository().findById(id);
}

export async function uploadMaterialAction(formData: FormData): Promise<Material> {
    const userId = await resolveUserId();
    const material = await getMaterialRepository().create({
        turmaId:    formData.get('turmaId')    as string,
        turmaNome:  formData.get('turmaNome')  as string,
        titulo:     formData.get('titulo')     as string,
        descricao:  formData.get('descricao')  as string ?? '',
        tipo:       formData.get('tipo')       as MaterialTipo,
        url:        formData.get('url')        as string,
        tamanhoKb:  Number(formData.get('tamanhoKb') ?? 0) || null,
        uploadedBy: userId,
        uploadedAt: new Date().toISOString().split('T')[0],
        disponivel: true,
        ordem:      Number(formData.get('ordem') ?? 99),
    });
    revalidatePath('/docente/materiais');
    revalidatePath('/aluno/materiais');
    return material;
}

export async function toggleDisponibilidade(id: string, disponivel: boolean): Promise<Material> {
    const mat = await getMaterialRepository().update(id, { disponivel });
    revalidatePath('/docente/materiais');
    revalidatePath('/aluno/materiais');
    return mat;
}

export async function toggleDisponibilidadeAction(id: string, disponivel: boolean): Promise<void> {
    await getMaterialRepository().update(id, { disponivel });
    revalidatePath('/docente/materiais');
    revalidatePath('/aluno/materiais');
}

export async function deleteMaterialAction(id: string): Promise<void> {
    await getMaterialRepository().delete(id);
    revalidatePath('/docente/materiais');
    revalidatePath('/aluno/materiais');
}

export async function reordenarMateriais(turmaId: string, ids: string[]): Promise<void> {
    await getMaterialRepository().reordenar(turmaId, ids);
    revalidatePath('/docente/materiais');
}
