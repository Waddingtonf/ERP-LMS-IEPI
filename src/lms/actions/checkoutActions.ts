"use server";

import { enrollmentService } from "../services/EnrollmentService";

/** Sandbox only. In production derive this from the authenticated session. */
const SANDBOX_STUDENT_ID = 'student-1';

export async function processCheckoutAction(courseId: string, formData: FormData) {
    return enrollmentService.enrollWithPayment(SANDBOX_STUDENT_ID, courseId, {
        cardNumber:     formData.get('cardNumber')     as string,
        holder:         formData.get('holder')         as string,
        expirationDate: formData.get('expirationDate') as string,
        securityCode:   formData.get('securityCode')   as string,
    });
}
