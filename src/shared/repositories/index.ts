import { INotificacaoRepository } from './NotificacaoRepository';
import { MockNotificacaoRepository } from './MockNotificacaoRepository';
import { IMensagemRepository }    from './MensagemRepository';
import { MockMensagemRepository } from './MockMensagemRepository';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
export const isMockMode = !supabaseUrl || supabaseUrl.includes('dummy') || supabaseUrl.includes('placeholder');

let _notificacao: INotificacaoRepository | null = null;
let _mensagem:    IMensagemRepository    | null = null;

/** Async factory — will swap in Supabase implementation when a real URL is provided. */
export async function getNotificacaoRepository(): Promise<INotificacaoRepository> {
    if (_notificacao) return _notificacao;
    if (isMockMode) return (_notificacao = new MockNotificacaoRepository());
    // TODO: replace with SupabaseNotificacaoRepository when implemented
    return (_notificacao = new MockNotificacaoRepository());
}

export async function getMensagemRepository(): Promise<IMensagemRepository> {
    if (_mensagem) return _mensagem;
    if (isMockMode) return (_mensagem = new MockMensagemRepository());
    // TODO: replace with SupabaseMensagemRepository when implemented
    return (_mensagem = new MockMensagemRepository());
}

/** Force all cached instances to be re-created (useful in tests). */
export function resetSharedRepositories(): void {
    _notificacao = null;
    _mensagem = null;
}
