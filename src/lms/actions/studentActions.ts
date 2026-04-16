"use server";

import { getUserRepository, getCourseRepository, getEnrollmentRepository } from "@/lms/repositories";

import { requireAuth } from "@/lib/auth/session";
import { NotFoundError } from "@/lib/errors";

export async function getStudentDashboardData() {
    const studentId = await requireAuth('STUDENT');
    const userRepo = await getUserRepository();
    const courseRepo = await getCourseRepository();
    const enrollmentRepo = await getEnrollmentRepository();

    const user = await userRepo.findById(studentId);
    if (!user) throw new NotFoundError('Student', studentId);

    const enrollments = await enrollmentRepo.findByAluno(studentId);

    const enriched = await Promise.all(
        enrollments.map(async enr => {
            const course = await courseRepo.findById(enr.courseId);
            return {
                id: enr.id,
                courseId: enr.courseId,
                title: enr.courseName,
                type: course?.type ?? 'Curso Online',
                moduleId: enr.moduleId,
                moduleName: enr.moduleName,
                turmaId: enr.turmaId,
                status: enr.status,
                dataMatricula: enr.dataMatricula,
                amountPaid: enr.amountPaid,
                progress: 0,
                lastAccessed: enr.moduleName ?? 'Modulo 1',
                thumbnail: course?.imageUrl ?? 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=600&auto=format&fit=crop',
            };
        })
    );

    return { user, enrollments: enriched };
}
