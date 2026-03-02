export default function SobrePage() {
    const stats = [
        { value: "15+", label: "Anos de Experiência" },
        { value: "12k+", label: "Alunos Formados" },
        { value: "98%", label: "Sat. dos Alunos" },
        { value: "200+", label: "Docentes Ativos" },
    ]
    const values = [
        { title: "Missão", text: "Oferecer educação transformadora e acessível, capacitando profissionais para os desafios do mercado de saúde.", icon: "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" },
        { title: "Visão", text: "Ser reconhecida nacionalmente pela excelência no ensino e inovação tecnológica na educação em saúde.", icon: "M15 12a3 3 0 11-6 0 3 3 0 016 0zM2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" },
        { title: "Valores", text: "Ética, inovação, pluralidade, comprometimento com o aluno e foco em resultados práticos.", icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" },
    ]
    return (
        <div className="flex flex-col" style={{ backgroundColor: "var(--iepi-navy)" }}>

            {/* Hero */}
            <section className="py-24 px-4" style={{ backgroundColor: "var(--iepi-navy-dark)" }}>
                <div className="container mx-auto max-w-4xl text-center">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-6 uppercase">
                        Sobre o <span style={{ color: "var(--iepi-pink)" }}>IEPI</span>
                    </h1>
                    <p className="text-lg text-white/60 max-w-2xl mx-auto">
                        Transformando o futuro através da educação superior e profissionalizante de excelência há mais de 15 anos.
                    </p>
                </div>
            </section>

            {/* Stats */}
            <section className="py-12" style={{ backgroundColor: "var(--iepi-purple)" }}>
                <div className="container mx-auto px-4 max-w-5xl">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                        {stats.map((s) => (
                            <div key={s.label}>
                                <p className="text-4xl font-extrabold text-white">{s.value}</p>
                                <p className="text-white/80 text-sm mt-1">{s.label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* History */}
            <section className="py-20 px-4">
                <div className="container mx-auto max-w-5xl">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div>
                            <h2 className="text-3xl font-extrabold text-white mb-6 uppercase">Nossa História</h2>
                            <p className="text-white/65 leading-relaxed mb-4">
                                Fundado com o propósito de democratizar o acesso ao ensino de qualidade, o Instituto de Educação e Pesquisa Integrada (IEPI) tem se consolidado como uma das principais referências em qualificação profissional na área da saúde no Nordeste.
                            </p>
                            <p className="text-white/65 leading-relaxed">
                                Nossa metodologia foca na união entre teoria sólida e prática alinhada às demandas reais do mercado, contando com o melhor corpo docente e infraestrutura da região.
                            </p>
                        </div>
                        <div className="rounded-2xl overflow-hidden shadow-2xl">
                            <img
                                src="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=2000&auto=format&fit=crop"
                                alt="Campus IEPI"
                                className="w-full h-72 object-cover"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* MVV */}
            <section className="py-16 px-4" style={{ backgroundColor: "var(--iepi-bg-deep)" }}>
                <div className="container mx-auto max-w-5xl">
                    <div className="grid md:grid-cols-3 gap-6">
                        {values.map((v) => (
                            <div
                                key={v.title}
                                className="rounded-2xl p-8 text-center"
                                style={{ backgroundColor: "var(--iepi-navy)" }}
                            >
                                <div className="flex justify-center mb-4">
                                    <div className="w-14 h-14 rounded-full flex items-center justify-center" style={{ backgroundColor: "var(--iepi-purple)" }}>
                                        <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d={v.icon}/>
                                        </svg>
                                    </div>
                                </div>
                                <h3 className="font-extrabold text-xl text-white mb-3">{v.title}</h3>
                                <p className="text-white/60 text-sm leading-relaxed">{v.text}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

        </div>
    )
}

