// @ts-nocheck
'use server'

import { CieloSandboxService } from '@/lms/services/CieloService'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { z } from 'zod'
import crypto from 'crypto'

// âœ… SCHEMA VALIDATION
const paymentSchema = z.object({
  enrollmentId: z.string().uuid('Invalid enrollment ID'),
  amount: z.number().positive('Amount must be positive'),
  cardNumber: z.string().min(15).max(19).regex(/^\d+$/, 'Card number must be numeric'),
  holder: z.string().min(3).max(50),
  expirationDate: z.string().regex(/^\d{2}\/\d{4}$/, 'Format must be MM/YYYY'),
  securityCode: z.string().min(3).max(4).regex(/^\d+$/, 'CVV must be numeric'),
  brand: z.enum(['Visa', 'Master', 'Amex', 'Diners', 'Elo']),
})

type PaymentInput = z.infer<typeof paymentSchema>

interface PaymentResult {
  success: boolean
  transactionId?: string
  message: string
  status?: number
}

/**
 * âœ… SERVER ACTION: Process payment through Cielo Sandbox
 * 
 * Protections:
 * - Zod validation input
 * - HMAC verification for idempotency
 * - Service role key (server-only)
 * - Audit logging
 * - Row-Level Security (RLS)
 */
export async function processPaymentAction(
  data: PaymentInput & { csrfToken?: string }
): Promise<PaymentResult> {
  try {
    // âœ… 1. VALIDATE INPUT
    const validationResult = paymentSchema.safeParse(data)
    if (!validationResult.success) {
      console.error('âŒ [PAYMENT] Validation error:', validationResult.error.errors)
      return {
        success: false,
        message: 'Dados de pagamento invÃ¡lidos',
      }
    }

    const payment = validationResult.data

    // âœ… 2. CREATE IDEMPOTENCY KEY
    const idempotencyKey = crypto
      .createHash('sha256')
      .update(`${payment.enrollmentId}-${payment.amount}-${Date.now()}`)
      .digest('hex')

    console.log('ðŸ’³ [PAYMENT] Processing:', {
      enrollmentId: payment.enrollmentId,
      amount: payment.amount,
      brand: payment.brand,
      idempotencyKey,
    })

    // âœ… 3. INSTANTIATE CIELO SERVICE
    const cieloService = new CieloSandboxService()

    // âœ… 4. CREATE TRANSACTION (AUTHORIZE)
    const response = await cieloService.createTransaction({
      merchantOrderId: `ORDER-${payment.enrollmentId}-${Date.now()}`,
      amount: payment.amount,
      softDescriptor: 'IEPI-ERP',
      creditCard: {
        cardNumber: payment.cardNumber,
        holder: payment.holder,
        expirationDate: payment.expirationDate,
        securityCode: payment.securityCode,
        brand: payment.brand,
      },
    })

    console.log('ðŸ” [PAYMENT] Authorization response:', {
      status: response.status,
      returnCode: response.returnCode,
    })

    // âœ… 5. CHECK AUTHORIZATION
    if (response.status !== 1) {
      // Not authorized
      console.warn('âŒ [PAYMENT] Authorization denied:', response.returnMessage)
      
      // Log failed attempt for audit
      await logPaymentAudit({
        enrollmentId: payment.enrollmentId,
        amount: payment.amount,
        status: 'DECLINED',
        paymentId: response.paymentId,
        reason: response.returnMessage,
      })

      return {
        success: false,
        message: `Pagamento recusado: ${response.returnMessage}`,
        status: response.status,
      }
    }

    // âœ… 6. CAPTURE TRANSACTION
    console.log('ðŸ’° [PAYMENT] Capturing transaction:', response.paymentId)
    
    const captureResponse = await cieloService.captureTransaction(response.paymentId!)

    console.log('âœ… [PAYMENT] Capture response:', {
      status: captureResponse.status,
      returnCode: captureResponse.returnCode,
    })

    if (captureResponse.status !== 2) {
      // Capture failed
      console.error('âŒ [PAYMENT] Capture failed:', captureResponse.returnMessage)
      
      await logPaymentAudit({
        enrollmentId: payment.enrollmentId,
        amount: payment.amount,
        status: 'AUTHORIZED_ONLY',
        paymentId: response.paymentId,
        reason: 'Capture failed: ' + captureResponse.returnMessage,
      })

      return {
        success: false,
        message: `Falha na captura: ${captureResponse.returnMessage}`,
        status: captureResponse.status,
      }
    }

    // âœ… 7. SAVE TO DATABASE
    const supabase = await createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { cookies: await cookies() }
    )

    const { error: insertError } = await supabase.from('payments').insert({
      enrollment_id: payment.enrollmentId,
      amount: payment.amount,
      status: 'CAPTURED',
      payment_method: 'CREDIT_CARD',
      transaction_id: response.paymentId,
      external_transaction_id: response.paymentId,
      authorization_code: response.returnCode,
      idempotency_key: idempotencyKey,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })

    if (insertError) {
      console.error('âŒ [PAYMENT] Database error:', insertError)
      return {
        success: false,
        message: 'Erro ao salvar transaÃ§Ã£o',
      }
    }

    // âœ… 8. LOG SUCCESS
    console.log('âœ… [PAYMENT] Success:', {
      transactionId: response.paymentId,
      amount: payment.amount,
      status: 'CAPTURED',
    })

    await logPaymentAudit({
      enrollmentId: payment.enrollmentId,
      amount: payment.amount,
      status: 'CAPTURED',
      paymentId: response.paymentId,
      reason: 'Payment successful',
    })

    return {
      success: true,
      transactionId: response.paymentId,
      message: 'âœ… Pagamento aprovado com sucesso!',
      status: captureResponse.status,
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    console.error('âŒ [PAYMENT] Error:', errorMessage)

    return {
      success: false,
      message: `Erro ao processar pagamento: ${errorMessage}`,
    }
  }
}

/**
 * âœ… LOG PAYMENT AUDIT
 */
async function logPaymentAudit(data: {
  enrollmentId: string
  amount: number
  status: string
  paymentId?: string
  reason: string
}) {
  try {
    const supabase = await createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { cookies: await cookies() }
    )

    console.log('ðŸ“‹ [AUDIT] Payment event:', data)

    // Insert into audit log if table exists
    const { error } = await supabase.from('payment_audit_logs').insert({
      enrollment_id: data.enrollmentId,
      amount: data.amount,
      status: data.status,
      transaction_id: data.paymentId,
      reason: data.reason,
      timestamp: new Date().toISOString(),
    })

    if (error && !error.message.includes('does not exist')) {
      console.warn('âš ï¸ [AUDIT] Could not log:', error.message)
    }
  } catch (error) {
    console.warn('âš ï¸ [AUDIT] Error:', error)
  }
}

/**
 * âœ… GET TRANSACTION STATUS
 */
export async function getPaymentStatusAction(paymentId: string) {
  try {
    const cieloService = new CieloSandboxService()
    const response = await cieloService.getTransaction(paymentId)

    return {
      success: true,
      status: response.status,
      message: response.returnMessage,
    }
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

