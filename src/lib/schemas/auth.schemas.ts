/**
 * Authentication Validation Schemas
 * Login, Register, Password Reset
 */

import { z } from 'zod';
import { emailSchema, passwordSchema } from './shared.schemas';

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Senha é obrigatória'),
  rememberMe: z.boolean().optional().default(false),
});

export type LoginInput = z.infer<typeof loginSchema>;

export const signupSchema = z
  .object({
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: z.string(),
    firstName: z.string().min(2, 'Nome deve ter no mínimo 2 caracteres'),
    lastName: z.string().min(2, 'Sobrenome deve ter no mínimo 2 caracteres'),
    phone: z.string().optional(),
    agreeToTerms: z.boolean().refine((val) => val === true, {
      message: 'Você deve concordar com os termos',
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Senhas não correspondem',
    path: ['confirmPassword'],
  });

export type SignupInput = z.infer<typeof signupSchema>;

export const resetPasswordSchema = z
  .object({
    password: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Senhas não correspondem',
    path: ['confirmPassword'],
  });

export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;

export const forgotPasswordSchema = z.object({
  email: emailSchema,
});

export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Senha atual é obrigatória'),
    newPassword: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Senhas não correspondem',
    path: ['confirmPassword'],
  });

export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;

export const verifyEmailSchema = z.object({
  token: z.string().min(1, 'Token é obrigatório'),
  email: emailSchema,
});

export type VerifyEmailInput = z.infer<typeof verifyEmailSchema>;

export const twoFactorSchema = z.object({
  code: z.string().length(6, 'Código deve ter 6 dígitos').regex(/^\d+$/, 'Código deve conter apenas números'),
});

export type TwoFactorInput = z.infer<typeof twoFactorSchema>;

export const updateProfileSchema = z.object({
  firstName: z.string().min(2, 'Nome deve ter no mínimo 2 caracteres').optional(),
  lastName: z.string().min(2, 'Sobrenome deve ter no mínimo 2 caracteres').optional(),
  phone: z.string().optional(),
  avatar: z.string().url().optional(),
  bio: z.string().max(500).optional(),
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
