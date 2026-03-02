import { IPaymentRepository, PaymentTransaction } from './PaymentRepository';

export class MockPaymentRepository implements IPaymentRepository {
    private transactions: PaymentTransaction[] = [];

    async create(transaction: Omit<PaymentTransaction, 'id' | 'createdAt' | 'updatedAt'>): Promise<PaymentTransaction> {
        const newTx: PaymentTransaction = {
            ...transaction,
            id: `m-order-${Math.random().toString(36).substring(7)}`,
            createdAt: new Date(),
            updatedAt: new Date()
        };
        this.transactions.push(newTx);
        return newTx;
    }

    async updateStatus(id: string, status: PaymentTransaction['status'], cieloPaymentId?: string): Promise<PaymentTransaction> {
        const tx = await this.findById(id);
        if (!tx) throw new Error('Transaction not found');

        tx.status = status;
        tx.updatedAt = new Date();
        if (cieloPaymentId) tx.cieloPaymentId = cieloPaymentId;

        return tx;
    }

    async findById(id: string): Promise<PaymentTransaction | null> {
        return this.transactions.find(t => t.id === id) || null;
    }

    async findByUserId(userId: string): Promise<PaymentTransaction[]> {
        return this.transactions.filter(t => t.userId === userId);
    }

    /** Clear all transactions — useful in beforeEach */
    reset(): void {
        this.transactions = [];
    }
}

export const paymentRepository = new MockPaymentRepository();
