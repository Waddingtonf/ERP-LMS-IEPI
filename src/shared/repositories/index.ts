import { INotificacaoRepository } from './NotificacaoRepository';
import { MockNotificacaoRepository } from './MockNotificacaoRepository';

let _notificacao: INotificacaoRepository | null = null;

export function getNotificacaoRepository(): INotificacaoRepository { return (_notificacao ??= new MockNotificacaoRepository()); }
