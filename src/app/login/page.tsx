"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ShieldCheck, GraduationCap } from "lucide-react"
import { mockLoginAction } from "@/lms/actions/authActions"

export default function LoginPage() {
    return (
        <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <div className="flex justify-center text-violet-700">
                    <GraduationCap className="w-12 h-12" />
                </div>
                <h2 className="mt-6 text-center text-3xl font-extrabold text-slate-900">
                    Acesse sua conta
                </h2>
                <p className="mt-2 text-center text-sm text-slate-600">
                    Ou <a href="/cursos" className="font-medium text-violet-600 hover:text-violet-500">inscreva-se em um novo curso</a>
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 border border-slate-200">
                    <form className="space-y-6" action={mockLoginAction}>
                        <div>
                            <Label htmlFor="email">Endereço de E-mail</Label>
                            <div className="mt-1">
                                <Input id="email" name="email" type="email" autoComplete="email" required placeholder="seu@email.com" />
                            </div>
                        </div>

                        <div>
                            <Label htmlFor="password">Senha</Label>
                            <div className="mt-1">
                                <Input id="password" name="password" type="password" autoComplete="current-password" required placeholder="••••••••" />
                            </div>
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <input id="remember-me" name="remember-me" type="checkbox" className="h-4 w-4 text-violet-600 focus:ring-violet-500 border-slate-300 rounded" />
                                <label htmlFor="remember-me" className="ml-2 block text-sm text-slate-900">
                                    Lembrar de mim
                                </label>
                            </div>

                            <div className="text-sm">
                                <a href="#" className="font-medium text-violet-600 hover:text-violet-500">
                                    Esqueceu a senha?
                                </a>
                            </div>
                        </div>

                        <div className="mb-4 rounded-lg border border-amber-200 bg-amber-50 p-4">
                            <p className="text-xs font-semibold text-amber-700 uppercase tracking-wide mb-2">Modo Sandbox — Selecione o Perfil</p>
                            <div className="grid grid-cols-2 gap-2 mt-2 sm:grid-cols-3">
                                <button type="submit" name="role" value="ADMIN"     className="text-xs px-3 py-2 rounded-md border border-amber-300 bg-white text-amber-800 font-medium hover:bg-amber-100 transition-colors">Admin</button>
                                <button type="submit" name="role" value="STUDENT"   className="text-xs px-3 py-2 rounded-md border border-amber-300 bg-white text-amber-800 font-medium hover:bg-amber-100 transition-colors">Aluno</button>
                                <button type="submit" name="role" value="DOCENTE"   className="text-xs px-3 py-2 rounded-md border border-amber-300 bg-white text-amber-800 font-medium hover:bg-amber-100 transition-colors">Docente</button>
                                <button type="submit" name="role" value="FINANCEIRO" className="text-xs px-3 py-2 rounded-md border border-amber-300 bg-white text-amber-800 font-medium hover:bg-amber-100 transition-colors">Financeiro</button>
                                <button type="submit" name="role" value="PEDAGOGICO" className="text-xs px-3 py-2 rounded-md border border-amber-300 bg-white text-amber-800 font-medium hover:bg-amber-100 transition-colors">Pedagógico</button>
                            </div>
                        </div>

                        <div>
                            <Button name="role" value="STUDENT" type="submit" className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-violet-600 hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 gap-2">
                                <ShieldCheck className="w-4 h-4" /> Acesso Padrão (Aluno)
                            </Button>
                        </div>

                        <div className="mt-4 text-center">
                            <span className="text-xs text-slate-400">Ambiente seguro verificado.</span>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}
