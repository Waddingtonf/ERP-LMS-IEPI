/**
 * Student Dashboard Component
 * Progresso de cursos, próximas aulas, notas
 */

'use client'

import { useEffect, useState } from 'react'

interface StudentCourse {
  id: string
  title: string
  progress: number
  nextClass?: string
  instructorName: string
}

interface StudentMetrics {
  enrolledCourses: number
  hoursLearned: number
  certificatesEarned: number
  averageGrade: number
  courses: StudentCourse[]
}

export function StudentDashboard() {
  const [metrics, setMetrics] = useState<StudentMetrics>({
    enrolledCourses: 0,
    hoursLearned: 0,
    certificatesEarned: 0,
    averageGrade: 0,
    courses: [],
  })

  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // TODO: Buscar dados do estudante
    const loadMetrics = async () => {
      try {
        setMetrics({
          enrolledCourses: 4,
          hoursLearned: 32,
          certificatesEarned: 2,
          averageGrade: 8.5,
          courses: [
            {
              id: '1',
              title: 'React Avançado',
              progress: 75,
              nextClass: '2026-04-09 10:00',
              instructorName: 'João Silva',
            },
            {
              id: '2',
              title: 'TypeScript Masterclass',
              progress: 45,
              nextClass: '2026-04-10 14:00',
              instructorName: 'Maria Santos',
            },
            {
              id: '3',
              title: 'Node.js Backend',
              progress: 20,
              instructorName: 'Pedro Costa',
            },
            {
              id: '4',
              title: 'Web Design Responsivo',
              progress: 100,
              instructorName: 'Ana Oliveira',
            },
          ],
        })
      } catch (error) {
        console.error('Error loading student metrics:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadMetrics()
  }, [])

  if (isLoading) {
    return <div className="text-center py-8">Carregando...</div>
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Meu Dashboard</h1>
        <p className="text-slate-600">Acompanhe seu progresso nos cursos</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border border-slate-200 p-4">
          <p className="text-sm text-slate-600">Cursos Inscritos</p>
          <p className="text-2xl font-bold text-slate-900">{metrics.enrolledCourses}</p>
        </div>
        
        <div className="bg-white rounded-lg border border-slate-200 p-4">
          <p className="text-sm text-slate-600">Horas Aprendidas</p>
          <p className="text-2xl font-bold text-slate-900">{metrics.hoursLearned}h</p>
        </div>
        
        <div className="bg-white rounded-lg border border-slate-200 p-4">
          <p className="text-sm text-slate-600">Certificados</p>
          <p className="text-2xl font-bold text-green-600">{metrics.certificatesEarned}</p>
        </div>
        
        <div className="bg-white rounded-lg border border-slate-200 p-4">
          <p className="text-sm text-slate-600">Média Geral</p>
          <p className="text-2xl font-bold text-sky-600">{metrics.averageGrade}</p>
        </div>
      </div>

      {/* My Courses */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-slate-900">Meus Cursos</h2>
        <div className="space-y-3">
          {metrics.courses.map((course) => (
            <div key={course.id} className="bg-white rounded-lg border border-slate-200 p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold text-slate-900">{course.title}</h3>
                  <p className="text-sm text-slate-600">Prof. {course.instructorName}</p>
                  
                  {/* Progress Bar */}
                  <div className="mt-3 bg-slate-200 rounded-full h-2 w-full">
                    <div
                      className="bg-sky-500 h-2 rounded-full transition-all"
                      style={{ width: `${course.progress}%` }}
                    />
                  </div>
                  <p className="text-xs text-slate-600 mt-1">{course.progress}% concluído</p>
                  
                  {course.nextClass && (
                    <p className="text-xs text-green-600 mt-2">
                      ⏰ Próxima aula: {new Date(course.nextClass).toLocaleString('pt-BR')}
                    </p>
                  )}
                </div>
                
                <button className="ml-4 px-4 py-2 bg-sky-500 text-white rounded-md hover:bg-sky-600 text-sm">
                  {course.progress === 100 ? 'Certificado' : 'Continuar'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
