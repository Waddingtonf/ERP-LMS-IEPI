/**
 * Enrollment & Course Validation Schemas
 * Matrícula, cursos, módulos, materiais
 */

import { z } from 'zod';
import { sharedSchemas } from './shared.schemas';

// Course schema
export const courseSchema = z.object({
  id: sharedSchemas.id.optional(),
  title: sharedSchemas.name,
  slug: sharedSchemas.slug,
  description: sharedSchemas.description,
  longDescription: z.string().max(2000).optional(),
  
  category: z.string().min(1, 'Categoria é obrigatória'),
  level: z.enum(['BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'EXPERT']),
  type: z.enum(['GRADUATION', 'POSTGRADUATION', 'EXTENSION', 'MBA', 'FREE']),
  
  price: sharedSchemas.currency,
  originalPrice: sharedSchemas.currency.optional(),
  
  duration: z.number().min(1, 'Duração deve ser no mínimo 1').describe('em horas'),
  startDate: z.date(),
  endDate: z.date(),
  
  instructorId: sharedSchemas.id,
  instructorName: z.string().optional(),
  
  thumbnail: sharedSchemas.url.optional(),
  banner: sharedSchemas.url.optional(),
  
  maxStudents: z.number().min(1).optional(),
  currentStudents: z.number().min(0).default(0),
  
  isPublished: z.boolean().default(false),
  isFeatured: z.boolean().default(false),
  
  requirements: z.array(z.string()).optional(),
  learningOutcomes: z.array(z.string()).optional(),
  
  tags: z.array(z.string()).optional(),
  
  certificates: z.boolean().default(true),
  liveClasses: z.boolean().default(false),
  
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export type CourseInput = z.infer<typeof courseSchema>;

// Module schema
export const moduleSchema = z.object({
  id: sharedSchemas.id.optional(),
  courseId: sharedSchemas.id,
  title: sharedSchemas.name,
  description: sharedSchemas.description.optional(),
  order: z.number().min(0),
  isPublished: z.boolean().default(true),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export type ModuleInput = z.infer<typeof moduleSchema>;

// Material schema
export const materialSchema = z.object({
  id: sharedSchemas.id.optional(),
  moduleId: sharedSchemas.id,
  title: sharedSchemas.name,
  description: sharedSchemas.description.optional(),
  type: z.enum(['PDF', 'VIDEO', 'LINK', 'SLIDE', 'AUDIO', 'DOCUMENT']),
  url: sharedSchemas.url,
  order: z.number().min(0),
  duration: z.number().min(0).optional().describe('em minutos'),
  isPublished: z.boolean().default(true),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export type MaterialInput = z.infer<typeof materialSchema>;

// Enrollment schema
export const enrollmentSchema = z.object({
  courseId: sharedSchemas.id,
  studentId: sharedSchemas.id.optional(),
  studentEmail: z.string().email(),
  
  enrollmentDate: z.date().optional(),
  startDate: z.date().optional(),
  endDate: z.date().optional(),
  
  status: z.enum(['PENDING', 'ACTIVE', 'COMPLETED', 'SUSPENDED', 'CANCELED']).default('ACTIVE'),
  
  progress: z.number().min(0).max(100).default(0),
  
  paymentTransactionId: sharedSchemas.id.optional(),
  tuitionFee: sharedSchemas.currency.optional(),
  discount: sharedSchemas.currency.optional().default(0),
  finalPrice: sharedSchemas.currency,
  
  certificateIssued: z.boolean().default(false),
  certificateDate: z.date().optional(),
  
  notes: z.string().optional(),
});

export type EnrollmentInput = z.infer<typeof enrollmentSchema>;

// Grade schema
export const gradeSchema = z.object({
  id: sharedSchemas.id.optional(),
  enrollmentId: sharedSchemas.id,
  studentId: sharedSchemas.id,
  courseId: sharedSchemas.id,
  
  assessment: z.string().optional().describe('Nome da avaliação'),
  grade: z.number().min(0).max(10),
  weight: z.number().min(0).max(100).default(100),
  
  recordedAt: z.date().optional(),
  recordedBy: sharedSchemas.id,
});

export type GradeInput = z.infer<typeof gradeSchema>;

// Attendance schema
export const attendanceSchema = z.object({
  id: sharedSchemas.id.optional(),
  enrollmentId: sharedSchemas.id,
  studentId: sharedSchemas.id,
  courseId: sharedSchemas.id,
  
  classDate: z.date(),
  isPresent: z.boolean(),
  justification: z.string().optional(),
  
  recordedAt: z.date().optional(),
  recordedBy: sharedSchemas.id,
});

export type AttendanceInput = z.infer<typeof attendanceSchema>;

// Syllabus schema
export const syllabusSchema = z.object({
  id: sharedSchemas.id.optional(),
  courseId: sharedSchemas.id,
  
  title: z.string().min(1),
  content: z.string().min(1),
  
  objectives: z.array(z.string()).optional(),
  methodology: z.string().optional(),
  assessment: z.string().optional(),
  bibliography: z.array(z.string()).optional(),
  
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export type SyllabusInput = z.infer<typeof syllabusSchema>;

// Certificate schema
export const certificateSchema = z.object({
  id: sharedSchemas.id.optional(),
  enrollmentId: sharedSchemas.id,
  studentId: sharedSchemas.id,
  courseId: sharedSchemas.id,
  
  certificateNumber: z.string().min(1).optional(),
  issueDate: z.date(),
  
  courseName: z.string().min(1),
  studentName: z.string().min(1),
  instructorName: z.string().min(1).optional(),
  
  verificationUrl: sharedSchemas.url.optional(),
  verificationCode: z.string().optional(),
});

export type CertificateInput = z.infer<typeof certificateSchema>;
