/**
 * Catálogo de cursos — fonte única de verdade para front-end (SSR/CSR)
 * e para o MockCourseRepository.
 * Em produção, esses dados virão do Supabase via CourseRepository.
 */

export type CourseType =
    | "Curso Livre"
    | "Pós-Graduação"
    | "Graduação"
    | "Especialização"
    | "Residência"

export interface CatalogCourse {
    id: string
    title: string
    description: string
    type: CourseType
    instructor: string       // público-alvo / pré-requisito profissional
    hours: string
    startDate: string        // "DD/MM/YYYY"
    endDate: string
    schedule: string         // "Matutino ou Vespertino"
    corenRequired: boolean
    price: number            // em centavos
    maxInstallments: number
    imageUrl?: string
}

export const CATALOG: CatalogCourse[] = [
    {
        id: "course-1",
        title: "Oncologia para Técnicos",
        description: "Especialização voltada para técnicos de enfermagem que atuam em ambientes oncológicos, abordando protocolos de quimioterapia, cuidados paliativos e manejo de cateteres.",
        type: "Curso Livre",
        instructor: "Técnicos de Enfermagem",
        hours: "360h",
        startDate: "02/10/2025",
        endDate: "10/12/2025",
        schedule: "Matutino ou Vespertino",
        corenRequired: true,
        price: 49900,
        maxInstallments: 12,
    },
    {
        id: "course-2",
        title: "Instrumentação Cirúrgica",
        description: "Formação completa em instrumentação cirúrgica com aulas práticas em centro cirúrgico equipado, preparando o profissional para atuar em salas de cirurgia.",
        type: "Curso Livre",
        instructor: "Técnicos de Enfermagem",
        hours: "360h",
        startDate: "02/10/2025",
        endDate: "10/12/2025",
        schedule: "Matutino ou Vespertino",
        corenRequired: true,
        price: 49900,
        maxInstallments: 12,
    },
    {
        id: "course-3",
        title: "Feridas, Estomias e Incontinências",
        description: "Capacitação avançada no tratamento e prevenção de feridas complexas, estomas intestinais e urológicos, com vista à certificação SOBEST.",
        type: "Especialização",
        instructor: "Enfermeiros e Enfermandos",
        hours: "360h",
        startDate: "02/10/2025",
        endDate: "10/12/2025",
        schedule: "Matutino ou Vespertino",
        corenRequired: true,
        price: 89900,
        maxInstallments: 12,
    },
    {
        id: "course-4",
        title: "Enfermagem Oncológica",
        description: "Pós-graduação em Enfermagem Oncológica com enfoque em quimioterapia, radioterapia, cuidados paliativos e biossegurança.",
        type: "Pós-Graduação",
        instructor: "Enfermeiros",
        hours: "360h",
        startDate: "02/10/2025",
        endDate: "10/12/2025",
        schedule: "Matutino ou Vespertino",
        corenRequired: true,
        price: 129900,
        maxInstallments: 12,
    },
    {
        id: "course-5",
        title: "Pós-Graduação em Enfermagem Oncológica",
        description: "Aprofundamento em oncologia clínica, semiologia do paciente oncológico e gestão de unidades de quimioterapia ambulatorial.",
        type: "Pós-Graduação",
        instructor: "Enfermeiros",
        hours: "360h",
        startDate: "02/10/2025",
        endDate: "10/12/2025",
        schedule: "Matutino ou Vespertino",
        corenRequired: true,
        price: 149900,
        maxInstallments: 12,
    },
    {
        id: "course-6",
        title: "Oncologia para Técnicos — Turma B",
        description: "Segunda turma do curso de Oncologia para Técnicos, com as mesmas competências e carga horária da Turma A.",
        type: "Curso Livre",
        instructor: "Técnicos de Enfermagem",
        hours: "360h",
        startDate: "02/10/2025",
        endDate: "10/12/2025",
        schedule: "Matutino ou Vespertino",
        corenRequired: true,
        price: 49900,
        maxInstallments: 12,
    },
    {
        id: "course-7",
        title: "Instrumentação Cirúrgica — Turma B",
        description: "Segunda turma de Instrumentação Cirúrgica, com ênfase em cirurgias videolaparoscópicas e robóticas.",
        type: "Curso Livre",
        instructor: "Técnicos de Enfermagem",
        hours: "360h",
        startDate: "02/10/2025",
        endDate: "10/12/2025",
        schedule: "Matutino ou Vespertino",
        corenRequired: true,
        price: 49900,
        maxInstallments: 12,
    },
    {
        id: "course-8",
        title: "Feridas e Estomias — Turma B",
        description: "Turma B da especialização em Feridas, Estomias e Incontinências com foco em casos clínicos avançados.",
        type: "Especialização",
        instructor: "Enfermeiros e Enfermandos",
        hours: "360h",
        startDate: "02/10/2025",
        endDate: "10/12/2025",
        schedule: "Matutino ou Vespertino",
        corenRequired: true,
        price: 89900,
        maxInstallments: 12,
    },
    {
        id: "course-9",
        title: "Enfermagem Oncológica — Turma B",
        description: "Segunda turma do curso de Enfermagem Oncológica, com módulo extra de pesquisa clínica e ensaios clínicos.",
        type: "Pós-Graduação",
        instructor: "Enfermeiros",
        hours: "360h",
        startDate: "02/10/2025",
        endDate: "10/12/2025",
        schedule: "Matutino ou Vespertino",
        corenRequired: true,
        price: 129900,
        maxInstallments: 12,
    },
    {
        id: "course-10",
        title: "Gestão em Saúde e Liderança",
        description: "Formação em gestão hospitalar, liderança de equipes de saúde, indicadores clínicos e acreditação hospitalar.",
        type: "Pós-Graduação",
        instructor: "Enfermeiros",
        hours: "360h",
        startDate: "05/11/2025",
        endDate: "20/01/2026",
        schedule: "Vespertino ou Noturno",
        corenRequired: false,
        price: 119900,
        maxInstallments: 12,
    },
]

/** Formata preço em centavos para exibição */
export function formatPrice(cents: number): string {
    return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(cents / 100)
}
