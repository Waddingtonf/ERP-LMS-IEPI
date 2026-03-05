"use server";

import { getRelatorioRepository } from "@/erp/repositories";
import type { DRE, FluxoCaixa, IndicadorExecutivo } from "@/erp/repositories/RelatorioRepository";

export async function getDRE(periodo = 'Março/2026'): Promise<DRE> {
    return getRelatorioRepository().getDRE(periodo);
}

export async function getFluxoCaixa(mes = 3, ano = 2026): Promise<FluxoCaixa> {
    return getRelatorioRepository().getFluxoCaixa(mes, ano);
}

export async function getIndicadoresExecutivos(): Promise<IndicadorExecutivo[]> {
    return getRelatorioRepository().getIndicadoresExecutivos();
}

export async function exportarRelatorio(
    tipo: 'DRE' | 'FluxoCaixa' | 'Balancete',
    periodo: string,
    formato: 'PDF' | 'XLSX' | 'CSV'
): Promise<{ url: string }> {
    return getRelatorioRepository().exportar(tipo, periodo, formato);
}

export type { DRE, FluxoCaixa, IndicadorExecutivo };
