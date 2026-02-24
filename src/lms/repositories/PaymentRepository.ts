export interface PaymentTransaction {
    id: string;
    userId: string;
    courseId: string;
    amount: number;
    status: 'PENDING' | 'AUTHORIZED' | 'CAPTURED' | 'FAILED' | 'CANCELED';
    cieloPaymentId?: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface IPaymentRepository {
    create(transaction: Omit<PaymentTransaction, 'id' | 'createdAt' | 'updatedAt'>): Promise<PaymentTransaction>;
    updateStatus(id: string, status: PaymentTransaction['status'], cieloPaymentId?: string): Promise<PaymentTransaction>;
    findById(id: string): Promise<PaymentTransaction | null>;
    findByUserId(userId: string): Promise<PaymentTransaction[]>;
}
