// @ts-nocheck
'use client'

import { processPaymentAction } from '@/shared/actions/payments.actions'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'
import { useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

// âœ… PAYMENT FORM SCHEMA
const paymentFormSchema = z.object({
  cardNumber: z
    .string()
    .min(15, 'âŒ MÃ­nimo 15 dÃ­gitos')
    .max(19, 'âŒ MÃ¡ximo 19 dÃ­gitos')
    .regex(/^\d+$/, 'âŒ Apenas nÃºmeros'),
  holder: z
    .string()
    .min(3, 'âŒ MÃ­nimo 3 caracteres')
    .max(50, 'âŒ MÃ¡ximo 50 caracteres'),
  expirationDate: z
    .string()
    .regex(/^\d{2}\/\d{4}$/, 'âŒ Formato: MM/YYYY'),
  securityCode: z
    .string()
    .min(3, 'âŒ MÃ­nimo 3 dÃ­gitos')
    .max(4, 'âŒ MÃ¡ximo 4 dÃ­gitos')
    .regex(/^\d+$/, 'âŒ Apenas nÃºmeros'),
  brand: z.enum(['Visa', 'Master', 'Amex', 'Diners', 'Elo'], {
    errorMap: () => ({ message: 'âŒ Selecione uma bandeira' }),
  }),
})

type PaymentFormData = z.infer<typeof paymentFormSchema>

interface PaymentFormProps {
  enrollmentId: string
  amount: number
  onSuccess?: (transactionId: string) => void
}

/**
 * âœ… PAYMENT FORM COMPONENT
 * 
 * Features:
 * - Real-time card validation
 * - Brand auto-detection
 * - Server action integration
 * - Toast notifications
 * - Optimistic UI
 */
export function PaymentForm({ enrollmentId, amount, onSuccess }: PaymentFormProps) {
  const [isPending, startTransition] = useTransition()
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<PaymentFormData>({
    resolver: zodResolver(paymentFormSchema),
  })

  const cardNumber = watch('cardNumber')

  // âœ… AUTO-DETECT CARD BRAND
  const detectBrand = (cardNum: string) => {
    cardNum = cardNum.replace(/\s/g, '')
    
    if (/^4/.test(cardNum)) {
      setValue('brand', 'Visa')
    } else if (/^5[1-5]/.test(cardNum)) {
      setValue('brand', 'Master')
    } else if (/^3[47]/.test(cardNum)) {
      setValue('brand', 'Amex')
    } else if (/^3(?:0[0-5]|[68])/.test(cardNum)) {
      setValue('brand', 'Diners')
    } else if (/^4011|^431|^438|^451|^457|^5/.test(cardNum)) {
      setValue('brand', 'Elo')
    }
  }

  // âœ… FORMAT CARD NUMBER
  const formatCardNumber = (value: string) => {
    const cleaned = value.replace(/\D/g, '').slice(0, 19)
    detectBrand(cleaned)
    return cleaned
  }

  // âœ… FORMAT EXPIRATION DATE
  const formatExpirationDate = (value: string) => {
    const cleaned = value.replace(/\D/g, '').slice(0, 4)
    if (cleaned.length >= 2) {
      return `${cleaned.slice(0, 2)}/${cleaned.slice(2)}`
    }
    return cleaned
  }

  // âœ… HANDLE SUBMIT
  const onSubmit = async (data: PaymentFormData) => {
    startTransition(async () => {
      try {
        toast.loading('ðŸ’³ Processando pagamento...')

        const result = await processPaymentAction({
          enrollmentId,
          amount,
          ...data,
        })

        if (result.success) {
          toast.dismiss()
          toast.success('âœ… Pagamento aprovado com sucesso!')
          if (onSuccess && result.transactionId) {
            onSuccess(result.transactionId)
          }
        } else {
          toast.dismiss()
          toast.error(`âŒ ${result.message}`)
        }
      } catch (error) {
        toast.dismiss()
        toast.error(`âŒ Erro: ${error instanceof Error ? error.message : 'Unknown error'}`)
      }
    })
  }

  // âœ… TEST CREDENTIALS BANNER
  const testCredentials = [
    {
      brand: 'ðŸ”µ Visa',
      number: '4111111111111111',
      expires: '12/2025',
      cvv: '123',
    },
    {
      brand: 'ðŸ”´ Mastercard',
      number: '5555555555554444',
      expires: '12/2025',
      cvv: '123',
    },
  ]

  return (
    <div className="space-y-6">
      {/* âœ… TEST CREDENTIALS */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-semibold text-blue-900 mb-2">ðŸ§ª CartÃµes de Teste (Sandbox)</h3>
        <div className="space-y-2 text-sm text-blue-800">
          {testCredentials.map((cred, idx) => (
            <div key={idx} className="font-mono bg-white p-2 rounded">
              <div>{cred.brand}</div>
              <div>NÃºmero: {cred.number}</div>
              <div>Validade: {cred.expires}</div>
              <div>CVV: {cred.cvv}</div>
            </div>
          ))}
        </div>
      </div>

      {/* âœ… AMOUNT SUMMARY */}
      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Valor a pagar:</span>
          <span className="text-2xl font-bold text-gray-900">
            R$ {(amount / 100).toFixed(2)}
          </span>
        </div>
      </div>

      {/* âœ… PAYMENT FORM */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Card Number */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            NÃºmero do CartÃ£o
          </label>
          <input
            type="text"
            placeholder="4111111111111111"
            inputMode="numeric"
            {...register('cardNumber', {
              onChange: (e) => {
                e.target.value = formatCardNumber(e.target.value)
              },
            })}
            className={`w-full px-3 py-2 border rounded-lg font-mono ${
              errors.cardNumber ? 'border-red-500' : 'border-gray-300'
            } focus:outline-none focus:ring-2 focus:ring-blue-500`}
            disabled={isPending}
          />
          {errors.cardNumber && (
            <p className="text-red-600 text-sm mt-1">{errors.cardNumber.message}</p>
          )}
        </div>

        {/* Holder Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Titular do CartÃ£o
          </label>
          <input
            type="text"
            placeholder="NOME DO TITULAR"
            {...register('holder')}
            className={`w-full px-3 py-2 border rounded-lg uppercase ${
              errors.holder ? 'border-red-500' : 'border-gray-300'
            } focus:outline-none focus:ring-2 focus:ring-blue-500`}
            disabled={isPending}
          />
          {errors.holder && (
            <p className="text-red-600 text-sm mt-1">{errors.holder.message}</p>
          )}
        </div>

        {/* Expiration & CVV */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Validade
            </label>
            <input
              type="text"
              placeholder="MM/YYYY"
              inputMode="numeric"
              {...register('expirationDate', {
                onChange: (e) => {
                  e.target.value = formatExpirationDate(e.target.value)
                },
              })}
              className={`w-full px-3 py-2 border rounded-lg font-mono ${
                errors.expirationDate ? 'border-red-500' : 'border-gray-300'
              } focus:outline-none focus:ring-2 focus:ring-blue-500`}
              disabled={isPending}
            />
            {errors.expirationDate && (
              <p className="text-red-600 text-sm mt-1">{errors.expirationDate.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              CVV
            </label>
            <input
              type="text"
              placeholder="123"
              inputMode="numeric"
              {...register('securityCode', {
                onChange: (e) => {
                  e.target.value = e.target.value.replace(/\D/g, '').slice(0, 4)
                },
              })}
              className={`w-full px-3 py-2 border rounded-lg font-mono ${
                errors.securityCode ? 'border-red-500' : 'border-gray-300'
              } focus:outline-none focus:ring-2 focus:ring-blue-500`}
              disabled={isPending}
              maxLength={4}
            />
            {errors.securityCode && (
              <p className="text-red-600 text-sm mt-1">{errors.securityCode.message}</p>
            )}
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isPending}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
        >
          {isPending && <Loader2 className="w-4 h-4 animate-spin" />}
          {isPending ? 'Processando...' : `ðŸ’³ Pagar R$ ${(amount / 100).toFixed(2)}`}
        </button>
      </form>

      {/* âœ… SECURITY INFO */}
      <div className="text-xs text-gray-600 text-center space-y-1">
        <p>ðŸ”’ Pagamento seguro via Cielo Sandbox</p>
        <p>ðŸ§ª Ambiente de testes - dados de teste apenas</p>
      </div>
    </div>
  )
}

