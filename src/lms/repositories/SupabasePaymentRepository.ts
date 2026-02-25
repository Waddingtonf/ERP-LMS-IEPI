import { createClient } from '@/lib/supabase/server';
import { IPaymentRepository, PaymentTransaction } from './PaymentRepository';

/**
 * Implementação real em Supabase para PaymentRepository.
 * Tabela esperada: payment_transactions
 * Colunas: id, user_id, course_id, amount, status, cielo_payment_id, created_at, updated_at
 */
export class SupabasePaymentRepository implements IPaymentRepository {
    async create(
        transaction: Omit<PaymentTransaction, 'id' | 'createdAt' | 'updatedAt'>
    ): Promise<PaymentTransaction> {
        const supabase = await createClient();
        const { data, error } = await supabase
            .from('payment_transactions')
            .insert({
                user_id: transaction.userId,
                course_id: transaction.courseId,
                amount: transaction.amount,
                status: transaction.status,
                cielo_payment_id: transaction.cieloPaymentId ?? null,
            })
            .select()
            .single();

        if (error || !data) throw new Error(error?.message ?? 'Failed to create transaction');
        return this.mapRow(data);
    }

    async updateStatus(
        id: string,
        status: PaymentTransaction['status'],
        cieloPaymentId?: string
    ): Promise<PaymentTransaction> {
        const supabase = await createClient();
        const updateData: Record<string, unknown> = {
            status,
            updated_at: new Date().toISOString(),
        };
        if (cieloPaymentId) updateData.cielo_payment_id = cieloPaymentId;

        const { data, error } = await supabase
            .from('payment_transactions')
            .update(updateData)
            .eq('id', id)
            .select()
            .single();

        if (error || !data) throw new Error(error?.message ?? 'Transaction not found');
        return this.mapRow(data);
    }

    async findById(id: string): Promise<PaymentTransaction | null> {
        const supabase = await createClient();
        const { data, error } = await supabase
            .from('payment_transactions')
            .select('*')
            .eq('id', id)
            .single();

        if (error || !data) return null;
        return this.mapRow(data);
    }

    async findByUserId(userId: string): Promise<PaymentTransaction[]> {
        const supabase = await createClient();
        const { data, error } = await supabase
            .from('payment_transactions')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false });

        if (error) throw new Error(error.message);
        return (data ?? []).map(this.mapRow);
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private mapRow(row: any): PaymentTransaction {
        return {
            id: row.id,
            userId: row.user_id,
            courseId: row.course_id,
            amount: row.amount,
            status: row.status,
            cieloPaymentId: row.cielo_payment_id ?? undefined,
            createdAt: new Date(row.created_at),
            updatedAt: new Date(row.updated_at),
        };
    }
}
