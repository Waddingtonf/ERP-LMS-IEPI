/**
 * Financial Dashboard Component
 * Métricas de receita, transações, relatórios
 */

'use client'

import { useEffect, useState } from 'react'

interface FinancialMetrics {
  totalRevenue: number
  monthlyRevenue: number
  pendingPayments: number
  completedTransactions: number
  conversionRate: number
  averageOrderValue: number
}

export function FinancialDashboard() {
  const [metrics, setMetrics] = useState<FinancialMetrics>({
    totalRevenue: 0,
    monthlyRevenue: 0,
    pendingPayments: 0,
    completedTransactions: 0,
    conversionRate: 0,
    averageOrderValue: 0,
  })

  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // TODO: Buscar metrics financeiros
    const loadMetrics = async () => {
      try {
        setMetrics({
          totalRevenue: 125500.50,
          monthlyRevenue: 18750.30,
          pendingPayments: 8950.00,
          completedTransactions: 4250,
          conversionRate: 12.5,
          averageOrderValue: 285.75,
        })
      } catch (error) {
        console.error('Error loading financial metrics:', error)
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
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Dashboard Financeiro</h1>
        <p className="text-slate-600">Relatórios de receita, transações e métricas</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <p className="text-sm text-slate-600 font-medium">Receita Total</p>
          <p className="text-3xl font-bold text-green-600 mt-2">
            R$ {metrics.totalRevenue.toLocaleString('pt-BR', { maximumFractionDigits: 2 })}
          </p>
        </div>

        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <p className="text-sm text-slate-600 font-medium">Receita Este Mês</p>
          <p className="text-3xl font-bold text-sky-600 mt-2">
            R$ {metrics.monthlyRevenue.toLocaleString('pt-BR', { maximumFractionDigits: 2 })}
          </p>
        </div>

        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <p className="text-sm text-slate-600 font-medium">Pagamentos Pendentes</p>
          <p className="text-3xl font-bold text-yellow-600 mt-2">
            R$ {metrics.pendingPayments.toLocaleString('pt-BR', { maximumFractionDigits: 2 })}
          </p>
        </div>

        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <p className="text-sm text-slate-600 font-medium">Transações Completadas</p>
          <p className="text-3xl font-bold text-slate-900 mt-2">
            {metrics.completedTransactions.toLocaleString('pt-BR')}
          </p>
        </div>

        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <p className="text-sm text-slate-600 font-medium">Taxa de Conversão</p>
          <p className="text-3xl font-bold text-purple-600 mt-2">{metrics.conversionRate}%</p>
        </div>

        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <p className="text-sm text-slate-600 font-medium">Ticket Médio</p>
          <p className="text-3xl font-bold text-slate-900 mt-2">
            R$ {metrics.averageOrderValue.toLocaleString('pt-BR', { maximumFractionDigits: 2 })}
          </p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <h2 className="text-lg font-bold text-slate-900 mb-4">Ações Rápidas</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <button className="py-2 px-4 bg-sky-500 text-white rounded-md hover:bg-sky-600 text-sm">
            Gerar Relatório
          </button>
          <button className="py-2 px-4 bg-sky-500 text-white rounded-md hover:bg-sky-600 text-sm">
            Ver Transações
          </button>
          <button className="py-2 px-4 bg-sky-500 text-white rounded-md hover:bg-sky-600 text-sm">
            Conciliação
          </button>
          <button className="py-2 px-4 bg-sky-500 text-white rounded-md hover:bg-sky-600 text-sm">
            Exportar
          </button>
        </div>
      </div>
    </div>
  )
}
