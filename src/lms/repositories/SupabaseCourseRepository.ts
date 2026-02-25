import { createClient } from '@/lib/supabase/server';
import { ICourseRepository, Course, Module, Material } from './CourseRepository';

/**
 * Implementação real em Supabase para CourseRepository.
 * Tabelas esperadas: courses, modules, materials
 */
export class SupabaseCourseRepository implements ICourseRepository {
    async findAll(): Promise<Course[]> {
        const supabase = await createClient();
        const { data: courses, error } = await supabase
            .from('courses')
            .select(`
                id, title, description, price,
                modules (
                    id, title, course_id,
                    materials ( id, title, type, url, module_id )
                )
            `)
            .order('created_at', { ascending: false });

        if (error) throw new Error(error.message);
        return (courses ?? []).map(this.mapRow);
    }

    async findById(id: string): Promise<Course | null> {
        const supabase = await createClient();
        const { data, error } = await supabase
            .from('courses')
            .select(`
                id, title, description, price,
                modules (
                    id, title, course_id,
                    materials ( id, title, type, url, module_id )
                )
            `)
            .eq('id', id)
            .single();

        if (error || !data) return null;
        return this.mapRow(data);
    }

    async create(course: Omit<Course, 'id' | 'modules'>): Promise<Course> {
        const supabase = await createClient();
        const { data, error } = await supabase
            .from('courses')
            .insert({
                title: course.title,
                description: course.description,
                price: course.price,
            })
            .select()
            .single();

        if (error || !data) throw new Error(error?.message ?? 'Failed to create course');
        return { ...data, modules: [] };
    }

    async addModule(courseId: string, module: Omit<Module, 'id' | 'materials'>): Promise<Module> {
        const supabase = await createClient();
        const { data, error } = await supabase
            .from('modules')
            .insert({ title: module.title, course_id: courseId })
            .select()
            .single();

        if (error || !data) throw new Error(error?.message ?? 'Failed to create module');
        return { ...data, materials: [] };
    }

    async addMaterial(courseId: string, moduleId: string, material: Omit<Material, 'id'>): Promise<Material> {
        const supabase = await createClient();
        const { data, error } = await supabase
            .from('materials')
            .insert({
                title: material.title,
                type: material.type,
                url: material.url,
                module_id: moduleId,
            })
            .select()
            .single();

        if (error || !data) throw new Error(error?.message ?? 'Failed to create material');
        return data as Material;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private mapRow(row: any): Course {
        return {
            id: row.id,
            title: row.title,
            description: row.description,
            price: row.price,
            modules: (row.modules ?? []).map((m: any) => ({
                id: m.id,
                title: m.title,
                materials: (m.materials ?? []) as Material[],
            })),
        };
    }
}
