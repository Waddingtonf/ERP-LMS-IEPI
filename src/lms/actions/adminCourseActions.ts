"use server";

import { revalidatePath } from "next/cache";
import { getCourseRepository } from "@/lms/repositories";
import { Course, CourseUpdateInput, Material, Module } from "@/lms/repositories/CourseRepository";

export async function getCourses(): Promise<Course[]> {
    return (await getCourseRepository()).findAll();
}

export async function getCourseById(id: string): Promise<Course | null> {
    return (await getCourseRepository()).findById(id);
}

export async function createCourseAction(formData: FormData) {
    const title            = formData.get('title')            as string;
    const description      = formData.get('description')      as string ?? '';
    const price            = Number(formData.get('price'));
    const type             = formData.get('type')             as string ?? '';
    const courseMode       = (formData.get('courseMode')      as Course['courseMode']) ?? 'CursoLivre';
    const instructor       = formData.get('instructor')       as string ?? '';
    const hours            = formData.get('hours')            as string ?? '';
    const startDate        = formData.get('startDate')        as string ?? '';
    const endDate          = formData.get('endDate')          as string ?? '';
    const schedule         = formData.get('schedule')         as string ?? '';
    const corenRequired    = formData.get('corenRequired')    === 'true';
    const maxInstallments  = Number(formData.get('maxInstallments') ?? 12);
    const bundlePrice      = formData.get('bundlePrice') ? Number(formData.get('bundlePrice')) : undefined;
    const imageUrl         = formData.get('imageUrl')         as string ?? undefined;

    const course = await (await getCourseRepository()).create({
        title, description, price,
        type, courseMode, instructor, hours,
        startDate, endDate, schedule,
        corenRequired, maxInstallments,
        ...(bundlePrice ? { bundlePrice } : {}),
        ...(imageUrl ? { imageUrl } : {}),
    });
    revalidatePath('/admin/cursos');
    return course;
}

export async function updateCourseAction(courseId: string, data: CourseUpdateInput) {
    const updated = await (await getCourseRepository()).update(courseId, data);
    revalidatePath('/admin/cursos');
    revalidatePath(`/admin/cursos/${courseId}`);
    return updated;
}

export async function publishCourseAction(courseId: string, isPublished: boolean) {
    const updated = await (await getCourseRepository()).update(courseId, { isPublished });
    revalidatePath('/admin/cursos');
    revalidatePath(`/admin/cursos/${courseId}`);
    return updated;
}

export async function addModuleAction(courseId: string, formData: FormData) {
    const title                = formData.get('title')               as string;
    const price                = Number(formData.get('price') ?? 0);
    const isSellableStandalone = formData.get('isSellableStandalone') === 'true';
    const sortOrder            = Number(formData.get('sortOrder') ?? 0);

    await (await getCourseRepository()).addModule(courseId, { title, price, isSellableStandalone, sortOrder });
    revalidatePath(`/admin/cursos/${courseId}`);
    revalidatePath('/admin/cursos');
}

export async function updateModuleAction(
    courseId: string,
    moduleId: string,
    data: Partial<Omit<Module, 'id' | 'materials'>>,
) {
    await (await getCourseRepository()).updateModule(courseId, moduleId, data);
    revalidatePath(`/admin/cursos/${courseId}`);
}

export async function deleteModuleAction(courseId: string, moduleId: string) {
    await (await getCourseRepository()).deleteModule(courseId, moduleId);
    revalidatePath(`/admin/cursos/${courseId}`);
}

export async function addMaterialAction(
    courseId: string,
    moduleId: string,
    formData: FormData,
) {
    const title = formData.get('title') as string;
    const type  = formData.get('type')  as Material['type'];
    const url   = formData.get('url')   as string;

    await (await getCourseRepository()).addMaterial(courseId, moduleId, { title, type, url });
    revalidatePath(`/admin/cursos/${courseId}`);
}

export async function deleteMaterialAction(courseId: string, moduleId: string, materialId: string) {
    await (await getCourseRepository()).deleteMaterial(courseId, moduleId, materialId);
    revalidatePath(`/admin/cursos/${courseId}`);
}
