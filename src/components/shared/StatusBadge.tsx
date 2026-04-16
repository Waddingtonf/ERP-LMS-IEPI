/**
 * StatusBadge — reusable semantic badge for enrollment and ocorrência statuses.
 */

import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

type BadgeVariant = 'success' | 'warning' | 'danger' | 'info' | 'neutral';

interface StatusBadgeProps {
    label: string;
    variant: BadgeVariant;
    className?: string;
}

const variantStyles: Record<BadgeVariant, string> = {
    success: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    warning: 'bg-amber-100 text-amber-700 border-amber-200',
    danger: 'bg-rose-100 text-rose-700 border-rose-200',
    info: 'bg-blue-100 text-blue-700 border-blue-200',
    neutral: 'bg-slate-100 text-slate-600 border-slate-200',
};

export function StatusBadge({ label, variant, className }: StatusBadgeProps) {
    return (
        <Badge className={cn('border text-xs font-semibold', variantStyles[variant], className)}>
            {label}
        </Badge>
    );
}

// ─── Helper maps ─────────────────────────────────────────────────────────────

const ENROLLMENT_STATUS_MAP: Record<string, { label: string; variant: BadgeVariant }> = {
    Ativo: { label: 'Ativo', variant: 'success' },
    Concluido: { label: 'Concluído', variant: 'info' },
    Trancado: { label: 'Trancado', variant: 'warning' },
    Evadido: { label: 'Evadido', variant: 'danger' },
    Pendente: { label: 'Pendente', variant: 'neutral' },
};

export function EnrollmentStatusBadge({ status }: { status: string }) {
    const cfg = ENROLLMENT_STATUS_MAP[status] ?? { label: status, variant: 'neutral' as BadgeVariant };
    return <StatusBadge label={cfg.label} variant={cfg.variant} />;
}

const OCORRENCIA_STATUS_MAP: Record<string, { label: string; variant: BadgeVariant }> = {
    ABERTA: { label: 'Aberta', variant: 'danger' },
    EM_ANALISE: { label: 'Em análise', variant: 'warning' },
    RESOLVIDA: { label: 'Resolvida', variant: 'success' },
    CANCELADA: { label: 'Cancelada', variant: 'neutral' },
};

export function OcorrenciaStatusBadge({ status }: { status: string }) {
    const cfg = OCORRENCIA_STATUS_MAP[status] ?? { label: status, variant: 'neutral' as BadgeVariant };
    return <StatusBadge label={cfg.label} variant={cfg.variant} />;
}

const OCORRENCIA_PRIORIDADE_MAP: Record<string, { label: string; variant: BadgeVariant }> = {
    BAIXA: { label: 'Baixa', variant: 'neutral' },
    MEDIA: { label: 'Média', variant: 'info' },
    ALTA: { label: 'Alta', variant: 'warning' },
    CRITICA: { label: 'Crítica', variant: 'danger' },
};

export function PrioridadeBadge({ prioridade }: { prioridade: string }) {
    const cfg = OCORRENCIA_PRIORIDADE_MAP[prioridade] ?? { label: prioridade, variant: 'neutral' as BadgeVariant };
    return <StatusBadge label={cfg.label} variant={cfg.variant} />;
}

const NOTA_STATUS_MAP = [
    { threshold: 6.0, label: 'Aprovado', variant: 'success' as BadgeVariant },
    { threshold: 4.0, label: 'Recuperação', variant: 'warning' as BadgeVariant },
    { threshold: 0, label: 'Reprovado', variant: 'danger' as BadgeVariant },
];

export function NotaStatusBadge({ media }: { media: number }) {
    const cfg = NOTA_STATUS_MAP.find(e => media >= e.threshold) ?? NOTA_STATUS_MAP[2];
    return <StatusBadge label={cfg.label} variant={cfg.variant} />;
}
