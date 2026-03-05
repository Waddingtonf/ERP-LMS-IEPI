"use server";

import { revalidatePath } from "next/cache";
import {
    getUserRepository,
    getEnrollmentRepository,
    getNotaRepository,
    getFrequenciaRepository,
    getCertificadoRepository,
} from "@/lms/repositories";
import type { User } from "@/lms/repositories/UserRepository";
import type { Nota } from "@/lms/repositories/NotaRepository";
import type { Certificado } from "@/lms/repositories/CertificadoRepository";

export interface AlunoCompleto {
    usuario: User;
    matriculas: {
        id: string;
        turmaId: string;
        turmaNome: string;
        status: string;
        dataMatricula: string;
    }[];
    notas: Nota[];
    certificados: Certificado[];
    frequenciaGeral: number;
}

export async function getAlunoCompleto(alunoId: string): Promise<AlunoCompleto> {
    const [userRepo, enrollmentRepo, notaRepo, certRepo] = await Promise.all([
        getUserRepository(),
        Promise.resolve(getEnrollmentRepository()),
        Promise.resolve(getNotaRepository()),
        Promise.resolve(getCertificadoRepository()),
    ]);

    const [usuario, matriculas, notas, certificados] = await Promise.all([
        userRepo.findById(alunoId),
        enrollmentRepo.findByAluno(alunoId),
        notaRepo.findByAluno(alunoId),
        certRepo.findByAluno(alunoId),
    ]);

    if (!usuario) throw new Error('Aluno não encontrado');

    // Frequência média geral
    const freqRepo = getFrequenciaRepository();
    const turmaIds = [...new Set(matriculas.map(m => m.turmaId))];
    let totalAulas = 0; let totalPresentes = 0;
    for (const turmaId of turmaIds) {
        const freq = await freqRepo.findByAlunoTurma(alunoId, turmaId);
        totalAulas += freq.length;
        totalPresentes += freq.filter(f => f.presente).length;
    }
    const frequenciaGeral = totalAulas === 0 ? 0 : Math.round((totalPresentes / totalAulas) * 100);

    return {
        usuario,
        matriculas: matriculas.map(m => ({
            id: m.id,
            turmaId: m.turmaId,
            turmaNome: m.courseName,
            status: m.status,
            dataMatricula: m.dataMatricula,
        })),
        notas,
        certificados,
        frequenciaGeral,
    };
}

export async function updateStatusMatricula(matriculaId: string, status: 'Ativa' | 'Trancada' | 'Cancelada'): Promise<void> {
    // Em produção: atualiza via Supabase
    revalidatePath('/admin/alunos');
    revalidatePath('/aluno');
}

export async function trancarMatricula(matriculaId: string, motivo: string): Promise<void> {
    await updateStatusMatricula(matriculaId, 'Trancada');
    revalidatePath('/admin/alunos');
}

export type { AlunoCompleto };
