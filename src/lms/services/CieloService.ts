export interface CreditCard {
    cardNumber: string;
    holder: string;
    expirationDate: string; // MM/YYYY
    securityCode: string;
    brand: 'Visa' | 'Master' | 'Amex' | 'Elo' | 'Diners' | 'Discover' | 'JCB' | 'Aura';
}

export interface CieloPaymentRequest {
    merchantOrderId: string;
    amount: number; // in cents
    softDescriptor?: string;
    creditCard: CreditCard;
}

export interface CieloPaymentResponse {
    paymentId: string;
    status: number; // 1 = Authorized, 2 = Payment confirmed, etc.
    returnCode: string;
    returnMessage: string;
}

export class CieloSandboxService {
    private merchantId: string;
    private merchantKey: string;
    private apiSandboxUrl = 'https://apisandbox.cieloecommerce.cielo.com.br/1/sales/';

    constructor() {
        this.merchantId = process.env.CIELO_MERCHANT_ID || 'SANDBOX-MOCK-ID';
        this.merchantKey = process.env.CIELO_MERCHANT_KEY || 'SANDBOX-MOCK-KEY';
    }

    async createTransaction(request: CieloPaymentRequest): Promise<CieloPaymentResponse> {
        // In a real scenario, this would make an HTTP POST to this.apiSandboxUrl
        // For this sandbox repository pattern, we'll simulate a successful authorization
        // usually returning status 1 (Authorized).

        console.log(`[CIELO Sandbox] Creating transaction for Order: ${request.merchantOrderId} Amount: ${request.amount}`);

        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));

        // Validate: must contain only digits and be at least 14 chars
        const cleanCard = request.creditCard.cardNumber.trim();
        if (!cleanCard || !/^\d+$/.test(cleanCard) || cleanCard.length < 14) {
            throw new Error('Invalid Credit Card Number');
        }

        return {
            paymentId: `cielo-sandbox-id-${Math.floor(Math.random() * 1000000)}`,
            status: 1, // Authorized
            returnCode: '4',
            returnMessage: 'Operation Successful',
        };
    }

    async captureTransaction(paymentId: string): Promise<CieloPaymentResponse> {
        console.log(`[CIELO Sandbox] Capturing transaction: ${paymentId}`);

        await new Promise(resolve => setTimeout(resolve, 500));

        return {
            paymentId: paymentId,
            status: 2, // Payment Confirmed/Captured
            returnCode: '6',
            returnMessage: 'Operation Successful',
        };
    }
}
