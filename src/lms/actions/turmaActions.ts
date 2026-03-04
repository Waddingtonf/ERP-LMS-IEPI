"use server";

import { revalidatePath } from "next/cache";
import { getTurmaRepository, getFrequenciaRepository } from "@/lms/repositories";
import { Aula, Turma } from "@/lms/repositories/TurmaRepository";

export async function getTurmas(): Promise<Turma[]> {
    return getTurmaRepository().findAll();
}

export async function getTurmasByInstructor(instructorId: string): Promise<Turma[]> {
    return getTurmaRepository().findByInstructor(instructorId);
}

export async function getTurmaById(id: string): Promise<Turma | null> {
    return getTurmaRepository().findById(id);
}

export async function createTurmaAction(formData: FormData) {
    const turma = await getTurmaRepository().create({
        courseId:       formData.get('courseId')       as string,
        courseName:     formData.get('courseName')     as string,
        code:           formData.get('code')           as string,
        instructorId:   formData.get('instructorId')   as string,
        instructorName: formData.get('instructorName') as string,
        startDate:      formData.get('startDate')      as string,
        endDate:        formData.get('endDate')        as string,
        schedule:       formData.get('schedule')       as string,
        location:       formData.get('location')       as string,
        maxStudents:    Number(formData.get('maxStudents') ?? 30),
        status:         'Planejada',
    });
    revalidatePath('/admin/turmas');
    revalidatePath('/docente/turmas');
    return turma;
}

export async function updateTurmaAction(id: string, data: Partial<Omit<Turma, 'id'>>) {
    const updated = await getTurmaRepository().update(id, data);
    revalidatePath('/admin/turmas');
    revalidatePath('/docente/turmas');
    return updated;
}

export async function getAulasByTurma(turmaId: string): Promise<Aula[]> {
    return getTurmaRepository().getAulas(turmaId);
}

export async function createAulaAction(formData: FormData) {
    const aula = await getTurmaRepository().createAula({
        turmaId:         formData.get('turmaId')      as string,
        moduleId:        formData.get('moduleId')     as string | null,
        moduleName:      formData.get('moduleName')   as string | null,
        title:           formData.get('title')        as string,
        date:            formData.get('date')         as string,
        startTime:       formData.get('startTime')    as string,
        durationMinutes: Number(formData.get('durationMinutes') ?? 60),
        status:          'Agendada',
    });
    revalidatePath('/docente');
    revalidatePath('/docente/turmas');
    return aula;
}

export async function marcarAulaRealizadaAction(aulaId: string) {
    await getTurmaRepository().updateAula(aulaId, { status: 'Realizada' });
    revalidatePath('/docente');
}
