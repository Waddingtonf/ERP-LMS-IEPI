"use client"

import { useState } from "react"

const AREAS = [
    "Enfermagem (Técnico)",
    "Enfermagem (Graduado)",
    "Gestão em Saúde",
    "Fisioterapia",
    "Nutrição",
    "Farmácia",
    "Outros",
]

const WA = "5584984162808"

export default function LeadForm() {
    const [form, setForm] = useState({ name: "", phone: "", area: "" })
    const [sent, setSent] = useState(false)

    const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
        setForm(f => ({ ...f, [k]: e.target.value }))

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        const msg = encodeURIComponent(
            `Olá! Me chamo *${form.name}* e tenho interesse em cursos de *${form.area || "Saúde"}*.\nMeu número: ${form.phone}`
        )
        window.open(`https://wa.me/${WA}?text=${msg}`, "_blank", "noopener")
        setSent(true)
    }

    if (sent) {
        return (
            <div className="iepi-lead-card text-center py-10">
                <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4"
                    style={{ backgroundColor: "var(--iepi-purple)" }}>
                    <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                    </svg>
                </div>
                <h3 className="font-extrabold text-lg mb-1" style={{ color: "var(--text-heading)" }}>
                    Ótimo, aguarde!
                </h3>
                <p className="text-sm mb-4" style={{ color: "var(--text-muted)" }}>
                    Você será redirecionado ao WhatsApp. Retorno em até 2h.
                </p>
                <button
                    onClick={() => setSent(false)}
                    className="text-xs font-semibold"
                    style={{ color: "var(--text-link)" }}
                >
                    Enviar novamente
                </button>
            </div>
        )
    }

    return (
        <div className="iepi-lead-card">
            <div className="mb-5">
                <span
                    className="inline-block px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest mb-3"
                    style={{ backgroundColor: "rgba(108,30,217,.10)", color: "var(--iepi-purple)" }}
                >
                    Consultoria gratuita
                </span>
                <h3 className="text-xl font-extrabold leading-snug" style={{ color: "var(--text-heading)", letterSpacing: "-0.02em" }}>
                    Encontre o curso ideal para você
                </h3>
                <p className="text-xs mt-1.5" style={{ color: "var(--text-muted)" }}>
                    Sem compromisso. Retorno em até 2h úteis.
                </p>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                <div>
                    <label className="iepi-label" htmlFor="lf-name">Seu nome</label>
                    <input
                        id="lf-name"
                        className="iepi-input"
                        placeholder="Como devemos te chamar"
                        value={form.name}
                        onChange={set("name")}
                        required
                    />
                </div>
                <div>
                    <label className="iepi-label" htmlFor="lf-phone">WhatsApp</label>
                    <input
                        id="lf-phone"
                        type="tel"
                        className="iepi-input"
                        placeholder="(84) 9xxxx-xxxx"
                        value={form.phone}
                        onChange={set("phone")}
                        required
                    />
                </div>
                <div>
                    <label className="iepi-label" htmlFor="lf-area">Área de interesse</label>
                    <select
                        id="lf-area"
                        className="iepi-select"
                        value={form.area}
                        onChange={set("area")}
                    >
                        <option value="">Selecione sua área</option>
                        {AREAS.map(a => <option key={a} value={a}>{a}</option>)}
                    </select>
                </div>

                <button
                    type="submit"
                    className="w-full mt-1 flex items-center justify-center gap-2 py-3.5 rounded-lg font-bold text-sm text-white transition-opacity hover:opacity-90"
                    style={{ backgroundColor: "var(--iepi-purple)" }}
                >
                    {/* WhatsApp icon */}
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                        <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.553 4.116 1.523 5.843L.057 23.428a.5.5 0 0 0 .616.616l5.628-1.473A11.93 11.93 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.894a9.882 9.882 0 0 1-5.034-1.377l-.361-.214-3.74.979.999-3.645-.235-.374A9.867 9.867 0 0 1 2.106 12C2.106 6.58 6.58 2.106 12 2.106S21.894 6.58 21.894 12 17.42 21.894 12 21.894z"/>
                    </svg>
                    Quero minha consultoria
                </button>

                <p className="text-center text-[10.5px]" style={{ color: "var(--text-muted)" }}>
                    🔒 Seus dados são usados apenas para contato. Sem spam.
                </p>
            </form>
        </div>
    )
}
