"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Settings, LogIn } from "lucide-react"
import { mockLoginAction } from "@/lms/actions/authActions"

export default function AdminLoginPage() {
    return (
        <div className="min-h-screen bg-slate-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <div className="flex justify-center text-slate-300">
                    <Settings className="w-12 h-12" />
                </div>
                <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
                    Backoffice IEPI
                </h2>
                <p className="mt-2 text-center text-sm text-slate-400">
                    Acesso restrito a colaboradores e administração.
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-slate-800 py-8 px-4 shadow sm:rounded-lg sm:px-10 border border-slate-700">
                    <form className="space-y-6" action={mockLoginAction}>
                        <input type="hidden" name="role" value="ADMIN" />
                        <div>
                            <Label htmlFor="email" className="text-slate-300">E-mail Corporativo</Label>
                            <div className="mt-1">
                                <Input id="email" name="email" type="email" autoComplete="email" required placeholder="admin@iepi.edu.br" className="bg-slate-900 border-slate-700 text-white placeholder-slate-500" />
                            </div>
                        </div>

                        <div>
                            <Label htmlFor="password" className="text-slate-300">Senha Segura</Label>
                            <div className="mt-1">
                                <Input id="password" name="password" type="password" autoComplete="current-password" required placeholder="••••••••" className="bg-slate-900 border-slate-700 text-white placeholder-slate-500" />
                            </div>
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <input id="remember-me" name="remember-me" type="checkbox" className="h-4 w-4 text-violet-600 focus:ring-violet-500 border-slate-700 bg-slate-900 rounded" />
                                <label htmlFor="remember-me" className="ml-2 block text-sm text-slate-300">
                                    Lembrar acesso neste IP
                                </label>
                            </div>

                            <div className="text-sm">
                                <a href="#" className="font-medium text-violet-400 hover:text-violet-300">
                                    Perdeu acesso?
                                </a>
                            </div>
                        </div>

                        <div>
                            <Button type="submit" className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-slate-900 bg-violet-400 hover:bg-violet-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 gap-2">
                                <LogIn className="w-4 h-4" /> Entrar no Sistema
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}
