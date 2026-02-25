import Link from "next/link";
import { GraduationCap } from "lucide-react";

export default function NotFound() {
    return (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center px-4 text-center">
            <div className="bg-violet-100 text-violet-700 p-6 rounded-full mb-8">
                <GraduationCap className="w-12 h-12" />
            </div>
            <h1 className="text-7xl font-extrabold text-slate-800 tracking-tight">404</h1>
            <h2 className="text-2xl font-semibold text-slate-700 mt-4">Página não encontrada</h2>
            <p className="text-slate-500 max-w-md mt-3">
                A página que você está procurando não existe ou foi movida. Verifique o endereço ou retorne à página inicial.
            </p>
            <div className="flex gap-4 mt-8">
                <Link
                    href="/"
                    className="bg-violet-600 hover:bg-violet-700 text-white font-semibold py-3 px-6 rounded-full transition-colors"
                >
                    Ir para o início
                </Link>
                <Link
                    href="/login"
                    className="border border-slate-200 hover:bg-slate-100 text-slate-700 font-semibold py-3 px-6 rounded-full transition-colors"
                >
                    Fazer login
                </Link>
            </div>
        </div>
    );
}
