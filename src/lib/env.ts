/**
 * env.ts — Validated environment variables.
 *
 * Uses Zod to validate at startup.  Import this module instead of
 * accessing process.env directly so you get type-safety and
 * early-failure error messages.
 *
 * Usage:
 *   import { env } from "@/lib/env"
 *   console.log(env.NEXT_PUBLIC_SUPABASE_URL)
 */
import { z } from "zod";

const envSchema = z.object({
    // ── Supabase (optional in mock mode) ──────────────────────
    NEXT_PUBLIC_SUPABASE_URL: z.string().url().optional(),
    NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().optional(),
    SUPABASE_SERVICE_ROLE_KEY: z.string().optional(),

    // ── Mock mode ─────────────────────────────────────────────
    NEXT_PUBLIC_MOCK_MODE: z
        .enum(["true", "false", ""])
        .optional()
        .transform((v) => v === "true"),

    // ── Cielo ─────────────────────────────────────────────────
    CIELO_MERCHANT_ID: z.string().optional(),
    CIELO_MERCHANT_KEY: z.string().optional(),
    CIELO_ENVIRONMENT: z.enum(["sandbox", "production"]).optional().default("sandbox"),

    // ── App ───────────────────────────────────────────────────
    NEXT_PUBLIC_APP_URL: z.string().url().optional().default("http://localhost:3000"),

    // ── Node environment ──────────────────────────────────────
    NODE_ENV: z.enum(["development", "test", "production"]).optional().default("development"),
});

// Parse and validate — throws at module load time if required vars are missing/invalid
const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
    console.error("❌ Invalid environment variables:", parsed.error.flatten().fieldErrors);
    // In production throw to prevent bad deploy; in dev just warn
    if (process.env.NODE_ENV === "production") {
        throw new Error("Invalid environment variables — check server logs.");
    }
}

export const env = parsed.success ? parsed.data : ({} as z.infer<typeof envSchema>);

/** Is the app running in mock/dev mode (no real Supabase)? */
export const IS_MOCK_MODE =
    env.NEXT_PUBLIC_MOCK_MODE === true ||
    !env.NEXT_PUBLIC_SUPABASE_URL ||
    env.NODE_ENV === "test";
