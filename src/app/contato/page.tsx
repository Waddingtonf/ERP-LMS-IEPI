export default function ContatoPage() {
    return (
        <div className="flex flex-col" style={{ backgroundColor: "var(--iepi-navy)" }}>

            <section className="py-20 px-4" style={{ backgroundColor: "var(--iepi-navy-dark)" }}>
                <div className="container mx-auto max-w-4xl text-center">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 uppercase">
                        Fale <span style={{ color: "var(--iepi-pink)" }}>Conosco</span>
                    </h1>
                    <p className="text-white/60 text-lg">
                        Dúvidas, sugestões ou suporte? Nossa equipe está pronta para te atender.
                    </p>
                </div>
            </section>

            <section className="py-20 px-4">
                <div className="container mx-auto max-w-5xl">
                    <div className="grid md:grid-cols-2 gap-12">

                        {/* Info cards */}
                        <div className="flex flex-col gap-5">
                            {[
                                { title: "Endereço", text: "Av. Miguel Castro, 1355, Natal-RN, 59082-000", icon: "M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z" },
                                { title: "Telefones", text: "(84) 4009-5108 | (84) 98416-2808", icon: "M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" },
                                { title: "E-mail", text: "atendimento@iepi.edu.br", icon: "M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" },
                                { title: "Horário", text: "Seg-Sex: 08h – 20h | Sáb: 08h – 14h", icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" },
                            ].map((item) => (
                                <div
                                    key={item.title}
                                    className="flex items-start gap-4 p-5 rounded-xl"
                                    style={{ backgroundColor: "var(--iepi-navy-light)", border: "1px solid rgba(255,255,255,0.07)" }}
                                >
                                    <div className="w-11 h-11 rounded-full flex items-center justify-center shrink-0" style={{ background: "var(--g-brand)" }}>
                                        <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d={item.icon}/>
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="text-white font-semibold text-sm">{item.title}</p>
                                        <p className="text-white/55 text-sm mt-0.5">{item.text}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Form */}
                        <div
                            className="rounded-2xl p-8"
                            style={{ backgroundColor: "var(--iepi-navy-light)", border: "1px solid rgba(255,255,255,0.07)" }}
                        >
                            <h3 className="text-xl font-bold text-white mb-6">Envie uma Mensagem</h3>
                            <form className="flex flex-col gap-4">
                                <div>
                                    <label className="block text-white/70 text-xs font-semibold mb-1.5 uppercase tracking-wide">Nome Completo</label>
                                    <input
                                        placeholder="Como devemos te chamar"
                                        className="w-full px-4 py-3 rounded-lg text-sm text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-[#6C1ED9]"
                                        style={{ backgroundColor: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)" }}
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-white/70 text-xs font-semibold mb-1.5 uppercase tracking-wide">E-mail</label>
                                        <input
                                            type="email"
                                            placeholder="seu@email.com"
                                            className="w-full px-4 py-3 rounded-lg text-sm text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-[#6C1ED9]"
                                            style={{ backgroundColor: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)" }}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-white/70 text-xs font-semibold mb-1.5 uppercase tracking-wide">Telefone</label>
                                        <input
                                            type="tel"
                                            placeholder="(XX) 9xxxx-xxxx"
                                            className="w-full px-4 py-3 rounded-lg text-sm text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-[#6C1ED9]"
                                            style={{ backgroundColor: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)" }}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-white/70 text-xs font-semibold mb-1.5 uppercase tracking-wide">Mensagem</label>
                                    <textarea
                                        rows={4}
                                        placeholder="Descreva sua dúvida ou mensagem..."
                                        className="w-full px-4 py-3 rounded-lg text-sm text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-[#6C1ED9] resize-none"
                                        style={{ backgroundColor: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)" }}
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="w-full py-3 text-white font-bold text-sm uppercase tracking-wide rounded-lg transition-all hover:opacity-90"
                                    style={{ background: "var(--g-brand)" }}
                                >
                                    Enviar Mensagem
                                </button>
                            </form>
                        </div>

                    </div>
                </div>
            </section>

        </div>
    )
}
