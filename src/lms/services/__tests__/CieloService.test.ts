import { CieloSandboxService, CieloPaymentRequest } from '../CieloService';

describe('CieloSandboxService', () => {
    let cieloService: CieloSandboxService;

    beforeEach(() => {
        cieloService = new CieloSandboxService();
    });

    it('should authorize a valid credit card transaction', async () => {
        const request: CieloPaymentRequest = {
            merchantOrderId: 'order-123',
            amount: 19999, // R$ 199.99
            creditCard: {
                cardNumber: '4111111111111111',
                holder: 'TEST BUYER',
                expirationDate: '12/2030',
                securityCode: '123',
                brand: 'Visa'
            }
        };

        const response = await cieloService.createTransaction(request);

        expect(response.status).toBe(1); // 1 = Authorized
        expect(response.paymentId).toContain('cielo-sandbox-id');
        expect(response.returnCode).toBe('4');
    });

    it('should reject an invalid credit card number', async () => {
        const request: CieloPaymentRequest = {
            merchantOrderId: 'order-123',
            amount: 19999,
            creditCard: {
                cardNumber: '123', // Invalid length
                holder: 'TEST BUYER',
                expirationDate: '12/2030',
                securityCode: '123',
                brand: 'Visa'
            }
        };

        await expect(cieloService.createTransaction(request)).rejects.toThrow('Invalid Credit Card Number');
    });

    it('should capture an authorized transaction', async () => {
        const paymentId = 'test-payment-id-999';
        const response = await cieloService.captureTransaction(paymentId);

        expect(response.status).toBe(2); // 2 = Captured
        expect(response.paymentId).toBe(paymentId);
    });
});
