export interface FinanceiroResumoMock {
    mrrLabel: string;
    mrrDeltaLabel: string;
    contasReceberHojeLabel: string;
    boletosPendentesLabel: string;
    contasPagarLabel: string;
    contasPagarHorizonLabel: string;
    inadimplenciaLabel: string;
    inadimplenciaDeltaLabel: string;
}

export const FINANCEIRO_RESUMO_MOCK: FinanceiroResumoMock = {
    mrrLabel: "R$ 45.231,89",
    mrrDeltaLabel: "+20.1% em relação ao mês anterior",
    contasReceberHojeLabel: "R$ 3.450,00",
    boletosPendentesLabel: "12 boletos pendentes",
    contasPagarLabel: "R$ 12.145,00",
    contasPagarHorizonLabel: "Próximos 7 dias",
    inadimplenciaLabel: "8.4%",
    inadimplenciaDeltaLabel: "+1.2% este mês",
};
