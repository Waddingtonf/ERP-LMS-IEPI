/**
 * Secretaria Acadêmica — functional page with real Ocorrências tab.
 * Uses `getOcorrenciasAdmin`, `resolverOcorrencia` from ocorrenciaActions.
 * Other tabs retain existing UI with mock data (scope for future migration).
 */

import SecretariaClient from './_components/SecretariaClient';
import { getOcorrenciasAdmin } from '@/lms/actions/ocorrenciaActions';
import { getEnrollments } from '@/lms/actions/enrollmentActions';

export default async function SecretariaPage() {
    const [ocorrencias, enrollments] = await Promise.all([
        getOcorrenciasAdmin(),
        getEnrollments(),
    ]);

    return (
        <SecretariaClient
            ocorrencias={ocorrencias}
            enrollments={enrollments}
        />
    );
}
