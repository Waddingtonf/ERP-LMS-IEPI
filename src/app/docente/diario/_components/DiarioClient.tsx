'use client';

import { useEffect, useState, useTransition } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import {
    getDiariosByInstructor,
    getRegistrosAula,
    registrarAula,
} from '@/lms/actions/diarioClasseActions';
import type { DiarioClasse, RegistroAula } from '@/lms/repositories/DiarioClasseRepository';

const SITUACAO_COLORS: Record<string, string> = {
    Planejada: 'bg-gray-100 text-gray-700',
    Realizada: 'bg-green-100 text-green-700',
    Cancelada: 'bg-red-100 text-red-700',
    Reposicao: 'bg-purple-100 text-purple-700',
};

interface Props {
    instrutorId: string;
}

export default function DiarioClient({ instrutorId }: Props) {
    const [diarios, setDiarios] = useState<DiarioClasse[]>([]);
    const [selectedDiario, setSelectedDiario] = useState<DiarioClasse | null>(null);
    const [registros, setRegistros] = useState<RegistroAula[]>([]);
    const [showForm, setShowForm] = useState(false);
    const [isPending, startTransition] = useTransition();

    const [data, setData] = useState('');
    const [horaInicio, setHoraInicio] = useState('08:00');
    const [horaFim, setHoraFim] = useState('10:00');
    const [cargaHoraria, setCargaHoraria] = useState(2);
    const [conteudo, setConteudo] = useState('');
    const [metodologia, setMetodologia] = useState('');

    useEffect(() => {
        getDiariosByInstructor(instrutorId).then(diarios => {
            if (diarios.length > 0) {
                setDiarios(diarios);
                const first = diarios[0];
                setSelectedDiario(first);
                loadRegistros(first.id);
            }
        });
    }, [instrutorId]);

    function loadRegistros(diarioId: string) {
        getRegistrosAula(diarioId).then(data => setRegistros(data));
    }

    function handleSelectDiario(d: DiarioClasse) {
        setSelectedDiario(d);
        loadRegistros(d.id);
        setShowForm(false);
    }

    function handleRegistrar() {
        if (!selectedDiario) return;
        startTransition(async () => {
            await registrarAula(selectedDiario.id, {
                turmaId: selectedDiario.turmaId,
                aulaId: `aula-${Date.now()}`,
                data,
                horaInicio,
                horaFim,
                cargaHoraria,
                conteudoMinistar: conteudo,
                conteudoMiniado: conteudo,
                metodologia,
                situacao: 'Realizada',
                instrutorId,
                instrutorNome: 'Prof. Demo',
                frequenciaRegistrada: false,
                observacoes: '',
            });
            setShowForm(false);
            setData('');
            setConteudo('');
            setMetodologia('');
            loadRegistros(selectedDiario.id);
        });
    }

    const pct = selectedDiario
        ? Math.round((selectedDiario.cargaHorariaRealizada / selectedDiario.cargaHorariaPrevista) * 100)
        : 0;

    return (
        <div className="p-6 max-w-5xl mx-auto space-y-6">
            <h1 className="text-2xl font-bold">Diário de Classe</h1>

            {/* Turma selector */}
            {diarios.length > 1 && (
                <div className="flex gap-2 flex-wrap">
                    {diarios.map(d => (
                        <Button
                            key={d.id}
                            size="sm"
                            variant={selectedDiario?.id === d.id ? 'default' : 'outline'}
                            onClick={() => handleSelectDiario(d)}
                        >
                            {d.turmaNome}
                        </Button>
                    ))}
                </div>
            )}

            {selectedDiario && (
                <>
                    {/* Header stats */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Card>
                            <CardContent className="pt-4">
                                <p className="text-sm text-muted-foreground">Carga Horária Prevista</p>
                                <p className="text-2xl font-bold">{selectedDiario.cargaHorariaPrevista}h</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="pt-4">
                                <p className="text-sm text-muted-foreground">Carga Horária Realizada</p>
                                <p className="text-2xl font-bold">{selectedDiario.cargaHorariaRealizada}h</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="pt-4">
                                <p className="text-sm text-muted-foreground">Cumprimento</p>
                                <p className="text-2xl font-bold">{pct}%</p>
                                <Progress value={pct} className="mt-2 h-2" />
                            </CardContent>
                        </Card>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Badge className={selectedDiario.status === 'Aberto' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}>
                                {selectedDiario.status}
                            </Badge>
                            <span className="text-sm text-muted-foreground">{selectedDiario.periodoLetivo}</span>
                        </div>
                        {selectedDiario.status === 'Aberto' && (
                            <Button size="sm" onClick={() => setShowForm(!showForm)}>
                                {showForm ? 'Cancelar' : '+ Registrar Aula'}
                            </Button>
                        )}
                    </div>

                    {/* Register form */}
                    {showForm && (
                        <Card>
                            <CardHeader><CardTitle className="text-base">Registrar Aula</CardTitle></CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label>Data</Label>
                                        <Input type="date" value={data} onChange={e => setData(e.target.value)} />
                                    </div>
                                    <div>
                                        <Label>Carga Horária (h)</Label>
                                        <Input type="number" min={1} max={8} value={cargaHoraria} onChange={e => setCargaHoraria(Number(e.target.value))} />
                                    </div>
                                    <div>
                                        <Label>Hora Início</Label>
                                        <Input type="time" value={horaInicio} onChange={e => setHoraInicio(e.target.value)} />
                                    </div>
                                    <div>
                                        <Label>Hora Fim</Label>
                                        <Input type="time" value={horaFim} onChange={e => setHoraFim(e.target.value)} />
                                    </div>
                                </div>
                                <div>
                                    <Label>Conteúdo Ministrado</Label>
                                    <Textarea value={conteudo} onChange={e => setConteudo(e.target.value)} rows={3} placeholder="Descreva o conteúdo ministrado..." />
                                </div>
                                <div>
                                    <Label>Metodologia</Label>
                                    <Input value={metodologia} onChange={e => setMetodologia(e.target.value)} placeholder="ex: Aula expositiva, estudo de caso..." />
                                </div>
                                <div className="flex justify-end gap-2">
                                    <Button variant="outline" onClick={() => setShowForm(false)}>Cancelar</Button>
                                    <Button onClick={handleRegistrar} disabled={isPending || !data || !conteudo}>
                                        {isPending ? 'Salvando...' : 'Salvar Registro'}
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Registros table */}
                    <div className="border rounded-lg overflow-hidden">
                        <table className="w-full text-sm">
                            <thead className="bg-muted">
                                <tr>
                                    <th className="text-left px-4 py-2 font-medium">Data</th>
                                    <th className="text-left px-4 py-2 font-medium">Conteúdo Ministrado</th>
                                    <th className="text-center px-4 py-2 font-medium">CH</th>
                                    <th className="text-center px-4 py-2 font-medium">Situação</th>
                                    <th className="text-center px-4 py-2 font-medium">Frequência</th>
                                </tr>
                            </thead>
                            <tbody>
                                {registros.map((r, i) => (
                                    <tr key={r.id ?? i} className={i % 2 === 0 ? 'bg-white' : 'bg-muted/30'}>
                                        <td className="px-4 py-2">{new Date(r.data).toLocaleDateString('pt-BR')}</td>
                                        <td className="px-4 py-2 max-w-xs truncate">{r.conteudoMiniado || r.conteudoMinistar}</td>
                                        <td className="px-4 py-2 text-center">{r.cargaHoraria}h</td>
                                        <td className="px-4 py-2 text-center">
                                            <Badge className={SITUACAO_COLORS[r.situacao]}>{r.situacao}</Badge>
                                        </td>
                                        <td className="px-4 py-2 text-center">
                                            {r.frequenciaRegistrada ? '✅' : '—'}
                                        </td>
                                    </tr>
                                ))}
                                {registros.length === 0 && (
                                    <tr>
                                        <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">
                                            Nenhum registro de aula encontrado.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </>
            )}
        </div>
    );
}
