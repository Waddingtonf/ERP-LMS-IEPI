import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, Clock, Users } from "lucide-react"
import Link from "next/link"

// Mock data for initial development
const courses = [
  {
    id: "1",
    title: "Gestão Estratégica em RH",
    description: "Formação completa para líderes de Recursos Humanos.",
    type: "Pós-Graduação",
    duration: "360 horas",
    price: 1599.00,
    installments: 12,
    openSpots: 45,
    imageUrl: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=2670&auto=format&fit=crop",
  },
  {
    id: "2",
    title: "Excelência em Atendimento",
    description: "Curso rápido focado em técnicas de atendimento ao cliente.",
    type: "Curso Livre",
    duration: "40 horas",
    price: 299.00,
    installments: 3,
    openSpots: 100,
    imageUrl: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?q=80&w=2670&auto=format&fit=crop",
  },
  {
    id: "3",
    title: "Administração de Empresas",
    description: "Graduação completa com as melhores práticas de mercado.",
    type: "Graduação",
    duration: "4 anos",
    price: 350.00, // mensalidade
    installments: 48,
    openSpots: 60,
    imageUrl: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2670&auto=format&fit=crop",
  }
]

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">

      {/* Hero Section */}
      <section className="relative bg-violet-900 py-24 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=2670&auto=format&fit=crop')] bg-cover bg-center opacity-10 mix-blend-overlay"></div>
        <div className="container relative z-10 mx-auto px-4 max-w-5xl text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight leading-tight mb-6">
            Eleve sua carreira com <span className="text-violet-300">qualificação de excelência</span>
          </h1>
          <p className="text-lg md:text-xl text-violet-100 mb-10 max-w-2xl mx-auto">
            Cursos de Graduação, Pós-graduação e Livres desenvolvidos para o mercado de trabalho atual.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-violet-900 hover:bg-slate-100 font-semibold rounded-full px-8">
              Ver Cursos Abertos
            </Button>
            <Button size="lg" variant="outline" className="text-white border-white hover:bg-white/10 rounded-full px-8">
              Área do Aluno
            </Button>
          </div>
        </div>
      </section>

      {/* Cursos Section */}
      <section className="py-20 bg-slate-50" id="cursos">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Turmas Abertas</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              Escolha a formação ideal para o seu momento profissional e garanta sua vaga.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {courses.map((course) => (
              <Card key={course.id} className="overflow-hidden border-slate-200 transition-all hover:shadow-lg hover:-translate-y-1">
                <div className="h-48 relative w-full">
                  <img src={course.imageUrl} alt={course.title} className="object-cover w-full h-full" />
                  <div className="absolute top-4 left-4">
                    <span className="bg-violet-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                      {course.type}
                    </span>
                  </div>
                </div>
                <CardHeader>
                  <CardTitle className="text-xl text-slate-900 leading-tight">{course.title}</CardTitle>
                  <CardDescription className="text-slate-500 line-clamp-2">
                    {course.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center text-sm text-slate-600">
                      <Clock className="w-4 h-4 mr-2 text-violet-500" />
                      Duração: {course.duration}
                    </div>
                    <div className="flex items-center text-sm text-slate-600">
                      <Users className="w-4 h-4 mr-2 text-violet-500" />
                      Vagas Abertas: {course.openSpots}
                    </div>
                    <div className="flex items-center text-sm text-slate-600">
                      <BookOpen className="w-4 h-4 mr-2 text-violet-500" />
                      Modalidade: EaD / Presencial
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col gap-4 border-t border-slate-100 pt-6">
                  <div className="w-full flex justify-between items-end">
                    <span className="text-sm text-slate-500">
                      {course.installments > 1 ? `Em até ${course.installments}x de` : 'À vista por'}
                    </span>
                    <span className="text-2xl font-bold text-violet-700">
                      {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(course.price / course.installments)}
                    </span>
                  </div>
                  <Link href={`/checkout/${course.id}`} className="w-full">
                    <Button className="w-full bg-violet-600 hover:bg-violet-700 text-white" size="lg">
                      Matricule-se Agora
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
