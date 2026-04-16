/**
 * Ocorrência Validation Schemas
 * Central entity for ERP event tracking across all portals.
 */

import { z } from 'zod';

export const OCORRENCIA_TIPOS = [
    'TRIAGEM',
    'ACADEMICA',
    'FINANCEIRA',
    'DISCIPLINAR',
    'SISTEMA',
    'REQUERIMENTO',
] as const;

export const OCORRENCIA_PRIORIDADES = ['BAIXA', 'MEDIA', 'ALTA', 'CRITICA'] as const;
export const OCORRENCIA_STATUS = ['ABERTA', 'EM_ANALISE', 'RESOLVIDA', 'CANCELADA'] as const;

export type OcorrenciaTipo = typeof OCORRENCIA_TIPOS[number];
export type OcorrenciaPrioridade = typeof OCORRENCIA_PRIORIDADES[number];
export type OcorrenciaStatus = typeof OCORRENCIA_STATUS[number];

export const ocorrenciaSchema = z.object({
    id: z.string().optional(),

    tipo: z.enum(OCORRENCIA_TIPOS, {
        error: () => ({ message: 'Tipo de ocorrência inválido.' }),
    }),
    prioridade: z.enum(OCORRENCIA_PRIORIDADES, {
        error: () => ({ message: 'Prioridade inválida.' }),
    }).default('MEDIA'),
    status: z.enum(OCORRENCIA_STATUS).default('ABERTA'),

    titulo: z.string().min(5, 'Título deve ter ao menos 5 caracteres.').max(120, 'Título muito longo.'),
    descricao: z.string().min(10, 'Descrição deve ter ao menos 10 caracteres.').max(2000),

    // Related entities (all optional — ocorrência can be standalone)
    alunoId: z.string().optional(),
    alunoNome: z.string().optional(),
    turmaId: z.string().optional(),
    cursoId: z.string().optional(),

    // Lifecycle
    criadoPorId: z.string().optional(),
    criadoPorNome: z.string().optional(),
    atribuidoParaId: z.string().optional(),
    atribuidoParaNome: z.string().optional(),

    resolucao: z.string().max(2000).optional(),

    criadoEm: z.date().optional(),
    atualizadoEm: z.date().optional(),
    resolvidoEm: z.date().optional(),
});

export type OcorrenciaInput = z.infer<typeof ocorrenciaSchema>;

export const resolverOcorrenciaSchema = z.object({
    id: z.string().min(1),
    resolucao: z
        .string()
        .min(10, 'Descreva a resolução com ao menos 10 caracteres.')
        .max(2000),
});

export const criarOcorrenciaSchema = ocorrenciaSchema.pick({
    tipo: true,
    prioridade: true,
    titulo: true,
    descricao: true,
    alunoId: true,
    turmaId: true,
    cursoId: true,
});

export type CriarOcorrenciaInput = z.infer<typeof criarOcorrenciaSchema>;
