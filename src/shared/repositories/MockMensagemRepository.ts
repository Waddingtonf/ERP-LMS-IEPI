import type { Mensagem, IMensagemRepository } from './MensagemRepository';

const NOW = () => new Date().toISOString();

const MOCK: Mensagem[] = [
    {
        id: 'msg-1',
        remetenteId: 'teacher-1',
        remetenteNome: 'Prof.ª Dra. Sandra Mello',
        remetentePerfil: 'Docente',
        destinatarioId: 'student-1',
        destinatarioNome: 'Maria Clara Souza',
        destinatarioPerfil: 'Aluno',
        assunto: 'Material complementar — Semana 3',
        corpo: 'Olá Maria Clara,\n\nSegue link para o material complementar sobre técnicas de acesso venoso central que usaremos na aula prática da semana 3.\n\nBons estudos!\nProf.ª Sandra.',
        categoria: 'Academico',
        parentId: null,
        lida: false,
        arquivada: false,
        enviadoEm: '2026-03-04T16:30:00Z',
        lidaEm: null,
        cc: [],
        prioridade: 'Normal',
    },
    {
        id: 'msg-2',
        remetenteId: 'admin-1',
        remetenteNome: 'Secretaria IEPI',
        remetentePerfil: 'Admin',
        destinatarioId: 'student-1',
        destinatarioNome: 'Maria Clara Souza',
        destinatarioPerfil: 'Aluno',
        assunto: 'Aviso: calendário de provas atualizado',
        corpo: 'Informamos que o calendário de provas do 1º semestre de 2026 foi atualizado. Acesse o portal para conferir as novas datas.',
        categoria: 'Aviso',
        parentId: null,
        lida: true,
        arquivada: false,
        enviadoEm: '2026-02-28T09:00:00Z',
        lidaEm: '2026-02-28T10:30:00Z',
        cc: [],
        prioridade: 'Normal',
    },
    {
        id: 'msg-3',
        remetenteId: 'financeiro-1',
        remetenteNome: 'Financeiro IEPI',
        remetentePerfil: 'Financeiro',
        destinatarioId: 'student-1',
        destinatarioNome: 'Maria Clara Souza',
        destinatarioPerfil: 'Aluno',
        assunto: '⚠️ Boleto com vencimento próximo',
        corpo: 'Prezada Maria Clara,\n\nInformamos que a parcela 3/10 do seu plano vence em 10/03/2026. Acesse o portal financeiro para emitir a 2ª via ou realizar o pagamento via PIX.\n\nAtenciosamente,\nFinanceiro IEPI.',
        categoria: 'Financeiro',
        parentId: null,
        lida: false,
        arquivada: false,
        enviadoEm: '2026-03-05T08:00:00Z',
        lidaEm: null,
        cc: [],
        prioridade: 'Urgente',
    },
    {
        id: 'msg-4',
        remetenteId: 'student-1',
        remetenteNome: 'Maria Clara Souza',
        remetentePerfil: 'Aluno',
        destinatarioId: 'teacher-1',
        destinatarioNome: 'Prof.ª Dra. Sandra Mello',
        destinatarioPerfil: 'Docente',
        assunto: 'Dúvida sobre questão 4 da P1',
        corpo: 'Boa tarde Professora,\n\nGostaria de entender melhor o critério de correção da questão 4 da P1. Acredito que minha resposta estava parcialmente correta.\n\nAguardo retorno.\nMaria Clara.',
        categoria: 'Academico',
        parentId: null,
        lida: true,
        arquivada: false,
        enviadoEm: '2026-02-27T15:00:00Z',
        lidaEm: '2026-02-27T18:00:00Z',
        cc: [],
        prioridade: 'Normal',
    },
    {
        id: 'msg-5',
        remetenteId: 'teacher-1',
        remetenteNome: 'Prof.ª Dra. Sandra Mello',
        remetentePerfil: 'Docente',
        destinatarioId: 'student-1',
        destinatarioNome: 'Maria Clara Souza',
        destinatarioPerfil: 'Aluno',
        assunto: 'Re: Dúvida sobre questão 4 da P1',
        corpo: 'Olá Maria Clara,\n\nAgradeço o contato. Analisarei sua resposta e retornarei ainda esta semana. Caso necessário, podemos agendar uma revisão individualizada.\n\nProf.ª Sandra.',
        categoria: 'Academico',
        parentId: 'msg-4',
        lida: false,
        arquivada: false,
        enviadoEm: '2026-02-27T19:30:00Z',
        lidaEm: null,
        cc: [],
        prioridade: 'Normal',
    },
];

export class MockMensagemRepository implements IMensagemRepository {
    private data = JSON.parse(JSON.stringify(MOCK)) as Mensagem[];

    async findCaixaEntrada(usuarioId: string) {
        return this.data
            .filter(m => m.destinatarioId === usuarioId && !m.arquivada && m.parentId === null)
            .sort((a, b) => b.enviadoEm.localeCompare(a.enviadoEm));
    }

    async findEnviadas(usuarioId: string) {
        return this.data
            .filter(m => m.remetenteId === usuarioId)
            .sort((a, b) => b.enviadoEm.localeCompare(a.enviadoEm));
    }

    async findThread(parentId: string) {
        return this.data.filter(m => m.id === parentId || m.parentId === parentId)
            .sort((a, b) => a.enviadoEm.localeCompare(b.enviadoEm));
    }

    async findById(id: string) {
        return this.data.find(m => m.id === id) ?? null;
    }

    async countUnread(usuarioId: string) {
        return this.data.filter(m => m.destinatarioId === usuarioId && !m.lida).length;
    }

    async marcarLida(id: string) {
        const m = this.data.find(m => m.id === id);
        if (m) { m.lida = true; m.lidaEm = NOW(); }
    }

    async arquivar(id: string) {
        const m = this.data.find(m => m.id === id);
        if (m) m.arquivada = true;
    }

    async responder(parentId: string, remetenteId: string, corpo: string) {
        const parent = await this.findById(parentId);
        if (!parent) throw new Error('Mensagem original não encontrada');
        const reply: Mensagem = {
            id: `msg-${Date.now()}`,
            remetenteId,
            remetenteNome: remetenteId,
            remetentePerfil: 'Aluno',
            destinatarioId: parent.remetenteId,
            destinatarioNome: parent.remetenteNome,
            destinatarioPerfil: parent.remetentePerfil,
            assunto: `Re: ${parent.assunto}`,
            corpo,
            categoria: parent.categoria,
            parentId,
            lida: false,
            arquivada: false,
            enviadoEm: NOW(),
            lidaEm: null,
            cc: [],
            prioridade: 'Normal',
        };
        this.data.push(reply);
        return reply;
    }

    async enviar(msg: Omit<Mensagem, 'id' | 'enviadoEm' | 'lida' | 'lidaEm' | 'arquivada'>) {
        const n: Mensagem = { ...msg, id: `msg-${Date.now()}`, lida: false, lidaEm: null, arquivada: false, enviadoEm: NOW() };
        this.data.push(n);
        return n;
    }

    async delete(id: string) {
        this.data = this.data.filter(m => m.id !== id);
    }
}
