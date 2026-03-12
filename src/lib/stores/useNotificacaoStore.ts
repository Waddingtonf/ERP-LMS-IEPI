/**
 * useNotificacaoStore — in-app notifications bell
 */
import { create } from 'zustand';

export interface Notificacao {
    id: string;
    titulo: string;
    mensagem: string;
    tipo: 'info' | 'sucesso' | 'aviso' | 'erro';
    lida: boolean;
    criadaEm: string; // ISO date
}

interface NotificacaoState {
    items: Notificacao[];
    unreadCount: number;
    // Actions
    addNotificacao: (n: Omit<Notificacao, 'id' | 'lida' | 'criadaEm'>) => void;
    markRead: (id: string) => void;
    markAllRead: () => void;
    remove: (id: string) => void;
    clearAll: () => void;
}

export const useNotificacaoStore = create<NotificacaoState>()((set, get) => ({
    items: [],
    unreadCount: 0,

    addNotificacao: (n) => {
        const nova: Notificacao = {
            ...n,
            id: `notif-${Date.now()}-${Math.random().toString(36).substring(7)}`,
            lida: false,
            criadaEm: new Date().toISOString(),
        };
        set((s) => ({
            items: [nova, ...s.items].slice(0, 50), // max 50
            unreadCount: s.unreadCount + 1,
        }));
    },

    markRead: (id) => {
        set((s) => {
            const items = s.items.map((n) => (n.id === id ? { ...n, lida: true } : n));
            return { items, unreadCount: items.filter((n) => !n.lida).length };
        });
    },

    markAllRead: () => {
        set((s) => ({
            items: s.items.map((n) => ({ ...n, lida: true })),
            unreadCount: 0,
        }));
    },

    remove: (id) => {
        set((s) => {
            const items = s.items.filter((n) => n.id !== id);
            return { items, unreadCount: items.filter((n) => !n.lida).length };
        });
    },

    clearAll: () => set({ items: [], unreadCount: 0 }),
}));
