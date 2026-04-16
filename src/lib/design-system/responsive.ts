/**
 * Responsive Design Utilities
 * Padroniza breakpoints e padrões mobile-first
 */

export const responsiveConfig = {
  // Breakpoints em pixels
  breakpoints: {
    xs: 320,   // Mobile pequeno
    sm: 640,   // Mobile padrão
    md: 768,   // Tablet
    lg: 1024,  // Desktop pequeno
    xl: 1280,  // Desktop
    '2xl': 1536, // Desktop grande
  },

  // Media query helpers
  mediaQueries: {
    mobile: '@media (max-width: 639px)',
    tablet: '@media (min-width: 640px) and (max-width: 1023px)',
    desktop: '@media (min-width: 1024px)',
    
    // Targeting específico
    belowSm: '@media (max-width: 639px)',
    aboveSm: '@media (min-width: 640px)',
    belowMd: '@media (max-width: 767px)',
    aboveMd: '@media (min-width: 768px)',
    belowLg: '@media (max-width: 1023px)',
    aboveLg: '@media (min-width: 1024px)',
  },

  // Grid layouts padrão
  gridLayouts: {
    // Tablet: 2 colunas
    tablet: 'grid-cols-2 gap-4 md:gap-6',
    
    // Desktop: 3 colunas
    desktop: 'grid-cols-3 lg:gap-8',
    
    // Responsivo automático
    auto: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
    
    // Dashboard layout
    dashboard: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6',
  },

  // Container sizes
  containers: {
    xs: 'max-w-xs',
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    '3xl': 'max-w-3xl',
    '4xl': 'max-w-4xl',
    '5xl': 'max-w-5xl',
    full: 'max-w-full',
  },

  // Typography responsive
  typography: {
    h1: 'text-2xl sm:text-3xl md:text-4xl font-bold',
    h2: 'text-xl sm:text-2xl md:text-3xl font-bold',
    h3: 'text-lg sm:text-xl md:text-2xl font-semibold',
    body: 'text-sm sm:text-base md:text-lg',
    caption: 'text-xs sm:text-sm',
  },

  // Padding responsive
  padding: {
    page: 'px-4 sm:px-6 md:px-8 lg:px-12',
    section: 'py-6 sm:py-8 md:py-12 lg:py-16',
    component: 'p-3 sm:p-4 md:p-6',
  },

  // Gap/spacing responsive
  spacing: {
    tight: 'gap-2 sm:gap-3 md:gap-4',
    normal: 'gap-4 sm:gap-5 md:gap-6',
    loose: 'gap-6 sm:gap-8 md:gap-10',
  },

  // Touch targets (mobile-friendly)
  touchTargets: {
    button: 'min-h-10 min-w-10', // 40x40px mínimo
    input: 'min-h-12', // 48px mínimo
    checkbox: 'min-h-6 min-w-6', // 24x24px
  },
} as const;

export type Breakpoint = keyof typeof responsiveConfig.breakpoints;
