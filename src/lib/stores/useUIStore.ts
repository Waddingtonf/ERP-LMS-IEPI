/**
 * useUIStore — transient UI preferences (sidebar collapsed state, etc.)
 * Persisted to localStorage.
 */
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface UIState {
    sidebarCollapsed: boolean;
    commandPaletteOpen: boolean;
    // Actions
    toggleSidebar: () => void;
    setSidebarCollapsed: (v: boolean) => void;
    setCommandPaletteOpen: (v: boolean) => void;
}

export const useUIStore = create<UIState>()(
    persist(
        (set) => ({
            sidebarCollapsed: false,
            commandPaletteOpen: false,

            toggleSidebar: () =>
                set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
            setSidebarCollapsed: (sidebarCollapsed) => set({ sidebarCollapsed }),
            setCommandPaletteOpen: (commandPaletteOpen) => set({ commandPaletteOpen }),
        }),
        {
            name: 'iepi-ui',
            storage: createJSONStorage(() => localStorage),
            partialize: (s) => ({ sidebarCollapsed: s.sidebarCollapsed }),
        },
    ),
);
