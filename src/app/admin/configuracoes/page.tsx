import { Settings, School, Calendar, CreditCard, Bell, Shield, Database } from "lucide-react";

const SECOES = [
    {
        id: 'geral',
        label: 'Informações da Instituição',
        icon: School,
        color: 'text-violet-600',
        bg: 'bg-violet-50',
        campos: [
            { id: 'nomeInstituicao', label: 'Nome da Instituição', tipo: 'text', valor: 'IEPI — Instituto de Educação Profissional Integrado' },
            { id: 'cnpj', label: 'CNPJ', tipo: 'text', valor: '00.000.000/0001-00' },
            { id: 'email', label: 'E-mail Institucional', tipo: 'email', valor: 'contato@iepi.edu.br' },
            { id: 'telefone', label: 'Telefone', tipo: 'text', valor: '(11) 9 0000-0000' },
        ],
    },
    {
        id: 'academico',
        label: 'Calendário Acadêmico',
        icon: Calendar,
        color: 'text-teal-600',
        bg: 'bg-teal-50',
        campos: [
            { id: 'anoLetivo', label: 'Ano Letivo Vigente', tipo: 'text', valor: '2025' },
            { id: 'inicioSemestre', label: 'Início do Semestre', tipo: 'date', valor: '2025-02-03' },
            { id: 'fimSemestre', label: 'Fim do Semestre', tipo: 'date', valor: '2025-06-27' },
            { id: 'minimoFrequencia', label: 'Frequência Mínima (%)', tipo: 'number', valor: '75' },
            { id: 'mediaAprovacao', label: 'Média de Aprovação', tipo: 'number', valor: '7' },
        ],
    },
    {
        id: 'financeiro',
        label: 'Integrações de Pagamento',
        icon: CreditCard,
        color: 'text-emerald-600',
        bg: 'bg-emerald-50',
        campos: [
            { id: 'merchantId', label: 'Cielo Merchant ID', tipo: 'text', valor: '00000000-0000-0000-0000-000000000000' },
            { id: 'merchantKey', label: 'Cielo Merchant Key', tipo: 'password', valor: '••••••••••••••••••••••••••••••••' },
            { id: 'pixChave', label: 'Chave PIX', tipo: 'text', valor: 'contato@iepi.edu.br' },
            { id: 'jurosAtraso', label: 'Juros por Atraso (% a.m.)', tipo: 'number', valor: '1' },
        ],
    },
    {
        id: 'notificacoes',
        label: 'Notificações',
        icon: Bell,
        color: 'text-amber-600',
        bg: 'bg-amber-50',
        campos: [
            { id: 'emailBoasVindas', label: 'E-mail de Boas-vindas', tipo: 'checkbox', valor: 'true' },
            { id: 'notifNotas', label: 'Notificar lançamento de notas', tipo: 'checkbox', valor: 'true' },
            { id: 'notifVencimento', label: 'Notificar vencimento de boleto', tipo: 'checkbox', valor: 'true' },
            { id: 'notifCertificado', label: 'Notificar emissão de certificado', tipo: 'checkbox', valor: 'true' },
        ],
    },
];

export default function AdminConfiguracoesPage() {
    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2"><Settings className="w-6 h-6 text-violet-600" />Configurações do Sistema</h1>
                <p className="text-slate-500 mt-1 text-sm">Gerencie informações institucionais, calendário, integrações e notificações.</p>
            </div>

            <div className="space-y-6">
                {SECOES.map(secao => (
                    <div key={secao.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                        <div className={`px-6 py-4 border-b border-slate-100 flex items-center gap-3`}>
                            <div className={`w-8 h-8 rounded-lg ${secao.bg} flex items-center justify-center`}>
                                <secao.icon className={`w-4 h-4 ${secao.color}`} />
                            </div>
                            <h2 className="font-bold text-slate-800">{secao.label}</h2>
                        </div>
                        <div className="px-6 py-6 grid grid-cols-1 md:grid-cols-2 gap-5">
                            {secao.campos.map(campo => (
                                <div key={campo.id}>
                                    <label htmlFor={campo.id} className="block text-xs font-semibold text-slate-600 mb-1.5">
                                        {campo.label}
                                    </label>
                                    {campo.tipo === 'checkbox' ? (
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input type="checkbox" id={campo.id} defaultChecked={campo.valor === 'true'} className="w-4 h-4 rounded accent-violet-600" />
                                            <span className="text-sm text-slate-600">Habilitado</span>
                                        </label>
                                    ) : (
                                        <input
                                            type={campo.tipo}
                                            id={campo.id}
                                            defaultValue={campo.valor}
                                            className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-violet-300 focus:border-transparent bg-slate-50 transition-all"
                                        />
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {/* Zona de Perigo */}
            <div className="bg-rose-50 rounded-2xl border border-rose-200 p-6">
                <div className="flex items-center gap-3 mb-4">
                    <Shield className="w-5 h-5 text-rose-600" />
                    <h3 className="font-bold text-rose-800">Zona de Perigo</h3>
                </div>
                <div className="flex items-center justify-between gap-4 flex-wrap">
                    <div>
                        <p className="text-sm font-medium text-rose-700">Limpar dados de demonstração</p>
                        <p className="text-xs text-rose-500 mt-0.5">Remove todos os dados mock e reseta o sistema para produção.</p>
                    </div>
                    <button className="px-4 py-2 bg-rose-600 text-white text-sm font-semibold rounded-xl hover:bg-rose-700 transition-colors">
                        Limpar Dados Mock
                    </button>
                </div>
            </div>

            {/* Salvar */}
            <div className="flex justify-end gap-3">
                <button className="px-6 py-2.5 text-slate-600 border border-slate-200 text-sm font-semibold rounded-xl hover:bg-slate-50 transition-colors">Cancelar</button>
                <button className="px-6 py-2.5 bg-violet-600 text-white text-sm font-semibold rounded-xl hover:bg-violet-700 transition-colors shadow-lg shadow-violet-100">
                    Salvar Configurações
                </button>
            </div>
        </div>
    );
}
