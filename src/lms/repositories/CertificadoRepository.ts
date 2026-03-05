// -------------------------------------------------------------------
// CertificadoRepository — Interface + shared types
// -------------------------------------------------------------------

export type CertificadoStatus = 'Disponivel' | 'Solicitado' | 'Em Emissao' | 'Emitido' | 'Bloqueado';

export interface Certificado {
    id: string;
    alunoId: string;
    alunoNome: string;
    turmaId: string;
    turmaNome: string;
    cursoNome: string;
    cargaHoraria: number;
    dataConlusao: string;
    dataEmissao: string | null;
    codigo: string | null; // código de autenticidade
    status: CertificadoStatus;
    urlDownload: string | null;
    motipoBloqueio: string | null;
}

export interface ICertificadoRepository {
    findByAluno(alunoId: string): Promise<Certificado[]>;
    findById(id: string): Promise<Certificado | null>;
    solicitar(alunoId: string, turmaId: string): Promise<Certificado>;
    emitir(id: string): Promise<Certificado>;
    getStatus(alunoId: string, turmaId: string): Promise<CertificadoStatus | null>;
    verificarElegibilidade(alunoId: string, turmaId: string): Promise<{ elegivel: boolean; motivo: string | null }>;
}
