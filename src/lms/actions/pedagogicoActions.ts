"use server";

/**
 * Pedagógico Actions
 * Em produção: consulta dados pedagógicos via Supabase.
 * Em sandbox: retorna dados mockados para demonstração.
 */

export interface AlunoAcompanhamento {
    id: string;
    nome: string;
    curso: string;
    turma: string;
    mediaGeral: number;
    frequencia: number;
    status: 'Regular' | 'Em risco' | 'Crítico' | 'Reprovado';
    modulosCompletos: number;
    totalModulos: number;
    ultimoAcesso: string;
}

export interface DesempenhoTurma {
    turma: string;
    curso: string;
    mediaGeral: number;
    taxaAprovacao: number;
    taxaEvasao: number;
    totalAlunos: number;
}

export interface Ocorrencia {
    id: string;
    tipo: 'Reclamação' | 'Sugestão' | 'Dúvida Acadêmica' | 'Solicitação de Documento' | 'Outros';
    descricao: string;
    aluno: string;
    responsavelAtendimento: string | null;
    status: 'Aberta' | 'Em andamento' | 'Resolvida' | 'Escalada';
    prioridade: 'Baixa' | 'Média' | 'Alta';
    dataAbertura: string;
    prazoSLA: string; // ISO date
    dataResolucao: string | null;
}

