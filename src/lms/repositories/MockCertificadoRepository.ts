import { ICertificadoRepository, Certificado, CertificadoStatus } from './CertificadoRepository';

const SEED: Certificado[] = [
    { id: 'cert-1', alunoId: 'student-1', alunoNome: 'João Silva', turmaId: 'turma-hist-1', turmaNome: 'BSC-CARD-2025A', cursoNome: 'Banho em Leito e Cuidados Cardíacos', cargaHoraria: 120, dataConlusao: '2025-08-30', dataEmissao: '2025-09-05', codigo: 'IEPI-2025-001234', status: 'Emitido', urlDownload: '/certificados/IEPI-2025-001234.pdf', motipoBloqueio: null },
    { id: 'cert-2', alunoId: 'student-1', alunoNome: 'João Silva', turmaId: 'turma-hist-2', turmaNome: 'VEN-ACC-2025B', cursoNome: 'Acesso Venoso Periférico e Central', cargaHoraria: 80, dataConlusao: '2025-12-10', dataEmissao: '2025-12-15', codigo: 'IEPI-2025-005678', status: 'Emitido', urlDownload: '/certificados/IEPI-2025-005678.pdf', motipoBloqueio: null },
    { id: 'cert-3', alunoId: 'student-1', alunoNome: 'João Silva', turmaId: 'turma-1', turmaNome: 'ONC-TEC-2026A', cursoNome: 'Oncologia para Técnicos', cargaHoraria: 240, dataConlusao: '2026-06-30', dataEmissao: null, codigo: null, status: 'Bloqueado', urlDownload: null, motipoBloqueio: 'Curso ainda em andamento. Conclusão prevista para 30/06/2026.' },
];

export class MockCertificadoRepository implements ICertificadoRepository {
    private certs: Certificado[] = JSON.parse(JSON.stringify(SEED));

    async findByAluno(alunoId: string): Promise<Certificado[]> {
        return this.certs.filter(c => c.alunoId === alunoId);
    }

    async findById(id: string): Promise<Certificado | null> {
        return this.certs.find(c => c.id === id) ?? null;
    }

    async solicitar(alunoId: string, turmaId: string): Promise<Certificado> {
        const existing = this.certs.find(c => c.alunoId === alunoId && c.turmaId === turmaId);
        if (existing) {
            if (existing.status === 'Bloqueado') throw new Error(existing.motipoBloqueio ?? 'Certificado bloqueado');
            existing.status = 'Solicitado';
            return existing;
        }
        throw new Error('Certificado não encontrado');
    }

    async emitir(id: string): Promise<Certificado> {
        const cert = this.certs.find(c => c.id === id);
        if (!cert) throw new Error('Certificado não encontrado');
        cert.status = 'Emitido';
        cert.dataEmissao = new Date().toISOString().split('T')[0];
        cert.codigo = `IEPI-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;
        cert.urlDownload = `/certificados/${cert.codigo}.pdf`;
        return cert;
    }

    async getStatus(alunoId: string, turmaId: string): Promise<CertificadoStatus | null> {
        const cert = this.certs.find(c => c.alunoId === alunoId && c.turmaId === turmaId);
        return cert?.status ?? null;
    }

    async verificarElegibilidade(alunoId: string, turmaId: string): Promise<{ elegivel: boolean; motivo: string | null }> {
        const cert = this.certs.find(c => c.alunoId === alunoId && c.turmaId === turmaId);
        if (!cert) return { elegivel: false, motivo: 'Matrícula não encontrada' };
        if (cert.status === 'Bloqueado') return { elegivel: false, motivo: cert.motipoBloqueio };
        return { elegivel: true, motivo: null };
    }
}
