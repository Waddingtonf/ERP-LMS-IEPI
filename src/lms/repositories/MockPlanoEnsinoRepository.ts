import type { PlanoEnsino, IPlanoEnsinoRepository } from './PlanoEnsinoRepository';

const NOW = () => new Date().toISOString();

const BASE: PlanoEnsino = {
    id: 'plano-1',
    turmaId: 'turma-1',
    turmaNome: 'ENF-ONC-2026A — Enfermagem Oncológica',
    cursoNome: 'Especialização em Enfermagem Oncológica',
    instructorId: 'teacher-1',
    instructorNome: 'Prof.ª Dra. Sandra Mello',
    ementa: 'O componente aborda os fundamentos da enfermagem oncológica, com ênfase nos protocolos de quimioterapia, cuidados paliativos e manejo de reações adversas em ambiente hospitalar e ambulatorial.',
    objetivoGeral: 'Capacitar o enfermeiro para atuar com competência técnica e humanizada no cuidado ao paciente oncológico em todas as fases do tratamento.',
    objetivosEspecificos: [
        { ordem: 1, descricao: 'Identificar os principais agentes antineoplásicos e seus mecanismos de ação.' },
        { ordem: 2, descricao: 'Dominar as técnicas seguras de preparação e administração de quimioterápicos.' },
        { ordem: 3, descricao: 'Avaliar e manejar as toxicidades e efeitos colaterais do tratamento oncológico.' },
        { ordem: 4, descricao: 'Aplicar protocolos de cuidados paliativos e suporte emocional ao paciente e família.' },
        { ordem: 5, descricao: 'Interpretar resultados de exames laboratoriais no contexto oncológico.' },
    ],
    conteudoProgramatico: [
        { semana: 1, topico: 'Introdução à Oncologia', subtopicos: ['Epidemiologia do câncer no Brasil', 'Tipos tumorais e estadiamento', 'Abordagem interdisciplinar'], cargaHoraria: 4 },
        { semana: 2, topico: 'Farmacologia Oncológica', subtopicos: ['Classificação dos quimioterápicos', 'Mecanismos de ação', 'Interações medicamentosas'], cargaHoraria: 4 },
        { semana: 3, topico: 'Técnicas de Administração de QT', subtopicos: ['Vias de acesso venoso', 'Preparo seguro', 'EPI e biossegurança'], cargaHoraria: 6 },
        { semana: 4, topico: 'Manejo de Toxicidades', subtopicos: ['Náuseas e vômitos', 'Mucosite', 'Neutropenia febril', 'Neurotoxicidade'], cargaHoraria: 4 },
        { semana: 5, topico: 'Cuidados Paliativos', subtopicos: ['Filosofia e princípios', 'Controle da dor', 'Comunicação com paciente e família'], cargaHoraria: 4 },
        { semana: 6, topico: 'Laboratório Prático', subtopicos: ['Simulação de punção venosa', 'Preparo de dose em bancada', 'Casos clínicos'], cargaHoraria: 8 },
    ],
    metodologias: [
        'Aula expositiva dialogada',
        'Simulação em laboratório de habilidades',
        'Estudo de caso clínico',
        'Discussão em grupo',
        'Visita técnica hospitalar',
    ],
    criteriosAvaliacao: [
        { descricao: 'Prova teórica (P1)', peso: 30 },
        { descricao: 'Prova teórica (P2)', peso: 30 },
        { descricao: 'Avaliação prática em laboratório', peso: 25 },
        { descricao: 'Trabalho em grupo — caso clínico', peso: 15 },
    ],
    bibliografiaBasica: [
        { tipo: 'basica', autores: 'BONASSA, E. M. A.; GATO, M. I. R.', titulo: 'Terapêutica Oncológica para Enfermeiros e Farmacêuticos', editora: 'Atheneu', ano: 2021, isbn: '9788538809012' },
        { tipo: 'basica', autores: 'INCA', titulo: 'Manual de Oncologia Clínica do Brasil', editora: 'Dendrix', ano: 2023 },
    ],
    bibliografiaComplementar: [
        { tipo: 'complementar', autores: 'SMELTZER, S. C.; BARE, B. G.', titulo: 'Brunner e Suddarth — Tratado de Enfermagem Médico-Cirúrgica', editora: 'Guanabara Koogan', ano: 2020, isbn: '9788527736374' },
        { tipo: 'complementar', autores: 'COFEN', titulo: 'Resolução 569/2018 — Regulamentação da atuação do enfermeiro na terapia antineoplásica', editora: 'COFEN', ano: 2018 },
    ],
    recursosNecessarios: [
        'Laboratório de habilidades com simuladores venosos',
        'Data show e computador',
        'Material de simulação (soluções, equipos, agulhas de treinamento)',
        'Acesso ao sistema CCIH do hospital parceiro (visita técnica)',
    ],
    observacoes: 'Frequência mínima de 75% exigida. Toda a simulação laboratorial é obrigatória.',
    status: 'Publicado',
    criadoEm: '2026-01-10T09:00:00Z',
    atualizadoEm: '2026-01-15T14:30:00Z',
};

