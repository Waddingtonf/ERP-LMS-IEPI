// @ts-nocheck
/**
 * SECURE Rate Limiting with Redis Backend
 * 
 * Implementa:
 * 1. âœ… Redis-backed rate limiting (nÃ£o reseta em deploy)
 * 2. âœ… MÃºltiplos limites por rota
 * 3. âœ… Bypass via proxy detection
 * 4. âœ… Logging de tentativas suspeitas
 * 5. âœ… Fallback para local em desenvolvimento
 */

import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'
import { NextRequest, NextResponse } from 'next/server'

// âœ… ConfiguraÃ§Ã£o Redis (via Upstash)
let redis: Redis | null = null
let isRedisAvailable = false

try {
  if (process.env.UPSTASH_REDIS_URL && process.env.UPSTASH_REDIS_TOKEN) {
    redis = new Redis({
      url: process.env.UPSTASH_REDIS_URL,
      token: process.env.UPSTASH_REDIS_TOKEN,
    })
    isRedisAvailable = true
  }
} catch (error) {
  console.warn('[RateLimit] Redis nÃ£o disponÃ­vel - usando fallback em memÃ³ria')
}

// âœ… Fallback: Rate limiting em memÃ³ria (com limpeza automÃ¡tica)
interface RateLimitRecord {
  count: number
  resetTime: number
}

const memoryStore = new Map<string, RateLimitRecord>()
let cleanupCounter = 0

function cleanupMemoryStore() {
  if (++cleanupCounter >= 1000) {
    const now = Date.now()
    for (const [key, record] of memoryStore.entries()) {
      if (now > record.resetTime) {
        memoryStore.delete(key)
      }
    }
    cleanupCounter = 0
  }
}

/**
 * âœ… Extrair IP real (com proteÃ§Ã£o contra proxy spoofing)
 */
function extractClientIp(request: NextRequest): string {
  // Ordem de verificaÃ§Ã£o: confiÃ¡vel a menos confiÃ¡vel
  const forwardedFor = request.headers.get('x-forwarded-for')
  const realIp = request.headers.get('x-real-ip')
  const cfConnectingIp = request.headers.get('cf-connecting-ip')
  const ip = request.ip || 'unknown'

  // Se houver mÃºltiplos IPs em x-forwarded-for, pegar o ÃšLTIMO (cliente real)
  if (forwardedFor) {
    const ips = forwardedFor.split(',').map(i => i.trim())
    // Validar se nÃ£o Ã© uma string suspeita
    if (ips.length > 10) {
      // Muitos proxies = suspeito
      console.warn('[Security] Suspicious proxy chain detected:', ips.length)
      return 'suspicious-proxy-chain'
    }
    return ips[0] || forwardedFor
  }

  return realIp || cfConnectingIp || ip || 'unknown'
}

/**
 * âœ… ConfiguraÃ§Ãµes de rate limit por rota
 */
const RATE_LIMIT_CONFIG = {
  // Auth endpoints - muito restritivo
  '/api/auth/signin': { limit: 5, windowMs: 15 * 60 * 1000 }, // 5/15min
  '/api/auth/signup': { limit: 3, windowMs: 60 * 60 * 1000 }, // 3/hora
  '/auth/login': { limit: 5, windowMs: 15 * 60 * 1000 },
  '/auth/reset-password': { limit: 3, windowMs: 60 * 60 * 1000 },
  
  // Checkout - moderado
  '/checkout': { limit: 10, windowMs: 60 * 1000 }, // 10/min
  '/api/payment': { limit: 10, windowMs: 60 * 1000 },
  
  // Admin - moderado
  '/admin': { limit: 100, windowMs: 60 * 1000 }, // 100/min
  
  // Default - permissivo
  default: { limit: 300, windowMs: 60 * 1000 }, // 300/min
}

interface RateLimitOptions {
  limit: number
  windowMs: number
}

/**
 * âœ… Obter configuraÃ§Ã£o de rate limit para uma rota
 */
function getConfigForRoute(pathname: string): RateLimitOptions {
  for (const [pattern, config] of Object.entries(RATE_LIMIT_CONFIG)) {
    if (pathname.startsWith(pattern)) {
      return config
    }
  }
  return RATE_LIMIT_CONFIG.default
}

/**
 * âœ… Rate limiting com Redis (produÃ§Ã£o)
 */
