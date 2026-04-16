// @ts-nocheck
/**
 * Signup Form Component
 */

'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { signupSchema, type SignupInput } from '@/lib/schemas'
import { signUpAction } from '@/shared/actions/auth.actions'
import { useNotificacaoStore } from '@/lib/stores/notificacao'
import Link from 'next/link'

export function SignupForm() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const { addNotificacao } = useNotificacaoStore()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupInput>({
    resolver: zodResolver(signupSchema),
  })

  const onSubmit = async (data: SignupInput) => {
    setIsLoading(true)
    try {
      const result = await signUpAction(data)

      if (result.success) {
        addNotificacao({
          type: 'success',
          title: 'Sucesso',
          message: result.message,
        })
        // Redirect to login after short delay
        setTimeout(() => {
          router.push('/auth/login')
        }, 2000)
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
        message: 'Erro ao fazer cadastro. Tente novamente.',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 w-full max-w-md">
      {/* Name Fields */}
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <label htmlFor="firstName" className="block text-sm font-medium text-slate-700">
            Nome
          </label>
          <input
            {...register('firstName')}
            id="firstName"
            placeholder="JoÃ£o"
            className="w-full px-3 py-2 border border-slate-300 rounded-md text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-sky-500 focus:border-transparent disabled:bg-slate-100"
            disabled={isLoading}
          />
          {errors.firstName && (
            <p className="text-sm text-red-500">{errors.firstName.message}</p>
          )}
        </div>

        <div className="space-y-1">
          <label htmlFor="lastName" className="block text-sm font-medium text-slate-700">
            Sobrenome
          </label>
          <input
            {...register('lastName')}
            id="lastName"
            placeholder="Silva"
            className="w-full px-3 py-2 border border-slate-300 rounded-md text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-sky-500 focus:border-transparent disabled:bg-slate-100"
            disabled={isLoading}
          />
          {errors.lastName && (
            <p className="text-sm text-red-500">{errors.lastName.message}</p>
          )}
        </div>
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

      {/* Phone */}
      <div className="space-y-1">
        <label htmlFor="phone" className="block text-sm font-medium text-slate-700">
          Telefone (Opcional)
        </label>
        <input
          {...register('phone')}
          id="phone"
          type="tel"
          placeholder="(XX) 9XXXX-XXXX"
          className="w-full px-3 py-2 border border-slate-300 rounded-md text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-sky-500 focus:border-transparent disabled:bg-slate-100"
          disabled={isLoading}
        />
        {errors.phone && (
          <p className="text-sm text-red-500">{errors.phone.message}</p>
        )}
      </div>

      {/* Password */}
      <div className="space-y-1">
        <label htmlFor="password" className="block text-sm font-medium text-slate-700">
          Senha
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

      {/* Terms */}
      <div className="flex items-start">
        <input
          {...register('agreeToTerms')}
          id="agreeToTerms"
          type="checkbox"
          className="h-4 w-4 text-sky-600 focus:ring-sky-500 border-slate-300 rounded mt-1"
          disabled={isLoading}
        />
        <label htmlFor="agreeToTerms" className="ml-2 block text-sm text-slate-700">
          Concordo com os{' '}
          <Link href="/termos" className="text-sky-500 hover:text-sky-600 underline">
            termos de serviÃ§o
          </Link>{' '}
          e{' '}
          <Link href="/privacidade" className="text-sky-500 hover:text-sky-600 underline">
            polÃ­tica de privacidade
          </Link>
        </label>
      </div>
      {errors.agreeToTerms && (
        <p className="text-sm text-red-500">{errors.agreeToTerms.message}</p>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-sky-500 text-white py-2 rounded-md hover:bg-sky-600 active:bg-sky-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {isLoading ? 'Cadastrando...' : 'Cadastrar'}
      </button>

      {/* Login Link */}
      <p className="text-center text-sm text-slate-600">
        JÃ¡ tem uma conta?{' '}
        <Link href="/auth/login" className="text-sky-500 hover:text-sky-600 underline">
          FaÃ§a login
        </Link>
      </p>
    </form>
  )
}

