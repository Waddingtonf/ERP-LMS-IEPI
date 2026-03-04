"use server";

import { getUserRepository, getCourseRepository, getEnrollmentRepository, isMockMode } from "@/lms/repositories";

async function resolveStudentId(): Promise<string> {
    if (isMockMode) return 'student-1';
    const { createClient } = await import('@/lib/supabase/server');
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Nao autenticado');
    return user.id;
}

export async function getStudentDashboardData() {
    const studentId = await resolveStudentId();
    const userRepo       = await getUserRepository();
    const courseRepo     = await getCourseRepository();
    const enrollmentRepo = getEnrollmentRepository();

    const user = await userRepo.findById(studentId);
    if (!user) throw new Error('Student not found');

    const enrollments = await enrollmentRepo.findByAluno(studentId);

    const enriched = await Promise.all(
        enrollments.map(async enr => {
            const course = await courseRepo.findById(enr.courseId);
            return {
                id:           enr.id,
                courseId:     enr.courseId,
                title:        enr.courseName,
                type:         course?.type ?? 'Curso Online',
                moduleId:     enr.moduleId,
                moduleName:   enr.moduleName,
                turmaId:      enr.turmaId,
                status:       enr.status,
                dataMatricula: enr.dataMatricula,
                amountPaid:   enr.amountPaid,
                progress:     0,
                lastAccessed: enr.moduleName ?? 'Modulo 1',
                thumbnail:    course?.imageUrl ?? 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=600&auto=format&fit=crop',
            };
        })
    );

    return { user, enrollments: enriched };
}
