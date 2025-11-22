/**
 * Gradient Configuration
 *
 * Configuración centralizada para el Stripe WebGL Mesh Gradient
 * y efectos de Perlin Noise.
 *
 * Paleta de colores del proyecto:
 * - Primary: #197278 (Caribbean Current)
 * - Secondary: #283d3b (Dark Slate Gray)
 * - Accent: #c44536 (Persian Red)
 * - Light: #edddd4 (Champagne Pink)
 */

export interface GradientColors {
  color1: string;
  color2: string;
  color3: string;
  color4: string;
}

export interface AnimationConfig {
  speed: number;
  density: number;
  amplitude: number;
}

export interface ScrollConfig {
  parallaxFactor: number;
  enabled: boolean;
}

export interface GradientConfig {
  light: GradientColors;
  dark: GradientColors;
  animation: AnimationConfig;
  scroll: ScrollConfig;
}

export interface PerlinNoiseThemeConfig {
  color: string;
  opacity: number;
  scale: number;
  speed: number;
}

export interface PerlinNoiseConfig {
  light: PerlinNoiseThemeConfig;
  dark: PerlinNoiseThemeConfig;
}

/**
 * Configuración principal del gradiente mesh
 */
export const gradientConfig: GradientConfig = {
  // Tema claro: colores sutiles para mantener legibilidad
  light: {
    color1: '#ffffff',    // Base blanca
    color2: '#edddd4',    // Champagne Pink (bg-secondary)
    color3: '#197278',    // Primary - aplicado con baja opacidad en shader
    color4: '#c44536',    // Accent - aplicado con baja opacidad en shader
  },

  // Tema oscuro: más contraste pero manteniendo profesionalismo
  dark: {
    color1: '#1c2a28',    // Dark base (bg-primary dark)
    color2: '#152220',    // Darker base (bg-secondary dark)
    color3: '#197278',    // Primary - opacidad media en shader
    color4: '#c44536',    // Accent - opacidad media en shader
  },

  // Configuración de animación
  animation: {
    speed: 0.0003,        // Velocidad muy lenta para efecto sutil (0.0003 = ~3.3 min por ciclo)
    density: 0.15,        // Densidad del mesh (0-1)
    amplitude: 260,       // Amplitud de deformación de vértices (px)
  },

  // Configuración de scroll
  scroll: {
    parallaxFactor: 0.25, // 25% de la velocidad del scroll (efecto parallax sutil)
    enabled: true,        // Activar/desactivar efecto scroll
  },
};

/**
 * Configuración de Perlin Noise Overlay (opcional)
 * Para usar en secciones específicas como Contact
 */
export const perlinConfig: PerlinNoiseConfig = {
  light: {
    color: '#197278',     // Primary color
    opacity: 0.04,        // Muy sutil en tema claro
    scale: 35,            // Tamaño del grid de puntos (px)
    speed: 0.3,           // Velocidad de animación
  },
  dark: {
    color: '#197278',     // Primary color
    opacity: 0.08,        // Más visible en tema oscuro
    scale: 35,            // Tamaño del grid de puntos (px)
    speed: 0.3,           // Velocidad de animación
  },
};

/**
 * Utilidades para trabajar con colores
 */
export const colorUtils = {
  /**
   * Convierte color hex a RGB array
   * @param hex - Color en formato #RRGGBB
   * @returns Array [R, G, B] con valores 0-1
   */
  hexToRgb(hex: string): [number, number, number] {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (!result) {
      throw new Error(`Invalid hex color: ${hex}`);
    }
    return [
      parseInt(result[1], 16) / 255,
      parseInt(result[2], 16) / 255,
      parseInt(result[3], 16) / 255,
    ];
  },

  /**
   * Convierte RGB array a color hex
   * @param rgb - Array [R, G, B] con valores 0-1
   * @returns Color en formato #RRGGBB
   */
  rgbToHex(rgb: [number, number, number]): string {
    const toHex = (n: number) => {
      const hex = Math.round(n * 255).toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    };
    return `#${toHex(rgb[0])}${toHex(rgb[1])}${toHex(rgb[2])}`;
  },

  /**
   * Interpola entre dos colores RGB
   * @param color1 - Color inicial [R, G, B]
   * @param color2 - Color final [R, G, B]
   * @param factor - Factor de interpolación (0-1)
   * @returns Color interpolado [R, G, B]
   */
  lerpColor(
    color1: [number, number, number],
    color2: [number, number, number],
    factor: number
  ): [number, number, number] {
    return [
      color1[0] + (color2[0] - color1[0]) * factor,
      color1[1] + (color2[1] - color1[1]) * factor,
      color1[2] + (color2[2] - color1[2]) * factor,
    ];
  },
};

/**
 * Configuración de performance
 */
export const performanceConfig = {
  // Reducir calidad en móviles
  mobile: {
    meshSegments: 32,     // Menos segmentos en mobile (vs 64 en desktop)
    amplitude: 180,       // Menor amplitud
    pauseWhenHidden: true, // Pausar cuando tab no es visible
  },

  // Desktop full quality
  desktop: {
    meshSegments: 64,     // Alta densidad
    amplitude: 260,       // Amplitud completa
    pauseWhenHidden: true,
  },

  // Respetar preferencias de accesibilidad
  accessibility: {
    respectReducedMotion: true, // Pausar si prefers-reduced-motion
    fallbackToStatic: true,     // Mostrar solo color estático si hay problemas
  },
};
