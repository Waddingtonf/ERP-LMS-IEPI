import { INotificacaoRepository, Notificacao } from './NotificacaoRepository';

const SEED: Notificacao[] = [
    { id: 'ntf-1', usuarioId: 'student-1', titulo: 'Nova Aula Disponível', mensagem: 'A Aula 03 — Protocolos de Quimioterapia foi publicada pelo Prof. Marcos Oliveira.', tipo: 'info', link: '/aluno/aulas/aula-3', lida: false, criadaEm: '2026-03-05T10:30:00Z', lidaEm: null, origem: 'academico' },
    { id: 'ntf-2', usuarioId: 'student-1', titulo: 'Nota Disponível', mensagem: 'Sua nota na AV1 — Biologia do Câncer foi lançada: 8,5.', tipo: 'sucesso', link: '/aluno/notas', lida: false, criadaEm: '2026-03-04T14:00:00Z', lidaEm: null, origem: 'academico' },
    { id: 'ntf-3', usuarioId: 'student-1', titulo: 'Boleto Vencendo', mensagem: 'Parcela de março vence em 3 dias. Evite multa e juros.', tipo: 'aviso', link: '/aluno/financeiro', lida: false, criadaEm: '2026-03-03T08:00:00Z', lidaEm: null, origem: 'financeiro' },
    { id: 'ntf-4', usuarioId: 'student-1', titulo: 'Material Novo — Slides TNM', mensagem: 'Prof. Marcos publicou novos slides: "Estadiamento TNM". Disponível na biblioteca.', tipo: 'info', link: '/aluno/materiais', lida: true, criadaEm: '2026-03-04T09:15:00Z', lidaEm: '2026-03-04T12:00:00Z', origem: 'academico' },
    { id: 'ntf-5', usuarioId: 'admin-1', titulo: '5 Novos Leads Hoje', mensagem: '5 novos leads foram capturados hoje via Instagram e WhatsApp.', tipo: 'info', link: '/admin/crm/leads', lida: false, criadaEm: '2026-03-05T18:00:00Z', lidaEm: null, origem: 'crm' },
    { id: 'ntf-6', usuarioId: 'admin-1', titulo: 'Triagem Pendente', mensagem: '3 candidatos aguardam validação documental na triagem.', tipo: 'aviso', link: '/admin/triagem', lida: false, criadaEm: '2026-03-05T08:30:00Z', lidaEm: null, origem: 'crm' },
    { id: 'ntf-7', usuarioId: 'docente-1', titulo: 'Frequência Pendente', mensagem: 'A Aula 03 ocorreu há 2 dias e a frequência ainda não foi registrada.', tipo: 'aviso', link: '/docente', lida: false, criadaEm: '2026-03-05T08:00:00Z', lidaEm: null, origem: 'academico' },
];

export class MockNotificacaoRepository implements INotificacaoRepository {
    private notifs: Notificacao[] = JSON.parse(JSON.stringify(SEED));

    async findByUsuario(usuarioId: string): Promise<Notificacao[]> {
        return this.notifs.filter(n => n.usuarioId === usuarioId).sort((a, b) => b.criadaEm.localeCompare(a.criadaEm));
    }

    async countUnread(usuarioId: string): Promise<number> {
        return this.notifs.filter(n => n.usuarioId === usuarioId && !n.lida).length;
    }

    async marcarLida(id: string): Promise<void> {
        const n = this.notifs.find(n => n.id === id);
        if (n) { n.lida = true; n.lidaEm = new Date().toISOString(); }
    }

    async marcarTodasLidas(usuarioId: string): Promise<void> {
        const agora = new Date().toISOString();
        this.notifs.filter(n => n.usuarioId === usuarioId && !n.lida).forEach(n => { n.lida = true; n.lidaEm = agora; });
    }

    async create(notificacao: Omit<Notificacao, 'id' | 'criadaEm' | 'lidaEm'>): Promise<Notificacao> {
        const nova: Notificacao = { ...notificacao, id: `ntf-${Date.now()}`, criadaEm: new Date().toISOString(), lidaEm: null };
        this.notifs.push(nova);
        return nova;
    }

    async delete(id: string): Promise<void> {
        const idx = this.notifs.findIndex(n => n.id === id);
        if (idx !== -1) this.notifs.splice(idx, 1);
    }
}
