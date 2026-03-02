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
    const title       = formData.get('title')       as string;
    const description = formData.get('description') as string;
    const price       = Number(formData.get('price'));

    const course = await getCourseRepository().create({ title, description, price });
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
