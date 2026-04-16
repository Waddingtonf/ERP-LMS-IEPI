/**
 * Component Configuration - Estilo e comportamento padrão de componentes
 */

export const componentsConfig = {
  // Button variants
  button: {
    variants: {
      primary: 'bg-sky-500 text-white hover:bg-sky-600 active:bg-sky-700',
      secondary: 'bg-slate-200 text-slate-900 hover:bg-slate-300 active:bg-slate-400',
      danger: 'bg-red-500 text-white hover:bg-red-600 active:bg-red-700',
      success: 'bg-green-500 text-white hover:bg-green-600 active:bg-green-700',
      ghost: 'text-slate-700 hover:bg-slate-100 active:bg-slate-200',
      outline: 'border border-slate-300 text-slate-700 hover:bg-slate-50',
    },
    sizes: {
      xs: 'px-2 py-1 text-xs',
      sm: 'px-3 py-2 text-sm',
      md: 'px-4 py-2 text-base',
      lg: 'px-5 py-3 text-lg',
      xl: 'px-6 py-4 text-lg',
    },
  },

  // Input styles
  input: {
    base: 'w-full px-3 py-2 border border-slate-300 rounded-md text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-sky-500 focus:border-transparent',
    sizes: {
      sm: 'text-sm',
      md: 'text-base',
      lg: 'text-lg',
    },
    states: {
      error: 'border-red-500 focus:ring-red-500',
      success: 'border-green-500 focus:ring-green-500',
      disabled: 'bg-slate-100 text-slate-500 cursor-not-allowed',
    },
  },

  // Card styles
  card: {
    base: 'bg-white rounded-lg border border-slate-200 shadow-sm',
    elevated: 'bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow',
    outlined: 'bg-transparent border-2 border-slate-300',
  },

  // Badge styles
  badge: {
    sizes: {
      xs: 'text-xs px-2 py-0.5',
      sm: 'text-sm px-2.5 py-1',
      md: 'text-base px-3 py-1.5',
    },
    variants: {
      primary: 'bg-sky-100 text-sky-800',
      success: 'bg-green-100 text-green-800',
      warning: 'bg-yellow-100 text-yellow-800',
      danger: 'bg-red-100 text-red-800',
      neutral: 'bg-slate-100 text-slate-800',
    },
  },

  // Modal/Dialog styles
  modal: {
    backdrop: 'fixed inset-0 bg-black/50',
    content: 'bg-white rounded-lg shadow-xl max-w-md w-full',
  },

  // Alert styles
  alert: {
    success: 'bg-green-50 border border-green-200 text-green-800',
    warning: 'bg-yellow-50 border border-yellow-200 text-yellow-800',
    error: 'bg-red-50 border border-red-200 text-red-800',
    info: 'bg-sky-50 border border-sky-200 text-sky-800',
  },

  // Table styles
  table: {
    header: 'bg-slate-50 border-b border-slate-200',
    row: 'border-b border-slate-200 hover:bg-slate-50',
    cell: 'px-4 py-3 text-left text-sm',
  },

  // Loading spinner
  spinner: {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  },
} as const;

export const darkModeConfig = {
  // Dark mode overrides
  colors: {
    background: '#111827',
    surface: '#1f2937',
    text: '#f9fafb',
    textSecondary: '#d1d5db',
    border: '#374151',
  },

  components: {
    input: 'bg-slate-800 border-slate-700 text-white placeholder-slate-500 focus:ring-sky-400',
    card: 'bg-slate-800 border-slate-700',
    modal: 'bg-slate-800 text-slate-50',
  },
} as const;
