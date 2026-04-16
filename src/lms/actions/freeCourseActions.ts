"use server";

import { isMockMode } from "@/lms/repositories";
import { FreeCourseService } from "@/lms/services/FreeCourseService";
import { requireAuth } from "@/lib/auth/session";

/**
 * Enroll the currently authenticated student in a free course.
 * Returns the enrollment id on success or an error message on failure.
 */
export async function enrollFreeAction(cursoId: string): Promise<{
    success: boolean;
    enrollmentId?: string;
    error?: string;
}> {
    try {
        const alunoId = await requireAuth('STUDENT');
        const service = new FreeCourseService();
        return await service.enroll(alunoId, cursoId);
    } catch (err) {
        console.error('[enrollFreeAction]', err);
        return { success: false, error: 'Ocorreu um erro ao processar a matrícula.' };
    }
}
