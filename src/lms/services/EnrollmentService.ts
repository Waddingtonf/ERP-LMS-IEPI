/**
 * EnrollmentService
 *
 * Business logic for student enrollments:
 * - Pre-requisite validation (course exists, user exists, not already enrolled)
 * - Payment processing via Cielo
 * - Enrollment activation on successful capture
 */

import { getUserRepository, getCourseRepository, getPaymentRepository } from '../repositories';
import { PaymentTransaction } from '../repositories/PaymentRepository';
import { CieloPaymentRequest, CieloSandboxService } from './CieloService';

export interface EnrollmentResult {
    success: boolean;
    transactionId?: string;
    error?: string;
}

/** Card data supplied by the checkout form */
export type CardData = {
    cardNumber: string;
    holder: string;
    expirationDate: string;
    securityCode: string;
};

export class EnrollmentService {
    private cieloService: CieloSandboxService;

    constructor(cieloService?: CieloSandboxService) {
        this.cieloService = cieloService ?? new CieloSandboxService();
    }

    /** Processes payment via Cielo and activates the enrollment on success. */
    async enrollWithPayment(
        userId: string,
        courseId: string,
        cardData: CardData,
    ): Promise<EnrollmentResult> {
        const course = await getCourseRepository().findById(courseId);
        if (!course) return { success: false, error: 'Curso não encontrado' };

        const user = await getUserRepository().findById(userId);
        if (!user) return { success: false, error: 'Usuário não encontrado' };

        if (user.enrolledCourseIds.includes(courseId)) {
            return { success: false, error: 'Aluno já está matriculado neste curso' };
        }

        const transaction = await getPaymentRepository().create({
            userId,
            courseId,
            amount: course.price,
            status: 'PENDING',
        });

        try {
            const authResp = await this.cieloService.createTransaction(
                this.buildPaymentRequest(transaction.id, course.price, cardData),
            );

            if (authResp.status !== 1) {
                await getPaymentRepository().updateStatus(transaction.id, 'FAILED', authResp.paymentId);
                return { success: false, error: authResp.returnMessage };
            }

            const captureResp = await this.cieloService.captureTransaction(authResp.paymentId);
            if (captureResp.status !== 2) {
                await getPaymentRepository().updateStatus(transaction.id, 'AUTHORIZED', authResp.paymentId);
                return { success: false, error: 'Capture failed' };
            }

            await getPaymentRepository().updateStatus(transaction.id, 'CAPTURED', captureResp.paymentId);
            await getUserRepository().enrollInCourse(userId, courseId);

            return { success: true, transactionId: transaction.id };
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : 'Erro desconhecido';
            await getPaymentRepository().updateStatus(transaction.id, 'FAILED');
            return { success: false, error: message };
        }
    }

    /** Returns all payment transactions for a given student. */
    async getStudentTransactions(userId: string): Promise<PaymentTransaction[]> {
        return getPaymentRepository().findByUserId(userId);
    }

    /** Returns true if the student is already enrolled in the given course. */
    async isEnrolled(userId: string, courseId: string): Promise<boolean> {
        const user = await getUserRepository().findById(userId);
        return user?.enrolledCourseIds.includes(courseId) ?? false;
    }

    private buildPaymentRequest(
        transactionId: string,
        amount: number,
        cardData: CardData,
    ): CieloPaymentRequest {
        return {
            merchantOrderId: transactionId,
            amount,
            creditCard: {
                cardNumber:     cardData.cardNumber.replace(/\D/g, ''),
                holder:         cardData.holder,
                expirationDate: cardData.expirationDate,
                securityCode:   cardData.securityCode,
                brand:          'Visa',
            },
        };
    }
}

export const enrollmentService = new EnrollmentService();
