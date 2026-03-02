export interface CreditCard {
    cardNumber: string;
    holder: string;
    /** Format: MM/YYYY */
    expirationDate: string;
    securityCode: string;
    brand: 'Visa' | 'Master' | 'Amex' | 'Elo' | 'Diners' | 'Discover' | 'JCB' | 'Aura';
}

export interface CieloPaymentRequest {
    merchantOrderId: string;
    /** Amount in cents (e.g. 19999 = R$ 199,99) */
    amount: number;
    softDescriptor?: string;
    creditCard: CreditCard;
}

export interface CieloPaymentResponse {
    paymentId: string;
    /** 1 = Authorized · 2 = Captured · 3+ = Declined/Error */
    status: number;
    returnCode: string;
    returnMessage: string;
}

/** Minimum digits required by Cielo for a valid card number */
const MIN_CARD_NUMBER_LENGTH = 14;

/**
 * Sandbox implementation of the Cielo payment gateway.
 * In production replace with a real HTTP client against the Cielo REST API.
 */
export class CieloSandboxService {
    async createTransaction(request: CieloPaymentRequest): Promise<CieloPaymentResponse> {
        await this.simulateNetworkDelay();
        this.validateCardNumber(request.creditCard.cardNumber);

        return {
            paymentId: `cielo-sandbox-id-${Math.floor(Math.random() * 1_000_000)}`,
            status: 1,
            returnCode: '4',
            returnMessage: 'Operation Successful',
        };
    }

    async captureTransaction(paymentId: string): Promise<CieloPaymentResponse> {
        await this.simulateNetworkDelay();

        return {
            paymentId,
            status: 2,
            returnCode: '6',
            returnMessage: 'Operation Successful',
        };
    }

    private validateCardNumber(cardNumber: string): void {
        const digits = cardNumber.trim();
        if (!digits || !/^\d+$/.test(digits) || digits.length < MIN_CARD_NUMBER_LENGTH) {
            throw new Error('Invalid Credit Card Number');
        }
    }

    private simulateNetworkDelay(): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, 500));
    }
}
