import { createClient } from '@/lib/supabase/server';
import { ICourseRepository, Course, CourseInput, CourseUpdateInput, Module, Material } from './CourseRepository';

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
                type, instructor, hours, start_date, end_date,
                schedule, coren_required, max_installments, image_url,
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
                type, instructor, hours, start_date, end_date,
                schedule, coren_required, max_installments, image_url,
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

    async create(course: CourseInput): Promise<Course> {
        const supabase = await createClient();
        const { data, error } = await supabase
            .from('courses')
            .insert({
                title:            course.title,
                description:      course.description,
                price:            course.price,
                type:             course.type            ?? '',
                instructor:       course.instructor      ?? '',
                hours:            course.hours           ?? '',
                start_date:       course.startDate       ?? '',
                end_date:         course.endDate         ?? '',
                schedule:         course.schedule        ?? '',
                coren_required:   course.corenRequired   ?? false,
                max_installments: course.maxInstallments ?? 1,
                image_url:        course.imageUrl        ?? null,
            })
            .select()
            .single();

        if (error || !data) throw new Error(error?.message ?? 'Failed to create course');
        return this.mapRow({ ...data, modules: [] });
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
            .insert({ title: material.title, type: material.type, url: material.url, module_id: moduleId })
            .select()
            .single();
        if (error || !data) throw new Error(error?.message ?? 'Failed to create material');
        return data as Material;
    }

    async update(id: string, data: CourseUpdateInput): Promise<Course> {
        const supabase = await createClient();
        const mapped: Record<string, unknown> = {};
        if (data.title           !== undefined) mapped.title            = data.title;
        if (data.description     !== undefined) mapped.description      = data.description;
        if (data.price           !== undefined) mapped.price            = data.price;
        if (data.bundlePrice     !== undefined) mapped.bundle_price     = data.bundlePrice;
        if (data.type            !== undefined) mapped.type             = data.type;
        if (data.courseMode      !== undefined) mapped.course_mode      = data.courseMode;
        if (data.instructor      !== undefined) mapped.instructor       = data.instructor;
        if (data.hours           !== undefined) mapped.hours            = data.hours;
        if (data.startDate       !== undefined) mapped.start_date       = data.startDate;
        if (data.endDate         !== undefined) mapped.end_date         = data.endDate;
        if (data.schedule        !== undefined) mapped.schedule         = data.schedule;
        if (data.corenRequired   !== undefined) mapped.coren_required   = data.corenRequired;
        if (data.maxInstallments !== undefined) mapped.max_installments = data.maxInstallments;
        if (data.isPublished     !== undefined) mapped.is_published     = data.isPublished;
        if (data.imageUrl        !== undefined) mapped.image_url        = data.imageUrl;
        const { data: row, error } = await supabase.from('courses').update(mapped).eq('id', id).select().single();
        if (error || !row) throw new Error(error?.message ?? 'Course not found');
        return this.mapRow({ ...row, modules: [] });
    }

    async updateModule(courseId: string, moduleId: string, data: Partial<Omit<Module, 'id' | 'materials'>>): Promise<Module> {
        const supabase = await createClient();
        const mapped: Record<string, unknown> = {};
        if (data.title                !== undefined) mapped.title                  = data.title;
        if (data.price                !== undefined) mapped.price                  = data.price;
        if (data.isSellableStandalone !== undefined) mapped.is_sellable_standalone = data.isSellableStandalone;
        if (data.sortOrder            !== undefined) mapped.sort_order             = data.sortOrder;
        const { data: row, error } = await supabase.from('modules').update(mapped).eq('id', moduleId).select().single();
        if (error || !row) throw new Error(error?.message ?? 'Module not found');
        return { id: row.id, title: row.title, price: row.price ?? 0, isSellableStandalone: row.is_sellable_standalone ?? false, sortOrder: row.sort_order ?? 0, materials: [] };
    }

    async deleteModule(courseId: string, moduleId: string): Promise<void> {
        const supabase = await createClient();
        const { error } = await supabase.from('modules').delete().eq('id', moduleId);
        if (error) throw new Error(error.message);
    }

    async deleteMaterial(courseId: string, moduleId: string, materialId: string): Promise<void> {
        const supabase = await createClient();
        const { error } = await supabase.from('materials').delete().eq('id', materialId);
        if (error) throw new Error(error.message);
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private mapRow(row: any): Course {
        return {
            id:              row.id,
            title:           row.title,
            description:     row.description,
            price:           row.price,
            bundlePrice:     row.bundle_price    ?? undefined,
            courseMode:      row.course_mode     ?? 'CursoLivre',
            type:            row.type            ?? '',
            instructor:      row.instructor      ?? '',
            hours:           row.hours           ?? '',
            startDate:       row.start_date      ?? '',
            endDate:         row.end_date        ?? '',
            schedule:        row.schedule        ?? '',
            corenRequired:   row.coren_required  ?? false,
            maxInstallments: row.max_installments ?? 1,
            isPublished:     row.is_published    ?? false,
            imageUrl:        row.image_url       ?? undefined,
            modules: (row.modules ?? []).map((m: any) => ({
                id:                   m.id,
                title:                m.title,
                price:                m.price                  ?? 0,
                isSellableStandalone: m.is_sellable_standalone ?? false,
                sortOrder:            m.sort_order             ?? 0,
                materials:            (m.materials ?? []) as Material[],
            })),
        };
    }
}
