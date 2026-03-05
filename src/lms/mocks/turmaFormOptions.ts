export interface TurmaCursoOption {
    id: string;
    nome: string;
}

export const TURMA_CURSOS: TurmaCursoOption[] = [
    { id: "course-1", nome: "Oncologia para Técnicos de Enfermagem" },
    { id: "course-2", nome: "UTI Adulto — Cuidados Intensivos" },
    { id: "course-3", nome: "Feridas, Estomias e Incontinências" },
    { id: "course-4", nome: "Enfermagem Oncológica" },
    { id: "course-5", nome: "Pediatria e Neonatologia" },
    { id: "course-10", nome: "Gestão em Saúde e Liderança" },
];

export const TURMA_DOCENTES: string[] = [
    "Prof.ª Dra. Carla Bezerra",
    "Enf.ª Esp. Renata Lima",
    "Enf.ª Dra. Fátima Saraiva",
    "Enf.ª Esp. Jorge Moutinho",
    "Prof. Dr. Marcos Albuquerque",
    "Enf.ª Ms. Beatriz Novais",
];
