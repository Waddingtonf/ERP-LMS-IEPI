import { getAvaliacaoById, getNotasByAvaliacao } from "@/lms/actions/avaliacaoActions";
import { getEnrollmentsByTurma } from "@/lms/actions/enrollmentActions";
import LancamentoNotasClient from "./_components/LancamentoNotasClient";
import { notFound } from "next/navigation";

export default async function LancamentoNotasPage({ params }: { params: Promise<{ avaliacaoId: string }> }) {
    const { avaliacaoId } = await params;

    const avaliacao = await getAvaliacaoById(avaliacaoId);
    if (!avaliacao) return notFound();

    const notas = await getNotasByAvaliacao(avaliacaoId);
    const enrollments = await getEnrollmentsByTurma(avaliacao.turmaId);

    // Prepare table data: combine enrollments with existing notas
    const alunosList = enrollments.map(enr => {
        const notaObj = notas.find(n => n.alunoId === enr.alunoId);
        return {
            alunoId: enr.alunoId,
            alunoNome: enr.alunoName,
            notaAtual: notaObj?.nota ?? null,
            observacao: notaObj?.observacao ?? "",
        };
    });

    return (
        <LancamentoNotasClient
            avaliacao={avaliacao}
            alunos={alunosList}
        />
    );
}
