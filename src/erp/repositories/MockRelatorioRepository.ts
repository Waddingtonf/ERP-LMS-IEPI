import { IRelatorioRepository, DRE, FluxoCaixa, IndicadorExecutivo, ItemFluxoCaixa } from './RelatorioRepository';

const DRE_MOCK: DRE = {
    periodo: 'Março/2026',
    receitaBruta: 387420,
    deducoes: 15497,
    receitaLiquida: 371923,
    cpv: 89241,
    lucroBruto: 282682,
    despesasOperacionais: 142300,
    ebitda: 140382,
    depreciacao: 8200,
    ebit: 132182,
    resultadoFinanceiro: -4820,
    lucroAnteIR: 127362,
    ir: 31840,
    lucroLiquido: 95522,
    margemLiquida: 24.7,
    linhas: [
        { codigo: '3.1', descricao: 'Mensalidades Recebidas', tipo: 'Receita', valor: 298600, percentualReceita: 77.1 },
        { codigo: '3.2', descricao: 'Matrículas e Taxas', tipo: 'Receita', valor: 54820, percentualReceita: 14.1 },
        { codigo: '3.3', descricao: 'Cursos Avulsos / Extensão', tipo: 'Receita', valor: 34000, percentualReceita: 8.8 },
        { codigo: '4.1', descricao: 'Devoluções e Cancelamentos', tipo: 'Deducao', valor: 9800, percentualReceita: 2.5 },
        { codigo: '4.2', descricao: 'Descontos Comerciais', tipo: 'Deducao', valor: 5697, percentualReceita: 1.5 },
        { codigo: '5.1', descricao: 'Remuneração Docentes', tipo: 'CPV', valor: 61400, percentualReceita: 15.9 },
        { codigo: '5.2', descricao: 'Material Didático', tipo: 'CPV', valor: 18640, percentualReceita: 4.8 },
        { codigo: '5.3', descricao: 'Direitos Autorais / Plataforma', tipo: 'CPV', valor: 9201, percentualReceita: 2.4 },
        { codigo: '6.1', descricao: 'Pessoal Administrativo', tipo: 'DespesaOperacional', valor: 78500, percentualReceita: 20.3 },
        { codigo: '6.2', descricao: 'Marketing e Campanhas', tipo: 'DespesaOperacional', valor: 22800, percentualReceita: 5.9 },
        { codigo: '6.3', descricao: 'Aluguel e Condomínio', tipo: 'DespesaOperacional', valor: 21000, percentualReceita: 5.4 },
        { codigo: '6.4', descricao: 'TI e Sistemas', tipo: 'DespesaOperacional', valor: 12400, percentualReceita: 3.2 },
        { codigo: '6.5', descricao: 'Utilidades (Luz/Água/Internet)', tipo: 'DespesaOperacional', valor: 7600, percentualReceita: 2.0 },
        { codigo: '7.1', descricao: 'Juros sobre Empréstimos', tipo: 'DespesaFinanceira', valor: 6200, percentualReceita: 1.6 },
        { codigo: '7.2', descricao: 'Rendimentos de Aplicações', tipo: 'ReceitaFinanceira', valor: 1380, percentualReceita: 0.4 },
        { codigo: '8.1', descricao: 'Imposto de Renda / CSLL', tipo: 'IR', valor: 31840, percentualReceita: 8.2 },
    ],
};

