"use server";

import { CieloSandboxService, CieloPaymentRequest } from "../services/CieloService";
import { getPaymentRepository } from "../repositories";
import { getUserRepository } from "../repositories";
import { getCourseById } from "./adminCourseActions";

const cieloService = new CieloSandboxService();
const STUDENT_MOCK_ID = 'student-1'; // Usando o aluno marretado no sandbox

export async function processCheckoutAction(courseId: string, formData: FormData) {
    const course = await getCourseById(courseId);
    if (!course) throw new Error("Course not found");

    const cardNumber = formData.get("cardNumber") as string;
    const holder = formData.get("holder") as string;
    const expirationDate = formData.get("expirationDate") as string;
    const securityCode = formData.get("securityCode") as string;

    // 1. Criar transação PENDING
    const transaction = await getPaymentRepository().create({
        userId: STUDENT_MOCK_ID,
        courseId: courseId,
        amount: course.price,
        status: 'PENDING'
    });

    try {
        // 2. Enviar para Cielo (mock service)
        const paymentRequest: CieloPaymentRequest = {
            merchantOrderId: transaction.id,
            amount: course.price, // price já está em centavos (ex: 19999 = R$ 199,99)
            creditCard: {
                cardNumber: cardNumber.replace(/\D/g, ''),
                holder,
                expirationDate,
                securityCode,
                brand: 'Visa' // Mocking brand para simplificar no sandbox
            }
        };

        const authResponse = await cieloService.createTransaction(paymentRequest);

        if (authResponse.status === 1) {
            // 3. Se autorizado, capturar (para o sandbox vamos fazer captura automática)
            const captureResponse = await cieloService.captureTransaction(authResponse.paymentId);

            if (captureResponse.status === 2) {
                // Atualiza repository como PAGO
                await getPaymentRepository().updateStatus(transaction.id, 'CAPTURED', captureResponse.paymentId);

                // 4. Efetivar matrícula
                await getUserRepository().enrollInCourse(STUDENT_MOCK_ID, courseId);

                return { success: true, transactionId: transaction.id };
            }
        }

        // Se chegou aqui não autorizou/capturou
        await getPaymentRepository().updateStatus(transaction.id, 'FAILED', authResponse.paymentId);
        return { success: false, error: authResponse.returnMessage || "Payment failed" };

    } catch (err: any) {
        console.error("Payment error", err);
        await getPaymentRepository().updateStatus(transaction.id, 'FAILED');
        return { success: false, error: err.message || "Unknown error processing payment" };
    }
}
