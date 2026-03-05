import { ILeadRepository }     from './LeadRepository';
import { ICampanhaRepository } from './CampanhaRepository';

import { MockLeadRepository }     from './MockLeadRepository';
import { MockCampanhaRepository } from './MockCampanhaRepository';

let _lead:     ILeadRepository     | null = null;
let _campanha: ICampanhaRepository | null = null;

export function getLeadRepository():     ILeadRepository     { return (_lead     ??= new MockLeadRepository()); }
export function getCampanhaRepository(): ICampanhaRepository { return (_campanha ??= new MockCampanhaRepository()); }
