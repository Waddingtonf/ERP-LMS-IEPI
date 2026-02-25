import { getAllMateriais } from "@/lms/actions/docenteActions";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, Video, Link as LinkIcon, FileSliders, Upload } from "lucide-react";

const TIPO_CONFIG = {
    PDF: { icon: FileText, label: "PDF", className: "bg-red-50 text-red-700 border-red-200" },
    VIDEO: { icon: Video, label: "Vídeo", className: "bg-purple-50 text-purple-700 border-purple-200" },
    LINK: { icon: LinkIcon, label: "Link", className: "bg-blue-50 text-blue-700 border-blue-200" },
    SLIDE: { icon: FileSliders, label: "Slide", className: "bg-orange-50 text-orange-700 border-orange-200" },
};

export default async function MateriaisPage() {
    const materiais = await getAllMateriais();

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight text-slate-800">Materiais Opcionais</h2>
                    <p className="text-slate-500 mt-1">Arquivos e conteúdos complementares disponibilizados aos alunos.</p>
                </div>
                <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors text-sm">
                    <Upload className="w-4 h-4" />
                    Enviar Material
                </button>
            </div>

            {materiais.length === 0 ? (
                <Card className="border-dashed border-slate-200">
                    <CardContent className="flex flex-col items-center justify-center py-16 text-center gap-4">
                        <FileText className="w-12 h-12 text-slate-300" />
                        <div>
                            <p className="font-medium text-slate-700">Nenhum material cadastrado</p>
                            <p className="text-sm text-slate-400 mt-1">Envie arquivos PDF, slides ou links externos para seus alunos.</p>
                        </div>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {materiais.map((material) => {
                        const tipoConfig = TIPO_CONFIG[material.tipo] ?? TIPO_CONFIG.LINK;
                        const TipoIcon = tipoConfig.icon;

                        return (
                            <Card key={material.id} className="border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                                <CardHeader className="pb-3">
                                    <div className="flex items-start gap-3">
                                        <div className="p-2.5 bg-slate-100 rounded-lg shrink-0">
                                            <TipoIcon className="w-5 h-5 text-slate-600" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <CardTitle className="text-sm font-semibold text-slate-800 leading-snug">
                                                {material.titulo}
                                            </CardTitle>
                                            <CardDescription className="text-xs mt-1">
                                                Enviado em {new Date(material.uploadedAt).toLocaleDateString("pt-BR")}
                                            </CardDescription>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="pt-0">
                                    <div className="flex items-center justify-between">
                                        <Badge variant="outline" className={`text-xs ${tipoConfig.className}`}>
                                            {tipoConfig.label}
                                        </Badge>
                                        <a
                                            href={material.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-xs font-semibold text-blue-600 hover:text-blue-700 hover:underline"
                                        >
                                            Visualizar →
                                        </a>
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
