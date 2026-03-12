"use client";

import React, { useState, useRef, useTransition } from 'react';
import { Upload, FileText, AlertCircle, CheckCircle2, Download } from 'lucide-react';
import { importAlunosCsvAction } from '@/lms/actions/csvImportActions';
import type { ImportResult } from '@/shared/services/CsvImportService';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const TEMPLATE_CSV = `nome,email,telefone,cpf,cursoId,turmaId
João Silva,joao@email.com,11912345678,00000000000,course-1,turma-1
Maria Santos,maria@email.com,11987654321,11111111111,course-2,`;

export default function ImportarAlunosPage() {
    const [isDragging, setIsDragging] = useState(false);
    const [csvText, setCsvText] = useState('');
    const [fileName, setFileName] = useState('');
    const [result, setResult] = useState<ImportResult | null>(null);
    const [error, setError] = useState('');
    const [isPending, startTransition] = useTransition();
    const inputRef = useRef<HTMLInputElement>(null);

    const handleFile = (file: File) => {
        if (!file.name.endsWith('.csv') && !file.name.endsWith('.txt')) {
            setError('Somente arquivos .csv ou .txt são aceitos.');
            return;
        }
        setError('');
        setFileName(file.name);
        const reader = new FileReader();
        reader.onload = (e) => setCsvText(e.target?.result as string);
        reader.readAsText(file, 'utf-8');
    };

    const onDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files[0];
        if (file) handleFile(file);
    };

    const handleImport = () => {
        if (!csvText) { setError('Nenhum arquivo selecionado.'); return; }
        setError('');
        startTransition(async () => {
            try {
                const res = await importAlunosCsvAction(csvText);
                setResult(res);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Erro ao importar.');
            }
        });
    };

    const downloadTemplate = () => {
        const blob = new Blob([TEMPLATE_CSV], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'modelo-importacao-alunos.csv';
        a.click();
        URL.revokeObjectURL(url);
    };

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-slate-800">Importar Alunos via CSV</h1>
                <p className="mt-1 text-sm text-slate-500">
                    Importe múltiplos alunos de uma vez. Baixe o modelo para ver o formato esperado.
                </p>
            </div>

            {/* Template download */}
            <button
                onClick={downloadTemplate}
                className="flex items-center gap-2 text-sm text-violet-600 hover:text-violet-800 font-medium"
            >
                <Download className="h-4 w-4" />
                Baixar modelo CSV
            </button>

            {/* Drop zone */}
            <div
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={onDrop}
                onClick={() => inputRef.current?.click()}
                className={cn(
                    'flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed px-6 py-12 cursor-pointer transition-colors',
                    isDragging
                        ? 'border-violet-400 bg-violet-50'
                        : 'border-slate-300 bg-slate-50 hover:border-violet-300 hover:bg-violet-50/50',
                )}
            >
                <input
                    ref={inputRef}
                    type="file"
                    accept=".csv,.txt"
                    className="sr-only"
                    onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleFile(file);
                    }}
                />
                <Upload className="h-8 w-8 text-slate-400" />
                {fileName ? (
                    <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
                        <FileText className="h-4 w-4 text-violet-600" />
                        {fileName}
                    </div>
                ) : (
                    <>
                        <p className="text-sm font-medium text-slate-600">
                            Arraste o arquivo aqui ou clique para selecionar
                        </p>
                        <p className="text-xs text-slate-400">CSV ou TXT, max 2 MB</p>
                    </>
                )}
            </div>

            {/* Error */}
            {error && (
                <div className="flex items-start gap-2 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
                    <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
                    {error}
                </div>
            )}

            {/* Import button */}
            <Button
                onClick={handleImport}
                disabled={!csvText || isPending}
                className="w-full"
            >
                {isPending ? 'Importando...' : 'Iniciar Importação'}
            </Button>

            {/* Result */}
            {result && (
                <div className="rounded-xl border border-slate-200 bg-white p-5 space-y-4">
                    <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-5 w-5 text-green-500" />
                        <h3 className="font-semibold text-slate-800">Importação concluída</h3>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-center">
                        <Stat label="Total" value={result.total} />
                        <Stat label="Importados" value={result.importados} color="text-green-600" />
                        <Stat label="Erros" value={result.erros.length} color={result.erros.length > 0 ? 'text-red-600' : 'text-slate-400'} />
                    </div>
                    {result.erros.length > 0 && (
                        <div className="space-y-1">
                            <p className="text-xs font-medium text-slate-600 uppercase tracking-wide">Erros detalhados</p>
                            <div className="max-h-48 overflow-auto rounded-lg bg-red-50 border border-red-200 p-3 space-y-1">
                                {result.erros.map((err, i) => (
                                    <p key={i} className="text-xs text-red-700">
                                        Linha {err.row}: {err.mensagem}
                                        {err.campo && ` (campo: ${err.campo})`}
                                    </p>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

function Stat({ label, value, color = 'text-slate-800' }: { label: string; value: number; color?: string }) {
    return (
        <div className="rounded-lg bg-slate-50 p-3">
            <p className={cn('text-2xl font-bold', color)}>{value}</p>
            <p className="text-xs text-slate-500 mt-0.5">{label}</p>
        </div>
    );
}
