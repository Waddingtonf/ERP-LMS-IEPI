import React from 'react';
import { cn } from '@/lib/utils';

// ── PageHeader ────────────────────────────────────────────────────────────────

interface PageHeaderProps {
    title: string;
    description?: string;
    actions?: React.ReactNode;
    breadcrumbs?: Array<{ label: string; href?: string }>;
    className?: string;
}

export function PageHeader({ title, description, actions, breadcrumbs, className }: PageHeaderProps) {
    return (
        <div className={cn('mb-6', className)}>
            {breadcrumbs && breadcrumbs.length > 0 && (
                <nav className="mb-2 flex items-center gap-1.5 text-xs text-slate-400">
                    {breadcrumbs.map((crumb, i) => (
                        <React.Fragment key={i}>
                            {i > 0 && <span>/</span>}
                            {crumb.href ? (
                                <a href={crumb.href} className="hover:text-slate-600 transition-colors">
                                    {crumb.label}
                                </a>
                            ) : (
                                <span className="text-slate-600 font-medium">{crumb.label}</span>
                            )}
                        </React.Fragment>
                    ))}
                </nav>
            )}
            <div className="flex items-start justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800 leading-tight">{title}</h1>
                    {description && (
                        <p className="mt-1 text-sm text-slate-500">{description}</p>
                    )}
                </div>
                {actions && (
                    <div className="flex items-center gap-2 shrink-0">{actions}</div>
                )}
            </div>
        </div>
    );
}

// ── PageSection ───────────────────────────────────────────────────────────────

interface PageSectionProps {
    title?: string;
    description?: string;
    actions?: React.ReactNode;
    children: React.ReactNode;
    className?: string;
}

export function PageSection({ title, description, actions, children, className }: PageSectionProps) {
    return (
        <section className={cn('space-y-4', className)}>
            {(title || actions) && (
                <div className="flex items-center justify-between">
                    <div>
                        {title && <h2 className="text-lg font-semibold text-slate-700">{title}</h2>}
                        {description && <p className="text-sm text-slate-400">{description}</p>}
                    </div>
                    {actions && <div className="flex items-center gap-2">{actions}</div>}
                </div>
            )}
            {children}
        </section>
    );
}

// ── StatsGrid ─────────────────────────────────────────────────────────────────

export interface StatCard {
    label: string;
    value: string | number;
    delta?: string;
    deltaPositive?: boolean;
    icon?: React.ReactNode;
    color?: string; // tailwind bg class e.g. "bg-violet-100"
    iconColor?: string; // tailwind text class e.g. "text-violet-600"
}

interface StatsGridProps {
    stats: StatCard[];
    cols?: 2 | 3 | 4;
    className?: string;
}

export function StatsGrid({ stats, cols = 4, className }: StatsGridProps) {
    const gridClass = {
        2: 'grid-cols-1 sm:grid-cols-2',
        3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
        4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
    }[cols];

    return (
        <div className={cn('grid gap-4', gridClass, className)}>
            {stats.map((stat, i) => (
                <div key={i} className="portal-card p-5 flex items-start gap-4">
                    {stat.icon && (
                        <div className={cn('w-10 h-10 rounded-lg flex items-center justify-center shrink-0', stat.color ?? 'bg-slate-100')}>
                            <span className={stat.iconColor ?? 'text-slate-600'}>{stat.icon}</span>
                        </div>
                    )}
                    <div className="min-w-0">
                        <p className="text-xs font-medium text-slate-500 truncate">{stat.label}</p>
                        <p className="text-2xl font-bold text-slate-800 leading-tight mt-0.5">{stat.value}</p>
                        {stat.delta && (
                            <p className={cn('text-xs mt-1', stat.deltaPositive ? 'text-emerald-600' : 'text-red-500')}>
                                {stat.delta}
                            </p>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
}

// ── EmptyState ────────────────────────────────────────────────────────────────

interface EmptyStateProps {
    icon?: React.ReactNode;
    title: string;
    description?: string;
    action?: React.ReactNode;
    className?: string;
}

export function EmptyState({ icon, title, description, action, className }: EmptyStateProps) {
    return (
        <div className={cn('flex flex-col items-center justify-center py-16 text-center', className)}>
            {icon && (
                <div className="mb-4 w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                    {icon}
                </div>
            )}
            <h3 className="text-base font-semibold text-slate-700">{title}</h3>
            {description && <p className="mt-1 text-sm text-slate-400 max-w-xs">{description}</p>}
            {action && <div className="mt-4">{action}</div>}
        </div>
    );
}

// ── LoadingSkeleton ───────────────────────────────────────────────────────────

interface LoadingSkeletonProps {
    rows?: number;
    className?: string;
}

export function LoadingSkeleton({ rows = 4, className }: LoadingSkeletonProps) {
    return (
        <div className={cn('space-y-3', className)}>
            {Array.from({ length: rows }).map((_, i) => (
                <div key={i} className="h-12 rounded-xl bg-slate-100 animate-pulse" style={{ opacity: 1 - i * 0.15 }} />
            ))}
        </div>
    );
}

/** Inline text skeleton */
export function SkeletonText({ width = 'w-32', height = 'h-4', className = '' }: { width?: string; height?: string; className?: string }) {
    return <div className={cn('rounded bg-slate-100 animate-pulse', width, height, className)} />;
}
