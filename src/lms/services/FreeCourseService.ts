/**
 * FreeCourseService — instant enrollment for free (Gratuito) courses.
 *
 * No payment processing. Validates pre-conditions, creates an Ativo enrollment,
 * and fires a welcome notification.
 */
import { getCourseRepository, getUserRepository, getEnrollmentRepository } from '@/lms/repositories';
import { NotificationService } from '@/shared/services/NotificationService';
import { AuditService } from '@/shared/services/AuditService';

export interface FreeEnrollResult {
    success: boolean;
    enrollmentId?: string;
    error?: string;
}

export class FreeCourseService {
    private notif: NotificationService;
    private audit: AuditService;

    constructor(notif?: NotificationService, audit?: AuditService) {
        this.notif = notif ?? new NotificationService();
        this.audit = audit ?? new AuditService();
    }

    async enroll(alunoId: string, cursoId: string): Promise<FreeEnrollResult> {
        const courseRepo     = await getCourseRepository();
        const userRepo       = await getUserRepository();
        const enrollmentRepo = getEnrollmentRepository();

        // Validate course
        const course = await courseRepo.findById(cursoId);
        if (!course) return { success: false, error: 'Curso não encontrado.' };
        if (course.tipo !== 'Gratuito') return { success: false, error: 'Este curso não é gratuito.' };
        if (!course.isPublished) return { success: false, error: 'Curso não disponível.' };

        // Validate user
        const user = await userRepo.findById(alunoId);
        if (!user) return { success: false, error: 'Usuário não encontrado.' };

        // Check duplicate
        const alreadyEnrolled = await enrollmentRepo.isEnrolled(alunoId, cursoId);
        if (alreadyEnrolled) return { success: false, error: 'Você já está matriculado neste curso.' };

        // Create enrollment
        const today = new Date().toISOString().split('T')[0];
        const enrollment = await enrollmentRepo.create({
            alunoId,
            alunoName:            user.name,
            alunoEmail:           user.email,
            courseId:             cursoId,
            courseName:           course.title,
            moduleId:             null,
            moduleName:           null,
            turmaId:              null,
            paymentTransactionId: null,
            status:               'Ativo',
            amountPaid:           0,
            dataMatricula:        today,
        });

        // Fire notification
        await this.notif.notify({
            usuarioId: alunoId,
            titulo: `Matrícula confirmada: ${course.title}`,
            mensagem: `Sua matrícula no curso gratuito "${course.title}" foi confirmada. Bom estudo!`,
            tipo: 'sucesso',
            metadata: { origem: 'free-course', cursoId },
        });

        // Audit
        await this.audit.log('ENROLL_FREE', {
            actorId: alunoId,
            targetId: enrollment.id,
            targetType: 'Enrollment',
            payload: { cursoId, courseName: course.title },
        });

        return { success: true, enrollmentId: enrollment.id };
    }
}
