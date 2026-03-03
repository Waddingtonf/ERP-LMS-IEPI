"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Save, Shield, Eye, EyeOff, Camera, CheckCircle, Lock, MapPin, Stethoscope } from "lucide-react"
import { useState } from "react"

export default function PerfilPage() {
    const [showPass, setShowPass] = useState(false)
    const [saved, setSaved] = useState(false)

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault()
        setSaved(true)
        setTimeout(() => setSaved(false), 3000)
    }

    return (
        <div className="space-y-6 max-w-2xl">
            <div>
                <h2 className="text-2xl font-bold text-slate-900">Meu Perfil</h2>
                <p className="text-slate-500 text-sm mt-0.5">Gerencie suas informações pessoais e credenciais de acesso.</p>
            </div>

            {/* Success banner */}
            {saved && (
                <div className="flex items-center gap-3 bg-emerald-50 border border-emerald-200 rounded-2xl px-5 py-3.5 text-emerald-700 text-sm font-medium">
                    <CheckCircle className="w-4 h-4 shrink-0" />
                    Alterações salvas com sucesso!
                </div>
            )}

            {/* Personal data card */}
            <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
                    <h3 className="font-bold text-slate-800">Dados Pessoais</h3>
                    <p className="text-xs text-slate-500 mt-0.5">Mantenha seus dados atualizados para emissão correta de certificados.</p>
                </div>
                <form onSubmit={handleSave} className="p-6 space-y-6">
                    {/* Avatar */}
                    <div className="flex flex-col sm:flex-row gap-6 items-start">
                        <div className="relative shrink-0">
                            <div className="w-20 h-20 rounded-2xl overflow-hidden ring-4 ring-violet-100 shadow-sm">
                                <img
                                    src="https://api.dicebear.com/7.x/notionists/svg?seed=Felix"
                                    alt="Avatar"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <button
                                type="button"
                                className="absolute -bottom-1.5 -right-1.5 w-7 h-7 rounded-lg bg-violet-600 hover:bg-violet-700 text-white flex items-center justify-center shadow-md transition-colors"
                                title="Alterar foto"
                            >
                                <Camera className="w-3.5 h-3.5" />
                            </button>
                        </div>
                        <div className="flex-1 w-full space-y-4">
                            <div className="space-y-1.5">
                                <Label htmlFor="nome" className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Nome Completo</Label>
                                <Input id="nome" defaultValue="João Silva" className="rounded-xl border-slate-200 focus:ring-violet-400" />
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <Label htmlFor="cpf" className="text-xs font-semibold text-slate-600 uppercase tracking-wide">CPF</Label>
                                    <div className="relative">
                                        <Input id="cpf" defaultValue="123.456.789-00" disabled className="rounded-xl bg-slate-50 text-slate-400 pr-9" />
                                        <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-300" />
                                    </div>
                                    <p className="text-[10px] text-slate-400">CPF não pode ser alterado.</p>
                                </div>
                                <div className="space-y-1.5">
                                    <Label htmlFor="telefone" className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Telefone</Label>
                                    <Input id="telefone" defaultValue="(11) 99999-9999" className="rounded-xl border-slate-200 focus:ring-violet-400" />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <Label htmlFor="nascimento" className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Data de Nascimento</Label>
                                    <Input id="nascimento" type="date" defaultValue="1990-05-15" className="rounded-xl border-slate-200 focus:ring-violet-400" />
                                </div>
                                <div className="space-y-1.5">
                                    <Label htmlFor="sexo" className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Sexo</Label>
                                    <select id="sexo" defaultValue="F" className="w-full h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-violet-400">
                                        <option value="">Selecione</option>
                                        <option value="F">Feminino</option>
                                        <option value="M">Masculino</option>
                                        <option value="O">Outro / Prefiro não informar</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Address */}
                    <div className="pt-5 border-t border-slate-100 space-y-4">
                        <h4 className="text-sm font-bold text-slate-700 flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-violet-500" /> Endereço
                        </h4>
                        <div className="grid grid-cols-3 gap-4">
                            <div className="space-y-1.5 col-span-1">
                                <Label htmlFor="cep" className="text-xs font-semibold text-slate-600 uppercase tracking-wide">CEP</Label>
                                <Input id="cep" defaultValue="01310-100" placeholder="00000-000" className="rounded-xl border-slate-200 focus:ring-violet-400" />
                            </div>
                            <div className="space-y-1.5 col-span-2">
                                <Label htmlFor="logradouro" className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Logradouro</Label>
                                <Input id="logradouro" defaultValue="Av. Paulista" className="rounded-xl border-slate-200 focus:ring-violet-400" />
                            </div>
                        </div>
                        <div className="grid grid-cols-4 gap-4">
                            <div className="space-y-1.5 col-span-1">
                                <Label htmlFor="numero" className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Número</Label>
                                <Input id="numero" defaultValue="1000" className="rounded-xl border-slate-200 focus:ring-violet-400" />
                            </div>
                            <div className="space-y-1.5 col-span-3">
                                <Label htmlFor="complemento" className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Complemento</Label>
                                <Input id="complemento" placeholder="Apto, Bloco, Sala…" className="rounded-xl border-slate-200 focus:ring-violet-400" />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <Label htmlFor="cidade" className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Cidade</Label>
                                <Input id="cidade" defaultValue="São Paulo" className="rounded-xl border-slate-200 focus:ring-violet-400" />
                            </div>
                            <div className="space-y-1.5">
                                <Label htmlFor="estado" className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Estado</Label>
                                <select id="estado" defaultValue="SP" className="w-full h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-violet-400">
                                    {["AC","AL","AP","AM","BA","CE","DF","ES","GO","MA","MT","MS","MG","PA","PB","PR","PE","PI","RJ","RN","RS","RO","RR","SC","SP","SE","TO"].map(uf => (
                                        <option key={uf} value={uf}>{uf}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Professional info */}
                    <div className="pt-5 border-t border-slate-100 space-y-4">
                        <h4 className="text-sm font-bold text-slate-700 flex items-center gap-2">
                            <Stethoscope className="w-4 h-4 text-violet-500" /> Informações Profissionais
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <Label htmlFor="coren" className="text-xs font-semibold text-slate-600 uppercase tracking-wide">COREN</Label>
                                <Input id="coren" defaultValue="COREN-SP 123456" placeholder="Ex.: COREN-SP 000000" className="rounded-xl border-slate-200 focus:ring-violet-400" />
                                <p className="text-[10px] text-slate-400">Obrigatório para emissão de certificados de cursos com pontuação COREN.</p>
                            </div>
                            <div className="space-y-1.5">
                                <Label htmlFor="categoria" className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Categoria COREN</Label>
                                <select id="categoria" defaultValue="ENF" className="w-full h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-violet-400">
                                    <option value="">Não se aplica</option>
                                    <option value="ENF">Enfermeiro(a)</option>
                                    <option value="TEC">Técnico(a) de Enfermagem</option>
                                    <option value="AUX">Auxiliar de Enfermagem</option>
                                    <option value="OBT">Obstetra</option>
                                </select>
                            </div>
                        </div>
                        <div className="space-y-1.5">
                            <Label htmlFor="instituicao" className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Instituição / Empresa onde trabalha</Label>
                            <Input id="instituicao" placeholder="Hospital, clínica ou empresa" className="rounded-xl border-slate-200 focus:ring-violet-400" />
                        </div>
                    </div>

                    {/* Access data */}
                    <div className="pt-5 border-t border-slate-100 space-y-4">
                        <h4 className="text-sm font-bold text-slate-700 flex items-center gap-2">
                            <Shield className="w-4 h-4 text-violet-500" /> Dados de Acesso
                        </h4>
                        <div className="space-y-1.5">
                            <Label htmlFor="email" className="text-xs font-semibold text-slate-600 uppercase tracking-wide">E-mail</Label>
                            <Input id="email" type="email" defaultValue="joao.silva@email.com" className="rounded-xl border-slate-200 focus:ring-violet-400" />
                        </div>
                        <div className="space-y-1.5">
                            <Label htmlFor="senha" className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Nova Senha</Label>
                            <div className="relative">
                                <Input
                                    id="senha"
                                    type={showPass ? "text" : "password"}
                                    placeholder="Deixe em branco para manter a atual"
                                    className="rounded-xl border-slate-200 focus:ring-violet-400 pr-10"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPass(!showPass)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                                >
                                    {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                            <p className="text-[11px] text-slate-400">Mínimo 8 caracteres, com letras e números.</p>
                        </div>
                    </div>

                    <div className="flex justify-end pt-2">
                        <Button
                            type="submit"
                            className="bg-violet-600 hover:bg-violet-700 active:scale-[0.97] font-semibold gap-2 rounded-xl transition-all shadow-sm shadow-violet-200"
                        >
                            <Save className="w-4 h-4" /> Salvar Alterações
                        </Button>
                    </div>
                </form>
            </div>

            {/* Security section */}
            <div className="rounded-2xl border border-slate-200 bg-white shadow-sm p-6">
                <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                    <Shield className="w-5 h-5 text-violet-500" /> Segurança da Conta
                </h3>
                <div className="space-y-3">
                    {[
                        { label: "Autenticação de dois fatores (2FA)", status: "Desativado", action: "Ativar", color: "amber" },
                        { label: "Notificações de acesso", status: "Ativo", action: "Configurar", color: "emerald" },
                        { label: "Sessões ativas", status: "1 dispositivo", action: "Ver", color: "slate" },
                    ].map(item => (
                        <div key={item.label} className="flex items-center justify-between p-4 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition-colors">
                            <div>
                                <p className="text-sm font-semibold text-slate-800">{item.label}</p>
                                <p className={`text-xs mt-0.5 ${
                                    item.color === 'emerald' ? 'text-emerald-600' :
                                    item.color === 'amber' ? 'text-amber-600' : 'text-slate-500'
                                }`}>{item.status}</p>
                            </div>
                            <button className="text-xs font-semibold text-violet-700 bg-violet-50 hover:bg-violet-100 px-3 py-1.5 rounded-lg transition-colors">
                                {item.action}
                            </button>
                        </div>
                    ))}
                </div>

                {/* SSL indicator */}
                <div className="mt-4 flex items-center gap-2.5 text-xs text-slate-400 pt-3 border-t border-slate-100">
                    <Lock className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Seus dados são protegidos com criptografia SSL 256-bit. Nunca compartilhamos suas informações.</span>
                </div>
            </div>
        </div>
    )
}
