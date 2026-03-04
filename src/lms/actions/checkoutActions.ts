"use server";

import { isMockMode } from '../repositories';
import { enrollmentService } from '../services/EnrollmentService';

async function resolveStudentId(): Promise<string> {
    if (isMockMode) return 'student-1';
    const { createClient } = await import('@/lib/supabase/server');
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Nao autenticado');
    return user.id;
}

export async function processCheckoutAction(
    courseId: string,
    formData: FormData,
    moduleId?: string,
) {
    const studentId = await resolveStudentId();
    return enrollmentService.enrollWithPayment(studentId, courseId, {
        cardNumber:     formData.get('cardNumber')     as string,
        holder:         formData.get('holder')         as string,
        expirationDate: formData.get('expirationDate') as string,
        securityCode:   formData.get('securityCode')   as string,
    }, moduleId);
}
