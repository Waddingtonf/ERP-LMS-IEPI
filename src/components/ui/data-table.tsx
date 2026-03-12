"use client";

/**
 * DataTable — universal data table with:
 * - Column sorting
 * - Row checkbox selection
 * - BulkActionBar (sticky bottom bar when rows are selected)
 * - Pagination (25 / 50 / 100 rows per page)
 * - Optional CSV/JSON export
 *
 * Usage:
 *   <DataTable columns={cols} data={rows} bulkActions={[...]} />
 */
import React, { useState, useMemo, useCallback } from 'react';
import { ChevronUp, ChevronDown, ChevronsUpDown, Download, X } from 'lucide-react';
import { Button } from './button';
import { Checkbox } from './checkbox';
import { cn } from '@/lib/utils';

// ── Types ─────────────────────────────────────────────────────────────────────

export type SortDir = 'asc' | 'desc' | null;

export interface Column<T> {
    key: keyof T | string;
    header: string;
    sortable?: boolean;
    className?: string;
    render?: (row: T) => React.ReactNode;
}

export interface BulkAction<T> {
    label: string;
    icon?: React.ReactNode;
    variant?: 'default' | 'destructive' | 'outline';
    onClick: (selectedRows: T[]) => void;
}

export interface DataTableProps<T extends { id: string }> {
    columns: Column<T>[];
    data: T[];
    keyField?: keyof T;
    selectable?: boolean;
    bulkActions?: BulkAction<T>[];
    defaultPageSize?: 25 | 50 | 100;
    exportFilename?: string;
    isLoading?: boolean;
    emptyMessage?: string;
    className?: string;
}

// ── Sort icon ─────────────────────────────────────────────────────────────────

function SortIcon({ dir }: { dir: SortDir }) {
    if (dir === 'asc') return <ChevronUp className="h-3.5 w-3.5 text-slate-600" />;
    if (dir === 'desc') return <ChevronDown className="h-3.5 w-3.5 text-slate-600" />;
    return <ChevronsUpDown className="h-3.5 w-3.5 text-slate-400" />;
}

// ── Export helper ─────────────────────────────────────────────────────────────

