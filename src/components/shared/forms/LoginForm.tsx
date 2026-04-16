// @ts-nocheck
/**
 * Login Form Component
 */

'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { loginSchema, type LoginInput } from '@/lib/schemas'
import { loginAction } from '@/shared/actions/auth.actions'
import { useNotificacaoStore } from '@/lib/stores/notificacao'
import Link from 'next/link'

export function LoginForm() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const { addNotificacao } = useNotificacaoStore()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema) as any,
    defaultValues: {
      rememberMe: false,
    },
  })

  const onSubmit = async (data: LoginInput) => {
    setIsLoading(true)
    try {
      const result = await loginAction(data)

      if (result.success) {
        addNotificacao({
          type: 'success',
          title: 'Sucesso',
          message: result.message,
        })
        // Redirect based on role
        router.push(result.redirectPath || '/aluno')
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
        message: 'Erro ao fazer login. Tente novamente.',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit as any)} className="space-y-4 w-full max-w-md">
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

      {/* Remember Me */}
      <div className="flex items-center">
        <input
          {...register('rememberMe')}
          id="rememberMe"
          type="checkbox"
          className="h-4 w-4 text-sky-600 focus:ring-sky-500 border-slate-300 rounded"
          disabled={isLoading}
        />
        <label htmlFor="rememberMe" className="ml-2 block text-sm text-slate-700">
          Lembrar login
        </label>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-sky-500 text-white py-2 rounded-md hover:bg-sky-600 active:bg-sky-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {isLoading ? 'Entrando...' : 'Entrar'}
      </button>

      {/* Links */}
      <div className="flex flex-col gap-2 text-center text-sm">
        <Link
          href="/auth/forgot-password"
          className="text-sky-500 hover:text-sky-600 underline"
        >
          Esqueceu a senha?
        </Link>
        <div className="text-slate-600">
          NÃ£o tem uma conta?{' '}
          <Link href="/auth/signup" className="text-sky-500 hover:text-sky-600 underline">
            Cadastre-se
          </Link>
        </div>
      </div>
    </form>
  )
}

