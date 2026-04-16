// @ts-nocheck
/**
 * Payment Form Component
 * Suporta CartÃ£o de CrÃ©dito, PIX e Boleto
 */

'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { paymentSchema, type PaymentInput } from '@/lib/schemas'
import { initiatePaymentAction } from '@/lms/services/PaymentGatewayService'
import { useNotificacaoStore } from '@/lib/stores/notificacao'

type PaymentMethod = 'CREDIT_CARD' | 'PIX' | 'BOLETO'

interface PaymentFormProps {
  enrollmentId: string
  courseTitle: string
  coursePrice: number
  onSuccess?: (transactionId: string) => void
}

export function PaymentForm({
  enrollmentId,
  courseTitle,
  coursePrice,
  onSuccess,
}: PaymentFormProps) {
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('CREDIT_CARD')
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const { addNotificacao } = useNotificacaoStore()

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<PaymentInput>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      amount: coursePrice,
      paymentMethod: 'CREDIT_CARD',
      installments: 1,
    },
  })

  const onSubmit = async (data: PaymentInput) => {
    setIsLoading(true)
    try {
      const result = await initiatePaymentAction(
        { ...data, paymentMethod },
        enrollmentId
      )

      if (result.success) {
        setResult(result)
        addNotificacao({
          type: 'success',
          title: 'Sucesso',
          message: result.message,
        })
        onSuccess?.(result.transactionId!)
      } else {
        addNotificacao({
          type: 'error',
          title: 'Erro',
          message: result.message,
        })
      }
    } catch (error) {
      addNotificacao({
        type: 'error',
        title: 'Erro',
        message: 'Erro ao processar pagamento',
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (result?.pixQrCode) {
    return (
      <div className="space-y-4 text-center">
        <h3 className="font-semibold text-lg">QR Code PIX</h3>
        <div className="bg-white p-4 rounded-lg border border-slate-200">
          <p className="text-sm text-slate-600 mb-4">Escaneie o QR Code com seu APP de banco</p>
          {/* Em produÃ§Ã£o, renderizar imagem do QR Code */}
          <div className="w-64 h-64 bg-slate-100 rounded-lg flex items-center justify-center mx-auto">
            <p className="text-slate-500">QR Code</p>
          </div>
        </div>
        <p className="text-sm text-green-600">
          TransaÃ§Ã£o ID: {result.transactionId}
        </p>
      </div>
    )
  }

  if (result?.boletoBarcode) {
    return (
      <div className="space-y-4">
        <h3 className="font-semibold text-lg">Boleto BancÃ¡rio</h3>
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-sm font-mono text-center mb-2">{result.boletoBarcode}</p>
          <button
            onClick={() => window.print()}
            className="w-full bg-yellow-600 text-white py-2 rounded-md hover:bg-yellow-700"
          >
            Imprimir Boleto
          </button>
        </div>
        <p className="text-sm text-slate-600">
          Pague em qualquer agÃªncia bancÃ¡ria atÃ© a data de vencimento
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* MÃ©todo de Pagamento */}
      <div className="space-y-3">
        <label className="block text-sm font-medium text-slate-700">
          MÃ©todo de Pagamento
        </label>
        <div className="grid grid-cols-3 gap-3">
          {(['CREDIT_CARD', 'PIX', 'BOLETO'] as const).map((method) => (
            <button
              key={method}
              type="button"
              onClick={() => setPaymentMethod(method)}
              className={`p-4 rounded-lg border-2 transition-colors ${
                paymentMethod === method
                  ? 'border-sky-500 bg-sky-50'
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              <div className="text-sm font-medium">
                {method === 'CREDIT_CARD' && 'ðŸ’³ CartÃ£o'}
                {method === 'PIX' && 'ðŸ“± PIX'}
                {method === 'BOLETO' && 'ðŸ“„ Boleto'}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* CartÃ£o de CrÃ©dito */}
      {paymentMethod === 'CREDIT_CARD' && (
        <div className="space-y-4 p-4 bg-slate-50 rounded-lg border border-slate-200">
          <h4 className="font-medium text-slate-900">Dados do CartÃ£o</h4>

          {/* Cardholder Name */}
          <div className="space-y-1">
            <label htmlFor="cardholderName" className="block text-sm font-medium text-slate-700">
              Nome do TitulÃ¡rio
            </label>
            <input
              {...register('creditCard.cardholderName')}
              id="cardholderName"
              placeholder="JoÃ£o Silva"
              className="w-full px-3 py-2 border border-slate-300 rounded-md"
              disabled={isLoading}
            />
            {errors.creditCard?.cardholderName && (
              <p className="text-sm text-red-500">
                {errors.creditCard.cardholderName.message}
              </p>
            )}
          </div>

          {/* Card Number */}
          <div className="space-y-1">
            <label htmlFor="cardNumber" className="block text-sm font-medium text-slate-700">
              NÃºmero do CartÃ£o
            </label>
            <input
              {...register('creditCard.cardNumber')}
              id="cardNumber"
              placeholder="1234 5678 9012 3456"
              maxLength={19}
              className="w-full px-3 py-2 border border-slate-300 rounded-md font-mono"
              disabled={isLoading}
            />
            {errors.creditCard?.cardNumber && (
              <p className="text-sm text-red-500">
                {errors.creditCard.cardNumber.message}
              </p>
            )}
          </div>

          {/* Expiry & CVV */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label htmlFor="expiryMonth" className="block text-sm font-medium text-slate-700">
                MÃªs
              </label>
              <input
                {...register('creditCard.expiryMonth')}
                id="expiryMonth"
                placeholder="MM"
                maxLength={2}
                className="w-full px-3 py-2 border border-slate-300 rounded-md"
                disabled={isLoading}
              />
            </div>
            <div className="space-y-1">
              <label htmlFor="expiryYear" className="block text-sm font-medium text-slate-700">
                Ano
              </label>
              <input
                {...register('creditCard.expiryYear')}
                id="expiryYear"
                placeholder="YYYY"
                maxLength={4}
                className="w-full px-3 py-2 border border-slate-300 rounded-md"
                disabled={isLoading}
              />
            </div>
          </div>

          {/* CVV */}
          <div className="space-y-1">
            <label htmlFor="cvv" className="block text-sm font-medium text-slate-700">
              CVV
            </label>
            <input
              {...register('creditCard.cvv')}
              id="cvv"
              placeholder="123"
              maxLength={4}
              type="password"
              className="w-full px-3 py-2 border border-slate-300 rounded-md font-mono"
              disabled={isLoading}
            />
            {errors.creditCard?.cvv && (
              <p className="text-sm text-red-500">{errors.creditCard.cvv.message}</p>
            )}
          </div>
        </div>
      )}

      {/* Resumo do Pedido */}
      <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-slate-600">{courseTitle}</span>
          <span className="font-medium">R$ {coursePrice.toFixed(2)}</span>
        </div>
        <div className="border-t border-slate-200 pt-2 flex justify-between">
          <span className="font-medium">Total</span>
          <span className="font-bold text-lg text-sky-600">R$ {coursePrice.toFixed(2)}</span>
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-sky-500 text-white py-3 rounded-lg font-medium hover:bg-sky-600 active:bg-sky-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {isLoading ? 'Processando...' : `Pagar R$ ${coursePrice.toFixed(2)}`}
      </button>

      {/* Security Info */}
      <div className="text-center text-xs text-slate-500">
        <p>ðŸ”’ Sua transaÃ§Ã£o Ã© segura e criptografada</p>
      </div>
    </form>
  )
}

