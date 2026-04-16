-- =============================================================================
-- ERP-IEPI — Payments Table & Audit Logs
-- Created: April 7, 2026
-- Purpose: Store Cielo payment transactions and audit logs
-- =============================================================================

-- ─────────────────────────────────────────────────────────────────────────
-- FUNCTION: set_updated_at
-- ─────────────────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ─────────────────────────────────────────────────────────────────────────
-- TABLE: payments
-- Stores all payment transactions from Cielo gateway
-- ─────────────────────────────────────────────────────────────────────────

DROP TABLE IF EXISTS public.payments CASCADE;

CREATE TABLE IF NOT EXISTS public.payments (
    id                          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    enrollment_id               UUID NOT NULL REFERENCES public.enrollments(id) ON DELETE CASCADE,
    amount                      INTEGER NOT NULL CHECK (amount > 0),
    status                      TEXT NOT NULL DEFAULT 'PENDING'
                                CHECK (status IN ('PENDING', 'AUTHORIZED', 'CAPTURED', 'DECLINED', 'CANCELLED', 'REFUNDED')),
    payment_method              TEXT NOT NULL DEFAULT 'CREDIT_CARD',
    transaction_id              TEXT UNIQUE,
    external_transaction_id     TEXT UNIQUE,
    authorization_code          TEXT,
    idempotency_key             TEXT UNIQUE,
    card_brand                  TEXT,
    error_message               TEXT,
    raw_response                JSONB,
    created_at                  TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at                  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS payments_enrollment_id_idx ON public.payments(enrollment_id);
CREATE INDEX IF NOT EXISTS payments_status_idx ON public.payments(status);
CREATE INDEX IF NOT EXISTS payments_transaction_id_idx ON public.payments(transaction_id);
CREATE INDEX IF NOT EXISTS payments_created_at_idx ON public.payments(created_at DESC);

-- Trigger: Update updated_at timestamp
DROP TRIGGER IF EXISTS payments_updated_at ON public.payments;
CREATE TRIGGER payments_updated_at
    BEFORE UPDATE ON public.payments
    FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();

-- ─────────────────────────────────────────────────────────────────────────
-- TABLE: payment_audit_logs
-- Audit trail for all payment operations
-- ─────────────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.payment_audit_logs (
    id                          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    enrollment_id               UUID NOT NULL REFERENCES public.enrollments(id) ON DELETE CASCADE,
    payment_id                  UUID REFERENCES public.payments(id) ON DELETE CASCADE,
    amount                      INTEGER,
    status                      TEXT NOT NULL,
    transaction_id              TEXT,
    reason                      TEXT,
    user_id                     UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    ip_address                  INET,
    user_agent                  TEXT,
    timestamp                   TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS payment_audit_logs_enrollment_id_idx ON public.payment_audit_logs(enrollment_id);
CREATE INDEX IF NOT EXISTS payment_audit_logs_payment_id_idx ON public.payment_audit_logs(payment_id);
CREATE INDEX IF NOT EXISTS payment_audit_logs_timestamp_idx ON public.payment_audit_logs(timestamp DESC);
CREATE INDEX IF NOT EXISTS payment_audit_logs_status_idx ON public.payment_audit_logs(status);

-- ─────────────────────────────────────────────────────────────────────────
-- TABLE: payment_webhooks
-- Store incoming webhooks from Cielo for reconciliation
-- ─────────────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.payment_webhooks (
    id                          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    payment_id                  UUID REFERENCES public.payments(id) ON DELETE CASCADE,
    event_type                  TEXT NOT NULL,
    status                      TEXT NOT NULL,
    data                        JSONB NOT NULL,
    processed_at                TIMESTAMPTZ,
    error_message               TEXT,
    created_at                  TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at                  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Index
CREATE INDEX IF NOT EXISTS payment_webhooks_payment_id_idx ON public.payment_webhooks(payment_id);
CREATE INDEX IF NOT EXISTS payment_webhooks_created_at_idx ON public.payment_webhooks(created_at DESC);

-- Trigger: Update updated_at timestamp
DROP TRIGGER IF EXISTS payment_webhooks_updated_at ON public.payment_webhooks;
CREATE TRIGGER payment_webhooks_updated_at
    BEFORE UPDATE ON public.payment_webhooks
    FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();

-- ─────────────────────────────────────────────────────────────────────────
-- ROW LEVEL SECURITY (RLS)
-- ─────────────────────────────────────────────────────────────────────────

-- Enable RLS on payment tables
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_webhooks ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only see their own payments
DROP POLICY IF EXISTS payments_user_access ON public.payments;
CREATE POLICY payments_user_access ON public.payments
    FOR SELECT
    USING (
        enrollment_id IN (
            SELECT e.id FROM public.enrollments e
            WHERE e.aluno_id = auth.uid()
        )
    );

-- Policy: Service role can access all payments
DROP POLICY IF EXISTS payments_service_role ON public.payments;
CREATE POLICY payments_service_role ON public.payments
    USING (auth.role() = 'service_role');

-- Policy: Admins can view all payments
DROP POLICY IF EXISTS payments_admin_access ON public.payments;
CREATE POLICY payments_admin_access ON public.payments
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role = 'ADMIN'
        )
    );

-- Similar policies for audit logs (admin only)
DROP POLICY IF EXISTS payment_audit_logs_admin_access ON public.payment_audit_logs;
CREATE POLICY payment_audit_logs_admin_access ON public.payment_audit_logs
    FOR SELECT
    USING (
        auth.role() = 'service_role' OR
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role = 'ADMIN'
        )
    );

-- ─────────────────────────────────────────────────────────────────────────
-- VERIFICATION QUERIES
-- Run these to verify the migration was successful
-- ─────────────────────────────────────────────────────────────────────────

-- ✅ Check tables exist
-- SELECT table_name FROM information_schema.tables WHERE table_schema='public' AND table_name LIKE 'payment%';

-- ✅ Check columns in payments table
-- SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'payments';

-- ✅ Check RLS is enabled
-- SELECT table_name, row_security_enabled FROM information_schema.tables WHERE table_name LIKE 'payment%';

-- ✅ Check indexes exist
-- SELECT indexname FROM pg_indexes WHERE tablename LIKE 'payment%';
