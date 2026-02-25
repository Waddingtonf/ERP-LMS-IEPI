"use client";

import { AlertTriangle } from "lucide-react";

export default function AlunoError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    return (
        <div className="flex flex-col items-center justify-center h-full gap-6 py-24 text-center">
            <div className="bg-red-100 text-red-600 p-4 rounded-full">
                <AlertTriangle className="w-8 h-8" />
            </div>
            <div>
                <h2 className="text-2xl font-bold text-slate-800 mb-2">Ocorreu um erro</h2>
                <p className="text-slate-500 max-w-md">
                    {error.message || "Não foi possível carregar esta página. Tente novamente."}
                </p>
            </div>
            <button
                onClick={reset}
                className="bg-violet-600 hover:bg-violet-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
            >
                Tentar novamente
            </button>
        </div>
    );
}
