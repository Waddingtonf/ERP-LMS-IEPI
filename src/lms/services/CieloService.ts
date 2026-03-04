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

const CIELO_SANDBOX_URL       = 'https://apisandbox.cieloecommerce.cielo.com.br';
const CIELO_SANDBOX_QUERY_URL = 'https://apiquerysandbox.cieloecommerce.cielo.com.br';
const CIELO_PROD_URL          = 'https://api.cieloecommerce.cielo.com.br';
const CIELO_PROD_QUERY_URL    = 'https://apiquery.cieloecommerce.cielo.com.br';

/** Minimum digits required by Cielo for a valid card number */
const MIN_CARD_NUMBER_LENGTH = 14;

/**
 * Cielo eCommerce REST v3 implementation.
 * Reads credentials from environment variables:
 *   CIELO_MERCHANT_ID  — MerchantId (UUID)
 *   CIELO_MERCHANT_KEY — MerchantKey (32 chars)
 *   CIELO_ENVIRONMENT  — 'sandbox' (default) | 'production'
 *
 * URL map:
 *   Transacional  sandbox  → https://apisandbox.cieloecommerce.cielo.com.br
 *   Consultas     sandbox  → https://apiquerysandbox.cieloecommerce.cielo.com.br
 *   Transacional  prod     → https://api.cieloecommerce.cielo.com.br
 *   Consultas     prod     → https://apiquery.cieloecommerce.cielo.com.br
 */
export class CieloSandboxService {
    private readonly merchantId:  string;
    private readonly merchantKey: string;
    private readonly baseUrl:     string;
    private readonly queryUrl:    string;

    constructor() {
        this.merchantId  = process.env.CIELO_MERCHANT_ID  ?? '';
        this.merchantKey = process.env.CIELO_MERCHANT_KEY ?? '';
        const isProd     = process.env.CIELO_ENVIRONMENT === 'production';
        this.baseUrl     = isProd ? CIELO_PROD_URL       : CIELO_SANDBOX_URL;
        this.queryUrl    = isProd ? CIELO_PROD_QUERY_URL : CIELO_SANDBOX_QUERY_URL;
    }

    async createTransaction(request: CieloPaymentRequest): Promise<CieloPaymentResponse> {
        this.validateCardNumber(request.creditCard.cardNumber);

        const body = {
            MerchantOrderId: request.merchantOrderId,
            Customer: { Name: request.creditCard.holder },
            Payment: {
                Type:            'CreditCard',
                Amount:          request.amount,
                Installments:    1,
                SoftDescriptor:  request.softDescriptor ?? 'IEPI',
                Capture:         false,
                CreditCard: {
                    CardNumber:     request.creditCard.cardNumber,
                    Holder:         request.creditCard.holder,
                    ExpirationDate: request.creditCard.expirationDate,
                    SecurityCode:   request.creditCard.securityCode,
                    Brand:          request.creditCard.brand,
                },
            },
        };

        const res = await fetch(`${this.baseUrl}/1/sales/`, {
            method:  'POST',
            headers: this.headers(),
            body:    JSON.stringify(body),
        });

        if (!res.ok) {
            const text = await res.text();
            throw new Error(`Cielo API error ${res.status}: ${text}`);
        }

        const data = await res.json() as { Payment: {
            PaymentId: string; Status: number;
            ReturnCode: string; ReturnMessage: string;
        } };

        return {
            paymentId:     data.Payment.PaymentId,
            status:        data.Payment.Status,
            returnCode:    data.Payment.ReturnCode,
            returnMessage: data.Payment.ReturnMessage,
        };
    }

    async captureTransaction(paymentId: string): Promise<CieloPaymentResponse> {
        const res = await fetch(`${this.baseUrl}/1/sales/${paymentId}/capture`, {
            method:  'PUT',
            headers: this.headers(),
        });

        if (!res.ok) {
            const text = await res.text();
            throw new Error(`Cielo API error ${res.status}: ${text}`);
        }

        const data = await res.json() as {
            Status: number; ReturnCode: string; ReturnMessage: string;
        };

        return {
            paymentId,
            status:        data.Status,
            returnCode:    data.ReturnCode,
            returnMessage: data.ReturnMessage,
        };
    }

    /**
     * Consulta uma venda pelo PaymentId.
     * Usa a URL de consultas: apiquerysandbox / apiquery (prod).
     */
    async getTransaction(paymentId: string): Promise<CieloPaymentResponse> {
        const res = await fetch(`${this.queryUrl}/1/sales/${paymentId}`, {
            method:  'GET',
            headers: this.headers(),
        });

        if (!res.ok) {
            const text = await res.text();
            throw new Error(`Cielo API error ${res.status}: ${text}`);
        }

        const data = await res.json() as { Payment: {
            PaymentId: string; Status: number;
            ReturnCode: string; ReturnMessage: string;
        } };

        return {
            paymentId:     data.Payment.PaymentId,
            status:        data.Payment.Status,
            returnCode:    data.Payment.ReturnCode,
            returnMessage: data.Payment.ReturnMessage,
        };
    }

    // ── private ─────────────────────────────────────────────────────────────

    private headers(): Record<string, string> {
        return {
            'Content-Type': 'application/json',
            'MerchantId':   this.merchantId,
            'MerchantKey':  this.merchantKey,
        };
    }

    private validateCardNumber(cardNumber: string): void {
        const digits = cardNumber.trim();
        if (!digits || !/^\d+$/.test(digits) || digits.length < MIN_CARD_NUMBER_LENGTH) {
            throw new Error('Invalid Credit Card Number');
        }
    }
}
