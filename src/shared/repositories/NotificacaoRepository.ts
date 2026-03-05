// -------------------------------------------------------------------
// NotificacaoRepository — Shared domain
// -------------------------------------------------------------------

export type NotificacaoTipo = 'info' | 'sucesso' | 'aviso' | 'erro';
export type NotificacaoDestino = 'Aluno' | 'Docente' | 'Admin' | 'Financeiro' | 'Todos';

export interface Notificacao {
    id: string;
    usuarioId: string;
    titulo: string;
    mensagem: string;
    tipo: NotificacaoTipo;
    link: string | null;
    lida: boolean;
    criadaEm: string;
    lidaEm: string | null;
    origem: string; // módulo que gerou (ex: 'financeiro', 'academico', 'crm')
}

export interface INotificacaoRepository {
    findByUsuario(usuarioId: string): Promise<Notificacao[]>;
    countUnread(usuarioId: string): Promise<number>;
    marcarLida(id: string): Promise<void>;
    marcarTodasLidas(usuarioId: string): Promise<void>;
    create(notificacao: Omit<Notificacao, 'id' | 'criadaEm' | 'lidaEm'>): Promise<Notificacao>;
    delete(id: string): Promise<void>;
}
