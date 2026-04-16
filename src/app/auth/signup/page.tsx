/**
 * Signup Page
 */

import { SignupForm } from '@/components/shared/forms/SignupForm'

export const metadata = {
  title: 'Cadastro | IEPI',
  description: 'Cadastre-se no portail da IEPI',
}

export default function SignupPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-slate-100 flex items-center justify-center px-4 sm:px-6">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Cadastro</h1>
          <p className="text-slate-600">Crie sua conta para acessar nossos cursos</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-lg shadow-md p-8 border border-slate-200">
          <SignupForm />
        </div>

        {/* Footer */}
        <div className="text-center mt-6 text-sm text-slate-600">
          <p>© 2026 IEPI - Instituto de Educação. Todos os direitos reservados.</p>
        </div>
      </div>
    </div>
  )
}
