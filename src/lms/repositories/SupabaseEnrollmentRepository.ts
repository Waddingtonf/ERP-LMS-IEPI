import { createClient } from '@/lib/supabase/server';
import { IEnrollmentRepository, Enrollment, EnrollmentStatus } from './EnrollmentRepository';

/**
 * SupabaseEnrollmentRepository
 * Implementa IEnrollmentRepository contra a tabela `enrollments`.
 */
export class SupabaseEnrollmentRepository implements IEnrollmentRepository {

    private readonly SELECT = `
        id,
        aluno_id,
        course_id,
        module_id,
        turma_id,
        payment_transaction_id,
        status,
        amount_paid,
        data_matricula,
        profiles!aluno_id ( name, email ),
        courses ( title ),
        modules ( title )
    `;

    async findAll(): Promise<Enrollment[]> {
        const supabase = await createClient();
        const { data, error } = await supabase
            .from('enrollments')
            .select(this.SELECT)
            .order('data_matricula', { ascending: false });

        if (error) throw new Error(error.message);
        return (data ?? []).map(this.mapRow);
    }

    async findById(id: string): Promise<Enrollment | null> {
        const supabase = await createClient();
        const { data, error } = await supabase
            .from('enrollments')
            .select(this.SELECT)
            .eq('id', id)
            .single();

        if (error || !data) return null;
        return this.mapRow(data);
    }

    async findByAluno(alunoId: string): Promise<Enrollment[]> {
        const supabase = await createClient();
        const { data, error } = await supabase
            .from('enrollments')
            .select(this.SELECT)
            .eq('aluno_id', alunoId)
            .order('data_matricula', { ascending: false });

        if (error) throw new Error(error.message);
        return (data ?? []).map(this.mapRow);
    }

    async findByTurma(turmaId: string): Promise<Enrollment[]> {
        const supabase = await createClient();
        const { data, error } = await supabase
            .from('enrollments')
            .select(this.SELECT)
            .eq('turma_id', turmaId);

        if (error) throw new Error(error.message);
        return (data ?? []).map(this.mapRow);
    }

    async findByCourse(courseId: string): Promise<Enrollment[]> {
        const supabase = await createClient();
        const { data, error } = await supabase
            .from('enrollments')
            .select(this.SELECT)
            .eq('course_id', courseId);

        if (error) throw new Error(error.message);
        return (data ?? []).map(this.mapRow);
    }

    async create(enrollment: Omit<Enrollment, 'id'>): Promise<Enrollment> {
        const supabase = await createClient();
        const { data, error } = await supabase
            .from('enrollments')
            .insert({
                aluno_id: enrollment.alunoId,
                course_id: enrollment.courseId,
                module_id: enrollment.moduleId ?? null,
                turma_id: enrollment.turmaId ?? null,
                payment_transaction_id: enrollment.paymentTransactionId ?? null,
                status: enrollment.status,
                amount_paid: enrollment.amountPaid,
                data_matricula: enrollment.dataMatricula,
            })
            .select(this.SELECT)
            .single();

        if (error || !data) throw new Error(error?.message ?? 'Failed to create enrollment');

        // Incrementar enrolled_count da turma se tiver turma associada
        if (enrollment.turmaId) {
            await supabase.rpc('increment_turma_count', { turma_id: enrollment.turmaId });
        }

        return this.mapRow(data);
    }

    async updateStatus(id: string, status: EnrollmentStatus): Promise<Enrollment> {
        const supabase = await createClient();
        const { data, error } = await supabase
            .from('enrollments')
            .update({ status })
            .eq('id', id)
            .select(this.SELECT)
            .single();

        if (error || !data) throw new Error(error?.message ?? 'Enrollment not found');
        return this.mapRow(data);
    }

    async isEnrolled(alunoId: string, courseId: string, moduleId?: string): Promise<boolean> {
        const supabase = await createClient();
        let query = supabase
            .from('enrollments')
            .select('id', { count: 'exact', head: true })
            .eq('aluno_id', alunoId)
            .eq('course_id', courseId)
            .in('status', ['Ativo', 'Concluido']);

        if (moduleId) query = query.eq('module_id', moduleId);

        const { count, error } = await query;
        if (error) throw new Error(error.message);
        return (count ?? 0) > 0;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private mapRow(row: any): Enrollment {
        const profile = Array.isArray(row.profiles) ? row.profiles[0] : row.profiles;
        const course = Array.isArray(row.courses) ? row.courses[0] : row.courses;
        const module = Array.isArray(row.modules) ? row.modules[0] : row.modules;
        return {
            id: row.id,
            alunoId: row.aluno_id,
            alunoName: profile?.name ?? '',
            alunoEmail: profile?.email ?? '',
            courseId: row.course_id,
            courseName: course?.title ?? '',
            moduleId: row.module_id ?? null,
            moduleName: module?.title ?? null,
            turmaId: row.turma_id ?? null,
            paymentTransactionId: row.payment_transaction_id ?? null,
            status: row.status as EnrollmentStatus,
            amountPaid: Number(row.amount_paid ?? 0),
            dataMatricula: row.data_matricula ? String(row.data_matricula).slice(0, 10) : '',
        };
    }
}
