/**
 * SECURE CSRF Protection Middleware
 * 
 * Implementa:
 * 1. ✅ CSRF token generation e validation
 * 2. ✅ Token armazenado em httpOnly secure cookie
 * 3. ✅ Token validado em cada formulário POST/DELETE/PATCH
 * 4. ✅ SameSite=Strict para navegador-level protection
 */

'use server'

import crypto from 'crypto'
import { cookies } from 'next/headers'
import { z } from 'zod'

const CSRF_COOKIE_NAME = '__csrf-token'
const CSRF_HEADER_NAME = 'x-csrf-token'
const TOKEN_MAX_AGE = 3600 // 1 hora

/**
 * ✅ Gerar novo CSRF token
 */
export async function generateCsrfToken(): Promise<string> {
  const token = crypto.randomBytes(32).toString('hex')
  
  const cookieStore = await cookies()
  cookieStore.set(CSRF_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    partitioned: true,
    maxAge: TOKEN_MAX_AGE,
    path: '/',
  })
  
  return token
}

/**
 * ✅ Validar CSRF token
 */
export async function validateCsrfToken(token: string): Promise<boolean> {
  if (!token || typeof token !== 'string') {
    return false
  }

  const cookieStore = await cookies()
  const storedToken = cookieStore.get(CSRF_COOKIE_NAME)?.value

  if (!storedToken) {
    return false
  }

  // Usar timing-safe comparison
  return crypto.timingSafeEqual(
    Buffer.from(token),
    Buffer.from(storedToken)
  )
}

/**
 * ✅ Middleware para validar CSRF em actions
 * 
 * Uso:
 * export async function submitFormAction(data, csrfToken) {
 *   'use server'
 *   await requireCsrfToken(csrfToken)
 *   // ... processar
 * }
 */
export async function requireCsrfToken(token?: string) {
  if (!token) {
    throw new Error('CSRF token obrigatório')
  }

  const isValid = await validateCsrfToken(token)
  
  if (!isValid) {
    console.warn('[Security] CSRF token validation failed')
    throw new Error('CSRF validation failed')
  }
}

/**
 * ✅ Hook React para obter e enviar CSRF token
 * 
 * Uso no componente:
 * const csrfToken = useCsrfToken()
 * <form onSubmit={(e) => {
 *   const formData = new FormData(e.currentTarget)
 *   formData.append('csrfToken', csrfToken)
 *   await submitAction(formData)
 * }}>
 */
export async function getCsrfToken(): Promise<string> {
  const cookieStore = await cookies()
  let token = cookieStore.get(CSRF_COOKIE_NAME)?.value

  if (!token) {
    token = await generateCsrfToken()
  }

  return token
}

const csrfTokenSchema = z.string().min(64, 'CSRF token inválido').max(64)

/**
 * ✅ Validar e extrair CSRF token de FormData
 */
export async function extractAndValidateCsrfToken(
  formData: FormData | Record<string, any>
): Promise<void> {
  let token: string | null = null

  if (formData instanceof FormData) {
    token = formData.get('csrfToken') as string | null
  } else {
    token = formData.csrfToken as string | null
  }

  const validated = csrfTokenSchema.safeParse(token)

  if (!validated.success) {
    throw new Error('CSRF token inválido')
  }

  await requireCsrfToken(validated.data)
}

/**
 * Export for middleware layer integration
 */
export async function isCsrfTokenValid(token: string): Promise<boolean> {
  try {
    await requireCsrfToken(token)
    return true
  } catch {
    return false
  }
}
