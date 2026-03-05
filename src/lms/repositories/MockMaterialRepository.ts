import { IMaterialRepository, Material, MaterialTipo } from './MaterialRepository';

const SEED: Material[] = [
    { id: 'mat-1', turmaId: 'turma-1', turmaNome: 'ONC-TEC-2026A', titulo: 'Apostila — Biologia do Câncer', descricao: 'Material base do Módulo 1, cobrindo oncogênese, estadiamento e epidemiologia.', tipo: 'APOSTILA', url: '/files/apostila-bio-cancer.pdf', tamanhoKb: 2840, uploadedBy: 'Prof. Marcos Oliveira', uploadedAt: '2026-03-01', disponivel: true, ordem: 1 },
    { id: 'mat-2', turmaId: 'turma-1', turmaNome: 'ONC-TEC-2026A', titulo: 'Slides — Estadiamento TNM', descricao: 'Apresentação da aula 02 com sistema TNM e exemplos clínicos.', tipo: 'SLIDE', url: '/files/slides-tnm.pptx', tamanhoKb: 5120, uploadedBy: 'Prof. Marcos Oliveira', uploadedAt: '2026-03-04', disponivel: true, ordem: 2 },
    { id: 'mat-3', turmaId: 'turma-1', turmaNome: 'ONC-TEC-2026A', titulo: 'Vídeo — Preparo de Quimioterapia', descricao: 'Demonstração prática de oncossegurança para preparo de agentes citostáticos.', tipo: 'VIDEO', url: 'https://youtube.com/watch?v=demo-oncosseguranca', tamanhoKb: null, uploadedBy: 'Prof. Marcos Oliveira', uploadedAt: '2026-03-05', disponivel: true, ordem: 3 },
    { id: 'mat-4', turmaId: 'turma-1', turmaNome: 'ONC-TEC-2026A', titulo: 'Exercícios — AV1', descricao: 'Lista de exercícios preparatória para a primeira avaliação.', tipo: 'EXERCICIO', url: '/files/exercicios-av1.pdf', tamanhoKb: 420, uploadedBy: 'Prof. Marcos Oliveira', uploadedAt: '2026-03-08', disponivel: true, ordem: 4 },
    { id: 'mat-5', turmaId: 'turma-1', turmaNome: 'ONC-TEC-2026A', titulo: 'Link — INCA: Protocolos Oncológicos', descricao: 'Portal do INCA com protocolos e manuais de quimioterapia atualizados.', tipo: 'LINK', url: 'https://www.inca.gov.br/publicacoes', tamanhoKb: null, uploadedBy: 'Prof. Marcos Oliveira', uploadedAt: '2026-03-02', disponivel: true, ordem: 5 },
    { id: 'mat-6', turmaId: 'turma-2', turmaNome: 'FER-ESP-2026A', titulo: 'Apostila — Anatomia e Fisiologia Cutânea', descricao: 'Fundamentos de histologia da pele para o cuidado de feridas.', tipo: 'APOSTILA', url: '/files/apostila-anatomia-cutanea.pdf', tamanhoKb: 3200, uploadedBy: 'Prof.a Dra. Carla Bezerra', uploadedAt: '2026-03-03', disponivel: true, ordem: 1 },
    { id: 'mat-7', turmaId: 'turma-2', turmaNome: 'FER-ESP-2026A', titulo: 'PDF — Classificação de Feridas NPUAP/EPUAP', descricao: 'Guideline internacional para estadiamento de lesões por pressão.', tipo: 'PDF', url: '/files/classificacao-feridas-npuap.pdf', tamanhoKb: 1870, uploadedBy: 'Prof.a Dra. Carla Bezerra', uploadedAt: '2026-03-05', disponivel: true, ordem: 2 },
];

export class MockMaterialRepository implements IMaterialRepository {
    private materiais: Material[] = JSON.parse(JSON.stringify(SEED));

    async findByTurma(turmaId: string): Promise<Material[]> {
        return this.materiais.filter(m => m.turmaId === turmaId).sort((a, b) => a.ordem - b.ordem);
    }

    async findByTipo(turmaId: string, tipo: MaterialTipo): Promise<Material[]> {
        return this.materiais.filter(m => m.turmaId === turmaId && m.tipo === tipo);
    }

    async findById(id: string): Promise<Material | null> {
        return this.materiais.find(m => m.id === id) ?? null;
    }

    async create(material: Omit<Material, 'id'>): Promise<Material> {
        const novo = { ...material, id: `mat-${Date.now()}` };
        this.materiais.push(novo);
        return novo;
    }

    async update(id: string, data: Partial<Omit<Material, 'id'>>): Promise<Material> {
        const idx = this.materiais.findIndex(m => m.id === id);
        if (idx === -1) throw new Error('Material não encontrado');
        this.materiais[idx] = { ...this.materiais[idx], ...data };
        return this.materiais[idx];
    }

    async delete(id: string): Promise<void> {
        const idx = this.materiais.findIndex(m => m.id === id);
        if (idx !== -1) this.materiais.splice(idx, 1);
    }

    async reordenar(turmaId: string, ids: string[]): Promise<void> {
        ids.forEach((id, idx) => {
            const m = this.materiais.find(m => m.id === id && m.turmaId === turmaId);
            if (m) m.ordem = idx + 1;
        });
    }
}
