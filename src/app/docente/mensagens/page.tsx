'use client';

import { useEffect, useState, useTransition } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  getCaixaEntrada,
  getMensagensEnviadas,
  countMensagensNaoLidas,
  marcarMensagemLida,
  getThread,
  responderMensagem,
  enviarMensagem,
} from '@/shared/actions/mensagemActions';
import type { Mensagem, MensagemCategoria } from '@/shared/repositories/MensagemRepository';

const DOCENTE_ID = 'instrutor-1';
const DOCENTE_NOME = 'Prof. Demo';

export default function DocenteMensagensPage() {
  const [tab, setTab] = useState<'inbox' | 'sent'>('inbox');
  const [mensagens, setMensagens] = useState<Mensagem[]>([]);
  const [thread, setThread] = useState<Mensagem[]>([]);
  const [selected, setSelected] = useState<Mensagem | null>(null);
  const [unread, setUnread] = useState(0);
  const [reply, setReply] = useState('');
  const [openNew, setOpenNew] = useState(false);
  const [isPending, startTransition] = useTransition();

  const [assunto, setAssunto] = useState('');
  const [corpo, setCorpo] = useState('');
  const [categoria, setCategoria] = useState<MensagemCategoria>('Academico');
  const [destId, setDestId] = useState('');
  const [destNome, setDestNome] = useState('');

  useEffect(() => {
    loadTab(tab);
    countMensagensNaoLidas(DOCENTE_ID).then(n => setUnread(n));
  }, [tab]);

  async function loadTab(t: 'inbox' | 'sent') {
    const action = t === 'inbox' ? getCaixaEntrada : getMensagensEnviadas;
    const data = await action(DOCENTE_ID);
    setMensagens(data);
  }

  async function openMessage(msg: Mensagem) {
    setSelected(msg);
    if (!msg.lida) {
      await marcarMensagemLida(msg.id);
      setUnread(prev => Math.max(0, prev - 1));
      setMensagens(prev => prev.map(m => m.id === msg.id ? { ...m, lida: true } : m));
    }
    const threadData = await getThread(msg.id);
    setThread(threadData);
  }

  function handleReply() {
    if (!selected) return;
    startTransition(async () => {
      const rootId = selected.parentId ?? selected.id;
      await responderMensagem(rootId, DOCENTE_ID, reply);
      setReply('');
      const threads = await getThread(selected.id);
      setThread(threads);
    });
  }

  function handleSend() {
    startTransition(async () => {
      await enviarMensagem({
        remetenteId: DOCENTE_ID,
        remetenteNome: DOCENTE_NOME,
        remetentePerfil: 'Docente',
        destinatarioId: destId,
        destinatarioNome: destNome,
        destinatarioPerfil: 'Aluno',
        assunto,
        corpo,
        categoria,
        prioridade: 'Normal',
      });
      setOpenNew(false);
      setAssunto('');
      setCorpo('');
      loadTab('sent');
    });
  }

  return (
    <div className="p-6 max-w-5xl mx-auto h-full">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Mensagens</h1>
          <p className="text-sm text-muted-foreground">
            Comunique-se com alunos e secretaria
            {unread > 0 && <span className="ml-2 bg-red-500 text-white text-xs rounded-full px-2 py-0.5">{unread}</span>}
          </p>
        </div>
        <Button onClick={() => setOpenNew(true)}>+ Nova Mensagem</Button>
      </div>

      <div className="grid grid-cols-3 gap-4 h-[600px]">
        <div className="col-span-1 border rounded-lg flex flex-col overflow-hidden">
          <div className="flex border-b">
            {(['inbox', 'sent'] as const).map(t => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`flex-1 py-2 text-sm font-medium transition-colors ${
                  tab === t ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'
                }`}
              >
                {t === 'inbox' ? 'Caixa de Entrada' : 'Enviadas'}
              </button>
            ))}
          </div>
          <div className="flex-1 overflow-y-auto space-y-1 p-2">
            {mensagens.map(msg => (
              <button
                key={msg.id}
                onClick={() => openMessage(msg)}
                className={`w-full text-left p-2 rounded-md text-sm transition-colors ${
                  selected?.id === msg.id ? 'bg-primary/10' : 'hover:bg-muted'
                } ${!msg.lida ? 'font-semibold' : ''}`}
              >
                <div className="flex items-center justify-between gap-1">
                  <span className="truncate">{msg.assunto}</span>
                  {msg.prioridade === 'Urgente' && (
                    <Badge className="bg-red-100 text-red-700 text-xs shrink-0">Urgente</Badge>
                  )}
                </div>
                <div className="text-xs text-muted-foreground truncate">
                  {tab === 'inbox' ? msg.remetenteNome : msg.destinatarioNome}
                </div>
              </button>
            ))}
            {mensagens.length === 0 && (
              <p className="text-center text-muted-foreground text-sm py-8">Nenhuma mensagem</p>
            )}
          </div>
        </div>

        <div className="col-span-2 border rounded-lg flex flex-col">
          {!selected ? (
            <div className="flex-1 flex items-center justify-center text-muted-foreground text-sm">
              Selecione uma mensagem para visualizar
            </div>
          ) : (
            <>
              <div className="p-4 border-b">
                <h2 className="font-semibold">{selected.assunto}</h2>
                <p className="text-xs text-muted-foreground">
                  De: {selected.remetenteNome} · {new Date(selected.enviadoEm).toLocaleString('pt-BR')}
                </p>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {thread.map(msg => (
                  <div key={msg.id} className={`flex ${msg.remetenteId === DOCENTE_ID ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[75%] rounded-lg p-3 text-sm ${
                      msg.remetenteId === DOCENTE_ID ? 'bg-primary text-primary-foreground' : 'bg-muted'
                    }`}>
                      <p className="font-medium text-xs mb-1">{msg.remetenteNome}</p>
                      <p className="whitespace-pre-wrap">{msg.corpo}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-3 border-t flex gap-2">
                <Textarea
                  rows={2}
                  value={reply}
                  onChange={e => setReply(e.target.value)}
                  placeholder="Escreva sua resposta..."
                  className="flex-1 resize-none"
                />
                <Button onClick={handleReply} disabled={isPending || !reply.trim()} className="self-end">
                  Enviar
                </Button>
              </div>
            </>
          )}
        </div>
      </div>

      {openNew && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-lg">
            <CardHeader><CardTitle>Nova Mensagem</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Destinatário (ID)</Label>
                  <Input value={destId} onChange={e => setDestId(e.target.value)} placeholder="ID do aluno" />
                </div>
                <div>
                  <Label>Nome do Destinatário</Label>
                  <Input value={destNome} onChange={e => setDestNome(e.target.value)} placeholder="Nome" />
                </div>
              </div>
              <div>
                <Label>Categoria</Label>
                <Select value={categoria} onValueChange={v => setCategoria(v as MensagemCategoria)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {(['Geral','Academico','Financeiro','Suporte','Aviso'] as MensagemCategoria[]).map(c => (
                      <SelectItem key={c} value={c}>{c}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Assunto</Label>
                <Input value={assunto} onChange={e => setAssunto(e.target.value)} />
              </div>
              <div>
                <Label>Mensagem</Label>
                <Textarea value={corpo} onChange={e => setCorpo(e.target.value)} rows={4} />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setOpenNew(false)}>Cancelar</Button>
                <Button onClick={handleSend} disabled={isPending || !assunto || !corpo || !destId}>
                  {isPending ? 'Enviando...' : 'Enviar'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

