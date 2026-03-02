"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { processCheckoutAction } from "@/lms/actions/checkoutActions"

// Validation schemas
const profileSchema = z.object({
    fullName: z.string().min(5, "Nome completo é obrigatório"),
    email: z.string().email("E-mail inválido"),
    cpf: z.string().min(11, "CPF inválido"),
    phone: z.string().min(10, "Telefone inválido"),
})

const paymentSchema = z.object({
    cardNumber: z.string().min(16, "Número do cartão inválido"),
    cardHolderName: z.string().min(5, "Nome impresso inválido"),
    expirationDate: z.string().regex(/^(0[1-9]|1[0-2])\/?([0-9]{4}|[0-9]{2})$/, "Data inválida (MM/AA)"),
    cvv: z.string().min(3, "CVV inválido"),
    installments: z.string().min(1, "Selecione o número de parcelas"),
})

export default function CheckoutPage({ params }: { params: { cursoId: string } }) {
    const [step, setStep] = useState<1 | 2 | 3>(1)
    const [isProcessing, setIsProcessing] = useState(false)
    const [files, setFiles] = useState<{ rg: File | null; historico: File | null }>({ rg: null, historico: null })
    const router = useRouter()

    // MOCK: Em produção viria do DB (ex: await getCourseById no server component passando p/ client)
    const course = {
        title: "Gestão Estratégica em RH (Sandbox CIELO)",
        price: 199.99,
        maxInstallments: 12
    }

    const profileForm = useForm<z.infer<typeof profileSchema>>({
        resolver: zodResolver(profileSchema),
        defaultValues: { fullName: "", email: "", cpf: "", phone: "" }
    })

    const paymentForm = useForm<z.infer<typeof paymentSchema>>({
        resolver: zodResolver(paymentSchema),
        defaultValues: { cardNumber: "", cardHolderName: "", expirationDate: "", cvv: "", installments: "1" }
    })

    const onProfileSubmit = (data: z.infer<typeof profileSchema>) => {
        setStep(2)
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'rg' | 'historico') => {
        if (e.target.files && e.target.files[0]) {
            setFiles(prev => ({ ...prev, [type]: e.target.files![0] }))
        }
    }

    const onDocumentsSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!files.rg || !files.historico) {
            toast.error("Por favor, anexe o RG e o Histórico Escolar para simulação.")
            return
        }
        setStep(3)
    }

    const finalizePurchase = async (paymentData: z.infer<typeof paymentSchema>) => {
        setIsProcessing(true)
        try {
            // Prepara form data para a Action
            const formData = new FormData()
            formData.append("cardNumber", paymentData.cardNumber)
            formData.append("holder", paymentData.cardHolderName)
            formData.append("expirationDate", paymentData.expirationDate)
            formData.append("securityCode", paymentData.cvv)
            formData.append("installments", paymentData.installments)

            // Chama o Gateway CIELO Sandbox
            const result = await processCheckoutAction(params.cursoId, formData)

            if (result?.success) {
                toast.success(`Pagamento Aprovado na Cielo (Transação: ${result.transactionId})`)
                router.push('/aluno')
            } else {
                toast.error(`Pagamento Recusado: ${result?.error}`)
            }
        } catch (error: unknown) {
            const msg = error instanceof Error ? error.message : 'Erro desconhecido no processamento'
            toast.error(`Erro no processamento: ${msg}`)
        } finally {
            setIsProcessing(false)
        }
    }

    return (
        <div className="container mx-auto px-4 py-12 max-w-4xl">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Formulário Principal */}
                <div className="md:col-span-2">
                    <Card className="shadow-lg border-slate-200">
                        <CardHeader className="bg-slate-50 border-b border-slate-100 pb-6">
                            <div className="flex justify-between items-center mb-4">
                                <CardTitle className="text-2xl text-slate-800">Finalizar Matrícula</CardTitle>
                                <div className="flex gap-2 text-sm font-medium">
                                    <span className={`px-2 py-1 rounded-full ${step === 1 ? 'bg-violet-100 text-violet-700' : 'text-slate-400'}`}>1. Dados</span>
                                    <span className={`px-2 py-1 rounded-full ${step === 2 ? 'bg-violet-100 text-violet-700' : 'text-slate-400'}`}>2. Docs</span>
                                    <span className={`px-2 py-1 rounded-full ${step === 3 ? 'bg-violet-100 text-violet-700' : 'text-slate-400'}`}>3. Pagamento</span>
                                </div>
                            </div>
                            <CardDescription>
                                Curso: <span className="font-semibold text-slate-900">{course.title}</span>
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="pt-6">

                            {/* STEP 1: DADOS PESSOAIS */}
                            {step === 1 && (
                                <Form {...profileForm}>
                                    <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-4">
                                        <FormField control={profileForm.control} name="fullName" render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Nome Completo</FormLabel>
                                                <FormControl><Input placeholder="Seu nome igual do RG" {...field} /></FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )} />
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <FormField control={profileForm.control} name="email" render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>E-mail</FormLabel>
                                                    <FormControl><Input type="email" placeholder="seu@email.com" {...field} /></FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )} />
                                            <FormField control={profileForm.control} name="phone" render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Telefone / WhatsApp</FormLabel>
                                                    <FormControl><Input placeholder="(11) 99999-9999" {...field} /></FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )} />
                                        </div>
                                        <FormField control={profileForm.control} name="cpf" render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>CPF</FormLabel>
                                                <FormControl><Input placeholder="000.000.000-00" {...field} /></FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )} />
                                        <Button type="submit" className="w-full bg-violet-600 hover:bg-violet-700">Continuar para Documentos</Button>
                                    </form>
                                </Form>
                            )}

                            {/* STEP 2: UPLOAD DOCUMENTOS */}
                            {step === 2 && (
                                <form onSubmit={onDocumentsSubmit} className="space-y-6">
                                    <div className="bg-amber-50 border border-amber-200 p-4 rounded-md text-sm text-amber-800 mb-6">
                                        Precisamos dos seus documentos para efetivar a matrícula no sistema acadêmico. (Sandbox aceita qualquer arquivo)
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="rg">RG (Frente e Verso)</Label>
                                        <Input id="rg" type="file" accept=".pdf,image/*" onChange={(e) => handleFileChange(e, 'rg')} required />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="historico">Histórico Escolar / Diploma</Label>
                                        <Input id="historico" type="file" accept=".pdf,image/*" onChange={(e) => handleFileChange(e, 'historico')} required />
                                    </div>
                                    <div className="flex gap-4">
                                        <Button type="button" variant="outline" onClick={() => setStep(1)} className="w-1/3">Voltar</Button>
                                        <Button type="submit" className="w-2/3 bg-violet-600 hover:bg-violet-700">Ir para Pagamento</Button>
                                    </div>
                                </form>
                            )}

                            {/* STEP 3: PAGAMENTO */}
                            {step === 3 && (
                                <Form {...paymentForm}>
                                    <form onSubmit={paymentForm.handleSubmit(finalizePurchase)} className="space-y-4">
                                        <div className="bg-slate-50 p-4 rounded-md border border-slate-200 mb-6 flex items-center justify-between">
                                            <span className="font-semibold text-slate-700">Total a Pagar:</span>
                                            <span className="text-xl font-bold text-violet-700">
                                                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(course.price)}
                                            </span>
                                        </div>

                                        <FormField control={paymentForm.control} name="cardNumber" render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Número do Cartão de Crédito</FormLabel>
                                                <FormControl><Input placeholder="0000 0000 0000 0000" {...field} /></FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )} />
                                        <FormField control={paymentForm.control} name="cardHolderName" render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Nome impresso no cartão</FormLabel>
                                                <FormControl><Input placeholder="JOAO S SILVA" {...field} /></FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )} />
                                        <div className="grid grid-cols-2 gap-4">
                                            <FormField control={paymentForm.control} name="expirationDate" render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Validade</FormLabel>
                                                    <FormControl><Input placeholder="MM/AA" {...field} /></FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )} />
                                            <FormField control={paymentForm.control} name="cvv" render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>CVV</FormLabel>
                                                    <FormControl><Input placeholder="123" type="password" maxLength={4} {...field} /></FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )} />
                                        </div>

                                        <FormField control={paymentForm.control} name="installments" render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Parcelamento</FormLabel>
                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                    <FormControl><SelectTrigger><SelectValue placeholder="Selecione..." /></SelectTrigger></FormControl>
                                                    <SelectContent>
                                                        {[...Array(course.maxInstallments)].map((_, i) => {
                                                            const parcs = i + 1;
                                                            const val = course.price / parcs;
                                                            return (
                                                                <SelectItem key={parcs} value={parcs.toString()}>
                                                                    {parcs}x de {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val)}
                                                                </SelectItem>
                                                            )
                                                        })}
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )} />

                                        <div className="flex gap-4 pt-4 border-t border-slate-100 mt-6">
                                            <Button type="button" variant="outline" onClick={() => setStep(2)} className="w-1/3" disabled={isProcessing}>Voltar</Button>
                                            <Button type="submit" disabled={isProcessing} className="w-2/3 bg-green-600 hover:bg-green-700 text-white font-bold">
                                                {isProcessing ? 'Processando...' : 'Finalizar Pagamento (Simulação CIELO)'}
                                            </Button>
                                        </div>
                                    </form>
                                </Form>
                            )}

                        </CardContent>
                    </Card>
                </div>

                {/* Resumo Lateral */}
                <div className="hidden md:block">
                    <Card className="bg-slate-50 border-slate-200 sticky top-24">
                        <CardHeader><CardTitle className="text-lg">Resumo do Pedido</CardTitle></CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <img src="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=600&auto=format&fit=crop" alt="Curso" className="w-full h-32 object-cover rounded-md mb-2" />
                                <h4 className="font-semibold text-slate-900">{course.title}</h4>
                                <p className="text-sm text-slate-500">Curso Online Sandbox</p>
                            </div>
                            <div className="pt-4 border-t border-slate-200 flex justify-between items-center">
                                <span className="text-slate-600">Total:</span>
                                <span className="text-xl font-bold text-violet-700">
                                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(course.price)}
                                </span>
                            </div>
                            <div className="flex items-center text-xs text-slate-500 mt-4 gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-600"><rect width="18" height="11" x="3" y="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
                                Ambiente Sandbox 100% Seguro integrado a Cielo
                            </div>
                        </CardContent>
                    </Card>
                </div>

            </div>
        </div>
    )
}
