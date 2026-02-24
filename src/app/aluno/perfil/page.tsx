import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Save } from "lucide-react"

export default function PerfilPage() {
    return (
        <div className="space-y-6 max-w-2xl">
            <div>
                <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Meu Perfil</h2>
                <p className="text-slate-500 mt-1">Gerencie suas informações pessoais e de acesso.</p>
            </div>

            <Card className="border-slate-200">
                <CardHeader>
                    <CardTitle>Dados Pessoais</CardTitle>
                    <CardDescription>Mantenha seus dados atualizados para emissão correta de certificados.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form className="space-y-6">
                        <div className="flex flex-col sm:flex-row gap-6">
                            <div className="w-24 h-24 rounded-full bg-slate-200 overflow-hidden shrink-0 border-4 border-white shadow-sm">
                                <img src="https://api.dicebear.com/7.x/notionists/svg?seed=Felix" alt="Avatar" className="w-full h-full" />
                            </div>
                            <div className="flex-1 space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="nome">Nome Completo</Label>
                                    <Input id="nome" defaultValue="João Silva" />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="cpf">CPF</Label>
                                        <Input id="cpf" defaultValue="123.456.789-00" disabled className="bg-slate-50 text-slate-500" />
                                        <p className="text-[10px] text-slate-400">O CPF não pode ser alterado após o cadastro.</p>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="telefone">Telefone</Label>
                                        <Input id="telefone" defaultValue="(11) 99999-9999" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="pt-6 border-t border-slate-100">
                            <h3 className="font-semibold text-slate-800 mb-4">Dados de Acesso</h3>
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="email">E-mail</Label>
                                    <Input id="email" type="email" defaultValue="joao.silva@email.com" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="senha">Nova Senha</Label>
                                    <Input id="senha" type="password" placeholder="Deixe em branco para manter a atual" />
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end pt-4">
                            <Button className="bg-violet-600 hover:bg-violet-700 font-semibold gap-2">
                                <Save className="w-4 h-4" /> Salvar Alterações
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
