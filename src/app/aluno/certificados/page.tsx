"use client";

import { getCertificadosAluno, solicitarCertificado } from "@/lms/actions/certificadoActions";
import { Award, Download, Clock, Lock, CheckCircle, AlertCircle } from "lucide-react";
import { useState, useEffect } from "react";
import type { Certificado } from "@/lms/repositories/CertificadoRepository";
import { toast } from "sonner";

const STATUS_CONFIG = {
    'Emitido':    { label: 'Disponível',    bg: 'bg-emerald-50', border: 'border-emerald-200', badge: 'bg-emerald-100 text-emerald-700', icon: CheckCircle, iconColor: 'text-emerald-500' },
    'Solicitado': { label: 'Em Análise',    bg: 'bg-blue-50',    border: 'border-blue-200',    badge: 'bg-blue-100 text-blue-700',       icon: Clock,        iconColor: 'text-blue-500' },
    'Em Emissao': { label: 'Em Emissão',    bg: 'bg-amber-50',   border: 'border-amber-200',   badge: 'bg-amber-100 text-amber-700',     icon: Clock,        iconColor: 'text-amber-500' },
    'Disponivel': { label: 'Solicitar',     bg: 'bg-violet-50',  border: 'border-violet-200',  badge: 'bg-violet-100 text-violet-700',   icon: Award,        iconColor: 'text-violet-500' },
    'Bloqueado':  { label: 'Bloqueado',     bg: 'bg-slate-50',   border: 'border-slate-200',   badge: 'bg-slate-100 text-slate-500',     icon: Lock,         iconColor: 'text-slate-400' },
} as const;

export default function AlunosCertificadosPage() {
    const [certs, setCerts] = useState<Certificado[]>([]);
    const [loading, setLoading] = useState(true);
    const [solicitando, setSolicitando] = useState<string | null>(null);

    useEffect(() => {
        getCertificadosAluno().then(data => { setCerts(data); setLoading(false); });
    }, []);

    async function handleSolicitar(turmaId: string) {
        setSolicitando(turmaId);
        try {
            const updated = await solicitarCertificado(turmaId);
            setCerts(prev => prev.map(c => c.turmaId === turmaId ? updated : c));
            toast.success('Solicitação enviada! Você será notificado quando o certificado estiver pronto.');
        } catch (e: unknown) {
            toast.error(e instanceof Error ? e.message : 'Erro ao solicitar certificado');
        } finally {
            setSolicitando(null);
        }
    }

    if (loading) return (
        <div className="space-y-4">
            {[1,2,3].map(i => <div key={i} className="h-32 bg-slate-100 rounded-2xl animate-pulse" />)}
        </div>
    );

    const emitidos = certs.filter(c => c.status === 'Emitido').length;

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-2xl font-bold text-slate-900">Meus Certificados</h1>
                <p className="text-slate-500 mt-1 text-sm">Gerencie, solicite e baixe seus certificados de conclusão.</p>
            </div>

            {/* KPIs */}
            <div className="grid grid-cols-3 gap-4">
                <div className="bg-emerald-50 rounded-2xl p-5 flex items-center gap-4">
                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm"><CheckCircle className="w-5 h-5 text-emerald-500" /></div>
                    <div><div className="text-2xl font-bold text-emerald-600">{emitidos}</div><div className="text-xs text-slate-500">Emitidos</div></div>
                </div>
                <div className="bg-blue-50 rounded-2xl p-5 flex items-center gap-4">
                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm"><Clock className="w-5 h-5 text-blue-500" /></div>
                    <div><div className="text-2xl font-bold text-blue-600">{certs.filter(c => c.status === 'Solicitado' || c.status === 'Em Emissao').length}</div><div className="text-xs text-slate-500">Em processamento</div></div>
                </div>
                <div className="bg-slate-100 rounded-2xl p-5 flex items-center gap-4">
                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm"><Award className="w-5 h-5 text-slate-500" /></div>
                    <div><div className="text-2xl font-bold text-slate-600">{certs.length}</div><div className="text-xs text-slate-500">Total</div></div>
                </div>
            </div>

            {/* Certificados */}
            <div className="space-y-4">
                {certs.map(cert => {
                    const cfg = STATUS_CONFIG[cert.status];
                    return (
                        <div key={cert.id} className={`rounded-2xl border ${cfg.border} ${cfg.bg} p-6 flex items-center justify-between gap-4 flex-wrap`}>
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm shrink-0">
                                    <cfg.icon className={`w-6 h-6 ${cfg.iconColor}`} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-900">{cert.cursoNome}</h3>
                                    <div className="text-sm text-slate-500 mt-0.5">{cert.cargaHoraria}h · {cert.turmaNome}</div>
                                    {cert.dataEmissao && <div className="text-xs text-slate-400 mt-1">Emitido em {cert.dataEmissao}</div>}
                                    {cert.codigo && <div className="text-xs text-slate-400">Código: {cert.codigo}</div>}
                                    {cert.motipoBloqueio && <div className="text-xs text-amber-600 mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{cert.motipoBloqueio}</div>}
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${cfg.badge}`}>
                                    <cfg.icon className={`w-3 h-3 ${cfg.iconColor}`} />
                                    {cfg.label}
                                </span>
                                {cert.status === 'Emitido' && cert.urlDownload && (
                                    <a href={cert.urlDownload} className="flex items-center gap-2 bg-white border border-slate-200 text-slate-700 text-sm font-medium px-4 py-2 rounded-xl hover:bg-slate-50 transition-colors shadow-sm">
                                        <Download className="w-4 h-4" /> Baixar PDF
                                    </a>
                                )}
                                {cert.status === 'Disponivel' && (
                                    <button
                                        onClick={() => handleSolicitar(cert.turmaId)}
                                        disabled={solicitando === cert.turmaId}
                                        className="bg-violet-600 text-white text-sm font-medium px-4 py-2 rounded-xl hover:bg-violet-700 transition-colors disabled:opacity-50"
                                    >
                                        {solicitando === cert.turmaId ? 'Solicitando...' : 'Solicitar'}
                                    </button>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
