import { createClient } from '@/lib/supabase/server';
import { IOcorrenciaRepository, Ocorrencia, CreateOcorrenciaData, OcorrenciaTipo, OcorrenciaPrioridade, OcorrenciaStatus } from './OcorrenciaRepository';

/**
 * SupabaseOcorrenciaRepository
 * Implementa IOcorrenciaRepository contra a tabela `ocorrencias`.
 */
export class SupabaseOcorrenciaRepository implements IOcorrenciaRepository {

    private readonly SELECT = `
        id, tipo, prioridade, status, titulo, descricao,
        aluno_id, turma_id, curso_id, criado_por_id, atribuido_para_id,
        resolucao, criado_em, atualizado_em, resolvido_em,
        aluno:profiles!aluno_id(name),
        criador:profiles!criado_por_id(name),
        atribuido:profiles!atribuido_para_id(name)
    `;

    async findAll(): Promise<Ocorrencia[]> {
        const supabase = await createClient();
        const { data, error } = await supabase
            .from('ocorrencias')
            .select(this.SELECT)
            .order('criado_em', { ascending: false });

        if (error) throw new Error(error.message);
        return (data ?? []).map(this.mapRow);
    }

    async findById(id: string): Promise<Ocorrencia | null> {
        const supabase = await createClient();
        const { data, error } = await supabase
            .from('ocorrencias')
            .select(this.SELECT)
            .eq('id', id)
            .single();

        if (error || !data) return null;
        return this.mapRow(data);
    }

    async findByStatus(status: OcorrenciaStatus): Promise<Ocorrencia[]> {
        const supabase = await createClient();
        const { data, error } = await supabase
            .from('ocorrencias')
            .select(this.SELECT)
            .eq('status', status)
            .order('criado_em', { ascending: false });

        if (error) throw new Error(error.message);
        return (data ?? []).map(this.mapRow);
    }

    async findByTipo(tipo: OcorrenciaTipo): Promise<Ocorrencia[]> {
        const supabase = await createClient();
        const { data, error } = await supabase
            .from('ocorrencias')
            .select(this.SELECT)
            .eq('tipo', tipo)
            .order('criado_em', { ascending: false });

        if (error) throw new Error(error.message);
        return (data ?? []).map(this.mapRow);
    }

    async findByAluno(alunoId: string): Promise<Ocorrencia[]> {
        const supabase = await createClient();
        const { data, error } = await supabase
            .from('ocorrencias')
            .select(this.SELECT)
            .eq('aluno_id', alunoId)
            .order('criado_em', { ascending: false });

        if (error) throw new Error(error.message);
        return (data ?? []).map(this.mapRow);
    }

    async create(data: CreateOcorrenciaData): Promise<Ocorrencia> {
        const supabase = await createClient();
        const { data: row, error } = await supabase
            .from('ocorrencias')
            .insert({
                tipo: data.tipo,
                prioridade: data.prioridade,
                titulo: data.titulo,
                descricao: data.descricao,
                aluno_id: data.alunoId ?? null,
                turma_id: data.turmaId ?? null,
                curso_id: data.cursoId ?? null,
                criado_por_id: data.criadoPorId ?? null,
                atribuido_para_id: data.atribuidoParaId ?? null,
                status: 'Aberta',
            })
            .select(this.SELECT)
            .single();

        if (error || !row) throw new Error(error?.message ?? 'Failed to create ocorrencia');
        return this.mapRow(row);
    }

    async updateStatus(id: string, status: OcorrenciaStatus, resolucao?: string): Promise<Ocorrencia> {
        const supabase = await createClient();

        const updates: Record<string, unknown> = { status };
        if (resolucao !== undefined) updates.resolucao = resolucao;

        if (status === 'RESOLVIDA' || status === 'CANCELADA') {
            updates.resolvido_em = new Date().toISOString();
        }

        const { data, error } = await supabase
            .from('ocorrencias')
            .update(updates)
            .eq('id', id)
            .select(this.SELECT)
            .single();

        if (error || !data) throw new Error(error?.message ?? 'Ocorrencia not found');
        return this.mapRow(data);
    }

    async atribuir(id: string, userId: string, userName: string): Promise<Ocorrencia> {
        const supabase = await createClient();
        const { data, error } = await supabase
            .from('ocorrencias')
            .update({ atribuido_para_id: userId })
            .eq('id', id)
            .select(this.SELECT)
            .single();

        if (error || !data) throw new Error(error?.message ?? 'Ocorrencia not found');
        return this.mapRow(data);
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private mapRow(row: any): Ocorrencia {
        const getProfileName = (profileData: any) => {
            if (!profileData) return undefined;
            return Array.isArray(profileData) ? profileData[0]?.name : profileData.name;
        };

        return {
            id: row.id,
            tipo: row.tipo as OcorrenciaTipo,
            prioridade: row.prioridade as OcorrenciaPrioridade,
            status: row.status as OcorrenciaStatus,
            titulo: row.titulo,
            descricao: row.descricao,
            alunoId: row.aluno_id ?? undefined,
            alunoNome: getProfileName(row.aluno),
            turmaId: row.turma_id ?? undefined,
            cursoId: row.curso_id ?? undefined,
            criadoPorId: row.criado_por_id ?? undefined,
            criadoPorNome: getProfileName(row.criador),
            atribuidoParaId: row.atribuido_para_id ?? undefined,
            atribuidoParaNome: getProfileName(row.atribuido),
            resolucao: row.resolucao ?? undefined,
            criadoEm: row.criado_em,
            atualizadoEm: row.atualizado_em,
            resolvidoEm: row.resolvido_em ?? undefined,
        };
    }
}
