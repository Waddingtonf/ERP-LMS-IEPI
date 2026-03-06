import type {
    AvaliacaoInstitucional,
    RespostaAvaliacaoInstitucional,
    ResultadoAvaliacao,
    RespostasAvaliacao,
    IAvaliacaoInstitucionalRepository,
} from './AvaliacaoInstitucionalRepository';

const QUESTOES_BASE = [
    { id: 'q1', categoria: 'Docente' as const, texto: 'O docente demonstra domínio do conteúdo apresentado?', tipo: 'escala' as const, obrigatoria: true },
    { id: 'q2', categoria: 'Docente' as const, texto: 'O docente apresenta didática clara e objetiva?', tipo: 'escala' as const, obrigatoria: true },
    { id: 'q3', categoria: 'Docente' as const, texto: 'O docente é pontual e respeita os horários?', tipo: 'escala' as const, obrigatoria: true },
    { id: 'q4', categoria: 'Disciplina' as const, texto: 'O conteúdo programático foi cumprido de forma satisfatória?', tipo: 'escala' as const, obrigatoria: true },
    { id: 'q5', categoria: 'Disciplina' as const, texto: 'A carga horária da disciplina é adequada ao conteúdo?', tipo: 'escala' as const, obrigatoria: true },
    { id: 'q6', categoria: 'Infraestrutura' as const, texto: 'As salas de aula e laboratórios são adequados?', tipo: 'escala' as const, obrigatoria: true },
    { id: 'q7', categoria: 'Infraestrutura' as const, texto: 'Os recursos tecnológicos (data show, internet) funcionaram adequadamente?', tipo: 'escala' as const, obrigatoria: true },
    { id: 'q8', categoria: 'Coordenacao' as const, texto: 'A coordenação do curso atende às necessidades dos alunos?', tipo: 'escala' as const, obrigatoria: true },
    { id: 'q9', categoria: 'Geral' as const, texto: 'Qual a sua avaliação geral do componente curricular?', tipo: 'escala' as const, obrigatoria: true },
    { id: 'q10', categoria: 'Geral' as const, texto: 'Deseja registrar alguma sugestão ou crítica construtiva?', tipo: 'texto' as const, obrigatoria: false },
];

const MOCK_AV: AvaliacaoInstitucional[] = [
    {
        id: 'avinst-1',
        titulo: 'Avaliação Institucional — 1º Semestre 2026',
        periodo: '1/2026',
        dataInicio: '2026-03-01T00:00:00Z',
        dataFim: '2026-03-15T23:59:59Z',
        status: 'Ativa',
        questoes: QUESTOES_BASE,
        alvoTipo: 'Geral',
        alvoId: null,
        alvoNome: null,
        totalRespondentes: 18,
        totalConvidados: 45,
    },
    {
        id: 'avinst-2',
        titulo: 'Avaliação de Turma — ENF-ONC-2026A',
        periodo: '1/2026',
        dataInicio: '2026-02-28T00:00:00Z',
        dataFim: '2026-03-10T23:59:59Z',
        status: 'Ativa',
        questoes: QUESTOES_BASE.slice(0, 7),
        alvoTipo: 'Turma',
        alvoId: 'turma-1',
        alvoNome: 'ENF-ONC-2026A',
        totalRespondentes: 8,
        totalConvidados: 20,
    },
];

const RESPOSTAS: RespostaAvaliacaoInstitucional[] = [
    {
        id: 'resp-1',
        avaliacaoId: 'avinst-2',
        alunoId: 'student-3',
        respondidoEm: '2026-03-02T14:30:00Z',
        anonima: true,
        respostas: [
            { questaoId: 'q1', valor: 5 }, { questaoId: 'q2', valor: 4 }, { questaoId: 'q3', valor: 5 },
            { questaoId: 'q4', valor: 4 }, { questaoId: 'q5', valor: 4 }, { questaoId: 'q6', valor: 3 },
            { questaoId: 'q7', valor: 4 },
        ],
    },
];

export class MockAvaliacaoInstitucionalRepository implements IAvaliacaoInstitucionalRepository {
    private avaliacoes = JSON.parse(JSON.stringify(MOCK_AV)) as AvaliacaoInstitucional[];
    private respostas = JSON.parse(JSON.stringify(RESPOSTAS)) as RespostaAvaliacaoInstitucional[];

    async findAll(periodo?: string) {
        return periodo ? this.avaliacoes.filter(a => a.periodo === periodo) : [...this.avaliacoes];
    }

    async findById(id: string) {
        return this.avaliacoes.find(a => a.id === id) ?? null;
    }

    async findPendentes(alunoId: string) {
        const respondidas = new Set(this.respostas.filter(r => r.alunoId === alunoId).map(r => r.avaliacaoId));
        return this.avaliacoes.filter(a => a.status === 'Ativa' && !respondidas.has(a.id));
    }

    async hasResponded(avaliacaoId: string, alunoId: string) {
        return this.respostas.some(r => r.avaliacaoId === avaliacaoId && r.alunoId === alunoId);
    }

    async responder(avaliacaoId: string, alunoId: string, respostas: RespostasAvaliacao[], anonima = true) {
        this.respostas.push({
            id: `resp-${Date.now()}`,
            avaliacaoId,
            alunoId,
            respostas,
            respondidoEm: new Date().toISOString(),
            anonima,
        });
        const av = this.avaliacoes.find(a => a.id === avaliacaoId);
        if (av) av.totalRespondentes += 1;
    }

    async getResultados(avaliacaoId: string): Promise<ResultadoAvaliacao[]> {
        const av = await this.findById(avaliacaoId);
        if (!av) return [];
        const resps = this.respostas.filter(r => r.avaliacaoId === avaliacaoId);
        return av.questoes.map(q => {
            const qResps = resps.flatMap(r => r.respostas.filter(a => a.questaoId === q.id));
            const numericos = qResps.map(r => r.valor).filter((v): v is number => typeof v === 'number');
            const textos = qResps.map(r => r.valor).filter((v): v is string => typeof v === 'string' && v.trim() !== '');
            const dist: Record<string, number> = {};
            qResps.forEach(r => { const k = String(r.valor); dist[k] = (dist[k] ?? 0) + 1; });
            return {
                avaliacaoId,
                questaoId: q.id,
                questaoTexto: q.texto,
                categoria: q.categoria,
                mediaNotas: numericos.length > 0 ? Math.round((numericos.reduce((a, b) => a + b, 0) / numericos.length) * 10) / 10 : null,
                distribuicao: dist,
                comentarios: textos,
            };
        });
    }

    async create(avaliacao: Omit<AvaliacaoInstitucional, 'id' | 'totalRespondentes'>) {
        const n: AvaliacaoInstitucional = { ...avaliacao, id: `avinst-${Date.now()}`, totalRespondentes: 0 };
        this.avaliacoes.push(n);
        return n;
    }

    async update(id: string, data: Partial<Omit<AvaliacaoInstitucional, 'id'>>) {
        const a = this.avaliacoes.find(a => a.id === id);
        if (!a) throw new Error('Avaliação não encontrada');
        Object.assign(a, data);
        return a;
    }
}
