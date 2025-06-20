/**
 * Shadow utility functions to prevent React Native shadow warnings
 * These functions ensure solid backgrounds are used with shadows for optimal performance
 */

export interface ShadowConfig {
  shadowColor: string;
  shadowOffset: { width: number; height: number };
  shadowOpacity: number;
  shadowRadius: number;
  elevation: number;
}

export interface OptimizedShadowStyle extends ShadowConfig {
  backgroundColor: string;
}

/**
 * Creates optimized shadow styles with solid background to prevent warnings
 * @param shadowColor - The color of the shadow
 * @param backgroundColor - Solid background color (defaults to #2A2A2A)
 * @param intensity - Shadow intensity: 'light' | 'medium' | 'heavy'
 * @returns Style object with optimized shadow properties
 */
export const createOptimizedShadow = (
  shadowColor: string,
  backgroundColor: string = '#2A2A2A',
  intensity: 'light' | 'medium' | 'heavy' = 'medium'
): OptimizedShadowStyle => {
  const shadowConfigs = {
    light: {
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.15,
      shadowRadius: 4,
      elevation: 3,
    },
    medium: {
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.25,
      shadowRadius: 8,
      elevation: 6,
    },
    heavy: {
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.3,
      shadowRadius: 16,
      elevation: 12,
    },
  };

  const config = shadowConfigs[intensity];

  return {
    backgroundColor, // Solid background prevents shadow calculation warnings
    shadowColor,
    ...config,
  };
};

/**
 * Creates conditional shadow styles (useful for selected/unselected states)
 * @param condition - Whether to apply shadow
 * @param shadowColor - The color of the shadow
 * @param backgroundColor - Solid background color
 * @param intensity - Shadow intensity
 * @returns Style object with conditional shadow
 */
export const createConditionalShadow = (
  condition: boolean,
  shadowColor: string,
  backgroundColor: string = '#2A2A2A',
  intensity: 'light' | 'medium' | 'heavy' = 'medium'
): OptimizedShadowStyle => {
  if (!condition) {
    return {
      backgroundColor,
      shadowColor: 'transparent',
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0,
      shadowRadius: 0,
      elevation: 0,
    };
  }

  return createOptimizedShadow(shadowColor, backgroundColor, intensity);
};

/**
 * Common shadow presets for the app
 */
export const shadowPresets = {
  // Primary brand shadow (gold)
  primary: (intensity: 'light' | 'medium' | 'heavy' = 'medium') =>
    createOptimizedShadow('#FFD20A', '#2A2A2A', intensity),
  
  // Success shadow (green)
  success: (intensity: 'light' | 'medium' | 'heavy' = 'medium') =>
    createOptimizedShadow('#4CAF50', '#2A2A2A', intensity),
  
  // Error shadow (red)
  error: (intensity: 'light' | 'medium' | 'heavy' = 'medium') =>
    createOptimizedShadow('#FF6B6B', '#2A2A2A', intensity),
  
  // Neutral shadow (black)
  neutral: (intensity: 'light' | 'medium' | 'heavy' = 'medium') =>
    createOptimizedShadow('#000000', '#2A2A2A', intensity),
  
  // Card shadow (subtle)
  card: () => createOptimizedShadow('#000000', '#2A2A2A', 'light'),
  
  // Button shadow (medium)
  button: (color: string = '#FFD20A') => createOptimizedShadow(color, color, 'medium'),
};

/**
 * Helper to create border effects that mimic rgba backgrounds
 * @param color - Border color
 * @param opacity - Border opacity (0-1)
 * @param width - Border width
 * @returns Border style object
 */
export const createBorderEffect = (
  color: string,
  opacity: number = 0.3,
  width: number = 1
) => {
  // Convert hex to rgba for border
  const hexToRgba = (hex: string, alpha: number) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };

  return {
    borderWidth: width,
    borderColor: color.startsWith('#') ? hexToRgba(color, opacity) : color,
  };
}; 