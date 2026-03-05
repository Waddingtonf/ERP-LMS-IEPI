"use client";

import React, { useCallback, useState, useRef } from "react";
import { Upload, File, X, CheckCircle, AlertCircle } from "lucide-react";

interface UploadZoneProps {
    onUpload: (file: File) => Promise<void>;
    accept?: string;
    maxSizeMb?: number;
    label?: string;
    hint?: string;
    className?: string;
}

type UploadState = 'idle' | 'dragging' | 'uploading' | 'success' | 'error';

function humanSize(bytes: number): string {
    if (bytes >= 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    return `${(bytes / 1024).toFixed(0)} KB`;
}

export function UploadZone({
    onUpload,
    accept = '*/*',
    maxSizeMb = 20,
    label = 'Arraste um arquivo ou clique para selecionar',
    hint,
    className = '',
}: UploadZoneProps) {
    const [state, setState] = useState<UploadState>('idle');
    const [error, setError] = useState<string | null>(null);
    const [file, setFile] = useState<File | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const handleFile = useCallback(async (f: File) => {
        if (f.size > maxSizeMb * 1024 * 1024) {
            setError(`Arquivo muito grande. Máximo: ${maxSizeMb} MB`);
            setState('error');
            return;
        }
        setFile(f);
        setState('uploading');
        setError(null);
        try {
            await onUpload(f);
            setState('success');
        } catch (e: unknown) {
            setError(e instanceof Error ? e.message : 'Erro ao enviar arquivo');
            setState('error');
        }
    }, [onUpload, maxSizeMb]);

    const onDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setState('idle');
        const f = e.dataTransfer.files[0];
        if (f) handleFile(f);
    }, [handleFile]);

    const onDragOver = (e: React.DragEvent<HTMLDivElement>) => { e.preventDefault(); setState('dragging'); };
    const onDragLeave = () => setState('idle');
    const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const f = e.target.files?.[0];
        if (f) handleFile(f);
    };

    function reset() {
        setState('idle');
        setFile(null);
        setError(null);
        if (inputRef.current) inputRef.current.value = '';
    }

    const borderColor =
        state === 'dragging'  ? 'border-violet-500 bg-violet-50' :
        state === 'success'   ? 'border-emerald-400 bg-emerald-50' :
        state === 'error'     ? 'border-rose-400 bg-rose-50' :
        state === 'uploading' ? 'border-blue-400 bg-blue-50' :
        'border-slate-300 bg-slate-50 hover:border-violet-400 hover:bg-violet-50/30';

    return (
        <div
            className={`relative border-2 border-dashed rounded-2xl p-8 transition-all cursor-pointer ${borderColor} ${className}`}
            onDrop={onDrop}
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onClick={() => state === 'idle' && inputRef.current?.click()}
        >
            <input ref={inputRef} type="file" accept={accept} className="hidden" onChange={onInputChange} />

            <div className="flex flex-col items-center text-center gap-3">
                {state === 'idle' && (
                    <>
                        <div className="w-14 h-14 rounded-2xl bg-white border border-slate-200 flex items-center justify-center shadow-sm">
                            <Upload className="w-6 h-6 text-violet-600" />
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-slate-700">{label}</p>
                            {hint && <p className="text-xs text-slate-400 mt-1">{hint}</p>}
                            <p className="text-xs text-slate-400 mt-1">Máximo: {maxSizeMb} MB</p>
                        </div>
                    </>
                )}

                {state === 'dragging' && (
                    <div className="flex flex-col items-center gap-2">
                        <Upload className="w-10 h-10 text-violet-500 animate-bounce" />
                        <p className="font-semibold text-violet-700">Solte o arquivo aqui</p>
                    </div>
                )}

                {state === 'uploading' && (
                    <div className="flex flex-col items-center gap-3">
                        <div className="w-12 h-12 rounded-full border-4 border-blue-200 border-t-blue-500 animate-spin" />
                        <p className="text-sm font-semibold text-blue-700">Enviando {file?.name}...</p>
                        <p className="text-xs text-blue-400">{file ? humanSize(file.size) : ''}</p>
                    </div>
                )}

                {state === 'success' && (
                    <div className="flex flex-col items-center gap-3">
                        <CheckCircle className="w-12 h-12 text-emerald-500" />
                        <p className="text-sm font-semibold text-emerald-700">{file?.name}</p>
                        <p className="text-xs text-emerald-500">Enviado com sucesso!</p>
                        <button onClick={e => { e.stopPropagation(); reset(); }} className="text-xs text-slate-400 hover:text-slate-600 flex items-center gap-1 mt-1">
                            <X className="w-3 h-3" /> Enviar outro
                        </button>
                    </div>
                )}

                {state === 'error' && (
                    <div className="flex flex-col items-center gap-3">
                        <AlertCircle className="w-12 h-12 text-rose-500" />
                        <p className="text-sm font-semibold text-rose-700">Erro no envio</p>
                        <p className="text-xs text-rose-500">{error}</p>
                        <button onClick={e => { e.stopPropagation(); reset(); }} className="text-xs text-slate-500 hover:text-slate-700 flex items-center gap-1 mt-1">
                            <X className="w-3 h-3" /> Tentar novamente
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
