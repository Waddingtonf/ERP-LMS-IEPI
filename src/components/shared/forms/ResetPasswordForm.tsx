// @ts-nocheck
/**
 * Forgot Password Form Component
 */

'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { forgotPasswordSchema, type ForgotPasswordInput } from '@/lib/schemas'
import { forgotPasswordAction } from '@/shared/actions/auth.actions'
import { useNotificacaoStore } from '@/lib/stores/notificacao'
import Link from 'next/link'

export function ForgotPasswordForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const { addNotificacao } = useNotificacaoStore()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
  })

  const onSubmit = async (data: ForgotPasswordInput) => {
    setIsLoading(true)
    try {
      const result = await forgotPasswordAction(data)

      if (result.success) {
        addNotificacao({
          type: 'success',
          title: 'Sucesso',
          message: result.message,
        })
        setIsSubmitted(true)
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
        message: 'Erro ao solicitar recuperaÃ§Ã£o de senha. Tente novamente.',
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (isSubmitted) {
    return (
      <div className="w-full max-w-md text-center space-y-4">
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <p className="text-green-800">
            Verifique seu email para instruÃ§Ãµes de recuperaÃ§Ã£o de senha.
          </p>
        </div>
        <Link href="/auth/login" className="text-sky-500 hover:text-sky-600 underline">
          Voltar para login
        </Link>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 w-full max-w-md">
      <div className="space-y-2">
        <p className="text-sm text-slate-600">
          Digite seu email para receber instruÃ§Ãµes de recuperaÃ§Ã£o de senha.
        </p>
      </div>

      {/* Email */}
      <div className="space-y-1">
        <label htmlFor="email" className="block text-sm font-medium text-slate-700">
          Email
        </label>
        <input
          {...register('email')}
          id="email"
          type="email"
          placeholder="seu@email.com"
          className="w-full px-3 py-2 border border-slate-300 rounded-md text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-sky-500 focus:border-transparent disabled:bg-slate-100"
          disabled={isLoading}
        />
        {errors.email && (
          <p className="text-sm text-red-500">{errors.email.message}</p>
        )}
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-sky-500 text-white py-2 rounded-md hover:bg-sky-600 active:bg-sky-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {isLoading ? 'Enviando...' : 'Enviar Link de RecuperaÃ§Ã£o'}
      </button>

      {/* Back to Login */}
      <p className="text-center text-sm">
        <Link href="/auth/login" className="text-sky-500 hover:text-sky-600 underline">
          Voltar para login
        </Link>
      </p>
    </form>
  )
}

