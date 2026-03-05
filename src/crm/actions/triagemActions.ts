import { TRIAGEM_DOCUMENTOS_MOCK, TriagemDocumento, TriagemStatus } from "@/crm/mocks/triagemDocumentsMock";

export type { TriagemDocumento, TriagemStatus };

export function getTriagemDocuments(): TriagemDocumento[] {
    return TRIAGEM_DOCUMENTOS_MOCK.map((doc) => ({
        ...doc,
        docs: doc.docs.map((item) => ({ ...item })),
    }));
}

export function updateTriagemStatus(
    documents: TriagemDocumento[],
    id: string,
    status: Extract<TriagemStatus, "approved" | "rejected">,
): TriagemDocumento[] {
    return documents.map((doc) => (doc.id === id ? { ...doc, status } : doc));
}
