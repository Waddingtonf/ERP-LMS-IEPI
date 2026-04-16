/**
 * Animation and Transition Utilities
 * Padrões de movimento e transições
 */

export const animationConfig = {
  // Durations padrão
  durations: {
    instant: '0ms',
    fast: '100ms',
    base: '200ms',
    slow: '300ms',
    slower: '500ms',
    slowest: '1000ms',
  },

  // Easing functions
  easing: {
    linear: 'linear',
    easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
    easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
    easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    easeInQuad: 'cubic-bezier(0.11, 0, 0.5, 0)',
    easeOutQuad: 'cubic-bezier(0.5, 1, 0.89, 1)',
    easeInOutQuad: 'cubic-bezier(0.45, 0, 0.55, 1)',
  },

  // Tailwind animation classes
  transitions: {
    // Fade
    fadeIn: 'transition opacity duration-200',
    fadeInSlow: 'transition opacity duration-500',
    
    // Scale
    scaleIn: 'transition transform duration-200 scale-95',
    scaleInLarge: 'transition transform duration-300 scale-90',
    
    // Slide
    slideInUp: 'transition transform duration-300 translate-y-4',
    slideInDown: 'transition transform duration-300 -translate-y-4',
    slideInLeft: 'transition transform duration-300 translate-x-4',
    slideInRight: 'transition transform duration-300 -translate-x-4',
    
    // Combined
    popIn: 'transition transform duration-300 scale-95 opacity-0',
    smoothOpacity: 'transition-opacity duration-200 ease-out',
    smoothAll: 'transition-all duration-200 ease-in-out',
  },

  // CSS animation keyframes
  keyframes: {
    // Pulse (heartbeat)
    pulse: `@keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.5; }
    }`,
    
    // Spinner/Loading
    spin: `@keyframes spin {
      to { transform: rotate(360deg); }
    }`,
    
    // Bounce
    bounce: `@keyframes bounce {
      0%, 100% { transform: translateY(-25%); animation-timing-function: cubic-bezier(0.8,0,1,1); }
      50% { transform: none; animation-timing-function: cubic-bezier(0,0,0.2,1); }
    }`,
    
    // Shimmer (skeleton loading)
    shimmer: `@keyframes shimmer {
      -100% { transform: translateX(-100%); }
      100% { transform: translateX(100%); }
    }`,
    
    // Fade in
    fadeIn: `@keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }`,
    
    // Scale in
    scaleIn: `@keyframes scaleIn {
      from { transform: scale(0.95); opacity: 0; }
      to { transform: scale(1); opacity: 1; }
    }`,
    
    // Slide up
    slideUp: `@keyframes slideUp {
      from { transform: translateY(10px); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
    }`,
  },

  // Component animation presets
  components: {
    modal: {
      enter: 'duration-300 ease-out data-[state=open]:animate-in data-[state=open]:fade-in data-[state=open]:zoom-in-95',
      exit: 'duration-200 ease-in data-[state=closed]:animate-out data-[state=closed]:fade-out data-[state=closed]:zoom-out-95',
    },
    
    dropdown: {
      enter: 'duration-150 ease-out data-[state=open]:animate-in data-[state=open]:fade-in data-[state=open]:slide-in-from-top-2',
      exit: 'duration-150 ease-in data-[state=closed]:animate-out data-[state=closed]:fade-out data-[state=closed]:slide-out-to-top-2',
    },
    
    tooltip: {
      enter: 'duration-200 ease-out data-[state=open]:animate-in data-[state=open]:fade-in data-[state=open]:slide-in-from-bottom-2',
      exit: 'duration-200 ease-in data-[state=closed]:animate-out data-[state=closed]:fade-out data-[state=closed]:slide-out-to-bottom-2',
    },
    
    sheet: {
      enter: 'duration-300 ease-out data-[state=open]:animate-in data-[state=open]:slide-in-from-left',
      exit: 'duration-300 ease-in data-[state=closed]:animate-out data-[state=closed]:slide-out-to-left',
    },
  },
} as const;

// Hook helper para transições
export const useTransition = (type: keyof typeof animationConfig.transitions) => {
  return animationConfig.transitions[type];
};

export const useAnimation = (
  duration: keyof typeof animationConfig.durations = 'base',
  easing: keyof typeof animationConfig.easing = 'easeInOut'
) => {
  return `${animationConfig.durations[duration]} ${animationConfig.easing[easing]}`;
};
