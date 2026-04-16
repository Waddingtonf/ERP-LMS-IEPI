"use server";

import { getRelatorioRepository } from "@/erp/repositories";
import type { DRE, FluxoCaixa, IndicadorExecutivo } from "@/erp/repositories/RelatorioRepository";

export async function getDRE(periodo = 'Março/2026'): Promise<DRE> {
    return (await getRelatorioRepository()).getDRE(periodo);
}

export async function getFluxoCaixa(mes = 3, ano = 2026): Promise<FluxoCaixa> {
    return (await getRelatorioRepository()).getFluxoCaixa(mes, ano);
}

export async function getIndicadoresExecutivos(): Promise<IndicadorExecutivo[]> {
    return (await getRelatorioRepository()).getIndicadoresExecutivos();
}

export async function exportarRelatorio(
    tipo: 'DRE' | 'FluxoCaixa' | 'Balancete',
    periodo: string,
    formato: 'PDF' | 'XLSX' | 'CSV'
): Promise<{ url: string }> {
    return (await getRelatorioRepository()).exportar(tipo, periodo, formato);
}
