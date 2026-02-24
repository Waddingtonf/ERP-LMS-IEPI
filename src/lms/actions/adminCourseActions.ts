"use server";

import { revalidatePath } from "next/cache";
import { courseRepository } from "@/lms/repositories/MockCourseRepository";
import { Course, Material, Module } from "@/lms/repositories/CourseRepository";

export async function getCourses(): Promise<Course[]> {
    return courseRepository.findAll();
}

export async function getCourseById(id: string): Promise<Course | null> {
    return courseRepository.findById(id);
}

export async function createCourseAction(formData: FormData) {
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const price = parseFloat(formData.get("price") as string);

    const newCourse = await courseRepository.create({
        title,
        description,
        price,
    });

    revalidatePath("/admin/cursos");
    return newCourse;
}

export async function addModuleAction(courseId: string, formData: FormData) {
    const title = formData.get("title") as string;

    await courseRepository.addModule(courseId, { title });
    revalidatePath(`/admin/cursos/${courseId}`);
    revalidatePath("/admin/cursos");
}

export async function addMaterialAction(
    courseId: string,
    moduleId: string,
    formData: FormData
) {
    const title = formData.get("title") as string;
    const type = formData.get("type") as "PDF" | "VIDEO" | "LINK";
    const url = formData.get("url") as string;

    await courseRepository.addMaterial(courseId, moduleId, {
        title,
        type,
        url,
    });

    revalidatePath(`/admin/cursos/${courseId}`);
}
