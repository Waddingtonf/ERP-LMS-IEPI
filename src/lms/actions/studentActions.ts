"use server";

import { getUserRepository } from "@/lms/repositories";
import { getCourseById } from "./adminCourseActions";

// Em um cenário real, pegaríamos o ID da sessão (NextAuth ou Supabase Auth)
// Para o sandbox, vamos fixar o ID do nosso aluno de teste.
const STUDENT_MOCK_ID = 'student-1';

export async function getStudentDashboardData() {
    const user = await getUserRepository().findById(STUDENT_MOCK_ID);
    if (!user) {
        throw new Error("Student not found in mock auth");
    }

    // Buscar os curos que ele está matriculado
    const enrolledCourses = await Promise.all(
        user.enrolledCourseIds.map(id => getCourseById(id))
    );

    return {
        user,
        // Remover nulls e mapear para a estrutura da view
        enrollments: enrolledCourses.filter(Boolean).map(course => ({
            id: `e-${course!.id}`,
            courseId: course!.id,
            title: course!.title,
            // Para o sandbox, estamos simulando o tipo e progresso
            type: "Curso Online",
            progress: 0, // Mock: recém matriculado
            lastAccessed: "Módulo 1",
            thumbnail: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=600&auto=format&fit=crop"
        }))
    };
}
