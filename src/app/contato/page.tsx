import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { MapPin, Phone, Mail } from "lucide-react"

export default function ContatoPage() {
    return (
        <div className="flex flex-col min-h-screen">
            <section className="bg-violet-900 text-white py-16 px-4">
                <div className="container mx-auto max-w-4xl text-center">
                    <h1 className="text-4xl font-bold mb-4">Fale Conosco</h1>
                    <p className="text-violet-200">
                        Dúvidas, sugestões ou suporte? Nossa equipe está pronta para te atender.
                    </p>
                </div>
            </section>

            <section className="py-16 px-4 flex-1">
                <div className="container mx-auto max-w-5xl">
                    <div className="grid md:grid-cols-2 gap-12">

                        {/* Informações de Contato */}
                        <div className="space-y-8">
                            <div>
                                <h2 className="text-2xl font-bold text-slate-900 mb-6">Informações de Contato</h2>
                                <div className="space-y-6 text-slate-600">
                                    <div className="flex items-start gap-4">
                                        <div className="bg-violet-100 p-3 rounded-full text-violet-700 mt-1">
                                            <MapPin className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-slate-900">Endereço Principal</h4>
                                            <p>Av. Paulista, 1000 - Bela Vista</p>
                                            <p>São Paulo, SP - 01310-100</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-4">
                                        <div className="bg-violet-100 p-3 rounded-full text-violet-700 mt-1">
                                            <Phone className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-slate-900">Telefones</h4>
                                            <p>(11) 4000-0000 (Capitais e Regiões Metropolitanas)</p>
                                            <p>0800 000 0000 (Demais localidades)</p>
                                            <p className="text-sm mt-1 text-emerald-600 font-medium whitespace-nowrap">WhatsApp: (11) 99999-9999</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-4">
                                        <div className="bg-violet-100 p-3 rounded-full text-violet-700 mt-1">
                                            <Mail className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-slate-900">E-mail</h4>
                                            <p>atendimento@iepi.edu.br</p>
                                            <p>suporte.aluno@iepi.edu.br</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-8 border-t border-slate-200">
                                <h3 className="font-semibold text-slate-900 mb-4">Horário de Atendimento</h3>
                                <p className="text-slate-600">Segunda a Sexta: 08:00 às 20:00</p>
                                <p className="text-slate-600">Sábados: 08:00 às 14:00</p>
                            </div>
                        </div>

                        {/* Formulário de Mensagem */}
                        <div className="bg-white p-8 rounded-xl shadow-lg border border-slate-100">
                            <h3 className="text-xl font-bold text-slate-900 mb-6">Envie uma Mensagem</h3>
                            <form className="space-y-6">
                                <div className="space-y-2">
                                    <Label htmlFor="nome">Nome Completo</Label>
                                    <Input id="nome" placeholder="Como devemos te chamar" />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="email">E-mail</Label>
                                        <Input id="email" type="email" placeholder="seu@email.com" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="telefone">Telefone</Label>
                                        <Input id="telefone" placeholder="(11) 90000-0000" />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="assunto">Assunto</Label>
                                    <Input id="assunto" placeholder="Dúvida comercial, suporte técnico..." />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="mensagem">Mensagem</Label>
                                    <textarea
                                        id="mensagem"
                                        rows={4}
                                        className="w-full min-h-[100px] border border-slate-200 rounded-md p-3 text-sm focus:outline-none focus:ring-2 focus:ring-violet-600 focus:border-transparent"
                                        placeholder="Escreva sua mensagem aqui..."
                                    ></textarea>
                                </div>

                                <Button className="w-full bg-violet-600 hover:bg-violet-700 text-white" size="lg">
                                    Enviar Mensagem
                                </Button>
                            </form>
                        </div>

                    </div>
                </div>
            </section>
        </div>
    )
}
