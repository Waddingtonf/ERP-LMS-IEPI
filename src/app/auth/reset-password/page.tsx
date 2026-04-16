// @ts-nocheck
/**
 * Reset Password Page
 * Accessed via email link with token
 */

'use client'

import { useState } from 'react'
import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { resetPasswordSchema, type ResetPasswordInput } from '@/lib/schemas'
import { resetPasswordAction } from '@/shared/actions/auth.actions'
import { useNotificacaoStore } from '@/lib/stores/notificacao'
import Link from 'next/link'

function ResetPasswordContent() {
  const searchParams = useSearchParams()
  const token = searchParams.get('token')
  
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const { addNotificacao } = useNotificacaoStore()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordInput>({
    resolver: zodResolver(resetPasswordSchema),
  })

  const onSubmit = async (data: ResetPasswordInput) => {
    if (!token) {
      addNotificacao({
        type: 'error',
        title: 'Erro',
        message: 'Link invÃ¡lido. Por favor, solicite uma nova recuperaÃ§Ã£o de senha.',
      })
      return
    }

    setIsLoading(true)
    try {
      const result = await resetPasswordAction(data, token)

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
        message: 'Erro ao resetar senha. Tente novamente.',
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (!token) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-slate-100 flex items-center justify-center px-4 sm:px-6">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-lg shadow-md p-8 border border-slate-200">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-800 text-center">
                Link invÃ¡lido. Por favor, solicite uma nova{' '}
                <Link href="/auth/forgot-password" className="underline font-medium">
                  recuperaÃ§Ã£o de senha
                </Link>
                .
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-slate-100 flex items-center justify-center px-4 sm:px-6">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Sucesso</h1>
          </div>

          <div className="bg-white rounded-lg shadow-md p-8 border border-slate-200 text-center space-y-4">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-green-800">
                Sua senha foi alterada com sucesso! VocÃª serÃ¡ redirecionado para o login.
              </p>
            </div>
            <Link
              href="/auth/login"
              className="inline-block bg-sky-500 text-white py-2 px-4 rounded-md hover:bg-sky-600 transition-colors"
            >
              Ir para Login
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-slate-100 flex items-center justify-center px-4 sm:px-6">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Redefinir Senha</h1>
          <p className="text-slate-600">Escolha uma nova senha para sua conta</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-lg shadow-md p-8 border border-slate-200">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Password */}
            <div className="space-y-1">
              <label htmlFor="password" className="block text-sm font-medium text-slate-700">
                Nova Senha
              </label>
              <input
                {...register('password')}
                id="password"
                type="password"
                placeholder="â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢"
                className="w-full px-3 py-2 border border-slate-300 rounded-md text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-sky-500 focus:border-transparent disabled:bg-slate-100"
                disabled={isLoading}
              />
              {errors.password && (
                <p className="text-sm text-red-500">{errors.password.message}</p>
              )}
            </div>

            {/* Confirm Password */}
            <div className="space-y-1">
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-700">
                Confirmar Senha
              </label>
              <input
                {...register('confirmPassword')}
                id="confirmPassword"
                type="password"
                placeholder="â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢"
                className="w-full px-3 py-2 border border-slate-300 rounded-md text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-sky-500 focus:border-transparent disabled:bg-slate-100"
                disabled={isLoading}
              />
              {errors.confirmPassword && (
                <p className="text-sm text-red-500">{errors.confirmPassword.message}</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-sky-500 text-white py-2 rounded-md hover:bg-sky-600 active:bg-sky-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? 'Atualizando...' : 'Atualizar Senha'}
            </button>
          </form>
        </div>

        {/* Footer */}
        <div className="text-center mt-6 text-sm text-slate-600">
          <p>Â© 2026 IEPI - Instituto de EducaÃ§Ã£o. Todos os direitos reservados.</p>
        </div>
      </div>
    </div>
  )
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-50" />}>
      <ResetPasswordContent />
    </Suspense>
  )
}