function exportCsv<T>(data: T[], columns: Column<T>[], filename: string) {
    const headers = columns.map((c) => `"${c.header}"`).join(',');
    const rows = data.map((row) =>
        columns
            .map((c) => {
                const val = (row as Record<string, unknown>)[c.key as string];
                return `"${String(val ?? '').replace(/"/g, '""')}"`;
            })
            .join(','),
    );
    const csv = [headers, ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename}.csv`;
    a.click();
    URL.revokeObjectURL(url);
}

// ── DataTable ─────────────────────────────────────────────────────────────────

export function DataTable<T extends { id: string }>({
    columns,
    data,
    keyField = 'id' as keyof T,
    selectable = true,
    bulkActions = [],
    defaultPageSize = 25,
    exportFilename = 'export',
    isLoading = false,
    emptyMessage = 'Nenhum registro encontrado.',
    className,
}: DataTableProps<T>) {
    const [sortKey, setSortKey] = useState<string | null>(null);
    const [sortDir, setSortDir] = useState<SortDir>(null);
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState<number>(defaultPageSize);

    // ── Sort ─────────────────────────────────────────────────────────────────
    const sorted = useMemo(() => {
        if (!sortKey || !sortDir) return data;
        return [...data].sort((a, b) => {
            const av = (a as Record<string, unknown>)[sortKey];
            const bv = (b as Record<string, unknown>)[sortKey];
            const cmp = String(av ?? '').localeCompare(String(bv ?? ''), 'pt-BR');
            return sortDir === 'asc' ? cmp : -cmp;
        });
    }, [data, sortKey, sortDir]);

    // ── Pagination ───────────────────────────────────────────────────────────
    const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));
    const paged = sorted.slice((page - 1) * pageSize, page * pageSize);

    const toggleSort = useCallback(
        (key: string) => {
            if (sortKey !== key) {
                setSortKey(key);
                setSortDir('asc');
            } else if (sortDir === 'asc') {
                setSortDir('desc');
            } else {
                setSortKey(null);
                setSortDir(null);
            }
            setPage(1);
        },
        [sortKey, sortDir],
    );

    // ── Selection ────────────────────────────────────────────────────────────
    const allPageSelected = paged.length > 0 && paged.every((r) => selectedIds.has(r[keyField] as string));
    const somePageSelected = paged.some((r) => selectedIds.has(r[keyField] as string));

    const toggleAll = () => {
        if (allPageSelected) {
            const next = new Set(selectedIds);
            paged.forEach((r) => next.delete(r[keyField] as string));
            setSelectedIds(next);
        } else {
            const next = new Set(selectedIds);
            paged.forEach((r) => next.add(r[keyField] as string));
            setSelectedIds(next);
        }
    };

    const toggleRow = (id: string) => {
        const next = new Set(selectedIds);
        if (next.has(id)) next.delete(id);
        else next.add(id);
        setSelectedIds(next);
    };

    const clearSelection = () => setSelectedIds(new Set());

    const selectedRows = data.filter((r) => selectedIds.has(r[keyField] as string));

    return (
        <div className={cn('flex flex-col gap-0', className)}>
            {/* Table wrapper */}
            <div className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-slate-50 border-b border-slate-200">
                            <tr>
                                {selectable && (
                                    <th className="w-10 px-3 py-3">
                                        <Checkbox
                                            checked={allPageSelected}
                                            data-state={somePageSelected && !allPageSelected ? 'indeterminate' : undefined}
                                            onCheckedChange={toggleAll}
                                            aria-label="Selecionar todos"
                                        />
                                    </th>
                                )}
                                {columns.map((col) => (
                                    <th
                                        key={String(col.key)}
                                        className={cn(
                                            'px-4 py-3 text-left font-medium text-slate-600 whitespace-nowrap',
                                            col.sortable && 'cursor-pointer select-none hover:text-slate-800',
                                            col.className,
                                        )}
                                        onClick={() => col.sortable && toggleSort(String(col.key))}
                                    >
                                        <div className="flex items-center gap-1">
                                            {col.header}
                                            {col.sortable && (
                                                <SortIcon dir={sortKey === String(col.key) ? sortDir : null} />
                                            )}
                                        </div>
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {isLoading ? (
                                Array.from({ length: 5 }).map((_, i) => (
                                    <tr key={i}>
                                        {selectable && <td className="px-3 py-3"><div className="w-4 h-4 rounded bg-slate-100 animate-pulse" /></td>}
                                        {columns.map((col) => (
                                            <td key={String(col.key)} className="px-4 py-3">
                                                <div className="h-4 rounded bg-slate-100 animate-pulse" style={{ width: `${60 + Math.random() * 40}%` }} />
                                            </td>
                                        ))}
                                    </tr>
                                ))
                            ) : paged.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan={columns.length + (selectable ? 1 : 0)}
                                        className="px-4 py-12 text-center text-slate-400"
                                    >
                                        {emptyMessage}
                                    </td>
                                </tr>
                            ) : (
                                paged.map((row) => {
                                    const id = row[keyField] as string;
                                    const isSelected = selectedIds.has(id);
                                    return (
                                        <tr
                                            key={id}
                                            className={cn(
                                                'hover:bg-slate-50 transition-colors',
                                                isSelected && 'bg-violet-50',
                                            )}
                                        >
                                            {selectable && (
                                                <td className="px-3 py-3">
                                                    <Checkbox
                                                        checked={isSelected}
                                                        onCheckedChange={() => toggleRow(id)}
                                                        aria-label={`Selecionar linha ${id}`}
                                                    />
                                                </td>
                                            )}
                                            {columns.map((col) => (
                                                <td
                                                    key={String(col.key)}
                                                    className={cn('px-4 py-3 text-slate-700', col.className)}
                                                >
                                                    {col.render
                                                        ? col.render(row)
                                                        : String((row as Record<string, unknown>)[col.key as string] ?? '')}
                                                </td>
                                            ))}
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination footer */}
                <div className="flex items-center justify-between px-4 py-3 border-t border-slate-200 bg-slate-50 text-xs text-slate-500">
                    <div className="flex items-center gap-2">
                        <span>Linhas por página:</span>
                        {([25, 50, 100] as const).map((n) => (
                            <button
                                key={n}
                                onClick={() => { setPageSize(n); setPage(1); }}
                                className={cn(
                                    'px-2 py-1 rounded',
                                    pageSize === n
                                        ? 'bg-violet-100 text-violet-700 font-medium'
                                        : 'hover:bg-slate-200',
                                )}
                            >
                                {n}
                            </button>
                        ))}
                    </div>

                    <span>
                        {sorted.length === 0
                            ? '0 registros'
                            : `${(page - 1) * pageSize + 1}–${Math.min(page * pageSize, sorted.length)} de ${sorted.length}`}
                    </span>

                    <div className="flex items-center gap-1">
                        {exportFilename && (
                            <button
                                onClick={() => exportCsv(sorted, columns, exportFilename)}
                                className="flex items-center gap-1 px-2 py-1 rounded hover:bg-slate-200"
                                title="Exportar CSV"
                            >
                                <Download className="h-3.5 w-3.5" />
                                CSV
                            </button>
                        )}
                        <button
                            disabled={page === 1}
                            onClick={() => setPage((p) => p - 1)}
                            className="px-2 py-1 rounded hover:bg-slate-200 disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                            ‹
                        </button>
                        <span className="px-1">{page} / {totalPages}</span>
                        <button
                            disabled={page >= totalPages}
                            onClick={() => setPage((p) => p + 1)}
                            className="px-2 py-1 rounded hover:bg-slate-200 disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                            ›
                        </button>
                    </div>
                </div>
            </div>

            {/* BulkActionBar */}
            {selectable && selectedIds.size > 0 && (
                <div className="sticky bottom-0 z-20 mx-0 mt-0">
                    <div className="flex items-center gap-3 rounded-b-xl border border-t-0 border-slate-200 bg-slate-900 px-4 py-3 shadow-lg">
                        <span className="text-sm font-medium text-white">
                            {selectedIds.size} {selectedIds.size === 1 ? 'selecionado' : 'selecionados'}
                        </span>
                        <div className="flex items-center gap-2 ml-2">
                            {bulkActions.map((action, i) => (
                                <Button
                                    key={i}
                                    size="sm"
                                    variant={action.variant === 'destructive' ? 'destructive' : 'outline'}
                                    className={cn(
                                        action.variant !== 'destructive' && 'border-slate-600 text-slate-100 hover:bg-slate-700 hover:text-white',
                                    )}
                                    onClick={() => action.onClick(selectedRows)}
                                >
                                    {action.icon && <span className="mr-1.5">{action.icon}</span>}
                                    {action.label}
                                </Button>
                            ))}
                        </div>
                        <button
                            onClick={clearSelection}
                            className="ml-auto text-slate-400 hover:text-white"
                            title="Limpar seleção"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
