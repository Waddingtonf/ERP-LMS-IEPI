"use server";

import { revalidatePath } from "next/cache";
import { getCalendarioRepository } from "@/lms/repositories";
import type { EventoCalendario } from "@/lms/repositories/CalendarioRepository";

export async function getCalendarioAcademico(): Promise<EventoCalendario[]> {
    return getCalendarioRepository().findAll();
}

export async function getEventosByTurma(turmaId: string): Promise<EventoCalendario[]> {
    return getCalendarioRepository().findByTurma(turmaId);
}

export async function getEventosByMes(ano: number, mes: number): Promise<EventoCalendario[]> {
    return getCalendarioRepository().findByMes(ano, mes);
}

export async function criarEventoAction(formData: FormData): Promise<EventoCalendario> {
    const evento = await getCalendarioRepository().create({
        titulo:      formData.get('titulo')      as string,
        descricao:   formData.get('descricao')   as string ?? '',
        tipo:        formData.get('tipo')        as EventoCalendario['tipo'],
        dataInicio:  formData.get('dataInicio')  as string,
        dataFim:     formData.get('dataFim')     as string,
        horaInicio:  formData.get('horaInicio')  as string | null,
        horaFim:     formData.get('horaFim')     as string | null,
        turmaId:     formData.get('turmaId')     as string | null,
        turmaNome:   formData.get('turmaNome')   as string | null,
        local:       formData.get('local')       as string | null,
        cor:         formData.get('cor')         as string ?? '#3B82F6',
        allDay:      formData.get('allDay') === 'true',
        criadoPor:   formData.get('criadoPor')   as string ?? 'Admin',
    });
    revalidatePath('/admin/calendario');
    revalidatePath('/aluno/calendario');
    revalidatePath('/docente');
    return evento;
}

export async function deleteEventoAction(id: string): Promise<void> {
    await getCalendarioRepository().delete(id);
    revalidatePath('/admin/calendario');
    revalidatePath('/aluno/calendario');
}
