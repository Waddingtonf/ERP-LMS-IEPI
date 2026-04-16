/**
 * Admin Dashboard Component
 * Overview de metrics do sistema
 */

'use client'

import { useEffect, useState } from 'react'

interface AdminMetrics {
  totalStudents: number
  totalCourses: number
  totalRevenue: number
  activeEnrollments: number
  pendingPayments: number
  monthlyGrowth: number
}

export function AdminDashboard() {
  const [metrics, setMetrics] = useState<AdminMetrics>({
    totalStudents: 0,
    totalCourses: 0,
    totalRevenue: 0,
    activeEnrollments: 0,
    pendingPayments: 0,
    monthlyGrowth: 0,
  })

  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // TODO: Buscar metrics do servidor
    const loadMetrics = async () => {
      try {
        // Simular carregamento
        setMetrics({
          totalStudents: 1250,
          totalCourses: 45,
          totalRevenue: 125500.50,
          activeEnrollments: 3420,
          pendingPayments: 8950.00,
          monthlyGrowth: 12.5,
        })
      } catch (error) {
        console.error('Error loading metrics:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadMetrics()
  }, [])

  if (isLoading) {
    return <div className="text-center py-8">Carregando...</div>
  }

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Painel Admin</h1>
        <p className="text-slate-600">Visão geral do sistema e métricas importantes</p>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Total Students */}
        <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600 font-medium">Alunos Cadastrados</p>
              <p className="text-3xl font-bold text-slate-900 mt-2">
                {metrics.totalStudents.toLocaleString('pt-BR')}
              </p>
            </div>
            <div className="text-4xl">👥</div>
          </div>
        </div>

        {/* Total Courses */}
        <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600 font-medium">Cursos Ativos</p>
              <p className="text-3xl font-bold text-slate-900 mt-2">{metrics.totalCourses}</p>
            </div>
            <div className="text-4xl">📚</div>
          </div>
        </div>

        {/* Total Revenue */}
        <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600 font-medium">Receita Total</p>
              <p className="text-3xl font-bold text-green-600 mt-2">
                R$ {metrics.totalRevenue.toLocaleString('pt-BR', { maximumFractionDigits: 2 })}
              </p>
            </div>
            <div className="text-4xl">💰</div>
          </div>
        </div>

        {/* Active Enrollments */}
        <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600 font-medium">Matrículas Ativas</p>
              <p className="text-3xl font-bold text-sky-600 mt-2">
                {metrics.activeEnrollments.toLocaleString('pt-BR')}
              </p>
            </div>
            <div className="text-4xl">✅</div>
          </div>
        </div>

        {/* Pending Payments */}
        <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600 font-medium">Pagamentos Pendentes</p>
              <p className="text-3xl font-bold text-yellow-600 mt-2">
                R$ {metrics.pendingPayments.toLocaleString('pt-BR', { maximumFractionDigits: 2 })}
              </p>
            </div>
            <div className="text-4xl">⏳</div>
          </div>
        </div>

        {/* Monthly Growth */}
        <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600 font-medium">Crescimento Mensal</p>
              <p className="text-3xl font-bold text-green-600 mt-2">+{metrics.monthlyGrowth}%</p>
            </div>
            <div className="text-4xl">📈</div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-sm">
        <h2 className="text-xl font-bold text-slate-900 mb-4">Ações Rápidas</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <button className="py-2 px-4 bg-sky-500 text-white rounded-md hover:bg-sky-600 text-sm font-medium">
            Novo Curso
          </button>
          <button className="py-2 px-4 bg-sky-500 text-white rounded-md hover:bg-sky-600 text-sm font-medium">
            Novo Aluno
          </button>
          <button className="py-2 px-4 bg-sky-500 text-white rounded-md hover:bg-sky-600 text-sm font-medium">
            Gerar Relatório
          </button>
          <button className="py-2 px-4 bg-sky-500 text-white rounded-md hover:bg-sky-600 text-sm font-medium">
            Configurações
          </button>
        </div>
      </div>
    </div>
  )
}
