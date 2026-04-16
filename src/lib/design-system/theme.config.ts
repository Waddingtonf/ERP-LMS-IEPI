/**
 * Design System - Theme Configuration
 * Centraliza cores, espaçamento, tipografia e animações para todo o projeto
 */

export const designSystem = {
  // Paleta de cores - Brand IEPI
  colors: {
    primary: {
      50: '#f0f9ff',
      100: '#e0f2fe',
      200: '#bae6fd',
      300: '#7dd3fc',
      400: '#38bdf8',
      500: '#0ea5e9', // Primary: Azul institucional
      600: '#0284c7',
      700: '#0369a1',
      800: '#075985',
      900: '#0c3d66',
    },
    secondary: {
      50: '#f5f3ff',
      100: '#ede9fe',
      200: '#ddd6fe',
      300: '#c4b5fd',
      400: '#a78bfa',
      500: '#8b5cf6', // Purple accent
      600: '#7c3aed',
      700: '#6d28d9',
      800: '#5b21b6',
      900: '#4c1d95',
    },
    success: {
      50: '#f0fdf4',
      100: '#dcfce7',
      200: '#bbf7d0',
      300: '#86efac',
      500: '#22c55e',
      600: '#16a34a',
      700: '#15803d',
      800: '#166534',
      900: '#145231',
    },
    warning: {
      50: '#fffbeb',
      100: '#fef3c7',
      200: '#fde68a',
      300: '#fcd34d',
      500: '#eab308',
      600: '#ca8a04',
      700: '#a16207',
      800: '#92400e',
      900: '#78350f',
    },
    danger: {
      50: '#fef2f2',
      100: '#fee2e2',
      200: '#fecaca',
      300: '#fca5a5',
      500: '#ef4444',
      600: '#dc2626',
      700: '#b91c1c',
      800: '#991b1b',
      900: '#7f1d1d',
    },
    neutral: {
      50: '#f9fafb',
      100: '#f3f4f6',
      200: '#e5e7eb',
      300: '#d1d5db',
      400: '#9ca3af',
      500: '#6b7280',
      600: '#4b5563',
      700: '#374151',
      800: '#1f2937',
      900: '#111827',
    },
  },

  // Espaçamento - Base 4px (Tailwind default)
  spacing: {
    xs: '0.25rem', // 4px
    sm: '0.5rem', // 8px
    md: '1rem', // 16px
    lg: '1.5rem', // 24px
    xl: '2rem', // 32px
    '2xl': '2.5rem', // 40px
    '3xl': '3rem', // 48px
    '4xl': '4rem', // 64px
  },

  // Tipografia
  typography: {
    // Display - Para títulos grandes
    displayLarge: {
      fontSize: '2.25rem', // 36px
      lineHeight: '2.5rem', // 40px
      fontWeight: '700',
      letterSpacing: '-0.02em',
    },
    displayMedium: {
      fontSize: '1.875rem', // 30px
      lineHeight: '2.25rem', // 36px
      fontWeight: '700',
      letterSpacing: '-0.01em',
    },
    displaySmall: {
      fontSize: '1.5rem', // 24px
      lineHeight: '1.875rem', // 30px
      fontWeight: '700',
      letterSpacing: '-0.01em',
    },
    // Heading - Para seções e subsessões
    headingLarge: {
      fontSize: '1.25rem', // 20px
      lineHeight: '1.5rem', // 24px
      fontWeight: '600',
      letterSpacing: '-0.005em',
    },
    headingMedium: {
      fontSize: '1rem', // 16px
      lineHeight: '1.5rem', // 24px
      fontWeight: '600',
    },
    headingSmall: {
      fontSize: '0.875rem', // 14px
      lineHeight: '1.25rem', // 20px
      fontWeight: '600',
      letterSpacing: '0.005em',
    },
    // Body - Para conteúdo
    bodyLarge: {
      fontSize: '1rem', // 16px
      lineHeight: '1.5rem', // 24px
      fontWeight: '400',
    },
    bodyMedium: {
      fontSize: '0.875rem', // 14px
      lineHeight: '1.25rem', // 20px
      fontWeight: '400',
    },
    bodySmall: {
      fontSize: '0.75rem', // 12px
      lineHeight: '1rem', // 16px
      fontWeight: '400',
    },
    // Caption - Para labels e hints
    captionLarge: {
      fontSize: '0.75rem', // 12px
      lineHeight: '1rem', // 16px
      fontWeight: '500',
      letterSpacing: '0.02em',
    },
    captionSmall: {
      fontSize: '0.625rem', // 10px
      lineHeight: '0.875rem', // 14px
      fontWeight: '500',
      letterSpacing: '0.04em',
    },
  },

  // Animações
  animations: {
    // Transições padrão
    fast: '150ms ease-in-out',
    base: '200ms ease-in-out',
    slow: '300ms ease-in-out',

    // Easing functions
    easing: {
      easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
      easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
      easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
      easeInQuad: 'cubic-bezier(0.11, 0, 0.5, 0)',
      easeOutQuad: 'cubic-bezier(0.5, 1, 0.89, 1)',
    },
  },

  // Border radius
  borderRadius: {
    none: '0',
    sm: '0.25rem', // 4px
    base: '0.375rem', // 6px
    md: '0.5rem', // 8px
    lg: '0.75rem', // 12px
    xl: '1rem', // 16px
    '2xl': '1.5rem', // 24px
    full: '9999px',
  },

  // Shadows
  shadows: {
    xs: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    sm: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
    base: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    md: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    lg: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    xl: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  },

  // Z-index layers
  zIndex: {
    hide: -1,
    base: 0,
    dropdown: 10,
    sticky: 20,
    fixed: 30,
    backdrop: 40,
    modal: 50,
    popover: 60,
    tooltip: 70,
  },

  // Breakpoints - Mobile-first
  breakpoints: {
    xs: '320px',
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  },
} as const;

export type DesignSystemColors = keyof typeof designSystem.colors;
export type DesignSystemSpacing = keyof typeof designSystem.spacing;
export type DesignSystemBorderRadius = keyof typeof designSystem.borderRadius;
