"use server";

import { isMockMode } from '../repositories';
import { enrollmentService } from '../services/EnrollmentService';

import { requireAuth } from "@/lib/auth/session";

export async function processCheckoutAction(
    courseId: string,
    formData: FormData,
    moduleId?: string,
) {
    const studentId = await requireAuth('STUDENT');
    return enrollmentService.enrollWithPayment(studentId, courseId, {
        cardNumber: formData.get('cardNumber') as string,
        holder: formData.get('holder') as string,
        expirationDate: formData.get('expirationDate') as string,
        securityCode: formData.get('securityCode') as string,
    }, moduleId);
}
