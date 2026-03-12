/**
 * useAuthStore — authentication & role state
 * Persisted to sessionStorage so a page refresh keeps the user logged in.
 */
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export type Role = 'admin' | 'student' | 'docente' | 'financeiro' | 'pedagogico' | null;

export interface UserPerfil {
    id: string;
    nome: string;
    email: string;
    avatarUrl?: string;
}

interface AuthState {
    user: UserPerfil | null;
    role: Role;
    isMock: boolean;
    isLoading: boolean;
    // Actions
    setUser: (user: UserPerfil | null) => void;
    setRole: (role: Role) => void;
    setIsMock: (isMock: boolean) => void;
    setLoading: (v: boolean) => void;
    clear: () => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            role: null,
            isMock: false,
            isLoading: false,

            setUser: (user) => set({ user }),
            setRole: (role) => set({ role }),
            setIsMock: (isMock) => set({ isMock }),
            setLoading: (isLoading) => set({ isLoading }),
            clear: () => set({ user: null, role: null, isMock: false }),
        }),
        {
            name: 'iepi-auth',
            storage: createJSONStorage(() =>
                typeof window !== 'undefined' ? sessionStorage : localStorage,
            ),
        },
    ),
);
