// -------------------------------------------------------------------
// RelatorioRepository — ERP domain
// -------------------------------------------------------------------

export interface LinhaPlanoContas {
    codigo: string;
    descricao: string;
    tipo: 'Receita' | 'Deducao' | 'CPV' | 'DespesaOperacional' | 'DespesaFinanceira' | 'ReceitaFinanceira' | 'IR';
    valor: number;
    percentualReceita: number;
}

export interface DRE {
    periodo: string;        // "Janeiro/2026" | "2026"
    receitaBruta: number;
    deducoes: number;
    receitaLiquida: number;
    cpv: number;
    lucroBruto: number;
    despesasOperacionais: number;
    ebitda: number;
    depreciacao: number;
    ebit: number;
    resultadoFinanceiro: number;
    lucroAnteIR: number;
    ir: number;
    lucroLiquido: number;
    margemLiquida: number;
    linhas: LinhaPlanoContas[];
}

export interface ItemFluxoCaixa {
    data: string;
    descricao: string;
    categoria: string;
    tipo: 'Entrada' | 'Saida';
    valor: number;
    saldoAcumulado: number;
}

export interface FluxoCaixa {
    periodo: string;
    saldoInicial: number;
    totalEntradas: number;
    totalSaidas: number;
    saldoFinal: number;
    itens: ItemFluxoCaixa[];
}

export interface IndicadorExecutivo {
    chave: string;
    label: string;
    valor: number | string;
    delta: string;
    tendencia: 'up' | 'down' | 'neutral';
    formato: 'moeda' | 'percentual' | 'numero' | 'texto';
}

export interface IRelatorioRepository {
    getDRE(periodo: string): Promise<DRE>;
    getFluxoCaixa(mes: number, ano: number): Promise<FluxoCaixa>;
    getIndicadoresExecutivos(): Promise<IndicadorExecutivo[]>;
    exportar(tipo: 'DRE' | 'FluxoCaixa' | 'Balancete', periodo: string, formato: 'PDF' | 'XLSX' | 'CSV'): Promise<{ url: string }>;
}
