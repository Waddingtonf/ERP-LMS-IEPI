/**
 * EnrollmentService
 *
 * Business logic for student enrollments:
 * - Pre-requisite validation (course exists, user exists, not already enrolled)
 * - Payment processing via Cielo
 * - Enrollment activation on successful capture
 * - Modular enrollment: buy single module or full bundle
 */

import { getUserRepository, getCourseRepository, getPaymentRepository, getEnrollmentRepository } from '../repositories';
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

    /**
     * Processes payment via Cielo and activates the enrollment on success.
     * @param moduleId â€” when provided, enroll only in that module (modular graduation)
     */
    async enrollWithPayment(
        userId: string,
        courseId: string,
        cardData: CardData,
        moduleId?: string,
    ): Promise<EnrollmentResult> {
        const courseRepo     = await getCourseRepository();
        const userRepo       = await getUserRepository();
        const paymentRepo    = await getPaymentRepository();
        const enrollmentRepo = await getEnrollmentRepository();

        const course = await courseRepo.findById(courseId);
        if (!course) return { success: false, error: 'Curso nao encontrado' };

        const user = await userRepo.findById(userId);
        if (!user) return { success: false, error: 'UsuÃ¡rio nÃ£o encontrado' };

        // Check duplicate enrollment
        const alreadyEnrolled = await enrollmentRepo.isEnrolled(userId, courseId, moduleId);
        if (alreadyEnrolled) {
            return { success: false, error: moduleId ? 'Aluno ja possui este modulo' : 'Aluno ja esta matriculado neste curso' };
        }

        // Resolve amount and names
        let amount: number;
        let moduleName: string | null = null;
        if (moduleId) {
            const mod = course.modules.find(m => m.id === moduleId);
            if (!mod) return { success: false, error: 'Modulo nao encontrado' };
            if (!mod.isSellableStandalone) return { success: false, error: 'Este modulo nao pode ser comprado separadamente' };
            amount = mod.price;
            moduleName = mod.title;
        } else {
            amount = course.bundlePrice ?? course.price;
        }

        const transaction = await paymentRepo.create({ userId, courseId, amount, status: 'PENDING' });

        try {
            const authResp = await this.cieloService.createTransaction(
                this.buildPaymentRequest(transaction.id, amount, cardData),
            );

            if (authResp.status !== 1) {
                await paymentRepo.updateStatus(transaction.id, 'FAILED', authResp.paymentId);
                return { success: false, error: authResp.returnMessage };
            }

            const captureResp = await this.cieloService.captureTransaction(authResp.paymentId);
            if (captureResp.status !== 2) {
                await paymentRepo.updateStatus(transaction.id, 'AUTHORIZED', authResp.paymentId);
                return { success: false, error: 'Capture failed' };
            }

            await paymentRepo.updateStatus(transaction.id, 'CAPTURED', captureResp.paymentId);

            // Create enrollment record
            await enrollmentRepo.create({
                alunoId: userId,
                alunoName: user.name,
                alunoEmail: user.email,
                courseId,
                courseName: course.title,
                moduleId: moduleId ?? null,
                moduleName,
                turmaId: null,
                paymentTransactionId: transaction.id,
                status: 'Ativo',
                amountPaid: amount,
                dataMatricula: new Date().toISOString().split('T')[0],
            });

            // Legacy: update enrolled_course_ids on user
            await userRepo.enrollInCourse(userId, courseId);

            return { success: true, transactionId: transaction.id };
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : 'Erro desconhecido';
            await paymentRepo.updateStatus(transaction.id, 'FAILED');
            return { success: false, error: message };
        }
    }

    /** Returns all payment transactions for a given student. */
    async getStudentTransactions(userId: string): Promise<PaymentTransaction[]> {
        return (await getPaymentRepository()).findByUserId(userId);
    }

    /** Returns true if the student is already enrolled in the given course. */
    async isEnrolled(userId: string, courseId: string): Promise<boolean> {
        const user = await (await getUserRepository()).findById(userId);
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
