/**
 * Financial Validation Schemas
 * Invoices, transactions, cost tracking, reports
 */

import { z } from 'zod';
import { sharedSchemas } from './shared.schemas';

// Invoice schema
export const invoiceSchema = z.object({
  id: sharedSchemas.id.optional(),
  
  invoiceNumber: z.string().min(1, 'Número da nota fiscal é obrigatório'),
  
  studentId: sharedSchemas.id,
  courseId: sharedSchemas.id,
  enrollmentId: sharedSchemas.id,
  
  issueDate: z.date(),
  dueDate: z.date(),
  
  description: z.string().min(1),
  
  subtotal: sharedSchemas.currency,
  discount: sharedSchemas.currency.optional().default(0),
  tax: sharedSchemas.currency.optional().default(0),
  total: sharedSchemas.currency,
  
  status: z.enum(['DRAFT', 'ISSUED', 'SENT', 'VIEWED', 'PAID', 'OVERDUE', 'CANCELED']).default('ISSUED'),
  
  paymentMethod: z.enum(['CREDIT_CARD', 'PIX', 'BOLETO', 'BANK_TRANSFER']).optional(),
  transactionId: sharedSchemas.id.optional(),
  
  notes: z.string().optional(),
  
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export type InvoiceInput = z.infer<typeof invoiceSchema>;

// Reconciliation schema
export const reconciliationSchema = z.object({
  id: sharedSchemas.id.optional(),
  
  transactionId: sharedSchemas.id,
  invoiceId: sharedSchemas.id.optional(),
  
  amount: sharedSchemas.currency,
  
  bankDate: z.date(),
  systemDate: z.date(),
  
  status: z.enum(['PENDING', 'MATCHED', 'DISCREPANCY', 'RESOLVED']).default('PENDING'),
  
  remarks: z.string().optional(),
  
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export type ReconciliationInput = z.infer<typeof reconciliationSchema>;

// Scholarship/Bolsa schema
export const scholarshipSchema = z.object({
  id: sharedSchemas.id.optional(),
  
  studentId: sharedSchemas.id,
  courseId: sharedSchemas.id,
  
  type: z.enum(['PERCENTAGE', 'FIXED_AMOUNT', 'FULL_TUITION']),
  
  value: sharedSchemas.currency,
  
  percentage: sharedSchemas.percentage.optional(),
  
  startDate: z.date(),
  endDate: z.date().optional(),
  
  status: z.enum(['ACTIVE', 'INACTIVE', 'EXPIRED', 'REVOKED']).default('ACTIVE'),
  
  reason: z.string().optional(),
  
  approvedBy: sharedSchemas.id.optional(),
  approvalDate: z.date().optional(),
  
  notes: z.string().optional(),
  
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export type ScholarshipInput = z.infer<typeof scholarshipSchema>;

// Revenue Report schema
export const revenueReportSchema = z.object({
  id: sharedSchemas.id.optional(),
  
  period: z.object({
    startDate: z.date(),
    endDate: z.date(),
  }),
  
  totalRevenue: sharedSchemas.currency,
  totalDiscounts: sharedSchemas.currency,
  totalRefunds: sharedSchemas.currency,
  
  netRevenue: sharedSchemas.currency,
  
  byPaymentMethod: z.record(
    z.enum(['CREDIT_CARD', 'PIX', 'BOLETO', 'BANK_TRANSFER']),
    sharedSchemas.currency
  ).optional(),
  
  byCourse: z.array(z.object({
    courseId: sharedSchemas.id,
    courseName: z.string(),
    revenue: sharedSchemas.currency,
    enrollments: z.number(),
  })).optional(),
  
  averageOrderValue: sharedSchemas.currency.optional(),
  
  createdAt: z.date().optional(),
});

export type RevenueReportInput = z.infer<typeof revenueReportSchema>;

// Expense schema
export const expenseSchema = z.object({
  id: sharedSchemas.id.optional(),
  
  category: z.enum(['INSTRUCTOR_PAYMENT', 'PLATFORM', 'MARKETING', 'SUPPORT', 'INFRASTRUCTURE', 'OTHER']),
  
  description: z.string().min(1),
  
  amount: sharedSchemas.currency,
  
  date: z.date(),
  
  payee: z.string().optional(),
  
  method: z.enum(['CREDIT_CARD', 'BANK_TRANSFER', 'CHECK', 'CASH']).optional(),
  
  receipt: sharedSchemas.url.optional(),
  
  status: z.enum(['PENDING', 'APPROVED', 'REJECTED', 'PAID']).default('PENDING'),
  
  notes: z.string().optional(),
  
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export type ExpenseInput = z.infer<typeof expenseSchema>;

// Financial Dashboard schema (read-only, aggregated)
export const financialDashboardSchema = z.object({
  totalRevenue: sharedSchemas.currency,
  pendingPayments: sharedSchemas.currency,
  pendingCount: z.number(),
  
  monthlyRevenue: z.array(z.object({
    month: z.string(),
    revenue: sharedSchemas.currency,
  })),
  
  topCourses: z.array(z.object({
    courseId: sharedSchemas.id,
    courseName: z.string(),
    revenue: sharedSchemas.currency,
  })),
  
  conversionRate: sharedSchemas.percentage,
  
  averageOrderValue: sharedSchemas.currency,
});

export type FinancialDashboard = z.infer<typeof financialDashboardSchema>;
