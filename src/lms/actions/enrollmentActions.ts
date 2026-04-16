"use server";

import { revalidatePath } from "next/cache";
import { getEnrollmentRepository } from "@/lms/repositories";
import { Enrollment, EnrollmentStatus } from "@/lms/repositories/EnrollmentRepository";

export async function getEnrollments(): Promise<Enrollment[]> {
    return (await getEnrollmentRepository()).findAll();
}

export async function getEnrollmentsByAluno(alunoId: string): Promise<Enrollment[]> {
    return (await getEnrollmentRepository()).findByAluno(alunoId);
}

export async function getEnrollmentsByTurma(turmaId: string): Promise<Enrollment[]> {
    return (await getEnrollmentRepository()).findByTurma(turmaId);
}

export async function getEnrollmentsByCourse(courseId: string): Promise<Enrollment[]> {
    return (await getEnrollmentRepository()).findByCourse(courseId);
}

export async function updateEnrollmentStatusAction(id: string, status: EnrollmentStatus) {
    const updated = await (await getEnrollmentRepository()).updateStatus(id, status);
    revalidatePath('/admin/alunos');
    revalidatePath('/admin/turmas');
    revalidatePath('/pedagogico');
    return updated;
}
