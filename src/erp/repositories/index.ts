import { IRelatorioRepository }    from './RelatorioRepository';
import { IBolsaRepository }        from './BolsaRepository';
import { IConciliacaoRepository }  from './ConciliacaoRepository';

import { MockRelatorioRepository }   from './MockRelatorioRepository';
import { MockBolsaRepository }       from './MockBolsaRepository';
import { MockConciliacaoRepository } from './MockConciliacaoRepository';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
export const isMockMode = !supabaseUrl || supabaseUrl.includes('dummy') || supabaseUrl.includes('placeholder');

let _relatorio:   IRelatorioRepository   | null = null;
let _bolsa:       IBolsaRepository       | null = null;
let _conciliacao: IConciliacaoRepository | null = null;

/** Async factory — will swap in Supabase implementation when a real URL is provided. */
export async function getRelatorioRepository(): Promise<IRelatorioRepository> {
    if (_relatorio) return _relatorio;
    if (isMockMode) return (_relatorio = new MockRelatorioRepository());
    // TODO: replace with SupabaseRelatorioRepository when implemented
    return (_relatorio = new MockRelatorioRepository());
}

export async function getBolsaRepository(): Promise<IBolsaRepository> {
    if (_bolsa) return _bolsa;
    if (isMockMode) return (_bolsa = new MockBolsaRepository());
    // TODO: replace with SupabaseBolsaRepository when implemented
    return (_bolsa = new MockBolsaRepository());
}

export async function getConciliacaoRepository(): Promise<IConciliacaoRepository> {
    if (_conciliacao) return _conciliacao;
    if (isMockMode) return (_conciliacao = new MockConciliacaoRepository());
    // TODO: replace with SupabaseConciliacaoRepository when implemented
    return (_conciliacao = new MockConciliacaoRepository());
}

/** Force all cached instances to be re-created (useful in tests). */
export function resetErpRepositories(): void {
    _relatorio = null;
    _bolsa = null;
    _conciliacao = null;
}
