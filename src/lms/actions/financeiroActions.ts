"use server";

/**
 * Financeiro Actions
 * Em produção: integra com módulo financeiro / Supabase.
 * Em sandbox: retorna dados mockados para apresentação visual completa.
 */

export interface ContaReceber {
    id: string;
    aluno: string;
    curso: string;
    valor: number; // em centavos
    vencimento: string; // ISO date
    status: 'Pendente' | 'Pago' | 'Em atraso' | 'Cancelado';
    metodoPagamento: 'Cartão' | 'Boleto' | 'Pix';
}

export interface ContaPagar {
    id: string;
    fornecedor: string;
    descricao: string;
    valor: number; // em centavos
    vencimento: string; // ISO date
    status: 'Pendente' | 'Pago' | 'Em atraso';
    categoria: 'Docente' | 'Infraestrutura' | 'Marketing' | 'Administrativo' | 'Tecnologia';
}

export interface AlunoInadimplente {
    id: string;
    nome: string;
    email: string;
    curso: string;
    diasAtraso: number;
    valorDevido: number; // em centavos
    tentativasContato: number;
    ultimoContato: string | null;
}

export interface ResumoFinanceiro {
    mrrCentavos: number;
    variMrrPct: number;
    contasReceberHojeCentavos: number;
    qtdBoletos: number;
    contasPagarSemana: number;
    qtdContasPagar: number;
    taxaInadimplencia: number;
    variInadimplenciaPct: number;
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const MOCK_CONTAS_RECEBER: ContaReceber[] = [
    { id: 'cr1', aluno: 'Ana Paula Ferreira', curso: 'Gestão em RH', valor: 159900, vencimento: '2026-02-10', status: 'Pago', metodoPagamento: 'Cartão' },
    { id: 'cr2', aluno: 'Bruno Carvalho', curso: 'Gestão em RH', valor: 159900, vencimento: '2026-02-10', status: 'Em atraso', metodoPagamento: 'Boleto' },
    { id: 'cr3', aluno: 'Carlos Silva', curso: 'Administração', valor: 35000, vencimento: '2026-02-15', status: 'Pendente', metodoPagamento: 'Pix' },
    { id: 'cr4', aluno: 'Daniela Ramos', curso: 'Atendimento', valor: 29900, vencimento: '2026-02-07', status: 'Em atraso', metodoPagamento: 'Boleto' },
    { id: 'cr5', aluno: 'Eduardo Lima', curso: 'Administração', valor: 35000, vencimento: '2026-02-20', status: 'Pendente', metodoPagamento: 'Pix' },
    { id: 'cr6', aluno: 'Fernanda Costa', curso: 'Gestão em RH', valor: 159900, vencimento: '2026-01-10', status: 'Pago', metodoPagamento: 'Cartão' },
];

const MOCK_CONTAS_PAGAR: ContaPagar[] = [
    { id: 'cp1', fornecedor: 'Prof. João Marcos', descricao: 'Honorários Fevereiro 2026', valor: 450000, vencimento: '2026-02-28', status: 'Pendente', categoria: 'Docente' },
    { id: 'cp2', fornecedor: 'Locação Imóvel Ltda', descricao: 'Aluguel Fevereiro 2026', valor: 1200000, vencimento: '2026-02-05', status: 'Pago', categoria: 'Infraestrutura' },
    { id: 'cp3', fornecedor: 'Agência Digital XYZ', descricao: 'Gestão de Mídias - Fev', valor: 280000, vencimento: '2026-02-25', status: 'Pendente', categoria: 'Marketing' },
    { id: 'cp4', fornecedor: 'Vercel Inc.', descricao: 'Hospedagem - Março 2026', valor: 15000, vencimento: '2026-03-01', status: 'Pendente', categoria: 'Tecnologia' },
    { id: 'cp5', fornecedor: 'Supabase Inc.', descricao: 'Banco de Dados - Março 2026', valor: 8000, vencimento: '2026-03-01', status: 'Pendente', categoria: 'Tecnologia' },
];

const MOCK_INADIMPLENTES: AlunoInadimplente[] = [
    { id: 'a2', nome: 'Bruno Carvalho', email: 'bruno@email.com', curso: 'Gestão em RH', diasAtraso: 15, valorDevido: 159900, tentativasContato: 2, ultimoContato: '2026-02-18' },
    { id: 'a7', nome: 'Daniela Ramos', email: 'daniela@email.com', curso: 'Atendimento', diasAtraso: 18, valorDevido: 29900, tentativasContato: 3, ultimoContato: '2026-02-20' },
    { id: 'a9', nome: 'Marcos Oliveira', email: 'marcos@email.com', curso: 'Administração', diasAtraso: 45, valorDevido: 105000, tentativasContato: 5, ultimoContato: '2026-02-10' },
];

// ─── Actions ──────────────────────────────────────────────────────────────────

export async function getResumoFinanceiro(): Promise<ResumoFinanceiro> {
    return {
        mrrCentavos: 4523189,
        variMrrPct: 20.1,
        contasReceberHojeCentavos: 345000,
        qtdBoletos: 12,
        contasPagarSemana: 1214500,
        qtdContasPagar: 5,
        taxaInadimplencia: 8.4,
        variInadimplenciaPct: 1.2,
    };
}

export async function getContasReceber(): Promise<ContaReceber[]> {
    return MOCK_CONTAS_RECEBER;
}

export async function getContasReceberByStatus(status: ContaReceber['status']): Promise<ContaReceber[]> {
    return MOCK_CONTAS_RECEBER.filter(c => c.status === status);
}

export async function getContasPagar(): Promise<ContaPagar[]> {
    return MOCK_CONTAS_PAGAR;
}

export async function getAlunosInadimplentes(): Promise<AlunoInadimplente[]> {
    return MOCK_INADIMPLENTES;
}

export async function registrarContatoInadimplente(alunoId: string): Promise<{ success: boolean }> {
    // Em produção: atualiza no Supabase
    const aluno = MOCK_INADIMPLENTES.find(a => a.id === alunoId);
    if (!aluno) return { success: false };
    aluno.tentativasContato += 1;
    aluno.ultimoContato = new Date().toISOString().split('T')[0];
    return { success: true };
}
