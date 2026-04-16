import { createClient } from '@/lib/supabase/server';
import { IFrequenciaRepository, Frequencia, FrequenciaResumo } from './FrequenciaRepository';

/**
 * SupabaseFrequenciaRepository
 * Implementa IFrequenciaRepository contra as tabelas `frequencias` e `aulas`.
 */
export class SupabaseFrequenciaRepository implements IFrequenciaRepository {

    async findByAula(aulaId: string): Promise<Frequencia[]> {
        const supabase = await createClient();
        const { data, error } = await supabase
            .from('frequencias')
            .select('id, aula_id, aluno_id, presente, observacao, registrado_em, profiles(name)')
            .eq('aula_id', aulaId);

        if (error) throw new Error(error.message);
        return (data ?? []).map(this.mapRow);
    }

    async findByAlunoTurma(alunoId: string, turmaId: string): Promise<Frequencia[]> {
        const supabase = await createClient();
        // frequencias → aulas where turma_id
        const { data, error } = await supabase
            .from('frequencias')
            .select('id, aula_id, aluno_id, presente, observacao, registrado_em, profiles(name), aulas!inner(turma_id)')
            .eq('aluno_id', alunoId)
            .eq('aulas.turma_id', turmaId);

        if (error) throw new Error(error.message);
        return (data ?? []).map(this.mapRow);
    }

    async getResumoTurma(turmaId: string): Promise<FrequenciaResumo[]> {
        const supabase = await createClient();
        const { data, error } = await supabase
            .from('v_frequencia_resumo')
            .select('aluno_id, aluno_name, total_aulas, presentes, percentual')
            .eq('turma_id', turmaId);

        if (error) throw new Error(error.message);
        return (data ?? []).map((row) => ({
            alunoId: row.aluno_id as string,
            alunoName: row.aluno_name as string,
            totalAulas: Number(row.total_aulas ?? 0),
            presentes: Number(row.presentes ?? 0),
            percentual: Number(row.percentual ?? 0),
        }));
    }

    async bulkUpsert(
        aulaId: string,
        records: { alunoId: string; alunoName: string; presente: boolean; observacao?: string }[],
    ): Promise<Frequencia[]> {
        const supabase = await createClient();

        const rows = records.map((r) => ({
            aula_id: aulaId,
            aluno_id: r.alunoId,
            presente: r.presente,
            observacao: r.observacao ?? null,
        }));

        const { data, error } = await supabase
            .from('frequencias')
            .upsert(rows, { onConflict: 'aula_id,aluno_id', ignoreDuplicates: false })
            .select('id, aula_id, aluno_id, presente, observacao, registrado_em, profiles(name)');

        if (error) throw new Error(error.message);
        return (data ?? []).map(this.mapRow);
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private mapRow(row: any): Frequencia {
        const profile = Array.isArray(row.profiles) ? row.profiles[0] : row.profiles;
        return {
            id: row.id,
            aulaId: row.aula_id,
            alunoId: row.aluno_id,
            alunoName: profile?.name ?? '',
            presente: row.presente ?? false,
            observacao: row.observacao ?? undefined,
            registradoEm: row.registrado_em ?? new Date().toISOString(),
        };
    }
}
