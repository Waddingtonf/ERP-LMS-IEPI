/**
 * NotificationService — unified notifications (in-app + future push/email)
 *
 * Always produces in-app Notificacao records.
 * Future: add email/push channel dispatch here without touching callers.
 */
import { getNotificacaoRepository } from '@/shared/repositories';

export interface NotificationPayload {
    usuarioId: string;
    titulo: string;
    mensagem: string;
    tipo?: 'info' | 'sucesso' | 'aviso' | 'erro';
    /** Extra metadata stored for future email/push use */
    metadata?: Record<string, unknown>;
}

export class NotificationService {
    async notify(payload: NotificationPayload): Promise<void> {
        const repo = await getNotificacaoRepository();
        await repo.create({
            usuarioId: payload.usuarioId,
            titulo: payload.titulo,
            mensagem: payload.mensagem,
            tipo: payload.tipo ?? 'info',
            lida: false,
            link: null,
            origem: (payload.metadata?.origem as string) ?? 'sistema',
        });
    }

    async notifyMany(userIds: string[], payload: Omit<NotificationPayload, 'usuarioId'>): Promise<void> {
        await Promise.all(userIds.map((uid) => this.notify({ ...payload, usuarioId: uid })));
    }

    async markRead(notificacaoId: string): Promise<void> {
        const repo = await getNotificacaoRepository();
        await repo.marcarLida(notificacaoId);
    }

    async getForUser(usuarioId: string) {
        const repo = await getNotificacaoRepository();
        return repo.findByUsuario(usuarioId);
    }
}
