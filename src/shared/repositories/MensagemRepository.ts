// -------------------------------------------------------------------
// MensagemRepository — Internal messaging (SIGAA Mensagens)
// -------------------------------------------------------------------

export type MensagemCategoria =
    | 'Geral'
    | 'Academico'
    | 'Financeiro'
    | 'Suporte'
    | 'Aviso';

export interface Mensagem {
    id: string;
    remetenteId: string;
    remetenteNome: string;
    remetentePerfil: 'Aluno' | 'Docente' | 'Admin' | 'Financeiro';
    destinatarioId: string;
    destinatarioNome: string;
    destinatarioPerfil: 'Aluno' | 'Docente' | 'Admin' | 'Financeiro' | 'Todos';
    assunto: string;
    corpo: string;
    categoria: MensagemCategoria;
    /** thread parent id for replies */
    parentId: string | null;
    lida: boolean;
    arquivada: boolean;
    enviadoEm: string; // ISO
    lidaEm: string | null;
    /** CC list — user ids */
    cc: string[];
    prioridade: 'Normal' | 'Urgente';
}

export interface IMensagemRepository {
    findCaixaEntrada(usuarioId: string): Promise<Mensagem[]>;
    findEnviadas(usuarioId: string): Promise<Mensagem[]>;
    findThread(parentId: string): Promise<Mensagem[]>;
    findById(id: string): Promise<Mensagem | null>;
    countUnread(usuarioId: string): Promise<number>;
    marcarLida(id: string): Promise<void>;
    arquivar(id: string): Promise<void>;
    responder(parentId: string, remetenteId: string, corpo: string): Promise<Mensagem>;
    enviar(msg: Omit<Mensagem, 'id' | 'enviadoEm' | 'lida' | 'lidaEm' | 'arquivada'>): Promise<Mensagem>;
    delete(id: string): Promise<void>;
}
