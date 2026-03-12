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

export type CourseMode = 'CursoLivre' | 'GraduacaoModular' | 'PosGraduacao' | 'MBA'

/** Whether the course requires payment or is completely free. */
export type CourseTipo = 'Gratuito' | 'Pago'

export type VideoProvider = 'youtube' | 'vimeo' | 'supabase'

export interface CatalogCourse {
    id: string
    title: string
    description: string
    type: CourseType
    courseMode: CourseMode
    instructor: string       // público-alvo / pré-requisito profissional
    hours: string
    startDate: string        // "DD/MM/YYYY"
    endDate: string
    schedule: string         // "Matutino ou Vespertino"
    corenRequired: boolean
    price: number            // em centavos (0 for free courses)
    /** Preco bundle (todos modulos) em centavos. Apenas para GraduacaoModular. */
    bundlePrice?: number
    maxInstallments: number
    imageUrl?: string
    /** Defaults to 'Pago' when omitted. */
    tipo?: CourseTipo
    videoProvider?: VideoProvider
    videoUrl?: string
}

export const CATALOG: CatalogCourse[] = [
    {
        id: "course-1",
        title: "Oncologia para Técnicos",
        description: "Especialização voltada para técnicos de enfermagem que atuam em ambientes oncológicos, abordando protocolos de quimioterapia, cuidados paliativos e manejo de cateteres.",
        type: "Curso Livre",
        courseMode: "CursoLivre",
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
        courseMode: "CursoLivre",
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
        title: "Feridas, Estomias e Incontinencias",
        description: "Capacitação avançada no tratamento e prevenção de feridas complexas, estomas intestinais e urológicos, com vista à certificação SOBEST. Modular: compre módulos separadamente ou o curso completo.",
        type: "Especialização",
        courseMode: "GraduacaoModular",
        instructor: "Enfermeiros e Enfermandos",
        hours: "360h",
        startDate: "02/10/2025",
        endDate: "10/12/2025",
        schedule: "Matutino ou Vespertino",
        corenRequired: true,
        price: 24900,
        bundlePrice: 79900,
        maxInstallments: 12,
    },
    {
        id: "course-4",
        title: "Enfermagem Oncológica",
        description: "Pós-graduação em Enfermagem Oncológica com enfoque em quimioterapia, radioterapia, cuidados paliativos e biossegurança. Compre módulos separados ou o bundle completo.",
        type: "Pós-Graduação",
        courseMode: "GraduacaoModular",
        instructor: "Enfermeiros",
        hours: "360h",
        startDate: "02/10/2025",
        endDate: "10/12/2025",
        schedule: "Matutino ou Vespertino",
        corenRequired: true,
        price: 32400,
        bundlePrice: 109900,
        maxInstallments: 12,
    },
    {
        id: "course-5",
        title: "Pós-Graduação em Enfermagem Oncológica",
        description: "Aprofundamento em oncologia clínica, semiologia do paciente oncológico e gestão de unidades de quimioterapia ambulatorial.",
        type: "Pós-Graduação",
        courseMode: "PosGraduacao",
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
        courseMode: "CursoLivre",
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
        courseMode: "CursoLivre",
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
        description: "Turma B da especialização em Feridas, Estomias e Incontinencias com foco em casos clínicos avançados. Modular: adquira módulos avulsos.",
        type: "Especialização",
        courseMode: "GraduacaoModular",
        instructor: "Enfermeiros e Enfermandos",
        hours: "360h",
        startDate: "02/10/2025",
        endDate: "10/12/2025",
        schedule: "Matutino ou Vespertino",
        corenRequired: true,
        price: 24900,
        bundlePrice: 79900,
        maxInstallments: 12,
    },
    {
        id: "course-9",
        title: "Enfermagem Oncológica — Turma B",
        description: "Segunda turma do curso de Enfermagem Oncológica, com módulo extra de pesquisa clínica e ensaios clínicos.",
        type: "Pós-Graduação",
        courseMode: "PosGraduacao",
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
        courseMode: "PosGraduacao",
        instructor: "Enfermeiros",
        hours: "360h",
        startDate: "05/11/2025",
        endDate: "20/01/2026",
        schedule: "Vespertino ou Noturno",
        corenRequired: false,
        price: 119900,
        maxInstallments: 12,
    },
    // ── Free / Gratuito courses (MVP Moodle replacement) ──────────────────
    {
        id: "course-free-1",
        title: "Introdução à Enfermagem Oncológica (Gratuito)",
        description: "Curso introdutório gratuito para profissionais de saúde que desejam conhecer os fundamentos da enfermagem oncológica: biossegurança, manejo de quimioterápicos e comunicação com o paciente.",
        type: "Curso Livre",
        courseMode: "CursoLivre",
        instructor: "Todos os profissionais de saúde",
        hours: "8h",
        startDate: "01/01/2025",
        endDate: "31/12/2030",
        schedule: "Online — assíncrono",
        corenRequired: false,
        price: 0,
        maxInstallments: 1,
        tipo: "Gratuito" as CourseTipo,
        videoProvider: "youtube" as VideoProvider,
        videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    },
    {
        id: "course-free-2",
        title: "Biossegurança para Técnicos de Enfermagem (Gratuito)",
        description: "Capacitação obrigatória em biossegurança hospitalar: EPIs, descarte de resíduos, prevenção de infecções e normas da ANVISA. Acesso permanente.",
        type: "Curso Livre",
        courseMode: "CursoLivre",
        instructor: "Técnicos de Enfermagem",
        hours: "4h",
        startDate: "01/01/2025",
        endDate: "31/12/2030",
        schedule: "Online — assíncrono",
        corenRequired: true,
        price: 0,
        maxInstallments: 1,
        tipo: "Gratuito" as CourseTipo,
        videoProvider: "vimeo" as VideoProvider,
        videoUrl: "https://player.vimeo.com/video/123456789",
    },
]

/** Formata preço em centavos para exibição */
export function formatPrice(cents: number): string {
    return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(cents / 100)
}
