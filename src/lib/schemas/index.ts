/**
 * Centralized Schema Exports
 * Import schemas from here instead of individual files
 */

// Auth schemas
export * from './auth.schemas';

// Payment schemas
export * from './payment.schemas';

// Course & Enrollment schemas
export * from './enrollment.schemas';

// CRM schemas
export * from './crm.schemas';

// Financial schemas
export * from './financial.schemas';

// Shared schemas
export * from './shared.schemas';

// Re-export all schemas as a namespace
export {
  loginSchema,
  signupSchema,
  resetPasswordSchema,
  forgotPasswordSchema,
  changePasswordSchema,
  verifyEmailSchema,
  twoFactorSchema,
  updateProfileSchema,
} from './auth.schemas';

export {
  creditCardSchema,
  pixSchema,
  boletoSchema,
  paymentSchema,
  transactionSchema,
  refundSchema,
} from './payment.schemas';

export {
  courseSchema,
  moduleSchema,
  materialSchema,
  enrollmentSchema,
  gradeSchema,
  attendanceSchema,
  syllabusSchema,
  certificateSchema,
} from './enrollment.schemas';

export {
  leadSchema,
  campaignSchema,
  leadActivitySchema,
  leadBulkUpdateSchema,
  opportunitySchema,
} from './crm.schemas';

export {
  invoiceSchema,
  reconciliationSchema,
  scholarshipSchema,
  revenueReportSchema,
  expenseSchema,
  financialDashboardSchema,
} from './financial.schemas';

export {
  cpfSchema,
  emailSchema,
  phoneSchema,
  passwordSchema,
  urlSchema,
  dateSchema,
  cepSchema,
  sharedSchemas,
} from './shared.schemas';
