import { Button } from "@/components/ui/button"

export default function SobrePage() {
    return (
        <div className="flex flex-col min-h-screen">
            <section className="bg-violet-900 text-white py-20 px-4">
                <div className="container mx-auto max-w-4xl text-center">
                    <h1 className="text-4xl md:text-5xl font-bold mb-6">Sobre o IEPI</h1>
                    <p className="text-xl text-violet-200">
                        Transformando o futuro através da educação superior e profissionalizante de excelência.
                    </p>
                </div>
            </section>

            <section className="py-16 px-4 flex-1">
                <div className="container mx-auto max-w-4xl space-y-12">

                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div>
                            <h2 className="text-3xl font-bold text-slate-900 mb-6">Nossa História</h2>
                            <p className="text-slate-600 leading-relaxed mb-4">
                                Fundado com o propósito de democratizar o acesso ao ensino de qualidade, o Instituto de Educação e Pesquisa (IEPI) tem se consolidado como uma das principais referências em qualificação profissional e acadêmica da região.
                            </p>
                            <p className="text-slate-600 leading-relaxed">
                                Nossa metodologia foca na união entre teoria sólida e prática alinhada às demandas reais do mercado de trabalho.
                            </p>
                        </div>
                        <div className="aspect-video bg-slate-200 rounded-xl overflow-hidden screenshot-placeholder">
                            <img src="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=2000&auto=format&fit=crop" alt="Campus IEPI" className="w-full h-full object-cover" />
                        </div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8 pt-8 border-t border-slate-200">
                        <div className="text-center p-6 bg-slate-50 rounded-xl">
                            <div className="text-violet-600 mb-4 flex justify-center">
                                <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
                            </div>
                            <h3 className="font-bold text-lg mb-2">Missão</h3>
                            <p className="text-slate-600 text-sm">Oferecer educação transformadora e acessível, capacitando profissionais para os desafios do mercado.</p>
                        </div>
                        <div className="text-center p-6 bg-slate-50 rounded-xl">
                            <div className="text-violet-600 mb-4 flex justify-center">
                                <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                            </div>
                            <h3 className="font-bold text-lg mb-2">Visão</h3>
                            <p className="text-slate-600 text-sm">Ser reconhecida nacionalmente pela excelência no ensino e inovação tecnológica na educação.</p>
                        </div>
                        <div className="text-center p-6 bg-slate-50 rounded-xl">
                            <div className="text-violet-600 mb-4 flex justify-center">
                                <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                            </div>
                            <h3 className="font-bold text-lg mb-2">Valores</h3>
                            <p className="text-slate-600 text-sm">Ética, inovação, pluralidade, comprometimento com o aluno e foco em resultados práticos.</p>
                        </div>
                    </div>

                </div>
            </section>
        </div>
    )
}
