"use server";

import { revalidatePath } from "next/cache";
import { getMensagemRepository } from "@/shared/repositories";
import type { Mensagem, MensagemCategoria } from "@/shared/repositories/MensagemRepository";

export async function getCaixaEntrada(usuarioId: string): Promise<Mensagem[]> {
    return getMensagemRepository().findCaixaEntrada(usuarioId);
}

export async function getMensagensEnviadas(usuarioId: string): Promise<Mensagem[]> {
    return getMensagemRepository().findEnviadas(usuarioId);
}

export async function getThread(parentId: string): Promise<Mensagem[]> {
    return getMensagemRepository().findThread(parentId);
}

export async function countMensagensNaoLidas(usuarioId: string): Promise<number> {
    return getMensagemRepository().countUnread(usuarioId);
}

export async function marcarMensagemLida(id: string): Promise<void> {
    await getMensagemRepository().marcarLida(id);
    revalidatePath('/aluno/mensagens');
    revalidatePath('/docente/mensagens');
}

export async function enviarMensagem(data: {
    remetenteId: string;
    remetenteNome: string;
    remetentePerfil: Mensagem['remetentePerfil'];
    destinatarioId: string;
    destinatarioNome: string;
    destinatarioPerfil: Mensagem['destinatarioPerfil'];
    assunto: string;
    corpo: string;
    categoria: MensagemCategoria;
    prioridade?: Mensagem['prioridade'];
    cc?: string[];
}): Promise<Mensagem> {
    const msg = await getMensagemRepository().enviar({
        ...data,
        parentId: null,
        prioridade: data.prioridade ?? 'Normal',
        cc: data.cc ?? [],
    });
    revalidatePath('/aluno/mensagens');
    revalidatePath('/docente/mensagens');
    revalidatePath('/admin/mensagens');
    return msg;
}

export async function responderMensagem(parentId: string, remetenteId: string, corpo: string): Promise<Mensagem> {
    const msg = await getMensagemRepository().responder(parentId, remetenteId, corpo);
    revalidatePath('/aluno/mensagens');
    revalidatePath('/docente/mensagens');
    return msg;
}

export async function arquivarMensagem(id: string): Promise<void> {
    await getMensagemRepository().arquivar(id);
    revalidatePath('/aluno/mensagens');
    revalidatePath('/docente/mensagens');
}

export type { Mensagem, MensagemCategoria };