const MOCK: PlanoEnsino[] = [
    BASE,
    {
        ...BASE,
        id: 'plano-2',
        turmaId: 'turma-2',
        turmaNome: 'ENF-IV-2026A — Abordagens Intravenosas',
        cursoNome: 'Curso Livre em Terapia Intravenosa',
        instructorId: 'teacher-2',
        instructorNome: 'Enf. Marcos Ribeiro',
        ementa: 'Fundamentos da terapia intravenosa, acesso venoso periférico e central, complicações e protocolos de segurança.',
        objetivoGeral: 'Capacitar o profissional para realização segura de punção venosa e gerenciamento de dispositivos de acesso vascular.',
        objetivosEspecificos: [
            { ordem: 1, descricao: 'Realizar punção venosa periférica com técnica asséptica adequada.' },
            { ordem: 2, descricao: 'Identificar e prevenir complicações do acesso venoso.' },
            { ordem: 3, descricao: 'Manter e monitorar dispositivos de acesso central.' },
        ],
        conteudoProgramatico: [
            { semana: 1, topico: 'Anatomia Vascular', subtopicos: ['Veias periféricas', 'Veias centrais', 'Escolha do acesso'], cargaHoraria: 4 },
            { semana: 2, topico: 'Técnica de Punção', subtopicos: ['Materiais', 'Assepsia', 'Passo a passo'], cargaHoraria: 4 },
            { semana: 3, topico: 'Complicações', subtopicos: ['Flebite', 'Infiltração', 'Infecção de sítio'], cargaHoraria: 4 },
        ],
        metodologias: ['Aula expositiva', 'Treinamento em manequim', 'Laboratório prático com supervisor'],
        criteriosAvaliacao: [
            { descricao: 'Avaliação teórica', peso: 40 },
            { descricao: 'Avaliação prática (estação)', peso: 60 },
        ],
        bibliografiaBasica: [
            { tipo: 'basica', autores: 'INFUSION NURSES SOCIETY', titulo: 'Infusion Therapy Standards of Practice', editora: 'INS', ano: 2021 },
        ],
        bibliografiaComplementar: [],
        recursosNecessarios: ['Braço de treinamento venoso', 'Materiais descartáveis de punção', 'EPIs'],
        observacoes: 'Avaliação prática realizada em estação individual com avaliador designado.',
        status: 'Publicado',
        criadoEm: '2026-01-12T10:00:00Z',
        atualizadoEm: '2026-01-20T11:00:00Z',
    },
];

export class MockPlanoEnsinoRepository implements IPlanoEnsinoRepository {
    private data = JSON.parse(JSON.stringify(MOCK)) as PlanoEnsino[];

    async findByTurma(turmaId: string) {
        return this.data.find(p => p.turmaId === turmaId) ?? null;
    }

    async findByInstructor(instructorId: string) {
        return this.data.filter(p => p.instructorId === instructorId);
    }

    async findAll() {
        return [...this.data];
    }

    async create(plano: Omit<PlanoEnsino, 'id' | 'criadoEm' | 'atualizadoEm'>) {
        const n: PlanoEnsino = { ...plano, id: `plano-${Date.now()}`, criadoEm: NOW(), atualizadoEm: NOW() };
        this.data.push(n);
        return n;
    }

    async update(id: string, data: Partial<Omit<PlanoEnsino, 'id' | 'criadoEm'>>) {
        const p = this.data.find(p => p.id === id);
        if (!p) throw new Error('Plano não encontrado');
        Object.assign(p, data, { atualizadoEm: NOW() });
        return p;
    }

    async publicar(id: string) {
        return this.update(id, { status: 'Publicado' });
    }
}
