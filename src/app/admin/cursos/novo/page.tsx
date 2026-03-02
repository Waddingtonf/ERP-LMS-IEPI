"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createCourseAction } from "@/lms/actions/adminCourseActions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, GraduationCap, Save } from "lucide-react"
import Link from "next/link"

export default function NovoCursoPage() {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setLoading(true)
        setError(null)

        try {
            const fd = new FormData(e.currentTarget)
            await createCourseAction(fd)
            router.push("/admin/cursos")
        } catch {
            setError("Não foi possível criar o curso. Tente novamente.")
            setLoading(false)
        }
    }

    return (
        <div className="space-y-6 max-w-2xl">
            {/* Cabeçalho */}
            <div className="flex items-center gap-4 mb-8">
                <Link href="/admin/cursos">
                    <Button variant="outline" size="icon" className="h-8 w-8">
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                </Link>
                <div>
                    <h2 className="text-2xl font-bold text-slate-800 tracking-tight flex items-center gap-3">
                        <GraduationCap className="w-7 h-7 text-violet-600" />
                        Novo Curso
                    </h2>
                    <p className="text-slate-500 text-sm mt-0.5">
                        Preencha as informações básicas para criar o curso. Módulos e materiais podem ser adicionados após a criação.
                    </p>
                </div>
            </div>

            {/* Formulário */}
            <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-8">
                <form onSubmit={handleSubmit} className="space-y-6">

                    {error && (
                        <div className="flex items-center gap-3 bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm">
                            {error}
                        </div>
                    )}

                    <div className="space-y-2">
                        <Label htmlFor="title" className="text-slate-700 font-semibold">
                            Título do curso <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            id="title"
                            name="title"
                            placeholder="Ex.: Pós-Graduação em Gestão Hospitalar"
                            required
                            className="border-slate-200 focus-visible:ring-violet-500"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description" className="text-slate-700 font-semibold">
                            Descrição
                        </Label>
                        <Textarea
                            id="description"
                            name="description"
                            placeholder="Descreva os objetivos, público-alvo e diferenciais do curso…"
                            rows={4}
                            className="border-slate-200 focus-visible:ring-violet-500 resize-none"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="price" className="text-slate-700 font-semibold">
                            Valor total (R$) <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            id="price"
                            name="price"
                            type="number"
                            min="0"
                            step="0.01"
                            placeholder="1599.00"
                            required
                            className="border-slate-200 focus-visible:ring-violet-500 max-w-xs"
                        />
                        <p className="text-xs text-slate-400">Valor em reais (ex.: 1599.00). Parcelamento configurável após criação.</p>
                    </div>

                    <div className="flex items-center gap-3 pt-2 border-t border-slate-100">
                        <Button
                            type="submit"
                            disabled={loading}
                            className="bg-violet-600 hover:bg-violet-700 gap-2"
                        >
                            <Save className="w-4 h-4" />
                            {loading ? "Criando…" : "Criar curso"}
                        </Button>
                        <Link href="/admin/cursos">
                            <Button type="button" variant="ghost" className="text-slate-500">
                                Cancelar
                            </Button>
                        </Link>
                    </div>

                </form>
            </div>
        </div>
    )
}
