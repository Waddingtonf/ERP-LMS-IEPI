"use server";

import { getUserRepository, getCourseRepository } from "@/lms/repositories";
import { Course } from "@/lms/repositories/CourseRepository";

/** Sandbox only. In production derive this from the authenticated session. */
const SANDBOX_STUDENT_ID = 'student-1';

export async function getStudentDashboardData() {
    const user = await getUserRepository().findById(SANDBOX_STUDENT_ID);
    if (!user) throw new Error('Student not found');

    const enrolledCourses = await Promise.all(
        user.enrolledCourseIds.map(id => getCourseRepository().findById(id))
    );

    return {
        user,
        enrollments: enrolledCourses
            .filter((c): c is Course => c !== null)
            .map(course => ({
                id:           `e-${course.id}`,
                courseId:     course.id,
                title:        course.title,
                type:         'Curso Online',
                progress:     0,
                lastAccessed: 'Módulo 1',
                thumbnail:    'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=600&auto=format&fit=crop',
            })),
    };
}
