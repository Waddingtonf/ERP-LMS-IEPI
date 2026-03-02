import Link from 'next/link';
import { ShieldX } from 'lucide-react';

export default function ForbiddenPage() {
    return (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center text-center px-4">
            <ShieldX className="w-16 h-16 text-red-400 mb-6" />
            <h1 className="text-4xl font-bold text-slate-800 mb-2">403 — Acesso Negado</h1>
            <p className="text-slate-500 mb-8 max-w-md">
                Você não tem permissão para acessar esta área. Se acredita que isso é um erro,
                entre em contato com o administrador do sistema.
            </p>
            <Link
                href="/login"
                className="px-6 py-3 bg-violet-600 text-white rounded-lg font-medium hover:bg-violet-700 transition-colors"
            >
                Voltar ao Login
            </Link>
        </div>
    );
}
