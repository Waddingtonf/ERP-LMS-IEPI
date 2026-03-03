"use server";

import { revalidatePath } from "next/cache";
import { getCourseRepository } from "@/lms/repositories";
import { Course, Material, Module } from "@/lms/repositories/CourseRepository";

export async function getCourses(): Promise<Course[]> {
    return getCourseRepository().findAll();
}

export async function getCourseById(id: string): Promise<Course | null> {
    return getCourseRepository().findById(id);
}

export async function createCourseAction(formData: FormData) {
    const title            = formData.get('title')            as string;
    const description      = formData.get('description')      as string ?? '';
    const price            = Number(formData.get('price'));
    const type             = formData.get('type')             as string ?? '';
    const instructor       = formData.get('instructor')       as string ?? '';
    const hours            = formData.get('hours')            as string ?? '';
    const startDate        = formData.get('startDate')        as string ?? '';
    const endDate          = formData.get('endDate')          as string ?? '';
    const schedule         = formData.get('schedule')         as string ?? '';
    const corenRequired    = formData.get('corenRequired')    === 'true';
    const maxInstallments  = Number(formData.get('maxInstallments') ?? 12);
    const imageUrl         = formData.get('imageUrl')         as string ?? undefined;

    const course = await getCourseRepository().create({
        title, description, price,
        type, instructor, hours,
        startDate, endDate, schedule,
        corenRequired, maxInstallments,
        ...(imageUrl ? { imageUrl } : {}),
    });
    revalidatePath('/admin/cursos');
    return course;
}

export async function addModuleAction(courseId: string, formData: FormData) {
    const title = formData.get('title') as string;

    await getCourseRepository().addModule(courseId, { title });
    revalidatePath(`/admin/cursos/${courseId}`);
    revalidatePath('/admin/cursos');
}

export async function addMaterialAction(
    courseId: string,
    moduleId: string,
    formData: FormData,
) {
    const title = formData.get('title') as string;
    const type  = formData.get('type')  as Material['type'];
    const url   = formData.get('url')   as string;

    await getCourseRepository().addMaterial(courseId, moduleId, { title, type, url });
    revalidatePath(`/admin/cursos/${courseId}`);
}
