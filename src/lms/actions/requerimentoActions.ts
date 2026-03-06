"use server";

import { revalidatePath } from "next/cache";
import { getRequerimentoRepository } from "@/lms/repositories";
import type { Requerimento, RequerimentoTipo, RequerimentoStatus } from "@/lms/repositories/RequerimentoRepository";

export async function getRequerimentos(): Promise<Requerimento[]> {
    return getRequerimentoRepository().findAll();
}

export async function getRequerimentosByAluno(alunoId: string): Promise<Requerimento[]> {
    return getRequerimentoRepository().findByAluno(alunoId);
}

export async function getRequerimentoById(id: string): Promise<Requerimento | null> {
    return getRequerimentoRepository().findById(id);
}

export async function criarRequerimento(data: {
    alunoId: string;
    alunoNome: string;
    matricula: string;
    tipo: RequerimentoTipo;
    assunto: string;
    descricao: string;
    referenciaId?: string;
    referenciaNome?: string;
    anexos?: string[];
}): Promise<Requerimento> {
    const prazoMap: Record<RequerimentoTipo, number> = {
        'Revisao de Nota': 10,
        'Trancamento de Matricula': 15,
        'Declaracao de Matricula': 3,
        'Historico Escolar': 5,
        'Aproveitamento de Estudos': 20,
        'Dispensa de Componente': 20,
        'Alteracao de Turma': 7,
        'Segunda Chamada': 7,
        'Encerramento de Periodo': 10,
        'Outros': 10,
    };
    const prazo = new Date();
    prazo.setDate(prazo.getDate() + (prazoMap[data.tipo] ?? 10));

    const req = await getRequerimentoRepository().create({
        ...data,
        status: 'Enviado',
        anexos: data.anexos ?? [],
        referenciaId: data.referenciaId ?? null,
        referenciaNome: data.referenciaNome ?? null,
        parecerAdmin: null,
        parecerInstrutor: null,
        prazoResposta: prazo.toISOString(),
    });
    revalidatePath('/aluno/requerimentos');
    revalidatePath('/admin/secretaria');
    return req;
}

export async function analisarRequerimento(id: string, status: RequerimentoStatus, parecer: string): Promise<Requerimento> {
    const req = await getRequerimentoRepository().updateStatus(id, status, parecer);
    revalidatePath('/aluno/requerimentos');
    revalidatePath('/admin/secretaria');
    return req;
}

export async function countRequerimentosByStatus(): Promise<Record<RequerimentoStatus, number>> {
    return getRequerimentoRepository().countByStatus();
}

export type { Requerimento, RequerimentoTipo, RequerimentoStatus };
