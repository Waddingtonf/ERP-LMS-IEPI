"use client";

import { useEffect, useState, useTransition } from "react";
import { getNotificacoes, marcarNotificacaoLida, marcarTodasLidas, countUnreadNotificacoes } from "@/shared/actions/notificacaoActions";
import { Bell, CheckCheck, BookOpen, DollarSign, AlertCircle, Info, Award, Megaphone } from "lucide-react";
import type { Notificacao, NotificacaoTipo } from "@/shared/repositories/NotificacaoRepository";

const TIPO_CONFIG: Record<NotificacaoTipo, { icon: React.ElementType; color: string; bg: string }> = {
    'NOTA':          { icon: BookOpen,    color: 'text-blue-600',    bg: 'bg-blue-50' },
    'FINANCEIRO':    { icon: DollarSign,  color: 'text-emerald-600', bg: 'bg-emerald-50' },
    'AVISO':         { icon: AlertCircle, color: 'text-amber-600',   bg: 'bg-amber-50' },
    'SISTEMA':       { icon: Info,        color: 'text-slate-600',   bg: 'bg-slate-100' },
    'CERTIFICADO':   { icon: Award,       color: 'text-violet-600',  bg: 'bg-violet-50' },
    'MARKETING':     { icon: Megaphone,   color: 'text-pink-600',    bg: 'bg-pink-50' },
};

function timeAgo(dateStr: string): string {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins}min atrás`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h atrás`;
    return `${Math.floor(hours / 24)}d atrás`;
}

export function NotificacaoDropdown() {
    const [open, setOpen] = useState(false);
    const [notifs, setNotifs] = useState<Notificacao[]>([]);
    const [unread, setUnread] = useState(0);
    const [isPending, startTransition] = useTransition();

    useEffect(() => {
        countUnreadNotificacoes().then(setUnread);
        if (open) getNotificacoes().then(setNotifs);
    }, [open]);

    function handleMarcar(id: string) {
        startTransition(async () => {
            await marcarNotificacaoLida(id);
            setNotifs(prev => prev.map(n => n.id === id ? { ...n, lida: true } : n));
            setUnread(prev => Math.max(0, prev - 1));
        });
    }

    function handleTodasLidas() {
        startTransition(async () => {
            await marcarTodasLidas();
            setNotifs(prev => prev.map(n => ({ ...n, lida: true })));
            setUnread(0);
        });
    }

    return (
        <div className="relative">
            <button
                onClick={() => setOpen(o => !o)}
                className="relative w-9 h-9 rounded-xl flex items-center justify-center hover:bg-slate-100 transition-colors"
                aria-label="Notificações"
            >
                <Bell className="w-5 h-5 text-slate-600" />
                {unread > 0 && (
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500" />
                )}
            </button>

            {open && (
                <>
                    {/* Backdrop */}
                    <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
                    {/* Panel */}
                    <div className="absolute right-0 top-11 z-50 w-80 bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden">
                        {/* Header */}
                        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
                            <h3 className="font-bold text-slate-900 text-sm">Notificações</h3>
                            {unread > 0 && (
                                <button onClick={handleTodasLidas} disabled={isPending} className="flex items-center gap-1 text-xs text-violet-600 hover:underline font-semibold">
                                    <CheckCheck className="w-3.5 h-3.5" /> Marcar todas como lidas
                                </button>
                            )}
                        </div>

                        {/* Lista */}
                        <div className="max-h-96 overflow-y-auto divide-y divide-slate-50">
                            {notifs.length === 0 ? (
                                <div className="py-10 text-center text-slate-400 text-sm">Nenhuma notificação</div>
                            ) : notifs.map(n => {
                                const cfg = TIPO_CONFIG[n.tipo];
                                return (
                                    <div
                                        key={n.id}
                                        onClick={() => !n.lida && handleMarcar(n.id)}
                                        className={`px-4 py-3 flex items-start gap-3 transition-colors cursor-pointer ${n.lida ? 'opacity-60' : 'hover:bg-slate-50'}`}
                                    >
                                        <div className={`w-8 h-8 rounded-lg ${cfg.bg} flex items-center justify-center shrink-0`}>
                                            <cfg.icon className={`w-4 h-4 ${cfg.color}`} />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className={`text-sm font-medium ${n.lida ? 'text-slate-500' : 'text-slate-900'} truncate`}>{n.titulo}</div>
                                            <div className="text-xs text-slate-400 mt-0.5 line-clamp-2">{n.mensagem}</div>
                                            <div className="text-xs text-slate-300 mt-1">{timeAgo(n.criadoEm)}</div>
                                        </div>
                                        {!n.lida && <div className="w-2 h-2 rounded-full bg-violet-500 shrink-0 mt-1.5" />}
                                    </div>
                                );
                            })}
                        </div>

                        {/* Footer */}
                        <div className="border-t border-slate-100 px-4 py-3 text-center">
                            <a href="#" className="text-xs text-violet-600 font-semibold hover:underline">Ver todas as notificações</a>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
