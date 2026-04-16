/**
 * DataTable — generic paginated table component.
 * Server-friendly: receives pre-fetched rows, handles client-side search and pagination.
 */

'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Search } from 'lucide-react';

export interface Column<T> {
    key: string;
    header: string;
    render: (row: T) => React.ReactNode;
    searchable?: boolean;  // if true, this column's string value is used for search
}

interface DataTableProps<T extends Record<string, unknown>> {
    rows: T[];
    columns: Column<T>[];
    pageSize?: number;
    searchPlaceholder?: string;
    emptyMessage?: string;
}

export function DataTable<T extends Record<string, unknown>>({
    rows,
    columns,
    pageSize = 10,
    searchPlaceholder = 'Buscar...',
    emptyMessage = 'Nenhum registro encontrado.',
}: DataTableProps<T>) {
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(0);

    const searchableCols = columns.filter(c => c.searchable);

    const filtered = search.trim()
        ? rows.filter(row =>
            searchableCols.some(col => {
                const val = row[col.key];
                return String(val ?? '').toLowerCase().includes(search.toLowerCase());
            })
        )
        : rows;

    const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
    const paginated = filtered.slice(page * pageSize, (page + 1) * pageSize);

    const handleSearch = (v: string) => {
        setSearch(v);
        setPage(0);
    };

    return (
        <div className="space-y-3">
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                    placeholder={searchPlaceholder}
                    value={search}
                    onChange={e => handleSearch(e.target.value)}
                    className="pl-9"
                />
            </div>

            <div className="rounded-lg border border-slate-200 overflow-hidden">
                <table className="w-full text-sm">
                    <thead className="bg-slate-50 border-b border-slate-200">
                        <tr>
                            {columns.map(col => (
                                <th key={col.key} className="px-4 py-2.5 text-left text-xs font-semibold text-slate-600 uppercase tracking-wide">
                                    {col.header}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {paginated.length === 0 ? (
                            <tr>
                                <td colSpan={columns.length} className="px-4 py-8 text-center text-slate-400">
                                    {emptyMessage}
                                </td>
                            </tr>
                        ) : (
                            paginated.map((row, idx) => (
                                <tr key={idx} className="hover:bg-slate-50 transition-colors">
                                    {columns.map(col => (
                                        <td key={col.key} className="px-4 py-3 text-slate-700">
                                            {col.render(row)}
                                        </td>
                                    ))}
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {totalPages > 1 && (
                <div className="flex items-center justify-between text-xs text-slate-500">
                    <span>
                        {filtered.length} resultado(s) · página {page + 1} de {totalPages}
                    </span>
                    <div className="flex gap-1">
                        <Button variant="outline" size="sm" onClick={() => setPage(p => Math.max(0, p - 1))} disabled={page === 0}>
                            <ChevronLeft className="w-3.5 h-3.5" />
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))} disabled={page === totalPages - 1}>
                            <ChevronRight className="w-3.5 h-3.5" />
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}
