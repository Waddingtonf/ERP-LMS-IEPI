/**
 * Design System - Central Export
 * Importar tudo daqui para manter consistência
 */

export { designSystem, type DesignSystemColors, type DesignSystemSpacing, type DesignSystemBorderRadius } from './theme.config';
export { componentsConfig, darkModeConfig } from './components.config';
export { responsiveConfig, type Breakpoint } from './responsive';
export { animationConfig, useTransition, useAnimation } from './animations';

// Export individual configs for convenience
export const DS = {
  theme: require('./theme.config').designSystem,
  components: require('./components.config').componentsConfig,
  responsive: require('./responsive').responsiveConfig,
  animations: require('./animations').animationConfig,
};
