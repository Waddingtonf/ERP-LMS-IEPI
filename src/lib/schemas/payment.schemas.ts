// @ts-nocheck
/**
 * Payment Validation Schemas
 * Credit card, PIX, Boleto, transactions
 */

import { z } from 'zod';
import { sharedSchemas } from './shared.schemas';

// Credit Card validation
const cardNumberRegex = /^\d{13,19}$/;
export const creditCardSchema = z.object({
  cardNumber: z
    .string()
    .regex(cardNumberRegex, 'NÃºmero do cartÃ£o invÃ¡lido')
    .refine((cardNumber) => {
      // Luhn algorithm
      const digits = cardNumber.replace(/\D/g, '');
      let sum = 0;
      let isEven = false;
      
      for (let i = digits.length - 1; i >= 0; i--) {
        let digit = parseInt(digits[i], 10);
        if (isEven) {
          digit *= 2;
          if (digit > 9) {
            digit -= 9;
          }
        }
        sum += digit;
        isEven = !isEven;
      }
      return sum % 10 === 0;
    }, 'NÃºmero do cartÃ£o invÃ¡lido'),
  
  cardholderName: z
    .string()
    .min(3, 'Nome do titulÃ¡rio deve ter no mÃ­nimo 3 caracteres')
    .max(50)
    .regex(/^[a-zA-Z\s]+$/, 'Nome deve conter apenas letras'),
  
  expiryMonth: z
    .string()
    .length(2)
    .regex(/^0[1-9]|1[0-2]$/, 'MÃªs deve estar entre 01 e 12'),
  
  expiryYear: z
    .string()
    .length(4)
    .regex(/^\d{4}$/, 'Ano invÃ¡lido')
    .refine((year) => {
      const currentYear = new Date().getFullYear();
      return parseInt(year) >= currentYear;
    }, 'CartÃ£o expirado'),
  
  cvv: z
    .union([
      z.string().regex(/^\d{3}$/, 'CVV deve ter 3 dÃ­gitos'),
      z.string().regex(/^\d{4}$/, 'CVV deve ter 4 dÃ­gitos (American Express)'),
    ]),

  brand: z.enum(['VISA', 'MASTERCARD', 'AMEX', 'ELO', 'DINERS', 'DISCOVER']).optional(),
});

export type CreditCardInput = z.infer<typeof creditCardSchema>;

// PIX validation
export const pixSchema = z.object({
  pixKey: z
    .string()
    .min(1, 'Chave PIX Ã© obrigatÃ³ria')
    .refine(
      (key) => {
        // PIX key can be: email, phone, CPF, CNPJ, or random
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const phoneRegex = /^\+?[1-9]\d{1,14}$/;
        const cpfCnpjRegex = /^\d{11}(\d{2})?$/;
        const randomRegex = /^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/;
        
        return (
          emailRegex.test(key) ||
          phoneRegex.test(key) ||
          cpfCnpjRegex.test(key) ||
          randomRegex.test(key)
        );
      },
      'Chave PIX invÃ¡lida'
    ),
  
  bankCode: z.string().optional(),
  accountType: z.enum(['CHECKING', 'SAVINGS']).optional(),
});

export type PIXInput = z.infer<typeof pixSchema>;

// Boleto validation
export const boletoSchema = z.object({
  bankCode: z.string().length(3, 'CÃ³digo do banco deve ter 3 dÃ­gitos'),
  accountNumber: z.string().min(1, 'NÃºmero da conta Ã© obrigatÃ³rio'),
  accountDigit: z.string().optional(),
  agencyNumber: z.string().min(1, 'AgÃªncia Ã© obrigatÃ³ria'),
});

export type BoletoInput = z.infer<typeof boletoSchema>;

// General payment schema
export const paymentSchema = z.object({
  amount: sharedSchemas.currency,
  description: z.string().min(1, 'DescriÃ§Ã£o Ã© obrigatÃ³ria').max(100),
  paymentMethod: z.enum(['CREDIT_CARD', 'PIX', 'BOLETO']),
  
  // Conditional validation for each method
  creditCard: creditCardSchema.optional(),
  pix: pixSchema.optional(),
  boleto: boletoSchema.optional(),
  
  // Customer info
  customerEmail: z.string().email(),
  customerPhone: z.string().optional(),
  
  // Installments
  installments: z.number().min(1).max(12).optional().default(1),
  
  // Billing address
  billingAddress: z.object({
    street: z.string().min(1),
    number: z.string().min(1),
    complement: z.string().optional(),
    neighborhood: z.string().min(1),
    city: z.string().min(1),
    state: z.string().length(2),
    zipCode: z.string().regex(/^\d{5}-\d{3}$/),
  }).optional(),
});

export type PaymentInput = z.infer<typeof paymentSchema>;

// Transaction response schema
export const transactionSchema = z.object({
  id: z.string().uuid(),
  amount: sharedSchemas.currency,
  status: z.enum(['PENDING', 'AUTHORIZED', 'CAPTURED', 'DECLINED', 'REFUNDED', 'CANCELED']),
  paymentMethod: z.enum(['CREDIT_CARD', 'PIX', 'BOLETO']),
  createdAt: z.date(),
  updatedAt: z.date(),
  transactionId: z.string().optional(),
  authorizationCode: z.string().optional(),
  errorMessage: z.string().optional(),
});

export type Transaction = z.infer<typeof transactionSchema>;

// Refund schema
export const refundSchema = z.object({
  transactionId: z.string().uuid(),
  amount: sharedSchemas.currency.optional(),
  reason: z.string().min(1).max(200),
});

export type RefundInput = z.infer<typeof refundSchema>;

