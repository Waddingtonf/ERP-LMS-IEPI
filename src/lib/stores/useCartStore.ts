/**
 * useCartStore — checkout basket (single-course flow)
 * Persisted to localStorage so users don't lose their cart on refresh.
 */
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export type CourseType = 'Gratuito' | 'Pago';

export interface CartItem {
    cursoId: string;
    titulo: string;
    preco: number; // centavos
    tipo: CourseType;
    imageUrl?: string;
}

interface CartState {
    item: CartItem | null;
    // Actions
    addItem: (item: CartItem) => void;
    clear: () => void;
}

export const useCartStore = create<CartState>()(
    persist(
        (set) => ({
            item: null,
            addItem: (item) => set({ item }),
            clear: () => set({ item: null }),
        }),
        {
            name: 'iepi-cart',
            storage: createJSONStorage(() => localStorage),
        },
    ),
);
