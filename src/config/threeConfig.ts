/**
 * Configuración para la escena 3D con física
 *
 * Define geometrías, colores, física y comportamiento por scroll
 */

import { Vector3 } from 'three'

/**
 * Tipos de geometrías disponibles
 */
export type GeometryType = 'box' | 'sphere' | 'torus' | 'cone' | 'octahedron'

/**
 * Configuración de una geometría individual
 */
export interface GeometryConfig {
  type: GeometryType
  position: [number, number, number]
  scale: number
  color: string
  metalness?: number
  roughness?: number
  rotation?: [number, number, number]
}

/**
 * Configuración de física
 */
export interface PhysicsConfig {
  gravity: Vector3
  enabledAtStart: boolean
  restitution: number // Rebote (0-1)
  friction: number     // Fricción (0-1)
  mass: number
}

/**
 * Comportamiento por sección de scroll
 */
export interface ScrollBehavior {
  scrollRange: [number, number] // Porcentaje [inicio, fin]
  physics: {
    gravityMultiplier: number
    enabled: boolean
  }
  geometries: {
    rotationSpeed: number
    floatAmplitude: number
  }
}

/**
 * Configuración de la escena 3D
 */
export const threeSceneConfig = {
  /**
   * Configuración de la cámara
   */
  camera: {
    position: new Vector3(0, 0, 8),
    fov: 75,
  },

  /**
   * Configuración de luces
   */
  lights: {
    ambient: {
      color: '#ffffff',
      intensity: 0.5,
    },
    directional: {
      color: '#ffffff',
      intensity: 1,
      position: new Vector3(5, 5, 5),
    },
    point: {
      color: '#ffffff',
      intensity: 0.8,
      position: new Vector3(-5, 5, 0),
    },
  },

  /**
   * Configuración de geometrías
   */
  geometries: [
    {
      type: 'box' as GeometryType,
      position: [-3, 4, 0] as [number, number, number],
      scale: 1.2,
      color: '#197278',
      metalness: 0.5,
      roughness: 0.2,
      rotation: [0.3, 0.4, 0] as [number, number, number],
    },
    {
      type: 'sphere' as GeometryType,
      position: [3, 6, -1] as [number, number, number],
      scale: 1,
      color: '#c44536',
      metalness: 0.7,
      roughness: 0.3,
    },
    {
      type: 'torus' as GeometryType,
      position: [0, 8, 1] as [number, number, number],
      scale: 0.8,
      color: '#772e25',
      metalness: 0.6,
      roughness: 0.2,
      rotation: [0.5, 0, 0.3] as [number, number, number],
    },
    {
      type: 'octahedron' as GeometryType,
      position: [-2, 10, -2] as [number, number, number],
      scale: 1.1,
      color: '#283d3b',
      metalness: 0.8,
      roughness: 0.1,
    },
    {
      type: 'cone' as GeometryType,
      position: [2.5, 12, 0.5] as [number, number, number],
      scale: 1,
      color: '#edddd4',
      metalness: 0.3,
      roughness: 0.5,
      rotation: [0.2, 0.6, 0.1] as [number, number, number],
    },
  ] as GeometryConfig[],

  /**
   * Configuración de física (Rapier)
   */
  physics: {
    gravity: new Vector3(0, -9.81, 0),
    enabledAtStart: false,
    restitution: 0.6,  // Rebote medio
    friction: 0.3,
    mass: 1,
  } as PhysicsConfig,

  /**
   * Comportamiento por secciones de scroll
   * Los rangos están en porcentaje (0-100)
   */
  scrollBehaviors: [
    {
      // Hero Section (0-20%)
      scrollRange: [0, 20] as [number, number],
      physics: {
        gravityMultiplier: 0,
        enabled: false,
      },
      geometries: {
        rotationSpeed: 0.001,
        floatAmplitude: 0.2,
      },
    },
    {
      // About Section (20-40%)
      scrollRange: [20, 40] as [number, number],
      physics: {
        gravityMultiplier: 0.3,
        enabled: true,
      },
      geometries: {
        rotationSpeed: 0.003,
        floatAmplitude: 0.4,
      },
    },
    {
      // Projects Section (40-70%)
      scrollRange: [40, 70] as [number, number],
      physics: {
        gravityMultiplier: 1,
        enabled: true,
      },
      geometries: {
        rotationSpeed: 0.005,
        floatAmplitude: 0.6,
      },
    },
    {
      // Contact Section (70-100%)
      scrollRange: [70, 100] as [number, number],
      physics: {
        gravityMultiplier: 0.5,
        enabled: true,
      },
      geometries: {
        rotationSpeed: 0.002,
        floatAmplitude: 0.3,
      },
    },
  ] as ScrollBehavior[],

  /**
   * Configuración de performance
   */
  performance: {
    mobile: {
      geometryCount: 3, // Reducir geometrías en móvil
      shadowsEnabled: false,
      physicsEnabled: false, // Desactivar física en móvil para mejor performance
    },
    desktop: {
      geometryCount: 5,
      shadowsEnabled: true,
      physicsEnabled: true,
    },
  },
}

/**
 * Utilidad para obtener comportamiento según scroll
 */
export function getScrollBehavior(scrollPercent: number): ScrollBehavior {
  const behavior = threeSceneConfig.scrollBehaviors.find(
    (b) => scrollPercent >= b.scrollRange[0] && scrollPercent < b.scrollRange[1]
  )

  return behavior || threeSceneConfig.scrollBehaviors[0]
}

/**
 * Utilidad para detectar si es móvil
 */
export function isMobileDevice(): boolean {
  return window.innerWidth < 768
}

/**
 * Obtener configuración según dispositivo
 */
export function getPerformanceConfig() {
  return isMobileDevice()
    ? threeSceneConfig.performance.mobile
    : threeSceneConfig.performance.desktop
}
