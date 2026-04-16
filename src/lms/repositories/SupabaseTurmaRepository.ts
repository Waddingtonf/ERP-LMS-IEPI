import { createClient } from '@/lib/supabase/server';
import { ITurmaRepository, Turma, Aula } from './TurmaRepository';

/**
 * SupabaseTurmaRepository
 * Implementa ITurmaRepository contra as tabelas `turmas` e `aulas` do Supabase.
 */
export class SupabaseTurmaRepository implements ITurmaRepository {

    // ── Turmas ──────────────────────────────────────────────────────────────────

    async findAll(): Promise<Turma[]> {
        const supabase = await createClient();
        const { data, error } = await supabase
            .from('turmas')
            .select(`
                id, nome, semestre, horario, dias_semana, sala,
                course_id, max_students, enrolled_count, status,
                courses ( title ),
                profiles ( id, name )
            `)
            .order('created_at', { ascending: false });

        if (error) throw new Error(error.message);
        return (data ?? []).map(this.mapTurmaRow);
    }

    async findById(id: string): Promise<Turma | null> {
        const supabase = await createClient();
        const { data, error } = await supabase
            .from('turmas')
            .select(`
                id, nome, semestre, horario, dias_semana, sala,
                course_id, max_students, enrolled_count, status,
                courses ( title ),
                profiles ( id, name )
            `)
            .eq('id', id)
            .single();

        if (error || !data) return null;
        return this.mapTurmaRow(data);
    }

    async findByInstructor(instructorId: string): Promise<Turma[]> {
        const supabase = await createClient();
        const { data, error } = await supabase
            .from('turmas')
            .select(`
                id, nome, semestre, horario, dias_semana, sala,
                course_id, max_students, enrolled_count, status,
                courses ( title ),
                profiles ( id, name )
            `)
            .eq('instructor_id', instructorId)
            .order('created_at', { ascending: false });

        if (error) throw new Error(error.message);
        return (data ?? []).map(this.mapTurmaRow);
    }

    async create(turma: Omit<Turma, 'id' | 'enrolledCount'>): Promise<Turma> {
        const supabase = await createClient();
        const { data, error } = await supabase
            .from('turmas')
            .insert({
                course_id: turma.courseId,
                instructor_id: turma.instructorId,
                nome: turma.courseName, // nome field
                semestre: turma.startDate,  // placeholder
                horario: turma.schedule,
                dias_semana: '',
                sala: turma.location,
                max_students: turma.maxStudents,
                status: turma.status,
            })
            .select(`
                id, nome, semestre, horario, dias_semana, sala,
                course_id, max_students, enrolled_count, status,
                courses ( title ),
                profiles ( id, name )
            `)
            .single();

        if (error || !data) throw new Error(error?.message ?? 'Failed to create turma');
        return this.mapTurmaRow(data);
    }

    async update(id: string, data: Partial<Omit<Turma, 'id'>>): Promise<Turma> {
        const supabase = await createClient();
        const mapped: Record<string, unknown> = {};
        if (data.courseName !== undefined) mapped.nome = data.courseName;
        if (data.startDate !== undefined) mapped.start_date = data.startDate;
        if (data.endDate !== undefined) mapped.end_date = data.endDate;
        if (data.schedule !== undefined) mapped.horario = data.schedule;
        if (data.location !== undefined) mapped.sala = data.location;
        if (data.maxStudents !== undefined) mapped.max_students = data.maxStudents;
        if (data.status !== undefined) mapped.status = data.status;
        if (data.instructorId !== undefined) mapped.instructor_id = data.instructorId;

        const { data: row, error } = await supabase
            .from('turmas')
            .update(mapped)
            .eq('id', id)
            .select(`
                id, nome, semestre, horario, dias_semana, sala,
                course_id, max_students, enrolled_count, status,
                courses ( title ),
                profiles ( id, name )
            `)
            .single();

        if (error || !row) throw new Error(error?.message ?? 'Turma not found');
        return this.mapTurmaRow(row);
    }

    // ── Aulas ───────────────────────────────────────────────────────────────────

    async getAulas(turmaId: string): Promise<Aula[]> {
        const supabase = await createClient();
        const { data, error } = await supabase
            .from('aulas')
            .select('id, turma_id, module_id, title, date, start_time, duration_minutes, status, modules(title)')
            .eq('turma_id', turmaId)
            .order('date', { ascending: true });

        if (error) throw new Error(error.message);
        return (data ?? []).map(this.mapAulaRow);
    }

    async createAula(aula: Omit<Aula, 'id'>): Promise<Aula> {
        const supabase = await createClient();
        const { data, error } = await supabase
            .from('aulas')
            .insert({
                turma_id: aula.turmaId,
                module_id: aula.moduleId ?? null,
                title: aula.title,
                date: aula.date,
                start_time: aula.startTime,
                duration_minutes: aula.durationMinutes,
                status: aula.status,
            })
            .select('id, turma_id, module_id, title, date, start_time, duration_minutes, status, modules(title)')
            .single();

        if (error || !data) throw new Error(error?.message ?? 'Failed to create aula');
        return this.mapAulaRow(data);
    }

    async updateAula(aulaId: string, data: Partial<Omit<Aula, 'id'>>): Promise<Aula> {
        const supabase = await createClient();
        const mapped: Record<string, unknown> = {};
        if (data.title !== undefined) mapped.title = data.title;
        if (data.date !== undefined) mapped.date = data.date;
        if (data.startTime !== undefined) mapped.start_time = data.startTime;
        if (data.durationMinutes !== undefined) mapped.duration_minutes = data.durationMinutes;
        if (data.status !== undefined) mapped.status = data.status;
        if (data.moduleId !== undefined) mapped.module_id = data.moduleId;

        const { data: row, error } = await supabase
            .from('aulas')
            .update(mapped)
            .eq('id', aulaId)
            .select('id, turma_id, module_id, title, date, start_time, duration_minutes, status, modules(title)')
            .single();

        if (error || !row) throw new Error(error?.message ?? 'Aula not found');
        return this.mapAulaRow(row);
    }

    // ── Mappers ─────────────────────────────────────────────────────────────────

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private mapTurmaRow(row: any): Turma {
        const instructor = Array.isArray(row.profiles) ? row.profiles[0] : row.profiles;
        const course = Array.isArray(row.courses) ? row.courses[0] : row.courses;
        return {
            id: row.id,
            courseId: row.course_id,
            courseName: course?.title ?? row.nome ?? '',
            code: row.nome ?? row.id,
            instructorId: instructor?.id ?? '',
            instructorName: instructor?.name ?? '',
            startDate: row.start_date ?? '',
            endDate: row.end_date ?? '',
            schedule: row.horario ?? '',
            location: row.sala ?? '',
            maxStudents: row.max_students ?? 40,
            enrolledCount: row.enrolled_count ?? 0,
            status: row.status ?? 'Planejada',
        };
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private mapAulaRow(row: any): Aula {
        const module = Array.isArray(row.modules) ? row.modules[0] : row.modules;
        return {
            id: row.id,
            turmaId: row.turma_id,
            moduleId: row.module_id ?? null,
            moduleName: module?.title ?? null,
            title: row.title,
            date: row.date,
            startTime: row.start_time ?? '',
            durationMinutes: row.duration_minutes ?? 60,
            status: row.status ?? 'Agendada',
        };
    }
}
