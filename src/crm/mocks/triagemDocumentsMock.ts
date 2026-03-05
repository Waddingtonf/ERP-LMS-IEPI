export type TriagemStatus = "pending" | "approved" | "rejected";

export interface TriagemDocumentoItem {
    type: string;
    label: string;
    url: string;
    present: boolean;
}

export interface TriagemDocumento {
    id: string;
    studentName: string;
    cpf: string;
    course: string;
    submittedAt: string;
    status: TriagemStatus;
    corenRequired: boolean;
    corenNumber: string | null;
    docs: TriagemDocumentoItem[];
}

export const TRIAGEM_DOCUMENTOS_MOCK: TriagemDocumento[] = [
    {
        id: "doc-1", studentName: "João Silva", cpf: "123.456.789-00",
        course: "Gestão em Saúde e Liderança", submittedAt: "2026-02-18",
        status: "pending", corenRequired: true, corenNumber: "COREN-SP 287634",
        docs: [
            { type: "RG", label: "Cópia do RG", url: "https://images.unsplash.com/photo-1621844697921-289b4f526019?q=80&w=600&auto=format&fit=crop", present: true },
            { type: "DIPLOMA", label: "Diploma / Histórico", url: "https://images.unsplash.com/photo-1586281380349-632531db7ed4?q=80&w=600&auto=format&fit=crop", present: true },
            { type: "COREN", label: "Cartão COREN", url: "https://images.unsplash.com/photo-1550831107-1553da8c8464?q=80&w=600&auto=format&fit=crop", present: true },
        ],
    },
    {
        id: "doc-2", studentName: "Maria Souza", cpf: "987.654.321-00",
        course: "Excelência em Atendimento ao Paciente", submittedAt: "2026-02-19",
        status: "approved", corenRequired: false, corenNumber: null,
        docs: [
            { type: "RG", label: "Cópia do RG", url: "", present: true },
            { type: "DIPLOMA", label: "Diploma / Histórico", url: "", present: true },
        ],
    },
    {
        id: "doc-3", studentName: "Pedro Alves", cpf: "456.123.789-00",
        course: "Oncologia para Técnicos de Enfermagem", submittedAt: "2026-02-20",
        status: "pending", corenRequired: true, corenNumber: "COREN-RJ 112203",
        docs: [
            { type: "RG", label: "Cópia do RG", url: "https://images.unsplash.com/photo-1621844697921-289b4f526019?q=80&w=600&auto=format&fit=crop", present: true },
            { type: "DIPLOMA", label: "Diploma / Histórico", url: "https://images.unsplash.com/photo-1586281380349-632531db7ed4?q=80&w=600&auto=format&fit=crop", present: true },
            { type: "COREN", label: "Cartão COREN", url: "", present: false },
        ],
    },
    {
        id: "doc-4", studentName: "Ana Santos", cpf: "321.987.654-00",
        course: "Feridas, Estomias e Incontinências", submittedAt: "2026-02-22",
        status: "pending", corenRequired: true, corenNumber: null,
        docs: [
            { type: "RG", label: "Cópia do RG", url: "https://images.unsplash.com/photo-1621844697921-289b4f526019?q=80&w=600&auto=format&fit=crop", present: true },
            { type: "DIPLOMA", label: "Diploma / Histórico", url: "", present: false },
            { type: "COREN", label: "Cartão COREN", url: "", present: false },
        ],
    },
    {
        id: "doc-5", studentName: "Marcos Torres", cpf: "654.321.098-00",
        course: "Gestão em Saúde e Liderança", submittedAt: "2026-02-25",
        status: "rejected", corenRequired: true, corenNumber: "COREN-SP 445521",
        docs: [
            { type: "RG", label: "Cópia do RG", url: "", present: true },
            { type: "DIPLOMA", label: "Diploma / Histórico", url: "", present: true },
            { type: "COREN", label: "Cartão COREN", url: "", present: true },
        ],
    },
    {
        id: "doc-6", studentName: "Juliana Melo", cpf: "789.012.345-00",
        course: "Enfermagem Oncológica Avançada", submittedAt: "2026-03-01",
        status: "pending", corenRequired: true, corenNumber: "COREN-MG 098712",
        docs: [
            { type: "RG", label: "Cópia do RG", url: "https://images.unsplash.com/photo-1621844697921-289b4f526019?q=80&w=600&auto=format&fit=crop", present: true },
            { type: "DIPLOMA", label: "Diploma / Histórico", url: "https://images.unsplash.com/photo-1586281380349-632531db7ed4?q=80&w=600&auto=format&fit=crop", present: true },
            { type: "COREN", label: "Cartão COREN", url: "https://images.unsplash.com/photo-1550831107-1553da8c8464?q=80&w=600&auto=format&fit=crop", present: true },
        ],
    },
];
