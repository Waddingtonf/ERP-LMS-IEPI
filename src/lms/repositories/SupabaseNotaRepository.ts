import { createClient } from '@/lib/supabase/server';
import { INotaRepository, Nota, Boletim, SituacaoAluno } from './NotaRepository';
import { getFrequenciaRepository } from './index';

/**
 * SupabaseNotaRepository
 * Implementa INotaRepository contra as tabelas `notas` e views relacionadas.
 */
export class SupabaseNotaRepository implements INotaRepository {

    async findByAluno(alunoId: string): Promise<Nota[]> {
        const supabase = await createClient();
        const { data, error } = await supabase
            .from('notas')
            .select('id, turma_id, aluno_id, disciplina, av1, av2, trabalho, media, situacao, updated_at, profiles(name)')
            .eq('aluno_id', alunoId);

        if (error) throw new Error(error.message);
        return (data ?? []).map(this.mapRow);
    }

    async findByTurma(turmaId: string): Promise<Nota[]> {
        const supabase = await createClient();
        const { data, error } = await supabase
            .from('notas')
            .select('id, turma_id, aluno_id, disciplina, av1, av2, trabalho, media, situacao, updated_at, profiles(name)')
            .eq('turma_id', turmaId);

        if (error) throw new Error(error.message);
        return (data ?? []).map(this.mapRow);
    }

    async getBoletim(alunoId: string, turmaId: string): Promise<Boletim | null> {
        const supabase = await createClient();

        // 1. Fetch notas
        const { data: notasData, error: notasError } = await supabase
            .from('notas')
            .select('id, turma_id, aluno_id, disciplina, av1, av2, trabalho, media, situacao, updated_at, profiles(name)')
            .eq('aluno_id', alunoId)
            .eq('turma_id', turmaId);

        if (notasError) throw new Error(notasError.message);
        const notas = (notasData ?? []).map(this.mapRow);

        // 2. Fetch turma info
        const { data: turmaData, error: turmaError } = await supabase
            .from('turmas')
            .select('id, nome, courses(title)')
            .eq('id', turmaId)
            .single();

        if (turmaError || !turmaData) return null;

        // 3. Obter nome do aluno (pode vir da nota, mas e se não tiver nota? Pegamos do profile)
        const { data: profile } = await supabase
            .from('profiles')
            .select('name')
            .eq('id', alunoId)
            .single();

        // 4. Fetch frequencia
        const freqRepo = await getFrequenciaRepository(); // Usa o factory async
        const resumoFreq = await freqRepo.getResumoTurma(turmaId);
        const freqResult = resumoFreq.find(r => r.alunoId === alunoId);
        const frequenciaPercentual = freqResult?.percentual ?? 0;

        // 5. Cálculos (média geral)
        const notasComMedia = notas.filter((n) => n.media !== null);
        const mediaGeral =
            notasComMedia.length > 0
                ? Math.round(
                    (notasComMedia.reduce((sum, n) => sum + (n.media ?? 0), 0) /
                        notasComMedia.length) *
                    10
                ) / 10
                : null;

        // Situação global
        let situacaoGeral: SituacaoAluno = 'Em Andamento';
        if (notas.length > 0 && notas.every((n) => ['Aprovado', 'Reprovado', 'Recuperacao'].includes(n.situacao))) {
            if (frequenciaPercentual < 75) situacaoGeral = 'Reprovado'; // reprovação por falta
            else if (notas.some((n) => n.situacao === 'Reprovado')) situacaoGeral = 'Reprovado';
            else if (notas.some((n) => n.situacao === 'Recuperacao')) situacaoGeral = 'Recuperacao';
            else situacaoGeral = 'Aprovado';
        }

        const course = Array.isArray(turmaData.courses) ? turmaData.courses[0] : turmaData.courses;

        return {
            alunoId,
            alunoNome: profile?.name ?? '',
            turmaId,
            turmaNome: turmaData.nome ? `${course?.title ?? ''} - ${turmaData.nome}` : (course?.title ?? ''),
            notas,
            mediaGeral,
            situacaoGeral,
            frequenciaPercentual,
        };
    }

    async lancarNota(alunoId: string, turmaId: string, campo: 'av1' | 'av2' | 'trabalho', valor: number): Promise<Nota> {
        const supabase = await createClient();

        // Verifica se já existe um registro (vamos assumir disciplina 'Geral' se não existir, ou pegar o primeiro)
        let { data: notaData } = await supabase
            .from('notas')
            .select('id, disciplina')
            .eq('aluno_id', alunoId)
            .eq('turma_id', turmaId)
            .limit(1)
            .single();

        const updateObj: Record<string, number> = {};
        updateObj[campo] = valor;

        if (notaData) {
            // update
            const { data, error } = await supabase
                .from('notas')
                .update(updateObj)
                .eq('id', notaData.id)
                .select('id, turma_id, aluno_id, disciplina, av1, av2, trabalho, media, situacao, updated_at, profiles(name)')
                .single();

            if (error || !data) throw new Error(error?.message ?? 'Nota not found');
            return this.mapRow(data);
        } else {
            // insert
            const { data, error } = await supabase
                .from('notas')
                .insert({
                    turma_id: turmaId,
                    aluno_id: alunoId,
                    disciplina: 'Geral',
                    ...updateObj
                })
                .select('id, turma_id, aluno_id, disciplina, av1, av2, trabalho, media, situacao, updated_at, profiles(name)')
                .single();

            if (error || !data) throw new Error(error?.message ?? 'Failed to create nota');
            return this.mapRow(data);
        }
    }

    async upsert(nota: Omit<Nota, 'id' | 'media' | 'situacao' | 'updatedAt'>): Promise<Nota> {
        const supabase = await createClient();

        const { data, error } = await supabase
            .from('notas')
            .upsert({
                turma_id: nota.turmaId,
                aluno_id: nota.alunoId,
                disciplina: nota.disciplina || 'Geral',
                av1: nota.av1,
                av2: nota.av2,
                trabalho: nota.trabalho
            }, { onConflict: 'turma_id,aluno_id,disciplina', ignoreDuplicates: false })
            .select('id, turma_id, aluno_id, disciplina, av1, av2, trabalho, media, situacao, updated_at, profiles(name)')
            .single();

        if (error || !data) throw new Error(error?.message ?? 'Failed to upsert nota');
        return this.mapRow(data);
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private mapRow(row: any): Nota {
        const profile = Array.isArray(row.profiles) ? row.profiles[0] : row.profiles;
        return {
            id: row.id,
            alunoId: row.aluno_id,
            alunoNome: profile?.name ?? '',
            turmaId: row.turma_id,
            disciplina: row.disciplina ?? 'Geral',
            av1: row.av1 !== null ? Number(row.av1) : null,
            av2: row.av2 !== null ? Number(row.av2) : null,
            trabalho: row.trabalho !== null ? Number(row.trabalho) : null,
            media: row.media !== null ? Number(row.media) : null,
            situacao: (row.situacao ?? 'Em Andamento') as SituacaoAluno,
            updatedAt: row.updated_at,
        };
    }
}
