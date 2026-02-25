import { createClient } from '@/lib/supabase/server';
import { IUserRepository, User } from './UserRepository';

/**
 * Implementação real em Supabase para UserRepository.
 * Espera a tabela `profiles` com as colunas: id, name, email, role, enrolled_course_ids (text[])
 */
export class SupabaseUserRepository implements IUserRepository {
    async findById(id: string): Promise<User | null> {
        const supabase = createClient();
        const { data, error } = await (await supabase)
            .from('profiles')
            .select('id, name, email, role, enrolled_course_ids')
            .eq('id', id)
            .single();

        if (error || !data) return null;
        return this.mapRow(data);
    }

    async findByEmail(email: string): Promise<User | null> {
        const supabase = createClient();
        const { data, error } = await (await supabase)
            .from('profiles')
            .select('id, name, email, role, enrolled_course_ids')
            .eq('email', email)
            .single();

        if (error || !data) return null;
        return this.mapRow(data);
    }

    async create(user: Omit<User, 'id' | 'enrolledCourseIds'>): Promise<User> {
        const supabase = createClient();
        const { data, error } = await (await supabase)
            .from('profiles')
            .insert({
                name: user.name,
                email: user.email,
                role: user.role,
                enrolled_course_ids: [],
            })
            .select()
            .single();

        if (error || !data) throw new Error(error?.message ?? 'Failed to create user');
        return this.mapRow(data);
    }

    async enrollInCourse(userId: string, courseId: string): Promise<void> {
        const supabase = createClient();

        // Fetch existing enrollments
        const { data: profile, error: fetchError } = await (await supabase)
            .from('profiles')
            .select('enrolled_course_ids')
            .eq('id', userId)
            .single();

        if (fetchError || !profile) throw new Error('User not found');

        const current: string[] = profile.enrolled_course_ids ?? [];
        if (current.includes(courseId)) return; // já matriculado

        const { error: updateError } = await (await supabase)
            .from('profiles')
            .update({ enrolled_course_ids: [...current, courseId] })
            .eq('id', userId);

        if (updateError) throw new Error(updateError.message);
    }

    private mapRow(row: Record<string, unknown>): User {
        return {
            id: row.id as string,
            name: row.name as string,
            email: row.email as string,
            role: row.role as 'STUDENT' | 'ADMIN',
            enrolledCourseIds: (row.enrolled_course_ids as string[]) ?? [],
        };
    }
}
