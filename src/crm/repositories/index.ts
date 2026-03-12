import { ILeadRepository }     from './LeadRepository';
import { ICampanhaRepository } from './CampanhaRepository';

import { MockLeadRepository }     from './MockLeadRepository';
import { MockCampanhaRepository } from './MockCampanhaRepository';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
export const isMockMode = !supabaseUrl || supabaseUrl.includes('dummy') || supabaseUrl.includes('placeholder');

let _lead:     ILeadRepository     | null = null;
let _campanha: ICampanhaRepository | null = null;

/** Async factory — will swap in Supabase implementation when a real URL is provided. */
export async function getLeadRepository(): Promise<ILeadRepository> {
    if (_lead) return _lead;
    if (isMockMode) return (_lead = new MockLeadRepository());
    // TODO: replace with SupabaseLeadRepository when implemented
    return (_lead = new MockLeadRepository());
}

export async function getCampanhaRepository(): Promise<ICampanhaRepository> {
    if (_campanha) return _campanha;
    if (isMockMode) return (_campanha = new MockCampanhaRepository());
    // TODO: replace with SupabaseCampanhaRepository when implemented
    return (_campanha = new MockCampanhaRepository());
}

/** Force all cached instances to be re-created (useful in tests). */
export function resetCrmRepositories(): void {
    _lead = null;
    _campanha = null;
}