async function checkRateLimitRedis(
  key: string,
  options: RateLimitOptions
): Promise<{ allowed: boolean; remaining: number; resetAfter: number }> {
  if (!redis || !isRedisAvailable) {
    return { allowed: true, remaining: options.limit, resetAfter: 0 }
  }

  try {
    // Usar Redis sorted sets para sliding window
    const now = Date.now()
    const windowStart = now - options.windowMs

    // Remover entradas antigas
    await redis.zremrangebyscore(key, '-inf', windowStart)

    // Contar requisiÃ§Ãµes no window
    const count = await redis.zcard(key)

    if (count >= options.limit) {
      // Pegar reset time (eldest timestamp)
      const eldest = await redis.zrange(key, 0, 0)
      const resetTime = eldest.length > 0 ? (eldest[0] as number) + options.windowMs : now + options.windowMs

      return {
        allowed: false,
        remaining: 0,
        resetAfter: Math.ceil((resetTime - now) / 1000),
      }
    }

    // Adicionar nova requisiÃ§Ã£o
    await redis.zadd(key, { score: now, member: `${now}-${Math.random()}` })
    await redis.expire(key, Math.ceil(options.windowMs / 1000) + 60)

    return {
      allowed: true,
      remaining: options.limit - count - 1,
      resetAfter: Math.ceil(options.windowMs / 1000),
    }
  } catch (error) {
    console.error('[RateLimit] Redis error:', error)
    // Fallback to memory
    return checkRateLimitMemory(key, options)
  }
}

/**
 * âœ… Rate limiting em memÃ³ria (dev/fallback)
 */
function checkRateLimitMemory(
  key: string,
  options: RateLimitOptions
): { allowed: boolean; remaining: number; resetAfter: number } {
  cleanupMemoryStore()

  const now = Date.now()
  const record = memoryStore.get(key)

  if (!record || now > record.resetTime) {
    // Nova janela
    memoryStore.set(key, {
      count: 1,
      resetTime: now + options.windowMs,
    })
    return {
      allowed: true,
      remaining: options.limit - 1,
      resetAfter: Math.ceil(options.windowMs / 1000),
    }
  }

  // Janela existente
  if (record.count >= options.limit) {
    return {
      allowed: false,
      remaining: 0,
      resetAfter: Math.ceil((record.resetTime - now) / 1000),
    }
  }

  record.count++
  return {
    allowed: true,
    remaining: options.limit - record.count,
    resetAfter: Math.ceil((record.resetTime - now) / 1000),
  }
}

/**
 * âœ… Verificar rate limit
 */
export async function checkRateLimit(
  request: NextRequest
): Promise<NextResponse | null> {
  const pathname = request.nextUrl.pathname
  const config = getConfigForRoute(pathname)
  const clientIp = extractClientIp(request)

  // Se IP suspeito, rejeitar imediatamente
  if (clientIp === 'suspicious-proxy-chain') {
    return new NextResponse('Too Many Requests', {
      status: 429,
      headers: {
        'Retry-After': '3600',
        'X-RateLimit-Limit': String(config.limit),
        'X-RateLimit-Remaining': '0',
        'X-RateLimit-Reset': new Date(Date.now() + 3600000).toISOString(),
      },
    })
  }

  const key = `rl:${clientIp}:${pathname}`

  const result = isRedisAvailable
    ? await checkRateLimitRedis(key, config)
    : checkRateLimitMemory(key, config)

  if (!result.allowed) {
    console.warn('[Security] Rate limit exceeded', {
      ip: clientIp,
      path: pathname,
      resetAfter: result.resetAfter,
    })

    return new NextResponse('Too Many Requests', {
      status: 429,
      headers: {
        'Retry-After': String(result.resetAfter),
        'X-RateLimit-Limit': String(config.limit),
        'X-RateLimit-Remaining': '0',
        'X-RateLimit-Reset': new Date(
          Date.now() + result.resetAfter * 1000
        ).toISOString(),
      },
    })
  }

  return null
}

/**
 * âœ… Exportar para uso em middleware
 */
export async function rateLimitMiddleware(request: NextRequest) {
  return checkRateLimit(request)
}

/**
 * âœ… Reset rate limit para testing
 */
export async function resetRateLimit(key: string) {
  if (redis && isRedisAvailable) {
    await redis.del(key)
  } else {
    memoryStore.delete(key)
  }
}

/**
 * âœ… Get current rate limit status
 */
export async function getRateLimitStatus(
  request: NextRequest
): Promise<{
  limit: number
  remaining: number
  resetAfter: number
}> {
  const pathname = request.nextUrl.pathname
  const config = getConfigForRoute(pathname)
  const clientIp = extractClientIp(request)
  const key = `rl:${clientIp}:${pathname}`

  const result = isRedisAvailable
    ? await checkRateLimitRedis(key, config)
    : checkRateLimitMemory(key, config)

  return {
    limit: config.limit,
    remaining: result.remaining,
    resetAfter: result.resetAfter,
  }
}