export interface DadosRetencao {
    turma: string;
    curso: string;
    inicioTurma: string;
    totalInicial: number;
    ativos: number;
    evadidos: number;
    taxaRetencao: number;
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const MOCK_ALUNOS: AlunoAcompanhamento[] = [
    { id: 'a1', nome: 'Ana Paula Ferreira', curso: 'Gestão em RH', turma: 'RH-2024-1', mediaGeral: 8.5, frequencia: 92, status: 'Regular', modulosCompletos: 5, totalModulos: 8, ultimoAcesso: '2026-02-24' },
    { id: 'a2', nome: 'Bruno Carvalho', curso: 'Gestão em RH', turma: 'RH-2024-1', mediaGeral: 5.2, frequencia: 68, status: 'Em risco', modulosCompletos: 2, totalModulos: 8, ultimoAcesso: '2026-02-10' },
    { id: 'a3', nome: 'Carla Menezes', curso: 'Gestão em RH', turma: 'RH-2024-1', mediaGeral: 7.8, frequencia: 88, status: 'Regular', modulosCompletos: 4, totalModulos: 8, ultimoAcesso: '2026-02-23' },
    { id: 'a4', nome: 'Diego Santos', curso: 'Gestão em RH', turma: 'RH-2024-1', mediaGeral: 3.9, frequencia: 55, status: 'Crítico', modulosCompletos: 1, totalModulos: 8, ultimoAcesso: '2026-01-30' },
    { id: 'a5', nome: 'Eduardo Lima', curso: 'Administração', turma: 'ADM-2024-1', mediaGeral: 9.1, frequencia: 97, status: 'Regular', modulosCompletos: 7, totalModulos: 10, ultimoAcesso: '2026-02-24' },
    { id: 'a6', nome: 'Fernanda Costa', curso: 'Administração', turma: 'ADM-2024-1', mediaGeral: 6.7, frequencia: 80, status: 'Regular', modulosCompletos: 5, totalModulos: 10, ultimoAcesso: '2026-02-22' },
];

const MOCK_DESEMPENHO: DesempenhoTurma[] = [
    { turma: 'RH-2024-1', curso: 'Gestão em RH', mediaGeral: 7.2, taxaAprovacao: 72, taxaEvasao: 5.1, totalAlunos: 32 },
    { turma: 'ADM-2024-1', curso: 'Administração', mediaGeral: 7.9, taxaAprovacao: 85, taxaEvasao: 2.4, totalAlunos: 45 },
    { turma: 'ATN-2024-2', curso: 'Atendimento', mediaGeral: 8.1, taxaAprovacao: 90, taxaEvasao: 1.8, totalAlunos: 28 },
    { turma: 'RH-2024-2', curso: 'Gestão em RH', mediaGeral: 7.5, taxaAprovacao: 78, taxaEvasao: 3.2, totalAlunos: 38 },
];

const MOCK_OCORRENCIAS: Ocorrencia[] = [
    { id: 'oc1', tipo: 'Reclamação', descricao: 'Professor faltou sem aviso na última aula.', aluno: 'Bruno Carvalho', responsavelAtendimento: null, status: 'Aberta', prioridade: 'Alta', dataAbertura: '2026-02-22', prazoSLA: '2026-02-25', dataResolucao: null },
    { id: 'oc2', tipo: 'Solicitação de Documento', descricao: 'Solicito declaração de matrícula atualizada.', aluno: 'Ana Paula Ferreira', responsavelAtendimento: 'Coord. Maria', status: 'Em andamento', prioridade: 'Média', dataAbertura: '2026-02-20', prazoSLA: '2026-02-27', dataResolucao: null },
    { id: 'oc3', tipo: 'Dúvida Acadêmica', descricao: 'Não entendi o critério de avaliação do trabalho final.', aluno: 'Carla Menezes', responsavelAtendimento: 'Prof. João', status: 'Resolvida', prioridade: 'Baixa', dataAbertura: '2026-02-15', prazoSLA: '2026-02-22', dataResolucao: '2026-02-18' },
    { id: 'oc4', tipo: 'Reclamação', descricao: 'Sistema de provas apresentou erro e perdi minha avaliação.', aluno: 'Diego Santos', responsavelAtendimento: null, status: 'Aberta', prioridade: 'Alta', dataAbertura: '2026-02-10', prazoSLA: '2026-02-13', dataResolucao: null },
    { id: 'oc5', tipo: 'Sugestão', descricao: 'Seria ótimo ter tutoriais em vídeo além dos slides.', aluno: 'Eduardo Lima', responsavelAtendimento: 'Coord. Maria', status: 'Em andamento', prioridade: 'Baixa', dataAbertura: '2026-02-19', prazoSLA: '2026-03-05', dataResolucao: null },
];

const MOCK_RETENCAO: DadosRetencao[] = [
    { turma: 'RH-2024-1', curso: 'Gestão em RH', inicioTurma: '2024-02-05', totalInicial: 35, ativos: 32, evadidos: 3, taxaRetencao: 91.4 },
    { turma: 'ADM-2024-1', curso: 'Administração', inicioTurma: '2024-02-12', totalInicial: 48, ativos: 45, evadidos: 3, taxaRetencao: 93.8 },
    { turma: 'ATN-2024-2', curso: 'Atendimento', inicioTurma: '2024-08-05', totalInicial: 30, ativos: 28, evadidos: 2, taxaRetencao: 93.3 },
    { turma: 'RH-2024-2', curso: 'Gestão em RH', inicioTurma: '2024-08-12', totalInicial: 40, ativos: 38, evadidos: 2, taxaRetencao: 95.0 },
];

// ─── Actions ──────────────────────────────────────────────────────────────────

export async function getAlunosAcompanhamento(): Promise<AlunoAcompanhamento[]> {
    return MOCK_ALUNOS;
}

export async function getAlunosEmRisco(): Promise<AlunoAcompanhamento[]> {
    return MOCK_ALUNOS.filter(a => a.status === 'Em risco' || a.status === 'Crítico');
}

export async function getDesempenhoPorTurma(): Promise<DesempenhoTurma[]> {
    return MOCK_DESEMPENHO;
}

export async function getOcorrencias(): Promise<Ocorrencia[]> {
    return MOCK_OCORRENCIAS;
}

export async function getOcorrenciasAbertas(): Promise<Ocorrencia[]> {
    return MOCK_OCORRENCIAS.filter(o => o.status === 'Aberta' || o.status === 'Em andamento');
}

export async function getDadosRetencao(): Promise<DadosRetencao[]> {
    return MOCK_RETENCAO;
}

export async function assumirOcorrencia(
    ocorrenciaId: string,
    responsavel: string
): Promise<{ success: boolean }> {
    const oc = MOCK_OCORRENCIAS.find(o => o.id === ocorrenciaId);
    if (!oc) return { success: false };
    oc.responsavelAtendimento = responsavel;
    oc.status = 'Em andamento';
    return { success: true };
}
