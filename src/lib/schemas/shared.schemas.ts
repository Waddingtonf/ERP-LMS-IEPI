/**
 * Shared Validation Schemas
 * Validações comuns para CPF, telefone, email, etc.
 */

import { z } from 'zod';

// CPF validation
const cpfRegex = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/;
export const cpfSchema = z
  .string()
  .regex(cpfRegex, 'CPF deve estar no formato XXX.XXX.XXX-XX')
  .refine(
    (cpf) => {
      // Remove non-numeric characters
      const cleaned = cpf.replace(/\D/g, '');
      if (cleaned.length !== 11) return false;
      
      // Check for known invalid CPFs
      if (/^(\d)\1{10}$/.test(cleaned)) return false;
      
      // Luhn-like algorithm for CPF
      let sum = 0;
      let remainder;
      
      for (let i = 1; i <= 9; i++)
        sum += parseInt(cleaned.substring(i - 1, i)) * (11 - i);
      remainder = (sum * 10) % 11;
      if (remainder === 10 || remainder === 11) remainder = 0;
      if (remainder !== parseInt(cleaned.substring(9, 10))) return false;
      
      sum = 0;
      for (let i = 1; i <= 10; i++)
        sum += parseInt(cleaned.substring(i - 1, i)) * (12 - i);
      remainder = (sum * 10) % 11;
      if (remainder === 10 || remainder === 11) remainder = 0;
      if (remainder !== parseInt(cleaned.substring(10, 11))) return false;
      
      return true;
    },
    'CPF inválido'
  );

// Email validation
export const emailSchema = z
  .string()
  .email('Email inválido')
  .toLowerCase()
  .refine((email) => !email.endsWith('.'), 'Email não pode terminar com ponto');

// Phone validation (Brazil)
const phoneRegex = /^(\+55|0)?(\(?\d{2}\)?|\d{2})\s?9?\d{4}-?\d{4}$/;
export const phoneSchema = z
  .string()
  .regex(phoneRegex, 'Telefone deve estar no formato (XX) 9XXXX-XXXX ou similar');

// Password validation
export const passwordSchema = z
  .string()
  .min(8, 'Senha deve ter no mínimo 8 caracteres')
  .regex(/[A-Z]/, 'Senha deve conter uma letra maiúscula')
  .regex(/[a-z]/, 'Senha deve conter uma letra minúscula')
  .regex(/[0-9]/, 'Senha deve conter um número')
  .regex(/[^A-Za-z0-9]/, 'Senha deve conter um caractere especial (!@#$%^&*)');

// URL validation
export const urlSchema = z
  .string()
  .url('URL inválida')
  .refine(
    (url) => ['http://', 'https://'].some((proto) => url.startsWith(proto)),
    'URL deve começar com http:// ou https://'
  );

// Date validation
export const dateSchema = z
  .date()
  .or(z.string().datetime())
  .refine((date) => {
    const d = typeof date === 'string' ? new Date(date) : date;
    return d <= new Date();
  }, 'Data não pode ser no futuro');

// CEP validation (Brazil)
const cepRegex = /^\d{5}-?\d{3}$/;
export const cepSchema = z
  .string()
  .regex(cepRegex, 'CEP deve estar no formato XXXXX-XXX ou XXXXXXXX');

// Generic validators
export const sharedSchemas = {
  id: z.string().uuid('ID deve ser um UUID válido'),
  name: z.string().min(2, 'Nome deve ter no mínimo 2 caracteres').max(100),
  description: z.string().max(500, 'Descrição não pode ter mais de 500 caracteres'),
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug inválido'),
  url: urlSchema,
  percentage: z.number().min(0).max(100),
  currency: z.coerce.number().min(0).multipleOf(0.01, 'Inválido para moeda'),
} as const;

export type CPF = z.infer<typeof cpfSchema>;
export type Email = z.infer<typeof emailSchema>;
export type Phone = z.infer<typeof phoneSchema>;
export type Password = z.infer<typeof passwordSchema>;
export type CEP = z.infer<typeof cepSchema>;
