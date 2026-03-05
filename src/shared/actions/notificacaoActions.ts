"use server";

import { revalidatePath } from "next/cache";
import { getNotificacaoRepository } from "@/shared/repositories";
import type { Notificacao, NotificacaoTipo } from "@/shared/repositories/NotificacaoRepository";

export async function getNotificacoes(usuarioId: string): Promise<Notificacao[]> {
    return getNotificacaoRepository().findByUsuario(usuarioId);
}

export async function countUnreadNotificacoes(usuarioId: string): Promise<number> {
    return getNotificacaoRepository().countUnread(usuarioId);
}

export async function marcarNotificacaoLida(id: string, usuarioId: string): Promise<void> {
    await getNotificacaoRepository().marcarLida(id);
    revalidatePath(`/api/notificacoes`);
}

export async function marcarTodasLidas(usuarioId: string): Promise<void> {
    await getNotificacaoRepository().marcarTodasLidas(usuarioId);
    revalidatePath(`/api/notificacoes`);
}

export async function criarNotificacao(data: {
    usuarioId: string;
    titulo: string;
    mensagem: string;
    tipo: NotificacaoTipo;
    link?: string;
    origem: string;
}): Promise<Notificacao> {
    return getNotificacaoRepository().create({
        ...data,
        link: data.link ?? null,
        lida: false,
        origem: data.origem,
    });
}

export type { Notificacao, NotificacaoTipo };
