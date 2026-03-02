/**
 * EnrollmentService
 *
 * Encapsula toda a lógica de negócio relacionada a matrículas:
 * - Verificação de pré-requisitos
 * - Criação de matrícula após pagamento capturado
 * - Cancelamento de matrícula
 * - Consulta de status do aluno em um curso
 */

import { getUserRepository, getCourseRepository, getPaymentRepository } from '../repositories';
import { PaymentTransaction } from '../repositories/PaymentRepository';
import { CieloSandboxService } from './CieloService';

export interface EnrollmentResult {
    success: boolean;
    transactionId?: string;
    error?: string;
}

export class EnrollmentService {
    private cieloService: CieloSandboxService;

    constructor(cieloService?: CieloSandboxService) {
        this.cieloService = cieloService ?? new CieloSandboxService();
    }

    /**
     * Processa o pagamento via Cielo e efetiva a matrícula em caso de sucesso.
     */
    async enrollWithPayment(
        userId: string,
        courseId: string,
        cardData: {
            cardNumber: string;
            holder: string;
            expirationDate: string;
            securityCode: string;
        }
    ): Promise<EnrollmentResult> {
        const course = await getCourseRepository().findById(courseId);
        if (!course) return { success: false, error: 'Curso não encontrado' };

        const user = await getUserRepository().findById(userId);
        if (!user) return { success: false, error: 'Usuário não encontrado' };

        // Verificar se já está matriculado
        if (user.enrolledCourseIds.includes(courseId)) {
            return { success: false, error: 'Aluno já está matriculado neste curso' };
        }

        // Criar transação PENDING
        const transaction = await getPaymentRepository().create({
            userId,
            courseId,
            amount: course.price,
            status: 'PENDING',
        });

        try {
            // Autorizar via Cielo
            const authResp = await this.cieloService.createTransaction({
                merchantOrderId: transaction.id,
                amount: course.price,
                creditCard: {
                    cardNumber: cardData.cardNumber.replace(/\D/g, ''),
                    holder: cardData.holder,
                    expirationDate: cardData.expirationDate,
                    securityCode: cardData.securityCode,
                    brand: 'Visa',
                },
            });

            if (authResp.status !== 1) {
                await getPaymentRepository().updateStatus(transaction.id, 'FAILED', authResp.paymentId);
                return { success: false, error: authResp.returnMessage };
            }

            // Capturar
            const captureResp = await this.cieloService.captureTransaction(authResp.paymentId);
            if (captureResp.status !== 2) {
                await getPaymentRepository().updateStatus(transaction.id, 'AUTHORIZED', authResp.paymentId);
                return { success: false, error: 'Capture failed' };
            }

            // Efetivar matrícula
            await getPaymentRepository().updateStatus(transaction.id, 'CAPTURED', captureResp.paymentId);
            await getUserRepository().enrollInCourse(userId, courseId);

            return { success: true, transactionId: transaction.id };
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : 'Erro desconhecido';
            await getPaymentRepository().updateStatus(transaction.id, 'FAILED');
            return { success: false, error: message };
        }
    }

    /**
     * Retorna as transações de pagamento de um aluno.
     */
    async getStudentTransactions(userId: string): Promise<PaymentTransaction[]> {
        return getPaymentRepository().findByUserId(userId);
    }

    /**
     * Verifica se um aluno está matriculado em um curso.
     */
    async isEnrolled(userId: string, courseId: string): Promise<boolean> {
        const user = await getUserRepository().findById(userId);
        return user?.enrolledCourseIds.includes(courseId) ?? false;
    }
}

// Singleton
export const enrollmentService = new EnrollmentService();