const ITENS_FLUXO: ItemFluxoCaixa[] = [
    { data: '2026-03-03', descricao: 'Boletos mensalidade — lote Mar/26', categoria: 'Mensalidades', tipo: 'Entrada', valor: 87400, saldoAcumulado: 87400 },
    { data: '2026-03-05', descricao: 'Folha de pagamento — fev/26', categoria: 'Pessoal', tipo: 'Saida', valor: 78500, saldoAcumulado: 8900 },
    { data: '2026-03-07', descricao: 'Matrículas portal online', categoria: 'Matrículas', tipo: 'Entrada', valor: 21800, saldoAcumulado: 30700 },
    { data: '2026-03-10', descricao: 'Aluguel sede + laboratório', categoria: 'Infraestrutura', tipo: 'Saida', valor: 21000, saldoAcumulado: 9700 },
    { data: '2026-03-12', descricao: 'Recebimento Cielo — cartões fev/26', categoria: 'Mensalidades', tipo: 'Entrada', valor: 54200, saldoAcumulado: 63900 },
    { data: '2026-03-14', descricao: 'Google Ads — verba março', categoria: 'Marketing', tipo: 'Saida', valor: 8400, saldoAcumulado: 55500 },
    { data: '2026-03-15', descricao: 'Honórários docentes — Mar/26', categoria: 'Pessoal', tipo: 'Saida', valor: 32600, saldoAcumulado: 22900 },
    { data: '2026-03-18', descricao: 'Parcelamentos em atraso — recuperados', categoria: 'Inadimplência', tipo: 'Entrada', valor: 18340, saldoAcumulado: 41240 },
    { data: '2026-03-20', descricao: 'Fornecedor material didático', categoria: 'Material', tipo: 'Saida', valor: 9820, saldoAcumulado: 31420 },
    { data: '2026-03-25', descricao: 'Mensalidades 2a remessa', categoria: 'Mensalidades', tipo: 'Entrada', valor: 43600, saldoAcumulado: 75020 },
    { data: '2026-03-28', descricao: 'Plataforma LMS — licença mensal', categoria: 'TI', tipo: 'Saida', valor: 4200, saldoAcumulado: 70820 },
    { data: '2026-03-31', descricao: 'Cursos avulsos / extensão', categoria: 'Cursos', tipo: 'Entrada', valor: 12600, saldoAcumulado: 83420 },
];

const INDICADORES: IndicadorExecutivo[] = [
    { chave: 'mrr', label: 'MRR', valor: 298600, delta: '+8,4% vs fev/26', tendencia: 'up', formato: 'moeda' },
    { chave: 'novos_alunos', label: 'Novos Alunos (mês)', valor: 47, delta: '+12 vs fev/26', tendencia: 'up', formato: 'numero' },
    { chave: 'taxa_evasao', label: 'Taxa de Evasão', valor: 3.2, delta: '-0,8 p.p. vs fev/26', tendencia: 'down', formato: 'percentual' },
    { chave: 'inadimplencia', label: 'Inadimplência', valor: 6.1, delta: '+1,2 p.p. vs fev/26', tendencia: 'up', formato: 'percentual' },
    { chave: 'ticket_medio', label: 'Ticket Médio', valor: 2180, delta: '+R$ 120 vs fev/26', tendencia: 'up', formato: 'moeda' },
    { chave: 'ocupacao_turmas', label: 'Ocupação Turmas', valor: 84, delta: '+3% vs mês ant.', tendencia: 'up', formato: 'percentual' },
    { chave: 'margem_liquida', label: 'Margem Líquida', valor: 24.7, delta: '+1,9 p.p. vs fev/26', tendencia: 'up', formato: 'percentual' },
    { chave: 'leads_mes', label: 'Leads (mês)', valor: 312, delta: '+27 vs fev/26', tendencia: 'up', formato: 'numero' },
];

export class MockRelatorioRepository implements IRelatorioRepository {
    async getDRE(_periodo: string): Promise<DRE> {
        return { ...DRE_MOCK };
    }

    async getFluxoCaixa(_mes: number, _ano: number): Promise<FluxoCaixa> {
        return {
            periodo: 'Março/2026',
            saldoInicial: 148200,
            totalEntradas: 237940,
            totalSaidas: 154520,
            saldoFinal: 231620,
            itens: JSON.parse(JSON.stringify(ITENS_FLUXO)),
        };
    }

    async getIndicadoresExecutivos(): Promise<IndicadorExecutivo[]> {
        return [...INDICADORES];
    }

    async exportar(_tipo: string, _periodo: string, _formato: string): Promise<{ url: string }> {
        return { url: `/exports/relatorio-${Date.now()}.pdf` };
    }
}
