"use client";

import { useState, useTransition } from "react";
import { Download, FileText, Loader2 } from "lucide-react";

type ExportFormat = 'pdf' | 'xlsx' | 'csv';

interface DataExportButtonProps {
    relatorioId: string;
    relatorioNome?: string;
    periodoLabel?: string;
    formats?: ExportFormat[];
    className?: string;
}

const FORMAT_LABELS: Record<ExportFormat, string> = {
    pdf: 'PDF',
    xlsx: 'Excel',
    csv: 'CSV',
};

export function DataExportButton({
    relatorioId,
    relatorioNome = 'Relatório',
    periodoLabel = '',
    formats = ['pdf', 'xlsx', 'csv'],
    className = '',
}: DataExportButtonProps) {
    const [open, setOpen] = useState(false);
    const [isPending, startTransition] = useTransition();
    const [exporting, setExporting] = useState<ExportFormat | null>(null);

    async function handleExport(format: ExportFormat) {
        setExporting(format);
        setOpen(false);
        startTransition(async () => {
            try {
                const { exportarRelatorio } = await import('@/erp/actions/relatorioActions');
                const result = await exportarRelatorio(
                    relatorioId as 'DRE' | 'FluxoCaixa' | 'Balancete',
                    periodoLabel,
                    format.toUpperCase() as 'PDF' | 'XLSX' | 'CSV'
                );
                if (result?.url) {
                    const a = document.createElement('a');
                    a.href = result.url;
                    a.download = `${relatorioNome.replace(/\s+/g, '-')}-${periodoLabel}.${format}`;
                    a.click();
                }
            } finally {
                setExporting(null);
            }
        });
    }

    return (
        <div className={`relative ${className}`}>
            <button
                onClick={() => setOpen(o => !o)}
                disabled={isPending}
                className="flex items-center gap-2 bg-white border border-slate-200 text-slate-700 text-sm font-semibold px-4 py-2.5 rounded-xl hover:bg-slate-50 transition-colors shadow-sm disabled:opacity-50"
            >
                {isPending ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                    <Download className="w-4 h-4" />
                )}
                {exporting ? `Exportando ${FORMAT_LABELS[exporting]}...` : 'Exportar'}
            </button>

            {open && (
                <>
                    <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
                    <div className="absolute right-0 top-11 z-50 bg-white border border-slate-200 rounded-xl shadow-lg overflow-hidden w-40">
                        {formats.map(fmt => (
                            <button
                                key={fmt}
                                onClick={() => handleExport(fmt)}
                                className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-700 hover:bg-violet-50 hover:text-violet-700 transition-colors"
                            >
                                <FileText className="w-4 h-4" />
                                {FORMAT_LABELS[fmt]}
                            </button>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}
