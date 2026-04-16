import { getAulasByTurma, getTurmaById } from "@/lms/actions/turmaActions";
import { getProgressoCurso } from "@/lms/actions/progressoActions";
import ClassroomClient from "./ClassroomClient";
import { notFound } from "next/navigation";

export default async function TurmaClassroomPage({ params }: { params: Promise<{ turmaId: string }> }) {
    const { turmaId } = await params;
    const turma = await getTurmaById(turmaId);
    if (!turma) return notFound();

    const aulas = await getAulasByTurma(turmaId);
    if (!aulas || aulas.length === 0) return (
        <div className="p-8 text-center text-slate-500 bg-white rounded-2xl shadow-sm border border-slate-200">
            <h2 className="text-xl font-bold text-slate-800 mb-2">Nenhuma aula cadastrada</h2>
            <p>Ainda não há conteúdo disponível para a turma {turma.courseName}.</p>
        </div>
    );

    const progresso = await getProgressoCurso(turma.courseId);

    const modulesMap = new Map<string, typeof aulas>();
    aulas.sort((a, b) => new Date(`${a.date}T${a.startTime}`).getTime() - new Date(`${b.date}T${b.startTime}`).getTime());

    aulas.forEach(aula => {
        const mod = aula.moduleName || "Módulo Único";
        if (!modulesMap.has(mod)) modulesMap.set(mod, []);
        modulesMap.get(mod)!.push(aula);
    });

    const modulesList = Array.from(modulesMap.entries()).map(([moduleName, moduleAulas], idx) => ({
        id: `m${idx}`,
        title: moduleName,
        lessons: moduleAulas.map((a) => {
            const prog = progresso.records.find(r => r.aulaId === a.id);
            return {
                id: a.id,
                title: a.title,
                duration: `${a.durationMinutes} min`,
                blocked: false,
                completed: !!prog?.concluida,
                videoUrl: "https://www.youtube.com/embed/ScMzIvxBSi4", // mock video for MVP
            };
        })
    }));

    const courseData = {
        id: turma.courseId,
        title: turma.courseName,
        totalLessons: aulas.length,
        completedLessons: progresso.records.filter(r => r.concluida).length,
        modules: modulesList
    };

    return <ClassroomClient courseData={courseData} turmaId={turmaId} courseId={turma.courseId} />;
}
