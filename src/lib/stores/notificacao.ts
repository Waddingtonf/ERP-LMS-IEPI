import { create } from 'zustand'

interface NotificacaoState {
  message: string
  type: 'success' | 'error' | 'info' | 'warning'
  visible: boolean
  show: (message: string, type: 'success' | 'error' | 'info' | 'warning') => void
  hide: () => void
}

export const useNotificacaoStore = create<NotificacaoState>((set) => ({
  message: '',
  type: 'info',
  visible: false,
  show: (message, type) =>
    set({ message, type, visible: true }),
  hide: () =>
    set({ visible: false, message: '' }),
}))
