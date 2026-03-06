export default function ContatoPage() {
    const INFO = [
        {
            title: "Endereço",
            text: "Av. Miguel Castro, 1355, Natal-RN, 59082-000",
            icon: "M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z",
        },
        {
            title: "Telefones",
            text: "(84) 4009-5449 | (84) 98416-2808",
            icon: "M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z",
        },
        {
            title: "E-mail",
            text: "instituto@liga.org.br",
            icon: "M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z",
            href: "mailto:instituto@liga.org.br",
        },
        {
            title: "Horário de atendimento",
            text: "Seg–Sex: 08h – 20h | Sáb: 08h – 14h",
            icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z",
        },
    ]

    return (
        <div style={{ backgroundColor: "var(--iepi-light-alt)" }}>

            {/* HERO */}
            <section style={{ backgroundColor: "var(--iepi-dark)", borderBottom: "3px solid var(--iepi-purple)" }}>
                <div className="container mx-auto max-w-4xl px-6 py-14 text-center">
                    <p className="text-xs font-bold tracking-widest uppercase mb-3" style={{ color: "rgba(255,255,255,0.45)" }}>
                        Atendimento
                    </p>
                    <h1
                        className="text-3xl md:text-4xl font-extrabold text-white mb-3"
                        style={{ letterSpacing: "-0.02em" }}
                    >
                        Fale conosco
                    </h1>
                    <p className="text-base max-w-xl mx-auto" style={{ color: "var(--text-on-dark-muted)" }}>
                        Dúvidas, sugestões ou suporte? Nossa equipe está pronta para te atender.
                    </p>
                </div>
            </section>

            {/* CONTEÚDO */}
            <section className="py-14">
                <div className="container mx-auto max-w-5xl px-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                        {/* ── Coluna esquerda: informações ────── */}
                        <div className="flex flex-col gap-4">
                            <h2 className="text-lg font-extrabold mb-1" style={{ color: "var(--text-heading)" }}>
                                Informações de contato
                            </h2>

                            {INFO.map((item) => (
                                <div
                                    key={item.title}
                                    className="flex items-start gap-4 p-5 rounded-xl"
                                    style={{ backgroundColor: "var(--iepi-white)", border: "1px solid var(--border-light)" }}
                                >
                                    <div
                                        className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                                        style={{ backgroundColor: "var(--iepi-light-alt)" }}
                                    >
                                        <svg
                                            className="w-5 h-5"
                                            style={{ color: "var(--iepi-purple)" }}
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                            strokeWidth={1.8}
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: "var(--text-overline)" }}>
                                            {item.title}
                                        </p>
                                        {item.href ? (
                                            <a
                                                href={item.href}
                                                className="text-sm font-medium"
                                                style={{ color: "var(--text-link)" }}
                                            >
                                                {item.text}
                                            </a>
                                        ) : (
                                            <p className="text-sm font-medium" style={{ color: "var(--text-body)" }}>
                                                {item.text}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* ── Coluna direita: formulário ───────── */}
                        <div
                            className="rounded-xl p-7"
                            style={{ backgroundColor: "var(--iepi-white)", border: "1px solid var(--border-light)", boxShadow: "0 4px 20px rgba(0,0,0,0.07)" }}
                        >
                            <h2 className="text-lg font-extrabold mb-5" style={{ color: "var(--text-heading)" }}>
                                Envie uma mensagem
                            </h2>

                            <form className="flex flex-col gap-4">
                                <div>
                                    <label className="iepi-label" htmlFor="nome">Nome completo</label>
                                    <input
                                        id="nome"
                                        className="iepi-input"
                                        placeholder="Como devemos te chamar"
                                    />
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="iepi-label" htmlFor="email">E-mail</label>
                                        <input
                                            id="email"
                                            type="email"
                                            className="iepi-input"
                                            placeholder="seu@email.com"
                                        />
                                    </div>
                                    <div>
                                        <label className="iepi-label" htmlFor="tel">Telefone</label>
                                        <input
                                            id="tel"
                                            type="tel"
                                            className="iepi-input"
                                            placeholder="(XX) 9xxxx-xxxx"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="iepi-label" htmlFor="assunto">Assunto</label>
                                    <select id="assunto" className="iepi-select">
                                        <option value="">Selecione um assunto</option>
                                        <option>Informações sobre cursos</option>
                                        <option>Matrículas e inscrições</option>
                                        <option>Financeiro / pagamentos</option>
                                        <option>Suporte técnico</option>
                                        <option>Outros</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="iepi-label" htmlFor="msg">Mensagem</label>
                                    <textarea
                                        id="msg"
                                        rows={4}
                                        className="iepi-textarea"
                                        placeholder="Descreva sua dúvida ou mensagem…"
                                        style={{ resize: "none" }}
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="w-full py-3.5 text-white font-bold text-sm rounded-lg transition-opacity hover:opacity-90 mt-1"
                                    style={{ backgroundColor: "var(--iepi-purple)" }}
                                >
                                    Enviar mensagem
                                </button>
                            </form>
                        </div>

                    </div>
                </div>
            </section>

        </div>
    )
}
