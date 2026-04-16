/**
 * CRM Validation Schemas
 * Leads, campaings, pipeline
 */

import { z } from 'zod';
import { sharedSchemas, emailSchema, phoneSchema } from './shared.schemas';

// Lead schema
export const leadSchema = z.object({
  id: sharedSchemas.id.optional(),
  
  firstName: z.string().min(2, 'Nome deve ter no mínimo 2 caracteres'),
  lastName: z.string().min(2, 'Sobrenome deve ter no mínimo 2 caracteres'),
  email: emailSchema,
  phone: phoneSchema.optional(),
  
  company: z.string().optional(),
  jobTitle: z.string().optional(),
  
  source: z.enum(['WEBSITE', 'SOCIAL_MEDIA', 'REFERRAL', 'ADVERTISEMENT', 'EVENT', 'COLD_CALL', 'OTHER']),
  campaignId: sharedSchemas.id.optional(),
  
  status: z.enum(['NEW', 'CONTACTED', 'QUALIFIED', 'PROPOSAL', 'NEGOTIATION', 'CLOSED_WON', 'CLOSED_LOST']).default('NEW'),
  stage: z.number().min(0).max(100).describe('Percentual do funil'),
  
  score: z.number().min(0).max(100).default(0).describe('Lead score automático'),
  
  notes: z.string().optional(),
  
  country: z.string().optional(),
  state: z.string().optional(),
  city: z.string().optional(),
  
  interestCourse: sharedSchemas.id.optional(),
  
  lastContactDate: z.date().optional(),
  nextFollowUp: z.date().optional(),
  
  assignedTo: sharedSchemas.id.optional(),
  
  tags: z.array(z.string()).optional(),
  
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export type LeadInput = z.infer<typeof leadSchema>;

// Campaign schema
export const campaignSchema = z.object({
  id: sharedSchemas.id.optional(),
  
  name: sharedSchemas.name,
  description: sharedSchemas.description.optional(),
  
  type: z.enum(['EMAIL', 'SMS', 'SOCIAL_MEDIA', 'PAID_ADS', 'EVENT', 'CONTENT']),
  
  status: z.enum(['PLANNING', 'ACTIVE', 'PAUSED', 'COMPLETED', 'CANCELED']).default('PLANNING'),
  
  startDate: z.date(),
  endDate: z.date().optional(),
  
  budget: sharedSchemas.currency.optional(),
  spent: sharedSchemas.currency.optional(),
  
  targetAudience: z.string().optional(),
  
  courseId: sharedSchemas.id.optional(),
  
  metrics: z.object({
    leadsGenerated: z.number().default(0),
    conversions: z.number().default(0),
    roi: sharedSchemas.percentage.optional(),
  }).optional(),
  
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export type CampaignInput = z.infer<typeof campaignSchema>;

// Lead Activity schema
export const leadActivitySchema = z.object({
  id: sharedSchemas.id.optional(),
  leadId: sharedSchemas.id,
  
  type: z.enum(['EMAIL_SENT', 'PHONE_CALL', 'MEETING', 'DEMO', 'PROPOSAL', 'NOTE', 'STATUS_CHANGE']),
  
  description: z.string().min(1),
  
  outcome: z.enum(['SUCCESS', 'FAILURE', 'PENDING', 'FOLLOW_UP']).optional(),
  
  createdBy: sharedSchemas.id,
  createdAt: z.date().optional(),
});

export type LeadActivityInput = z.infer<typeof leadActivitySchema>;

// Lead Update schema (for bulk operations)
export const leadBulkUpdateSchema = z.object({
  leadIds: z.array(sharedSchemas.id),
  status: z.enum(['NEW', 'CONTACTED', 'QUALIFIED', 'PROPOSAL', 'NEGOTIATION', 'CLOSED_WON', 'CLOSED_LOST']).optional(),
  stage: z.number().min(0).max(100).optional(),
  assignedTo: sharedSchemas.id.optional(),
  tags: z.array(z.string()).optional(),
});

export type LeadBulkUpdateInput = z.infer<typeof leadBulkUpdateSchema>;

// Opportunity schema (qualified lead)
export const opportunitySchema = z.object({
  id: sharedSchemas.id.optional(),
  leadId: sharedSchemas.id,
  
  name: z.string().min(1),
  description: z.string().optional(),
  
  courseId: sharedSchemas.id,
  courseName: z.string().optional(),
  
  estimatedValue: sharedSchemas.currency,
  
  probability: sharedSchemas.percentage.default(50),
  
  expectedCloseDate: z.date(),
  
  stage: z.enum(['INITIAL', 'NEGOTIATION', 'PROPOSAL', 'CLOSING', 'CLOSED']).default('INITIAL'),
  
  notes: z.string().optional(),
  
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export type OpportunityInput = z.infer<typeof opportunitySchema>;
