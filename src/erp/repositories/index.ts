import { IRelatorioRepository }    from './RelatorioRepository';
import { IBolsaRepository }        from './BolsaRepository';
import { IConciliacaoRepository }  from './ConciliacaoRepository';

import { MockRelatorioRepository }   from './MockRelatorioRepository';
import { MockBolsaRepository }       from './MockBolsaRepository';
import { MockConciliacaoRepository } from './MockConciliacaoRepository';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
const isMockMode = !supabaseUrl || supabaseUrl.includes('dummy') || supabaseUrl.includes('placeholder');

let _relatorio:   IRelatorioRepository   | null = null;
let _bolsa:       IBolsaRepository       | null = null;
let _conciliacao: IConciliacaoRepository | null = null;

export function getRelatorioRepository():   IRelatorioRepository   { return (_relatorio   ??= new MockRelatorioRepository()); }
export function getBolsaRepository():       IBolsaRepository       { return (_bolsa       ??= new MockBolsaRepository()); }
export function getConciliacaoRepository(): IConciliacaoRepository { return (_conciliacao ??= new MockConciliacaoRepository()); }

export { isMockMode };
