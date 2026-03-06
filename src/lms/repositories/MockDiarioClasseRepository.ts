import type { DiarioClasse, RegistroAula, IDiarioClasseRepository } from './DiarioClasseRepository';

const NOW = () => new Date().toISOString();

const REGISTROS_T1: RegistroAula[] = [
    { id: 'reg-1', turmaId: 'turma-1', aulaId: 'aula-1', data: '2026-02-04', horaInicio: '08:00', horaFim: '12:00', cargaHoraria: 240, conteudoMinistar: 'Introdução à Oncologia', conteudoMiniado: 'Introdução à Oncologia — epidemiologia, tipos tumorais e estadiamento TNM', metodologia: 'Aula expositiva dialogada', observacoes: '', situacao: 'Realizada', instrutorId: 'teacher-1', instrutorNome: 'Prof.ª Dra. Sandra Mello', frequenciaRegistrada: true },
    { id: 'reg-2', turmaId: 'turma-1', aulaId: 'aula-2', data: '2026-02-11', horaInicio: '08:00', horaFim: '12:00', cargaHoraria: 240, conteudoMinistar: 'Farmacologia Oncológica', conteudoMiniado: 'Classificação dos quimioterápicos e mecanismos de ação', metodologia: 'Aula expositiva + estudo de caso', observacoes: 'Grupo demonstrou boa participação.', situacao: 'Realizada', instrutorId: 'teacher-1', instrutorNome: 'Prof.ª Dra. Sandra Mello', frequenciaRegistrada: true },
    { id: 'reg-3', turmaId: 'turma-1', aulaId: 'aula-3', data: '2026-02-18', horaInicio: '08:00', horaFim: '14:00', cargaHoraria: 360, conteudoMinistar: 'Técnicas de Administração de QT', conteudoMiniado: 'Vias de acesso venoso e EPI', metodologia: 'Laboratório prático', observacoes: 'Laboratório 2 com todo o material disponível.', situacao: 'Realizada', instrutorId: 'teacher-1', instrutorNome: 'Prof.ª Dra. Sandra Mello', frequenciaRegistrada: true },
    { id: 'reg-4', turmaId: 'turma-1', aulaId: 'aula-4', data: '2026-02-25', horaInicio: '08:00', horaFim: '12:00', cargaHoraria: 240, conteudoMinistar: 'Manejo de Toxicidades', conteudoMiniado: '', metodologia: 'Aula expositiva', observacoes: '', situacao: 'Planejada', instrutorId: 'teacher-1', instrutorNome: 'Prof.ª Dra. Sandra Mello', frequenciaRegistrada: false },
    { id: 'reg-5', turmaId: 'turma-1', aulaId: 'aula-5', data: '2026-03-04', horaInicio: '08:00', horaFim: '12:00', cargaHoraria: 240, conteudoMinistar: 'Cuidados Paliativos', conteudoMiniado: '', metodologia: 'Aula expositiva + debate', observacoes: '', situacao: 'Planejada', instrutorId: 'teacher-1', instrutorNome: 'Prof.ª Dra. Sandra Mello', frequenciaRegistrada: false },
    { id: 'reg-6', turmaId: 'turma-1', aulaId: 'aula-6', data: '2026-03-11', horaInicio: '08:00', horaFim: '16:00', cargaHoraria: 480, conteudoMinistar: 'Laboratório Prático Final', conteudoMiniado: '', metodologia: 'Simulação supervisionada', observacoes: '', situacao: 'Planejada', instrutorId: 'teacher-1', instrutorNome: 'Prof.ª Dra. Sandra Mello', frequenciaRegistrada: false },
];

const MOCK_DIARIOS: DiarioClasse[] = [
    {
        id: 'diario-1',
        turmaId: 'turma-1',
        turmaNome: 'ENF-ONC-2026A',
        instrutorId: 'teacher-1',
        instrutorNome: 'Prof.ª Dra. Sandra Mello',
        periodoLetivo: '1/2026',
        cargaHorariaPrevista: 30,
        cargaHorariaRealizada: 14,
        percentualCumprimento: 46.7,
        registros: JSON.parse(JSON.stringify(REGISTROS_T1)),
        status: 'Aberto',
        fechadoEm: null,
    },
];

export class MockDiarioClasseRepository implements IDiarioClasseRepository {
    private data = JSON.parse(JSON.stringify(MOCK_DIARIOS)) as DiarioClasse[];

    async findByTurma(turmaId: string) {
        return this.data.find(d => d.turmaId === turmaId) ?? null;
    }

    async findByInstructor(instructorId: string) {
        return this.data.filter(d => d.instrutorId === instructorId);
    }

    async getRegistros(turmaId: string) {
        const d = await this.findByTurma(turmaId);
        return d?.registros ?? [];
    }

    async upsertRegistro(turmaId: string, aula: Omit<RegistroAula, 'id'>) {
        const d = this.data.find(d => d.turmaId === turmaId);
        if (!d) throw new Error('Diário não encontrado');
        const idx = d.registros.findIndex(r => r.aulaId === aula.aulaId);
        const reg: RegistroAula = { ...aula, id: idx >= 0 ? d.registros[idx].id : `reg-${Date.now()}` };
        if (idx >= 0) d.registros[idx] = reg;
        else d.registros.push(reg);
        // recalculate
        const realizadas = d.registros.filter(r => r.situacao === 'Realizada');
        d.cargaHorariaRealizada = Math.round(realizadas.reduce((a, r) => a + r.cargaHoraria, 0) / 60);
        d.percentualCumprimento = d.cargaHorariaPrevista > 0
            ? Math.round((d.cargaHorariaRealizada / d.cargaHorariaPrevista) * 1000) / 10
            : 0;
        return reg;
    }

    async encerrarDiario(turmaId: string) {
        const d = this.data.find(d => d.turmaId === turmaId);
        if (!d) throw new Error('Diário não encontrado');
        d.status = 'Encerrado';
        d.fechadoEm = NOW();
        return d;
    }

    async create(turmaId: string, instrutorId: string) {
        const n: DiarioClasse = {
            id: `diario-${Date.now()}`,
            turmaId,
            turmaNome: turmaId,
            instrutorId,
            instrutorNome: instrutorId,
            periodoLetivo: '1/2026',
            cargaHorariaPrevista: 0,
            cargaHorariaRealizada: 0,
            percentualCumprimento: 0,
            registros: [],
            status: 'Aberto',
            fechadoEm: null,
        };
        this.data.push(n);
        return n;
    }
}
