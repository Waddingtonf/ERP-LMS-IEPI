"use server";

import { revalidatePath } from "next/cache";
import { getEnrollmentRepository } from "@/lms/repositories";
import { Enrollment, EnrollmentStatus } from "@/lms/repositories/EnrollmentRepository";

export async function getEnrollments(): Promise<Enrollment[]> {
    return getEnrollmentRepository().findAll();
}

export async function getEnrollmentsByAluno(alunoId: string): Promise<Enrollment[]> {
    return getEnrollmentRepository().findByAluno(alunoId);
}

export async function getEnrollmentsByTurma(turmaId: string): Promise<Enrollment[]> {
    return getEnrollmentRepository().findByTurma(turmaId);
}

export async function getEnrollmentsByCourse(courseId: string): Promise<Enrollment[]> {
    return getEnrollmentRepository().findByCourse(courseId);
}

export async function updateEnrollmentStatusAction(id: string, status: EnrollmentStatus) {
    const updated = await getEnrollmentRepository().updateStatus(id, status);
    revalidatePath('/admin/alunos');
    revalidatePath('/admin/turmas');
    revalidatePath('/pedagogico');
    return updated;
}
