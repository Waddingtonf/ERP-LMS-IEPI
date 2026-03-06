import { INotificacaoRepository } from './NotificacaoRepository';
import { MockNotificacaoRepository } from './MockNotificacaoRepository';
import { IMensagemRepository }    from './MensagemRepository';
import { MockMensagemRepository } from './MockMensagemRepository';

let _notificacao: INotificacaoRepository | null = null;
let _mensagem:    IMensagemRepository    | null = null;

export function getNotificacaoRepository(): INotificacaoRepository { return (_notificacao ??= new MockNotificacaoRepository()); }
export function getMensagemRepository():    IMensagemRepository    { return (_mensagem    ??= new MockMensagemRepository()); }
